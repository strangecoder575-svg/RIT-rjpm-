-- RIT Digital Campus — Supabase/PostgreSQL foundation
-- Run this in Supabase SQL Editor AFTER enabling Anonymous Sign-Ins.
-- Then create Strange's Auth account and run the bootstrap block at the bottom.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'RIT Student',
  roll_no text not null unique,
  email text,
  dept_id text not null default 'cse',
  dept_code text not null default 'CSE',
  year text default '1st Year',
  role text not null default 'student' check (role in ('student','admin','super-admin')),
  total_xp integer not null default 0 check (total_xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null check (amount > 0),
  reason text not null,
  source text not null,
  reference_id text,
  created_at timestamptz not null default now()
);

create unique index if not exists xp_transactions_reference_unique
  on public.xp_transactions(user_id, source, reference_id)
  where reference_id is not null;

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  department_id text not null,
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  percentage integer not null check (percentage between 0 and 100),
  xp_earned integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  roll_no text not null,
  reason text not null default 'Requested administrator access for the RIT digital campus.',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.campus_discoveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  department_id text not null,
  xp_earned integer not null default 15,
  created_at timestamptz not null default now(),
  unique(user_id, department_id)
);

create table if not exists public.daily_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_date date not null,
  mission_code text not null default 'rit-core-surge',
  xp_earned integer not null default 100,
  created_at timestamptz not null default now(),
  unique(user_id, mission_date, mission_code)
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, roll_no, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'RIT Student'),
    coalesce(new.raw_user_meta_data->>'roll_no', 'RIT-' || upper(substr(replace(new.id::text,'-',''),1,10))),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.prevent_role_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
declare caller_role text;
begin
  if old.role = new.role then return new; end if;
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role = 'super-admin' then return new; end if;
  raise exception 'Only the super-admin can change administrator roles';
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role before update on public.profiles
for each row execute function public.prevent_role_escalation();

-- Public leaderboard projection. Only non-sensitive leaderboard fields are exposed.
drop view if exists public.leaderboard;
create or replace function public.get_leaderboard()
returns table(id uuid, name text, dept_id text, dept_code text, year text, total_xp integer, role text)
language sql stable security definer set search_path = public as $$
  select p.id, p.name, p.dept_id, p.dept_code, p.year, p.total_xp, p.role
  from public.profiles p
  order by p.total_xp desc, p.created_at asc
  limit 100;
$$;
grant execute on function public.get_leaderboard() to authenticated;

alter table public.profiles enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.admin_requests enable row level security;
alter table public.campus_discoveries enable row level security;
alter table public.daily_missions enable row level security;

create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

grant execute on function public.current_user_role() to authenticated;

drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin on public.profiles for select
using (id = auth.uid() or public.current_user_role() in ('admin','super-admin'));

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles for insert
with check (id = auth.uid() and role = 'student');

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update
using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists xp_select_own_or_admin on public.xp_transactions;
create policy xp_select_own_or_admin on public.xp_transactions for select
using (user_id = auth.uid() or public.current_user_role() in ('admin','super-admin'));

drop policy if exists quiz_select_own_or_admin on public.quiz_attempts;
create policy quiz_select_own_or_admin on public.quiz_attempts for select
using (user_id = auth.uid() or public.current_user_role() in ('admin','super-admin'));

drop policy if exists admin_requests_insert_own on public.admin_requests;
create policy admin_requests_insert_own on public.admin_requests for insert
with check (user_id = auth.uid());

drop policy if exists admin_requests_select_own_or_super on public.admin_requests;
create policy admin_requests_select_own_or_super on public.admin_requests for select
using (user_id = auth.uid() or public.current_user_role() = 'super-admin');

create or replace function public.claim_daily_mission()
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); existing_id uuid; new_xp integer := 100;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  insert into public.daily_missions(user_id, mission_date, mission_code, xp_earned)
  values(uid, current_date, 'rit-core-surge', new_xp)
  on conflict (user_id, mission_date, mission_code) do nothing
  returning id into existing_id;
  if existing_id is null then
    return jsonb_build_object('ok', false, 'reason', 'already_claimed', 'xp', 0);
  end if;
  insert into public.xp_transactions(user_id, amount, reason, source, reference_id)
  values(uid, new_xp, 'Daily Mission: RIT Core Surge', 'daily_mission', existing_id::text);
  update public.profiles set total_xp = total_xp + new_xp where id = uid;
  return jsonb_build_object('ok', true, 'reason', 'claimed', 'xp', new_xp);
end;
$$;

grant execute on function public.claim_daily_mission() to authenticated;

create or replace function public.claim_campus_discovery(p_department_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); existing_id uuid; new_xp integer := 15;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  insert into public.campus_discoveries(user_id, department_id, xp_earned)
  values(uid, p_department_id, new_xp)
  on conflict (user_id, department_id) do nothing
  returning id into existing_id;
  if existing_id is null then
    return jsonb_build_object('ok', false, 'reason', 'already_discovered', 'xp', 0);
  end if;
  insert into public.xp_transactions(user_id, amount, reason, source, reference_id)
  values(uid, new_xp, 'Campus Discovery: ' || p_department_id, 'campus_discovery', existing_id::text);
  update public.profiles set total_xp = total_xp + new_xp where id = uid;
  return jsonb_build_object('ok', true, 'reason', 'discovered', 'xp', new_xp);
end;
$$;

grant execute on function public.claim_campus_discovery(text) to authenticated;

create or replace function public.complete_quiz(
  p_department_id text,
  p_score integer,
  p_total_questions integer,
  p_reference_id text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); pct integer; earned integer; attempt_id uuid;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  if p_total_questions <= 0 then raise exception 'Invalid quiz size'; end if;
  if p_score < 0 or p_score > p_total_questions then raise exception 'Invalid quiz score'; end if;
  pct := round((p_score::numeric / p_total_questions::numeric) * 100);
  earned := least(400, (p_score * 10) + 50 + case when pct = 100 then 100 else 0 end);
  insert into public.quiz_attempts(user_id, department_id, score, total_questions, percentage, xp_earned)
  values(uid, p_department_id, p_score, p_total_questions, pct, earned)
  returning id into attempt_id;
  insert into public.xp_transactions(user_id, amount, reason, source, reference_id)
  values(uid, earned, 'Quiz completed: ' || p_department_id, 'quiz', coalesce(p_reference_id, attempt_id::text));
  update public.profiles set total_xp = total_xp + earned where id = uid;
  return jsonb_build_object('ok', true, 'xp', earned, 'attempt_id', attempt_id, 'percentage', pct);
exception when unique_violation then
  return jsonb_build_object('ok', false, 'xp', 0, 'reason', 'already_recorded');
end;
$$;

grant execute on function public.complete_quiz(text, integer, integer, text) to authenticated;

create or replace function public.submit_admin_request(p_name text, p_roll_no text, p_reason text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); req_id uuid;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  insert into public.admin_requests(user_id, name, roll_no, reason)
  values(uid, trim(p_name), trim(p_roll_no), coalesce(nullif(trim(p_reason),''),'Requested administrator access for the RIT digital campus.'))
  returning id into req_id;
  return jsonb_build_object('ok', true, 'id', req_id);
end;
$$;

grant execute on function public.submit_admin_request(text,text,text) to authenticated;

create or replace function public.review_admin_request(p_request_id uuid, p_action text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); caller_role text; req public.admin_requests%rowtype;
begin
  caller_role := public.current_user_role();
  if caller_role <> 'super-admin' then raise exception 'Only the super-admin can review admin requests'; end if;
  select * into req from public.admin_requests where id = p_request_id for update;
  if req.id is null then raise exception 'Request not found'; end if;
  if p_action not in ('approve','reject') then raise exception 'Invalid action'; end if;
  if p_action = 'approve' then
    update public.profiles set role = 'admin', name = req.name, roll_no = req.roll_no where id = req.user_id;
    update public.admin_requests set status = 'approved', reviewed_by = uid, reviewed_at = now() where id = req.id;
  else
    update public.admin_requests set status = 'rejected', reviewed_by = uid, reviewed_at = now() where id = req.id;
  end if;
  return jsonb_build_object('ok', true, 'status', case when p_action='approve' then 'approved' else 'rejected' end);
end;
$$;

grant execute on function public.review_admin_request(uuid,text) to authenticated;

-- Bootstrap Strange AFTER creating his Auth user in Authentication > Users.
-- Replace AUTH_USER_UUID with Strange's actual Auth user UUID, then run this block.
-- This is deliberately manual so nobody can claim the first super-admin using only a roll number.
--
-- update public.profiles
-- set name='Strange', roll_no='200812200810', role='super-admin'
-- where id='AUTH_USER_UUID';

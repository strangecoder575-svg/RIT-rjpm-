import { supabase } from './supabaseClient';
import { DEPTS } from '../data/departments';
import { StudentUser } from '../types/user';

export type CloudProfile = StudentUser & {
  id: string;
  email?: string | null;
  role: 'student' | 'admin' | 'super-admin';
  totalXp: number;
};

const deptFromId = (id: string) => DEPTS.find(d => d.id === id) || DEPTS[0];

export async function ensureStudentSession(): Promise<{ userId: string }> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data: existing } = await supabase.auth.getSession();
  if (existing.session?.user) return { userId: existing.session.user.id };
  const { data, error } = await supabase.auth.signInAnonymously({
    options: { data: { name: 'RIT Student' } },
  });
  if (error || !data.user) throw error || new Error('Could not create student session.');
  return { userId: data.user.id };
}

export async function signInAdmin(email: string, password: string): Promise<CloudProfile> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user) throw error || new Error('Admin login failed.');
  const profile = await getMyProfile();
  if (!profile || !['admin', 'super-admin'].includes(profile.role)) {
    await supabase.auth.signOut();
    throw new Error('This account is authenticated but is not an approved RIT administrator.');
  }
  return profile;
}

export async function signOutCloud() {
  if (supabase) await supabase.auth.signOut();
}

export async function upsertStudentProfile(input: {
  name: string;
  rollNo: string;
  deptId: string;
  year: string;
}): Promise<CloudProfile> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const session = await ensureStudentSession();
  const dept = deptFromId(input.deptId);
  const { data, error } = await supabase.from('profiles').update({
    name: input.name.trim(),
    roll_no: input.rollNo.trim(),
    dept_id: dept.id,
    dept_code: dept.code,
    year: input.year,
  }).eq('id', session.userId).select().single();
  if (error) throw error;
  return mapProfile(data);
}

export async function getMyProfile(): Promise<CloudProfile | null> {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', auth.user.id).maybeSingle();
  if (error) throw error;
  return data ? mapProfile(data) : null;
}

function mapProfile(row: any): CloudProfile {
  return {
    id: row.id,
    name: row.name,
    rollNo: row.roll_no,
    deptId: row.dept_id,
    deptCode: row.dept_code,
    year: row.year,
    loginTime: row.created_at,
    email: row.email,
    role: row.role,
    totalXp: Number(row.total_xp || 0),
  };
}

export async function getMyXp(): Promise<number> {
  const p = await getMyProfile();
  return p?.totalXp || 0;
}

export async function claimDailyMission(): Promise<{ ok: boolean; xp: number; reason: string }> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.rpc('claim_daily_mission');
  if (error) throw error;
  return data as any;
}

export async function claimCampusDiscovery(departmentId: string): Promise<{ ok: boolean; xp: number; reason: string }> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.rpc('claim_campus_discovery', { p_department_id: departmentId });
  if (error) throw error;
  return data as any;
}

export async function completeQuizCloud(departmentId: string, score: number, total: number, referenceId: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.rpc('complete_quiz', {
    p_department_id: departmentId,
    p_score: score,
    p_total_questions: total,
    p_reference_id: referenceId,
  });
  if (error) throw error;
  return data as { ok: boolean; xp: number; percentage: number; reason?: string };
}

export async function submitAdminRequestCloud(name: string, rollNo: string, reason: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  await ensureStudentSession();
  const { data, error } = await supabase.rpc('submit_admin_request', {
    p_name: name,
    p_roll_no: rollNo,
    p_reason: reason,
  });
  if (error) throw error;
  return data;
}

export async function getLeaderboardCloud() {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('get_leaderboard');
  if (error) throw error;
  return data || [];
}

export async function getAdminDashboardCloud() {
  if (!supabase) throw new Error('Supabase is not configured.');
  const me = await getMyProfile();
  if (!me || !['admin','super-admin'].includes(me.role)) throw new Error('Admin access required.');
  const [{ data: profiles }, { data: requests }, { data: attempts }, { data: xpRows }] = await Promise.all([
    supabase.from('profiles').select('*').order('total_xp', { ascending: false }),
    me.role === 'super-admin' ? supabase.from('admin_requests').select('*').order('created_at', { ascending: false }) : Promise.resolve({ data: [] as any[] }),
    supabase.from('quiz_attempts').select('id', { count: 'exact', head: false }),
    supabase.from('xp_transactions').select('amount'),
  ]);
  return {
    me,
    profiles: profiles || [],
    requests: requests || [],
    attempts: attempts || [],
    totalXp: (xpRows || []).reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0),
  };
}

export async function reviewAdminRequestCloud(id: string, action: 'approve' | 'reject') {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.rpc('review_admin_request', { p_request_id: id, p_action: action });
  if (error) throw error;
  return data;
}

# RIT Digital Campus — Real Database Setup

## 1. Supabase project

Project URL:
`https://crbypufdnmpuuotgseky.supabase.co`

The frontend uses only the Supabase **publishable** key. Never add a service-role/secret key to Vercel frontend variables.

## 2. Enable Anonymous Sign-Ins

In Supabase Dashboard:

**Authentication → Providers / Sign In → Anonymous Sign-Ins → Enable**

The student login uses an anonymous Supabase Auth session so the current RIT UI can keep the simple name + roll-number flow while still getting a real `auth.users` identity.

## 3. Create the database

Open **SQL Editor**, create a new query, paste the entire contents of `supabase_schema.sql`, and run it.

This creates:

- profiles
- xp_transactions
- quiz_attempts
- admin_requests
- campus_discoveries
- daily_missions
- PostgreSQL XP functions
- admin approval function
- RLS policies
- live leaderboard view

## 4. Create Strange's real Auth account

Go to:

**Authentication → Users → Add user**

Create the Auth account that Strange will use for the Admin Command Core. Choose the email/password yourself; do not put the password in source code.

After creating the user, copy that user's Auth UUID.

Then in SQL Editor run:

```sql
update public.profiles
set name='Strange',
    roll_no='200812200810',
    role='super-admin'
where id='PASTE_STRANGE_AUTH_UUID_HERE';
```

The manual bootstrap is intentional: nobody can become the first super-admin merely by typing Strange's roll number.

## 5. Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add:

```text
VITE_SUPABASE_URL=https://crbypufdnmpuuotgseky.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_WlkjmqlZmy36THLxYRpfkA_Fsdt_Ywp
```

Apply to Production, Preview and Development as needed, then redeploy.

## 6. What is now stored online

- Student profiles
- Fire XP totals
- XP transaction history
- Quiz attempts
- Daily mission claims
- Campus discoveries
- Admin requests
- Admin roles
- Global XP leaderboard

## XP rules

- Correct quiz answer: 10 XP
- Quiz completion: 50 XP
- Perfect quiz bonus: 100 XP
- Daily mission: 100 XP once per day
- Department campus discovery: 15 XP once per department

The quiz RPC currently receives the completed score from the browser and calculates the reward server-side. For stronger anti-cheat protection, the next upgrade should move the question bank and answer validation into PostgreSQL/Edge Functions so the browser never submits the correct score as trusted input.

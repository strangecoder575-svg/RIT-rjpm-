# RIT Interactive Digital Campus — Shared Student/Admin + Fire XP

## Login
The website now uses one shared login page with a role switch at the top:
- STUDENT: normal student portal login.
- ADMIN: administrator login and admin-access request form.

## Initial administrator
- Name: Strange
- Roll No: 200812200810
- Role: Super Admin

An approved administrator can manage admin-access requests. In this prototype, only the Super Admin can approve or reject new admin requests.

## Fire XP
XP is now tied to the signed-in student's roll number and is awarded for:
- Correct quiz answers: +10 XP each.
- Completing a quiz: +50 XP.
- Perfect quiz: additional +100 XP.
- Daily campus challenge: +100 XP.
- Discovering a department building on the digital campus: +15 XP.

The current XP is visible in the top navigation, Digital Campus profile, and quiz completion screen.

## Important prototype note
This version stores authentication, admin requests, XP and quiz counters in browser localStorage. It is useful for the interactive prototype, but it is NOT secure multi-user authentication. For production, move authentication and data to a server/database such as Supabase or Firebase and never put admin credentials in frontend code.

## Vercel
The repository root must contain `package.json`, `index.html`, `src/`, `vite.config.ts`, and `vercel.json`.

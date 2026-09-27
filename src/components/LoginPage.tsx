import React, { useState } from 'react';
import { DEPTS } from '../data/departments';
import { StudentUser } from '../types/user';
import { saveStoredUser } from '../utils/userStorage';
import { signInAdmin, submitAdminRequestCloud, upsertStudentProfile, ensureStudentSession } from '../utils/cloud';
import { User, Hash, GraduationCap, Calendar, Sparkles, ArrowRight, ShieldCheck, Shield, Send, CheckCircle2, Mail, KeyRound, Database } from 'lucide-react';
import { playClickSound, playWarpSound } from '../utils/sound';
import { RIT3DWorld } from './RIT3DWorld';
import { supabaseConfigured } from '../utils/supabaseClient';

interface LoginPageProps {
  onLoginSuccess: (user: StudentUser) => void;
  onAdminLoginSuccess?: () => void;
  initialMode?: LoginMode;
}

type LoginMode = 'student' | 'admin';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onAdminLoginSuccess, initialMode = 'student' }) => {
  const [mode, setMode] = useState<LoginMode>(initialMode);
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [deptId, setDeptId] = useState('cse');
  const [year, setYear] = useState('3rd Year');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const switchMode = (next: LoginMode) => {
    playClickSound(); setMode(next); setError(''); setRequestSent(false);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) { setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'); return; }
    if (!name.trim()) { setError('Please enter your full name to proceed.'); return; }
    setBusy(true); setError('');
    try {
      const selectedDept = DEPTS.find(d => d.id === deptId) || DEPTS[0];
      const user = await upsertStudentProfile({
        name: name.trim(),
        rollNo: rollNo.trim() || `RIT-${Math.floor(100000 + Math.random() * 900000)}`,
        deptId: selectedDept.id,
        year,
      });
      const studentUser: StudentUser = { name: user.name, rollNo: user.rollNo, deptId: user.deptId, deptCode: user.deptCode, year: user.year, loginTime: new Date().toISOString(), authUserId: user.id };
      saveStoredUser(studentUser);
      playWarpSound(); onLoginSuccess(studentUser);
    } catch (err: any) {
      setError(err?.message || 'Student login failed.');
    } finally { setBusy(false); }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) { setError('Enter the administrator email and password.'); return; }
    setBusy(true); setError('');
    try {
      const admin = await signInAdmin(adminEmail, adminPassword);
      if (rollNo.trim() && admin.rollNo !== rollNo.trim()) { setError('Admin roll number does not match the authenticated account.'); return; }
      if (name.trim() && admin.name.trim().toLowerCase() !== name.trim().toLowerCase()) { setError('Admin name does not match the authenticated account.'); return; }
      playWarpSound(); onAdminLoginSuccess?.();
    } catch (err: any) {
      setError(err?.message || 'Admin login failed.');
    } finally { setBusy(false); }
  };

  const handleAdminRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) { setError('Enter your name and roll number before requesting admin access.'); return; }
    setBusy(true); setError('');
    try {
      await ensureStudentSession();
      await submitAdminRequestCloud(name, rollNo, adminReason);
      setRequestSent(true); playClickSound();
    } catch (err: any) {
      setError(err?.message || 'Could not send admin request.');
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#f3f5f7] flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden select-none">
      <div className="absolute w-[600px] h-[600px] rounded-full -right-[150px] -top-[150px] pointer-events-none opacity-40 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(85,230,165,0.4) 0%, rgba(22,77,60,0.2) 50%, transparent 70%)' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full -left-[150px] -bottom-[150px] pointer-events-none opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(90,169,255,0.4) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 opacity-45 pointer-events-none"><RIT3DWorld compact /></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121720] border border-[#292f38] text-[11px] font-semibold tracking-wider text-[#55e6a5] mb-3"><ShieldCheck className="w-3.5 h-3.5" /> <span>RIT DIGITAL CAMPUS • SECURE GATEWAY</span></div>
          <div className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white flex items-center justify-center gap-1">RIT<span className="text-[#55e6a5]">.</span></div>
          <h2 className="text-xs font-bold tracking-widest text-[#aeb5c0] uppercase mt-1">RAMCO INSTITUTE OF TECHNOLOGY</h2>
          <p className="text-xs text-[#707987] mt-0.5">North Venganallur, Rajapalayam, Tamil Nadu</p>
        </div>

        <div className="bg-[#0d1117]/88 border border-[#55e6a5]/25 rounded-3xl p-5 sm:p-7 shadow-[0_30px_100px_rgba(0,0,0,.75)] backdrop-blur-xl">
          <div className="login-role-switch" role="tablist" aria-label="Choose portal">
            <button type="button" className={mode === 'student' ? 'active' : ''} onClick={() => switchMode('student')}><User size={15}/> STUDENT</button>
            <button type="button" className={mode === 'admin' ? 'active admin' : ''} onClick={() => switchMode('admin')}><Shield size={15}/> ADMIN</button>
          </div>

          {!supabaseConfigured && <div className="mt-4 p-3 rounded-xl bg-amber-950/60 border border-amber-700/60 text-xs text-amber-200 flex gap-2"><Database size={15} className="shrink-0"/><span>Cloud database is not configured in this deployment yet.</span></div>}
          {error && <div className="mt-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-300">{error}</div>}

          {mode === 'student' ? (
            <>
              <div className="mb-5 mt-5"><h3 className="font-heading font-bold text-xl text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#55e6a5]" /> Student Portal Login</h3><p className="text-xs text-[#aeb5c0] mt-1">Your browser receives a secure Supabase student session. XP, quizzes and missions are stored online.</p></div>
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <Field icon={<User className="w-3.5 h-3.5 text-[#55e6a5]" />} label="Your Full Name *"><input type="text" required value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="e.g. Karthikeyan R." className="login-input" /></Field>
                <Field icon={<Hash className="w-3.5 h-3.5 text-[#4dd8e6]" />} label="Roll No / Register No (Optional)"><input type="text" value={rollNo} onChange={e => setRollNo(e.target.value)} placeholder="e.g. 953621104050" className="login-input" /></Field>
                <Field icon={<GraduationCap className="w-3.5 h-3.5 text-[#f2b544]" />} label="Academic Department"><select value={deptId} onChange={e => setDeptId(e.target.value)} className="login-input">{DEPTS.map(d => <option key={d.id} value={d.id}>{d.code} - {d.name}</option>)}</select></Field>
                <Field icon={<Calendar className="w-3.5 h-3.5 text-[#b98bff]" />} label="Year of Study"><select value={year} onChange={e => setYear(e.target.value)} className="login-input"><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Faculty / Guest</option></select></Field>
                <button disabled={busy || !supabaseConfigured} type="submit" className="login-main-button disabled:opacity-50"><span>{busy ? 'CONNECTING...' : 'ENTER RIT PORTAL'}</span><ArrowRight className="w-4 h-4" /></button>
              </form>
              <p className="text-[10px] text-[#707987] mt-4 text-center">Student access uses Supabase Anonymous Auth. Enable <b>Anonymous Sign-Ins</b> in Supabase Authentication settings.</p>
            </>
          ) : (
            <>
              <div className="mb-5 mt-5"><h3 className="font-heading font-bold text-xl text-white flex items-center gap-2"><Shield className="w-5 h-5 text-[#b98bff]" /> Admin Command Login</h3><p className="text-xs text-[#aeb5c0] mt-1">Approved administrators authenticate with a real Supabase account. Strange is the initial super-admin • Roll No <b className="text-[#55e6a5]">200812200810</b>.</p></div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <Field icon={<Mail className="w-3.5 h-3.5 text-[#b98bff]" />} label="Admin Email"><input type="email" required value={adminEmail} onChange={e => { setAdminEmail(e.target.value); setError(''); }} placeholder="your-admin-email@example.com" className="login-input" /></Field>
                <Field icon={<KeyRound className="w-3.5 h-3.5 text-[#4dd8e6]" />} label="Password"><input type="password" required value={adminPassword} onChange={e => { setAdminPassword(e.target.value); setError(''); }} placeholder="Supabase Auth password" className="login-input" /></Field>
                <Field icon={<User className="w-3.5 h-3.5 text-[#55e6a5]" />} label="Admin Name"><input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Strange" className="login-input" /></Field>
                <Field icon={<Hash className="w-3.5 h-3.5 text-[#4dd8e6]" />} label="Admin Roll No"><input type="text" required value={rollNo} onChange={e => setRollNo(e.target.value)} placeholder="200812200810" className="login-input" /></Field>
                <button disabled={busy} type="submit" className="login-admin-button disabled:opacity-50"><Shield size={16}/> {busy ? 'AUTHENTICATING...' : 'ENTER ADMIN COMMAND CORE'}</button>
              </form>
              <div className="admin-request-box">
                <div><b>Want to become an admin?</b><span>Your request is saved online and can only be approved by the super-admin.</span></div>
                {!requestSent ? <form onSubmit={handleAdminRequest} className="space-y-3"><textarea value={adminReason} onChange={e => setAdminReason(e.target.value)} placeholder="Why do you need admin access?" className="login-input min-h-[74px] resize-none" /><button disabled={busy} type="submit" className="login-request-button disabled:opacity-50"><Send size={14}/> SEND ADMIN REQUEST</button></form> : <div className="request-success"><CheckCircle2 size={18}/><span>Request sent to the online admin queue. Strange can review it from Command Core.</span></div>}
              </div>
              <p className="text-[10px] text-[#707987] mt-4 text-center">Never put a Supabase service-role/secret key in this website. Admin authorization is enforced by database policies.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
  <div><label className="block text-xs font-semibold text-[#aeb5c0] mb-1.5 flex items-center gap-1.5">{icon}<span>{label}</span></label>{children}</div>
);

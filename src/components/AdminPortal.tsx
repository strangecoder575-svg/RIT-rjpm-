import React, { useMemo, useState } from 'react';
import { Activity, ArrowLeft, BarChart3, Database, LockKeyhole, LogOut, Shield, Users, Zap } from 'lucide-react';
import { DEPTS } from '../data/departments';
import { getStoredUser } from '../utils/userStorage';

export const AdminPortal: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [boot, setBoot] = useState(false);

  const xp = Number(localStorage.getItem('rit_xp') || 420);
  const student = getStoredUser();
  const stats = useMemo(() => ({
    users: student ? 1 : 0,
    xp,
    departments: DEPTS.length,
    attempts: Number(localStorage.getItem('rit_quiz_attempts') || 0),
  }), [student, xp]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo gate only. Replace with server-side authentication before real deployment.
    if (username.trim().toLowerCase() === 'admin' && password === 'RIT-ADMIN') {
      setError(''); setBoot(true);
      window.setTimeout(() => setAuthenticated(true), 900);
    } else {
      setError('Access denied. This demo gateway accepts the configured admin demo credentials.');
    }
  };

  if (boot && !authenticated) {
    return <div className="admin-boot"><div className="admin-boot-reactor"><i/><b/></div><strong>AUTHENTICATING RIT ADMIN CORE</strong><span>SECURE CHANNEL ESTABLISHED...</span></div>;
  }

  if (!authenticated) {
    return <div className="admin-page"><div className="admin-noise"/><a className="admin-back" href="/"><ArrowLeft size={15}/> Return to student campus</a><main className="admin-login-shell"><div className="admin-symbol"><Shield size={30}/><span>RIT</span></div><div className="admin-kicker">RESTRICTED NETWORK // ADMINISTRATOR ACCESS</div><h1>Command <span>Core.</span></h1><p>Enter the administrator gateway to manage the RIT digital campus. This is a separate control surface from the student portal.</p><form onSubmit={login} className="admin-login-card"><div className="admin-card-top"><span/><b>ADMIN AUTHENTICATION</b><small>LEVEL 09</small></div><label>ADMIN ID<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" placeholder="admin"/></label><label>ACCESS KEY<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••"/></label>{error && <div className="admin-error">{error}</div>}<button type="submit"><LockKeyhole size={16}/> ENTER COMMAND CORE</button><small className="admin-demo-note">Demo gateway: <b>admin</b> / <b>RIT-ADMIN</b>. Use real server-side authentication before production.</small></form></main></div>;
  }

  return <div className="admin-dashboard"><header className="admin-dashboard-head"><div><div className="admin-kicker">RIT COMMAND CORE</div><h1>Digital Campus <span>Control Room</span></h1></div><div className="admin-head-actions"><span className="admin-online"><i/> ADMIN ONLINE</span><button onClick={() => { setAuthenticated(false); setBoot(false); }}><LogOut size={14}/> Exit</button></div></header><main className="admin-dashboard-grid"><section className="admin-stat-grid"><article><Users/><small>STUDENTS SEEN</small><strong>{stats.users}</strong><span>browser-local demo data</span></article><article><Zap/><small>TOTAL FIRE XP</small><strong>{stats.xp.toLocaleString()}</strong><span>current campus core</span></article><article><Database/><small>DEPARTMENTS</small><strong>{stats.departments}</strong><span>academic portals</span></article><article><Activity/><small>QUIZ ATTEMPTS</small><strong>{stats.attempts}</strong><span>recorded locally</span></article></section><section className="admin-command-grid"><article className="admin-data-card"><div className="admin-section-title"><BarChart3 size={16}/> NETWORK OVERVIEW</div><div className="admin-chart"><span style={{height:'42%'}}/><span style={{height:'67%'}}/><span style={{height:'51%'}}/><span style={{height:'82%'}}/><span style={{height:'62%'}}/><span style={{height:'92%'}}/><span style={{height:'75%'}}/><span style={{height:'98%'}}/></div><p>Connect Supabase/Firebase in the next phase to replace browser-local demo data with real student, quiz, leaderboard and audit records.</p></article><article className="admin-data-card"><div className="admin-section-title"><Shield size={16}/> DEPARTMENT NODES</div><div className="admin-node-list">{DEPTS.map((d) => <div key={d.id}><span style={{background:d.accent}}/><b>{d.code}</b><small>{d.name}</small><em>ONLINE</em></div>)}</div></article></section><section className="admin-notice"><strong>Production security checkpoint</strong><span>This dashboard is intentionally a front-end prototype. Never store real admin passwords or sensitive student records in localStorage. Use server-side authentication and a database for production.</span></section></main></div>;
};

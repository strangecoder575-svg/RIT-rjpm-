import React, { useEffect, useState } from 'react';
import { Activity, ArrowLeft, BarChart3, Check, Database, LogOut, Shield, Users, X, Zap, UserPlus, Clock3, RefreshCw } from 'lucide-react';
import { DEPTS } from '../data/departments';
import { getAdminDashboardCloud, reviewAdminRequestCloud, signOutCloud } from '../utils/cloud';

interface AdminPortalProps { admin: any; onLogout: () => void; }

export const AdminPortal: React.FC<AdminPortalProps> = ({ admin, onLogout }) => {
  const [data, setData] = useState<any>({ profiles: [], requests: [], attempts: [], totalXp: 0, me: admin });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true); setError('');
    try { setData(await getAdminDashboardCloud()); }
    catch (err: any) { setError(err?.message || 'Could not load Command Core data.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);

  const review = async (id: string, action: 'approve' | 'reject') => {
    try { await reviewAdminRequestCloud(id, action); await refresh(); }
    catch (err: any) { setError(err?.message || 'Admin request review failed.'); }
  };

  const pending = data.requests.filter((r: any) => r.status === 'pending');
  const admins = data.profiles.filter((p: any) => p.role === 'admin' || p.role === 'super-admin');

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-head">
        <div><div className="admin-kicker">RIT COMMAND CORE // {admin.role === 'super-admin' ? 'ROOT ADMIN' : 'ADMIN'}</div><h1>Digital Campus <span>Control Room</span></h1><p className="admin-subtitle">Signed in as <b>{admin.name}</b> • {admin.rollNo}</p></div>
        <div className="admin-head-actions"><span className="admin-online"><i/> CLOUD ADMIN ONLINE</span><button onClick={onLogout}><LogOut size={14}/> Exit</button></div>
      </header>

      <main className="admin-dashboard-grid">
        {error && <section className="admin-notice"><strong>Cloud alert</strong><span>{error}</span></section>}
        <section className="admin-stat-grid">
          <article><Users/><small>STUDENT PROFILES</small><strong>{data.profiles.length}</strong><span>online PostgreSQL profiles</span></article>
          <article><Zap/><small>TOTAL FIRE XP</small><strong>{Number(data.totalXp).toLocaleString()}</strong><span>from recorded XP transactions</span></article>
          <article><Database/><small>DEPARTMENTS</small><strong>{DEPTS.length}</strong><span>academic portals</span></article>
          <article><Activity/><small>QUIZ ATTEMPTS</small><strong>{data.attempts.length}</strong><span>database records</span></article>
        </section>

        {admin.role === 'super-admin' && (
          <section className="admin-data-card admin-requests-card">
            <div className="admin-section-title"><UserPlus size={16}/> ADMIN ACCESS REQUESTS <span className="request-count">{pending.length} PENDING</span></div>
            {data.requests.length === 0 ? <div className="empty-request"><Shield size={22}/><p>No admin requests yet.</p><small>Requests are stored in Supabase.</small></div> : <div className="admin-request-list">{data.requests.map((r: any) => <div key={r.id} className={`admin-request-row ${r.status}`}><div className="request-main"><div className="request-avatar">{r.name.slice(0,1).toUpperCase()}</div><div><b>{r.name}</b><span>{r.roll_no}</span><small>{r.reason}</small></div></div><div className="request-meta"><span><Clock3 size={12}/> {new Date(r.created_at).toLocaleString()}</span><em>{r.status.toUpperCase()}</em>{r.status === 'pending' && <div className="request-actions"><button className="approve" onClick={() => void review(r.id, 'approve')}><Check size={14}/> Approve</button><button className="reject" onClick={() => void review(r.id, 'reject')}><X size={14}/> Reject</button></div>}</div></div>)}</div>}
          </section>
        )}

        <section className="admin-command-grid">
          <article className="admin-data-card"><div className="admin-section-title"><BarChart3 size={16}/> CLOUD NETWORK OVERVIEW</div><div className="admin-chart"><span style={{height:'42%'}}/><span style={{height:'67%'}}/><span style={{height:'51%'}}/><span style={{height:'82%'}}/><span style={{height:'62%'}}/><span style={{height:'92%'}}/><span style={{height:'75%'}}/><span style={{height:'98%'}}/></div><p>XP, quiz attempts and admin requests now come from Supabase PostgreSQL. Quiz scores are recorded server-side; question-answer verification can be hardened further by moving the question bank into the database.</p></article>
          <article className="admin-data-card"><div className="admin-section-title"><Shield size={16}/> APPROVED ADMIN NODES</div><div className="admin-node-list">{admins.map((a: any) => <div key={a.id}><span style={{background:a.role === 'super-admin' ? '#b98bff' : '#55e6a5'}}/><b>{a.name}</b><small>{a.roll_no} • {a.role}</small><em>AUTHORIZED</em></div>)}</div></article>
        </section>

        <section className="admin-data-card"><div className="admin-section-title"><RefreshCw size={16}/> LIVE DATABASE MEMBERS</div><div className="admin-node-list">{data.profiles.slice(0, 20).map((p: any) => <div key={p.id}><span style={{background:'#4dd8e6'}}/><b>{p.name}</b><small>{p.roll_no} • {p.dept_code}</small><em>{Number(p.total_xp || 0).toLocaleString()} XP</em></div>)}</div></section>

        <section className="admin-notice"><strong>Security model</strong><span><b>Strange • 200812200810</b> is intended to be the initial super-admin. Roles are protected by PostgreSQL functions/RLS. Never put a service-role key in Vercel frontend environment variables.</span></section>
        <a className="admin-back-bottom" href="/"><ArrowLeft size={14}/> Back to shared login</a>
      </main>
    </div>
  );
};

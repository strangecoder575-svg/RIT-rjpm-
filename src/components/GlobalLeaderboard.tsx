import React, { useEffect, useState } from 'react';
import { Department } from '../data/departments';
import { StudentUser } from '../types/user';
import { getLeaderboardCloud } from '../utils/cloud';
import { Trophy, Crown, Search, Flame, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { LeaderboardPodium3D } from './LeaderboardPodium3D';

interface GlobalLeaderboardProps { departments: Department[]; currentDeptId?: string; onTakeQuizForDept?: (deptId: string) => void; onClose?: () => void; currentStudent?: StudentUser | null; }

type CloudEntry = { id: string; name: string; dept_id: string; dept_code: string; total_xp: number; role: string };

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({ departments, currentDeptId, onTakeQuizForDept, onClose, currentStudent }) => {
  const [entries, setEntries] = useState<CloudEntry[]>([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState(currentDeptId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); try { setEntries(await getLeaderboardCloud() as CloudEntry[]); } catch (e) { console.error(e); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);

  const filtered = entries.filter(e => (selectedDeptFilter === 'all' || e.dept_id === selectedDeptFilter) && (`${e.name} ${e.dept_code}`).toLowerCase().includes(searchQuery.toLowerCase()));
  const top3 = filtered.slice(0,3);
  const totalXp = filtered.reduce((s,e) => s + Number(e.total_xp || 0), 0);
  const highest = filtered[0]?.total_xp || 0;

  const podiumEntries = top3.map((e) => ({ id: e.id, studentName: e.name, rollNo: '', deptId: e.dept_id, deptCode: e.dept_code, score: e.total_xp, total: 0, percentage: e.total_xp, timeTaken: 0, grade: 'Fire XP', date: '' } as any));

  return <div className="w-full bg-[#0d1117] border border-[#292f38] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-fadeIn">
    <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #f5d90a 0%, #55e6a5 50%, transparent 70%)' }} />
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#20242c] relative z-10">
      <div><div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#f5d90a] uppercase"><Trophy className="w-4 h-4"/> RIT FIRE XP HALL OF FAME</div><h3 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-1">Global XP Leaderboard</h3><p className="text-xs sm:text-sm text-[#aeb5c0] mt-1">Live PostgreSQL rankings shared across the RIT digital campus.</p></div>
      <div className="flex gap-2"><button onClick={() => void load()} className="px-3 py-2 rounded-xl border border-[#292f38] bg-[#121720] text-xs text-[#aeb5c0] flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5"/> Refresh</button>{onClose && <button onClick={() => {playClickSound(); onClose();}} className="px-4 py-2 rounded-xl bg-[#55e6a5] text-[#06110d] text-xs font-bold">Resume Quiz</button>}</div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 relative z-10">
      <div className="p-3.5 rounded-xl bg-[#121720] border border-[#20242c]"><span className="text-[11px] font-semibold text-[#8b95a3] flex items-center gap-1"><Flame className="w-3 h-3 text-amber-400"/> Ranked Members</span><div className="text-xl font-heading font-bold text-white mt-1">{filtered.length}</div></div>
      <div className="p-3.5 rounded-xl bg-[#121720] border border-[#20242c]"><span className="text-[11px] font-semibold text-[#8b95a3] flex items-center gap-1"><Crown className="w-3 h-3 text-[#f5d90a]"/> Highest XP</span><div className="text-xl font-heading font-bold text-[#55e6a5] mt-1">{Number(highest).toLocaleString()}</div></div>
      <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-[#121720] border border-[#20242c]"><span className="text-[11px] font-semibold text-[#8b95a3] flex items-center gap-1"><Zap className="w-3 h-3 text-blue-400"/> XP in View</span><div className="text-xl font-heading font-bold text-[#4dd8e6] mt-1">{Number(totalXp).toLocaleString()}</div></div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6 relative z-10">
      <div className="flex flex-wrap gap-1.5 w-full sm:w-auto"><button onClick={() => setSelectedDeptFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedDeptFilter==='all'?'bg-[#55e6a5] text-[#06110d]':'bg-[#121720] border border-[#292f38] text-[#aeb5c0]'}`}>Global</button>{departments.map(d => <button key={d.id} onClick={() => setSelectedDeptFilter(d.id)} className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${selectedDeptFilter===d.id?'bg-[#161d29] text-white':'bg-[#121720] border-[#292f38] text-[#aeb5c0]'}`}>{d.code}</button>)}</div>
      <div className="relative w-full sm:w-56"><Search className="w-3.5 h-3.5 text-[#aeb5c0] absolute left-3 top-1/2 -translate-y-1/2"/><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search student or roll..." className="w-full pl-9 pr-3 py-1.5 bg-[#121720] border border-[#292f38] rounded-xl text-xs text-white"/></div>
    </div>

    {!loading && top3.length > 0 && selectedDeptFilter==='all' && !searchQuery && <LeaderboardPodium3D entries={podiumEntries}/>} 
    <div className="overflow-x-auto relative z-10"><table className="w-full text-left text-xs"><thead><tr className="border-b border-[#20242c] text-[#8b95a3] font-semibold uppercase tracking-wider"><th className="py-3 px-3">Rank</th><th className="py-3 px-4">Student</th><th className="py-3 px-3">Department</th><th className="py-3 px-3 text-right">Fire XP</th><th className="py-3 px-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-[#20242c]/50">{filtered.map((entry,index)=>{const current=currentStudent && (entry.id===currentStudent.authUserId || entry.id===currentStudent.authUserId); return <tr key={entry.id} className={current?'bg-[#1c4635]/40 border-l-2 border-l-[#55e6a5]':'hover:bg-[#121720]/80'}><td className="py-3.5 px-3 font-heading font-bold text-white">#{index+1}</td><td className="py-3.5 px-4"><b className={current?'text-[#55e6a5]':'text-white'}>{entry.name}</b>{current&&<span className="ml-2 text-[10px] font-bold bg-[#55e6a5] text-[#06110d] px-1.5 py-0.5 rounded">YOU</span>}<div className="text-[11px] font-mono text-[#8b95a3]">RIT CAMPUS MEMBER</div></td><td className="py-3.5 px-3"><span className="px-2 py-0.5 rounded text-[11px] font-semibold border" style={{color:departments.find(d=>d.id===entry.dept_id)?.accent || '#55e6a5', borderColor:`${departments.find(d=>d.id===entry.dept_id)?.accent || '#55e6a5'}40`}}>{entry.dept_code}</span></td><td className="py-3.5 px-3 text-right font-mono font-extrabold text-[#55e6a5]">🔥 {Number(entry.total_xp||0).toLocaleString()}</td><td className="py-3.5 px-3 text-right">{onTakeQuizForDept&&<button onClick={()=>{playClickSound();onTakeQuizForDept(entry.dept_id)}} className="text-[11px] font-semibold text-[#55e6a5] inline-flex items-center gap-1">Challenge <ArrowRight className="w-3 h-3"/></button>}</td></tr>})}</tbody></table>{(!loading&&filtered.length===0)&&<div className="text-center py-12 text-[#aeb5c0]">No cloud members found for this filter.</div>}{loading&&<div className="text-center py-12 text-[#55e6a5]">JARVIS // loading global XP...</div>}</div>
  </div>;
};

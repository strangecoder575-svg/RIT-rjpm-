import React, { useState, useEffect } from 'react';
import { Department } from '../data/departments';
import { LeaderboardEntry } from '../types/leaderboard';
import { StudentUser } from '../types/user';
import { getLeaderboardEntries, resetLeaderboardToDefault } from '../utils/leaderboardStorage';
import { 
  Trophy, 
  Crown, 
  Search, 
  RotateCcw, 
  Clock, 
  Calendar, 
  Flame, 
  Award,
  Sparkles,
  Zap,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { LeaderboardPodium3D } from './LeaderboardPodium3D';

interface GlobalLeaderboardProps {
  departments: Department[];
  currentDeptId?: string;
  onTakeQuizForDept?: (deptId: string) => void;
  onClose?: () => void;
  currentStudent?: StudentUser | null;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  departments,
  currentDeptId,
  onTakeQuizForDept,
  onClose,
  currentStudent
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>(currentDeptId || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadEntries = () => {
    setEntries(getLeaderboardEntries());
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleReset = () => {
    playClickSound();
    if (window.confirm("Reset leaderboard back to default top institutional ranks?")) {
      const reset = resetLeaderboardToDefault();
      setEntries(reset);
    }
  };

  const filteredEntries = entries.filter(item => {
    const matchesDept = selectedDeptFilter === 'all' || item.deptId === selectedDeptFilter;
    const matchesSearch = item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.rollNo && item.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          item.deptCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const top3 = filteredEntries.slice(0, 3);
  const remaining = filteredEntries.slice(3);

  // Overall stats
  const totalAttempts = filteredEntries.length;
  const highestScore = filteredEntries.length > 0 ? Math.max(...filteredEntries.map(e => e.percentage)) : 0;
  const avgAccuracy = filteredEntries.length > 0 
    ? Math.round(filteredEntries.reduce((acc, curr) => acc + curr.percentage, 0) / filteredEntries.length)
    : 0;

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    if (mins === 0) return `${rem}s`;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="w-full bg-[#0d1117] border border-[#292f38] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-fadeIn">
      {/* Background glow */}
      <div 
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f5d90a 0%, #55e6a5 50%, transparent 70%)' }}
      />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#20242c] relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#f5d90a] uppercase">
            <Trophy className="w-4 h-4 text-[#f5d90a]" />
            <span>RIT HALL OF FAME</span>
          </div>
          <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-1">
            Global Quiz Leaderboard
          </h3>
          <p className="text-xs sm:text-sm text-[#aeb5c0] mt-1">
            Live rankings tracking top engineering minds, accuracy, and fastest completions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleReset}
            title="Reset to default ranks"
            className="px-3 py-2 rounded-xl border border-[#292f38] bg-[#121720] text-xs font-medium text-[#aeb5c0] hover:text-white hover:border-[#384252] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset High Scores</span>
          </button>

          {onClose && (
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#55e6a5] text-[#06110d] text-xs font-bold hover:bg-[#6ef3b7] transition-all cursor-pointer"
            >
              Resume Quiz
            </button>
          )}
        </div>
      </div>

      {/* Quick summary metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 relative z-10">
        <div className="p-3.5 rounded-xl bg-[#121720] border border-[#20242c]">
          <span className="text-[11px] font-semibold text-[#8b95a3] flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" /> Total Ranked
          </span>
          <div className="text-xl font-heading font-bold text-white mt-1">{totalAttempts} Students</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121720] border border-[#20242c]">
          <span className="text-[11px] font-semibold text-[#8b95a3] flex items-center gap-1">
            <Crown className="w-3 h-3 text-[#f5d90a]" /> Top Record
          </span>
          <div className="text-xl font-heading font-bold text-[#55e6a5] mt-1">{highestScore}% Accuracy</div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-[#121720] border border-[#20242c]">
          <span className="text-[11px] font-semibold text-[#8b95a3] flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-400" /> Avg Accuracy
          </span>
          <div className="text-xl font-heading font-bold text-[#4dd8e6] mt-1">{avgAccuracy}%</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6 relative z-10">
        {/* Department Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => {
              playClickSound();
              setSelectedDeptFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDeptFilter === 'all'
                ? 'bg-[#55e6a5] text-[#06110d]'
                : 'bg-[#121720] border border-[#292f38] text-[#aeb5c0] hover:text-white'
            }`}
          >
            Global (All)
          </button>

          {departments.map(dept => {
            const isSel = selectedDeptFilter === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => {
                  playClickSound();
                  setSelectedDeptFilter(dept.id);
                }}
                style={{
                  borderColor: isSel ? dept.accent : undefined,
                  color: isSel ? '#ffffff' : undefined
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  isSel
                    ? 'bg-[#161d29]'
                    : 'bg-[#121720] border-[#292f38] text-[#aeb5c0] hover:text-white'
                }`}
              >
                {dept.code}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56 shrink-0">
          <Search className="w-3.5 h-3.5 text-[#aeb5c0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or roll..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121720] border border-[#292f38] rounded-xl text-xs text-white placeholder-[#8b95a3] focus:outline-none focus:border-[#55e6a5]"
          />
        </div>
      </div>

      {/* 3D Podium Top 3 */}
      {top3.length > 0 && selectedDeptFilter === 'all' && searchQuery === '' && <LeaderboardPodium3D entries={top3} />}

      {/* Podium Top 3 (if exists) */}
      {top3.length > 0 && selectedDeptFilter === 'all' && searchQuery === '' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
          {top3.map((entry, idx) => {
            const podiumRanks = [
              { color: '#f5d90a', title: '1st Place', border: 'border-[#f5d90a]/50', icon: '🥇' },
              { color: '#c0c0c0', title: '2nd Place', border: 'border-slate-400/40', icon: '🥈' },
              { color: '#cd7f32', title: '3rd Place', border: 'border-amber-700/40', icon: '🥉' }
            ];
            const p = podiumRanks[idx];

            return (
              <div
                key={entry.id}
                className={`p-5 rounded-2xl bg-gradient-to-b from-[#161c27] to-[#0f131b] border ${p.border} relative flex flex-col justify-between shadow-xl`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: p.color }}>
                        {p.title}
                      </span>
                      <h4 className="font-heading font-bold text-base text-white leading-tight">
                        {entry.studentName}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-[#0d1117] border border-[#292f38] text-gray-300">
                    {entry.deptCode}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#20242c] flex items-center justify-between">
                  <div>
                    <div className="text-xl font-heading font-extrabold text-white">
                      {entry.score}/{entry.total}
                    </div>
                    <div className="text-[11px] text-[#55e6a5] font-semibold">
                      {entry.percentage}% Accuracy
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-[#aeb5c0] space-y-0.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      <span>{formatSeconds(entry.timeTaken)}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end text-[10px] text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{entry.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table / Cards */}
      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#20242c] text-[#8b95a3] font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Rank</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-3">Department</th>
              <th className="py-3 px-3 text-center">Score</th>
              <th className="py-3 px-3 text-center">Accuracy</th>
              <th className="py-3 px-3">Time</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#20242c]/50">
            {filteredEntries.map((entry, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const dept = departments.find(d => d.id === entry.deptId);
              const isCurrentUser = currentStudent && (
                entry.studentName.toLowerCase() === currentStudent.name.toLowerCase() ||
                (entry.rollNo && currentStudent.rollNo && entry.rollNo.toLowerCase() === currentStudent.rollNo.toLowerCase())
              );

              return (
                <tr
                  key={entry.id}
                  className={`transition-colors group ${
                    isCurrentUser 
                      ? 'bg-[#1c4635]/40 border-l-2 border-l-[#55e6a5] hover:bg-[#1c4635]/60' 
                      : 'hover:bg-[#121720]/80'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-heading font-bold">
                      {rank === 1 && <span className="text-amber-400">#1 🏆</span>}
                      {rank === 2 && <span className="text-slate-300">#2 🥈</span>}
                      {rank === 3 && <span className="text-amber-600">#3 🥉</span>}
                      {rank > 3 && (
                        <span className="w-6 h-6 rounded-md bg-[#121720] border border-[#292f38] flex items-center justify-center text-xs font-mono text-[#aeb5c0]">
                          {rank}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Student */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold transition-colors ${isCurrentUser ? 'text-[#55e6a5] font-bold' : 'text-white group-hover:text-[#55e6a5]'}`}>
                        {entry.studentName}
                      </span>
                      {isCurrentUser && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#55e6a5] text-[#06110d] px-1.5 py-0.5 rounded uppercase tracking-wider">
                          YOU
                        </span>
                      )}
                    </div>
                    {entry.rollNo && (
                      <div className="text-[11px] font-mono text-[#8b95a3]">
                        {entry.rollNo}
                      </div>
                    )}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span 
                      className="px-2 py-0.5 rounded text-[11px] font-semibold border"
                      style={{
                        backgroundColor: dept ? `${dept.accent}15` : '#121720',
                        borderColor: dept ? `${dept.accent}40` : '#292f38',
                        color: dept ? dept.accent : '#55e6a5'
                      }}
                    >
                      {entry.deptCode}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap font-mono font-bold text-white">
                    {entry.score} / {entry.total}
                  </td>

                  {/* Accuracy */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold ${
                      entry.percentage >= 90
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : entry.percentage >= 75
                        ? 'bg-blue-950 text-blue-400 border border-blue-800/40'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {entry.percentage}%
                    </span>
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[#aeb5c0]">
                    {formatSeconds(entry.timeTaken)}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-[#8b95a3]">
                    {entry.date}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    {onTakeQuizForDept && (
                      <button
                        onClick={() => {
                          playClickSound();
                          onTakeQuizForDept(entry.deptId);
                        }}
                        className="text-[11px] font-semibold text-[#55e6a5] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Challenge</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12 text-[#aeb5c0]">
            No student scores recorded yet for this filter. Be the first to take this quiz and claim the #1 spot!
          </div>
        )}
      </div>
    </div>
  );
};

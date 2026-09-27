import React from 'react';
import { LeaderboardEntry } from '../types/leaderboard';
export const LeaderboardPodium3D: React.FC<{ entries: LeaderboardEntry[] }> = ({ entries }) => {
  const colors = ['#f5d90a','#c7d0d9','#cd7f32'];
  return <div className="podium-3d" aria-label="Top three leaderboard podium">
    {[1,0,2].map(rank => { const e=entries[rank]; return <div key={rank} className={`podium-slot rank-${rank+1}`} style={{'--rank-color':colors[rank]} as React.CSSProperties}>
      <div className="podium-avatar">{e?.studentName?.slice(0,1).toUpperCase() || '?'}</div><div className="podium-name">{e?.studentName || 'Awaiting Player'}</div><div className="podium-score">{e ? `${e.percentage}%` : '---'}</div><div className="podium-block"><span>{rank+1}</span></div>
    </div>})}
  </div>;
};

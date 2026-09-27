import React, { useMemo } from 'react';

export const RIT3DWorld: React.FC<{ compact?: boolean; onJarvisClick?: () => void }> = ({ compact = false, onJarvisClick }) => {
  const windows = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const trees = useMemo(() => Array.from({ length: 9 }, (_, i) => i), []);
  return (
    <div className={`rit-world ${compact ? 'rit-world-compact' : ''}`}>
      <div className="world-sky" />
      <div className="world-stars">{Array.from({length: 42}, (_, i) => <i key={i} style={{'--i': i} as React.CSSProperties} />)}</div>
      <div className="world-sun" />
      <div className="campus-haze" />
      <div className="campus-ground">
        <div className="campus-road road-a" /><div className="campus-road road-b" />
        <div className="campus-road road-c" />
        <div className="campus-building admin-building">
          <div className="building-roof" /><div className="building-core" />
          <div className="building-sign">RIT</div>
          <div className="building-windows">{windows.map(i => <span key={i} />)}</div>
        </div>
        <div className="campus-building lab-building"><div className="lab-glow" /><div className="building-sign">INNOVATION LABS</div></div>
        <div className="campus-tower"><span>13</span><b>YEARS</b></div>
        {trees.map(i => <div key={i} className="campus-tree" style={{'--x': `${8 + i * 10}%`, '--d': `${i * .13}s`} as React.CSSProperties}><i /><b /></div>)}
        <div className="campus-portal"><div className="portal-ring" /><span>RIT<br/><small>KNOWLEDGE</small></span></div>
      </div>
      <div className="pcb-board">
        {Array.from({ length: 18 }, (_, i) => <span key={i} className="pcb-trace" style={{ '--i': i } as React.CSSProperties} />)}
        {Array.from({ length: 14 }, (_, i) => <b key={i} className="pcb-node" style={{ '--i': i } as React.CSSProperties} />)}
        <a className="pcb-chip chip-a pcb-link" href="https://www.ritrjpm.ac.in/" target="_blank" rel="noopener noreferrer" aria-label="Open official Ramco Institute of Technology website">RIT</a><button className="pcb-chip chip-b pcb-link pcb-ai" type="button" onClick={onJarvisClick} aria-label="Open RIT JARVIS assistant">AI</button><i className="pcb-chip chip-c">CORE</i>
      </div>
      <div className="world-grid" />
      <div className="world-label"><strong>RAMCO INSTITUTE OF TECHNOLOGY</strong><span>3D CAMPUS // KNOWLEDGE NETWORK ONLINE</span></div>
    </div>
  );
};

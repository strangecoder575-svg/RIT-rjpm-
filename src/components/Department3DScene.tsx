import React from 'react';
import { Department } from '../data/departments';

const labels: Record<string, string> = {
  circuit: 'CODE MATRIX', orbit: 'NEURAL CORE', globe: 'NETWORK PLANET', bars: 'BUSINESS DATA', wave: 'SIGNAL LAB',
  bolt: 'POWER GRID', gear: 'MECHANICAL CORE', bridge: 'SMART STRUCTURES', atom: 'SCIENCE CORE'
};

export const Department3DScene: React.FC<{ department: Department; compact?: boolean }> = ({ department, compact = false }) => {
  const nodes = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className={`dept-3d-scene scene-${department.kind} ${compact ? 'scene-compact' : ''}`} style={{'--accent': department.accent} as React.CSSProperties}>
      <div className="scene-stars">{nodes.map(i => <i key={i} style={{'--i': i} as React.CSSProperties} />)}</div>
      <div className="scene-floor" />
      <div className="scene-halo" />
      <div className="scene-object">
        {department.kind === 'circuit' && <><div className="cube-core" />{nodes.map(i => <span className="circuit-node" key={i} style={{'--i': i} as React.CSSProperties} />)}</>}
        {department.kind === 'orbit' && <><div className="neural-core" />{[1,2,3].map(i => <div className="orbit-ring" key={i} style={{'--r': i} as React.CSSProperties}><b /></div>)}</>}
        {department.kind === 'globe' && <><div className="globe-core" /><div className="globe-grid g-a" /><div className="globe-grid g-b" /><div className="globe-grid g-c" />{nodes.map(i => <span className="net-node" key={i} style={{'--i': i} as React.CSSProperties} />)}</>}
        {department.kind === 'bars' && <>{[40,62,78,48,90,68].map((h,i)=><div className="data-bar" key={i} style={{'--h': `${h}%`, '--i': i} as React.CSSProperties}><b /></div>)}</>}
        {department.kind === 'wave' && <div className="waveform">{Array.from({length: 15},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div>}
        {department.kind === 'bolt' && <><div className="power-ring" /><div className="bolt-3d">ϟ</div>{nodes.slice(0,5).map(i=><span className="energy-node" key={i} style={{'--i':i} as React.CSSProperties}/>)}</>}
        {department.kind === 'gear' && <><div className="gear gear-one">⚙</div><div className="gear gear-two">⚙</div><div className="piston" /></>}
        {department.kind === 'blocks' && <><div className="building-block b1"/><div className="building-block b2"/><div className="building-block b3"/><div className="building-road"/></>}
        {department.kind === 'bridge' && <><div className="bridge-deck" />{[0,1,2,3].map(i=><span className="bridge-pillar" key={i} style={{'--i':i} as React.CSSProperties}/>)}<div className="bridge-arch" /></>}
        {department.kind === 'atom' && <><div className="atom-core" />{[0,1,2].map(i=><div className="atom-orbit" key={i} style={{'--i':i} as React.CSSProperties}><b /></div>)}</>}
      </div>
      <div className="scene-caption"><span>{department.code}</span><strong>{labels[department.kind] || 'KNOWLEDGE CORE'}</strong><small>INTERACTIVE 3D ENVIRONMENT</small></div>
    </div>
  );
};

import React from 'react';

interface DepartmentIconProps {
  kind: 'cube' | 'orbit' | 'globe' | 'bars' | 'wave' | 'bolt' | 'gear' | 'blocks' | 'atom';
  accent?: string;
  size?: 'normal' | 'portal';
}

export const DepartmentIcon: React.FC<DepartmentIconProps> = ({
  kind,
  accent = '#5aa9ff',
  size = 'normal'
}) => {
  const isPortal = size === 'portal';
  const sizeClass = isPortal ? 'portal-icon' : '';

  return (
    <div
      className={`icon3d k-${kind} ${sizeClass}`}
      style={{ '--accent': accent } as React.CSSProperties}
    >
      {kind === 'cube' && (
        <div className="inner">
          <div className="f f1" />
          <div className="f f2" />
          <div className="f f3" />
          <div className="f f4" />
          <div className="f f5" />
          <div className="f f6" />
        </div>
      )}

      {kind === 'orbit' && (
        <>
          <div className="core" />
          <div className="ring r1"><b /></div>
          <div className="ring r2"><b /></div>
          <div className="ring r3"><b /></div>
        </>
      )}

      {kind === 'globe' && (
        <>
          <div className="ring g1" />
          <div className="ring g2" />
          <div className="ring g3" />
        </>
      )}

      {kind === 'bars' && (
        <div className="inner">
          <div className="bar b1" />
          <div className="bar b2" />
          <div className="bar b3" />
          <div className="bar b4" />
        </div>
      )}

      {kind === 'wave' && (
        <div className="inner">
          <div className="bar w1" />
          <div className="bar w2" />
          <div className="bar w3" />
          <div className="bar w4" />
          <div className="bar w5" />
        </div>
      )}

      {kind === 'bolt' && (
        <div className="shape" />
      )}

      {kind === 'gear' && (
        <div className="cog" />
      )}

      {kind === 'blocks' && (
        <div className="inner">
          <div className="blk b1" />
          <div className="blk b2" />
          <div className="blk b3" />
        </div>
      )}

      {kind === 'atom' && (
        <>
          <div className="core" />
          <div className="ring a1" />
          <div className="ring a2" />
          <div className="ring a3" />
        </>
      )}
    </div>
  );
};

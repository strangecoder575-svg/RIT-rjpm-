import React, { useEffect, useRef, useState } from 'react';
interface Point { x: number; y: number; }
interface DeptHover { active: boolean; dept?: { code: string; name: string; accent: string } }
export const ArcReactorCursor: React.FC = () => {
  const [point, setPoint] = useState<Point>({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [hoverDept, setHoverDept] = useState<DeptHover>({ active: false });
  const [ripples, setRipples] = useState<Array<Point & { id: number }>>([]);
  const rippleId = useRef(0);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      setPoint({ x: event.clientX, y: event.clientY }); setVisible(true);
    };
    const down = (event: PointerEvent) => {
      setPoint({ x: event.clientX, y: event.clientY }); setActive(true);
      const id = ++rippleId.current;
      setRipples(items => [...items.slice(-5), { x: event.clientX, y: event.clientY, id }]);
      window.setTimeout(() => setRipples(items => items.filter(item => item.id !== id)), 850);
    };
    const hover = (event: Event) => setHoverDept((event as CustomEvent<DeptHover>).detail || { active: false });
    const up = () => setActive(false); const leave = () => setVisible(false); const enter = () => setVisible(true);
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerdown', down, { passive: true }); window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('rit:department-hover', hover); document.addEventListener('mouseleave', leave); document.addEventListener('mouseenter', enter);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); window.removeEventListener('rit:department-hover', hover); document.removeEventListener('mouseleave', leave); document.removeEventListener('mouseenter', enter); };
  }, []);
  const accent = hoverDept.dept?.accent || '#55e6a5';
  return <>
    <div className={`arc-cursor ${visible ? 'is-visible' : ''} ${active ? 'is-active' : ''} ${hoverDept.active ? 'is-department-active' : ''}`} style={{ left: point.x, top: point.y, '--cursor-accent': accent } as React.CSSProperties} aria-hidden="true">
      <span className="arc-cursor-ring" /><span className="arc-cursor-core" />
      <span className="arc-cursor-spoke s1" /><span className="arc-cursor-spoke s2" /><span className="arc-cursor-spoke s3" /><span className="arc-cursor-spoke s4" />
      {hoverDept.active && <span className="arc-dept-halo"><b>{hoverDept.dept?.code}</b><small>{hoverDept.dept?.name}</small></span>}
    </div>
    <div className="arc-cursor-trail" style={{ left: point.x, top: point.y, '--cursor-accent': accent } as React.CSSProperties} aria-hidden="true" />
    {ripples.map(ripple => <span key={ripple.id} className="touch-ripple" style={{ left: ripple.x, top: ripple.y }} aria-hidden="true" />)}
  </>;
};

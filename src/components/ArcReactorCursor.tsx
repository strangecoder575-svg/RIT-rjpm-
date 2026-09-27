import React, { useEffect, useRef, useState } from 'react';

interface Point { x: number; y: number; }

export const ArcReactorCursor: React.FC = () => {
  const [point, setPoint] = useState<Point>({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [ripples, setRipples] = useState<Array<Point & { id: number }>>([]);
  const lastMove = useRef(0);
  const rippleId = useRef(0);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const now = performance.now();
      setPoint({ x: event.clientX, y: event.clientY });
      setVisible(true);
      if (now - lastMove.current > 24) lastMove.current = now;
    };
    const down = (event: PointerEvent) => {
      setPoint({ x: event.clientX, y: event.clientY });
      setActive(true);
      const id = ++rippleId.current;
      setRipples((items) => [...items.slice(-5), { x: event.clientX, y: event.clientY, id }]);
      window.setTimeout(() => setRipples((items) => items.filter((item) => item.id !== id)), 850);
    };
    const up = () => setActive(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
    };
  }, []);

  return (
    <>
      <div
        className={`arc-cursor ${visible ? 'is-visible' : ''} ${active ? 'is-active' : ''}`}
        style={{ left: point.x, top: point.y }}
        aria-hidden="true"
      >
        <span className="arc-cursor-ring" />
        <span className="arc-cursor-core" />
        <span className="arc-cursor-spoke s1" /><span className="arc-cursor-spoke s2" />
        <span className="arc-cursor-spoke s3" /><span className="arc-cursor-spoke s4" />
      </div>
      <div className="arc-cursor-trail" style={{ left: point.x, top: point.y }} aria-hidden="true" />
      {ripples.map((ripple) => (
        <span key={ripple.id} className="touch-ripple" style={{ left: ripple.x, top: ripple.y }} aria-hidden="true" />
      ))}
    </>
  );
};

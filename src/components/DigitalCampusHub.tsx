import React, { useEffect, useMemo, useState } from 'react';
import { Building2, CalendarDays, ChevronRight, Flame, Gamepad2, Globe2, Lightbulb, Map, Moon, Radio, ShieldCheck, Sparkles, Sun, Trophy, Users, Zap } from 'lucide-react';
import { Department } from '../data/departments';

interface DigitalCampusHubProps {
  departments: Department[];
  studentName?: string;
  studentDeptId?: string;
  onSelectDepartment: (dept: Department) => void;
}

const activityLabels = [
  'entered the knowledge network',
  'activated a department portal',
  'completed a challenge',
  'discovered a campus node',
  'powered the RIT core',
];

export const DigitalCampusHub: React.FC<DigitalCampusHubProps> = ({ departments, studentName = 'Student', studentDeptId, onSelectDepartment }) => {
  const [nightMode, setNightMode] = useState(true);
  const [xp, setXp] = useState(() => Number(localStorage.getItem('rit_xp') || 420));
  const [challengeDone, setChallengeDone] = useState(() => localStorage.getItem('rit_daily_challenge') === new Date().toDateString());
  const [jarvisMessage, setJarvisMessage] = useState('Campus systems online. Choose a destination.');
  const [activityTick, setActivityTick] = useState(0);

  useEffect(() => {
    localStorage.setItem('rit_xp', String(xp));
  }, [xp]);

  useEffect(() => {
    const timer = window.setInterval(() => setActivityTick((v) => v + 1), 2600);
    return () => window.clearInterval(timer);
  }, []);

  const level = Math.floor(xp / 500) + 1;
  const progress = ((xp % 500) / 500) * 100;
  const featured = useMemo(() => departments.find(d => d.id === studentDeptId) || departments[0], [departments, studentDeptId]);
  const activity = `${['Arun', 'Priya', 'Kavin', 'Meena', 'Rithik'][activityTick % 5]} ${activityLabels[activityTick % activityLabels.length]}`;

  const award = (amount: number, message: string) => {
    setXp(v => v + amount);
    setJarvisMessage(`${message} +${amount} XP added to your reactor core.`);
  };

  const runDailyChallenge = () => {
    if (challengeDone) {
      setJarvisMessage('Daily challenge already completed. Return after the campus cycle resets.');
      return;
    }
    setChallengeDone(true);
    localStorage.setItem('rit_daily_challenge', new Date().toDateString());
    award(100, 'Daily challenge secured.');
  };

  const activateFeatured = () => {
    setJarvisMessage(`${featured.code} portal synchronized. Launching ${featured.name}.`);
    onSelectDepartment(featured);
  };

  return (
    <section id="campus" className={`digital-campus ${nightMode ? 'campus-night' : 'campus-day'}`}>
      <div className="campus-hub-orbit orbit-a" /><div className="campus-hub-orbit orbit-b" />
      <div className="campus-hub-header">
        <div>
          <span className="section-kicker"><Globe2 size={13} /> RIT DIGITAL CAMPUS</span>
          <h2>Command the <span>knowledge network.</span></h2>
          <p>Explore buildings, activate department portals, collect XP, complete daily missions and watch the campus network come alive.</p>
        </div>
        <button className="campus-mode-button" onClick={() => setNightMode(v => !v)}>
          {nightMode ? <Sun size={16} /> : <Moon size={16} />}
          {nightMode ? 'Day campus' : 'Night campus'}
        </button>
      </div>

      <div className="campus-command-grid">
        <div className="jarvis-console glass-card">
          <div className="console-top"><span className="status-dot" /> JARVIS // CAMPUS CORE <span>ONLINE</span></div>
          <div className="jarvis-orb"><span /><b /><i /></div>
          <p className="jarvis-copy">{jarvisMessage}</p>
          <div className="jarvis-actions">
            <button onClick={activateFeatured}><Zap size={15} /> Open my department</button>
            <button onClick={runDailyChallenge}><Gamepad2 size={15} /> Daily challenge</button>
          </div>
          <div className="network-readout"><Radio size={13} /> LIVE NETWORK <strong>127</strong> students online</div>
        </div>

        <div className="profile-core glass-card">
          <div className="profile-head"><div className="profile-avatar">{studentName.slice(0,1).toUpperCase()}</div><div><small>STUDENT IDENTITY</small><strong>{studentName}</strong><span>{featured?.code || 'RIT'} // CAMPUS MEMBER</span></div></div>
          <div className="xp-row"><span><Flame size={15} /> FIRE XP</span><b>{xp.toLocaleString()}</b><em>LVL {level}</em></div>
          <div className="xp-track"><i style={{ width: `${progress}%` }} /></div>
          <div className="mini-stats"><span><Trophy size={14}/> 3 badges</span><span><Sparkles size={14}/> 12 nodes</span><span><ShieldCheck size={14}/> verified</span></div>
        </div>

        <div className="daily-core glass-card">
          <div className="daily-icon"><CalendarDays size={22}/></div>
          <small>DAILY MISSION</small>
          <strong>RIT Core Surge</strong>
          <p>Complete today's quick challenge and power the campus reactor.</p>
          <button disabled={challengeDone} onClick={runDailyChallenge}>{challengeDone ? 'MISSION COMPLETE ✓' : 'CLAIM +100 XP'} <ChevronRight size={15}/></button>
        </div>
      </div>

      <div className="campus-map-panel glass-card">
        <div className="map-title"><div><span className="section-kicker"><Map size={13}/> INTERACTIVE CAMPUS MAP</span><h3>Walk the digital campus</h3></div><span className="live-pill"><span/> NETWORK LIVE</span></div>
        <div className="campus-map">
          <div className="map-road road-1"/><div className="map-road road-2"/><div className="map-road road-3"/>
          <div className="map-core"><div className="map-reactor"><i/><b/></div><strong>RIT CORE</strong><small>KNOWLEDGE HUB</small></div>
          {departments.map((d, i) => (
            <button key={d.id} className="map-building" style={{ '--accent': d.accent, '--x': `${12 + (i % 3) * 35}%`, '--y': `${14 + Math.floor(i / 3) * 28}%`, '--delay': `${i * -.18}s` } as React.CSSProperties} onMouseEnter={() => setJarvisMessage(`${d.code} building detected. Hover link synchronized.`)} onFocus={() => setJarvisMessage(`${d.code} building detected.`)} onClick={() => { award(15, `${d.code} building discovered.`); onSelectDepartment(d); }}>
              <Building2 size={17}/><span>{d.code}</span><small>{d.name.split(' ')[0]}</small><i className="building-pulse"/>
            </button>
          ))}
          <div className="map-scanline"/>
        </div>
      </div>

      <div className="campus-bottom-grid">
        <div className="activity-feed glass-card"><div className="feed-title"><Users size={15}/> LIVE CAMPUS FEED <span className="live-dot"/></div><div className="feed-event"><div className="feed-avatar">R</div><p><strong>{activity.split(' ')[0]}</strong> {activity.split(' ').slice(1).join(' ')}<small>just now // local simulation</small></p></div><div className="feed-event"><div className="feed-avatar alt">AI</div><p><strong>AI&amp;DS</strong> neural core is warming up<small>32 seconds ago</small></p></div><div className="feed-event"><div className="feed-avatar gold">⚡</div><p><strong>RIT CORE</strong> energy routed to quiz arena<small>1 minute ago</small></p></div></div>
        <div className="feature-card glass-card"><div className="feature-visual"><Lightbulb size={26}/><span>INNOVATION ZONE</span></div><div><small>EXPLORE NEXT</small><h3>Department Wars</h3><p>Every quiz can feed your department's future campus score.</p><button onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })}>View leaderboard <ChevronRight size={15}/></button></div></div>
      </div>
    </section>
  );
};

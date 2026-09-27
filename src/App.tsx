/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { DEPTS, Department } from './data/departments';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RIT3DWorld } from './components/RIT3DWorld';
import { AboutSection } from './components/AboutSection';
import { DepartmentsGrid } from './components/DepartmentsGrid';
import { QuizArena } from './components/QuizArena';
import { CampusHighlights } from './components/CampusHighlights';
import { Footer } from './components/Footer';
import { PortalTransition } from './components/PortalTransition';
import { LoginPage } from './components/LoginPage';
import { StudentUser } from './types/user';
import { getStoredUser, clearStoredUser } from './utils/userStorage';
import { playWarpSound, playClickSound } from './utils/sound';
import { ArcReactorCursor } from './components/ArcReactorCursor';
import { DigitalCampusHub } from './components/DigitalCampusHub';
import { JarvisAssistant } from './components/JarvisAssistant';
import { AdminPortal } from './components/AdminPortal';
import { getMyProfile, signOutCloud } from './utils/cloud';
import { supabase } from './utils/supabaseClient';

export default function App() {
  const [studentUser, setStudentUser] = useState<StudentUser | null>(() => getStoredUser());
  const [adminSession, setAdminSession] = useState<any>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let active = true;
    const boot = async () => {
      try {
        const profile = await getMyProfile();
        if (!active) return;
        if (profile?.role === 'admin' || profile?.role === 'super-admin') { setAdminSession(profile); setStudentUser(null); }
        else if (profile) setStudentUser(profile);
        else { clearStoredUser(); setStudentUser(null); }
      } catch (err) {
        console.warn('Cloud session boot failed:', err);
      } finally { if (active) setBooting(false); }
    };
    boot();
    const listener = supabase?.auth.onAuthStateChange(() => { boot(); });
    return () => { active = false; listener?.data.subscription.unsubscribe(); };
  }, []);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('cse');
  const [portalDept, setPortalDept] = useState<Department | null>(null);
  const [showPortal, setShowPortal] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [jarvisOpen, setJarvisOpen] = useState(false);

  if (booting) return <div className="min-h-screen bg-[#080a0f] text-[#55e6a5] flex items-center justify-center font-mono">JARVIS // CONNECTING TO RIT CLOUD...</div>;

  if (adminSession) {
    return (
      <>
        <ArcReactorCursor />
        <AdminPortal admin={adminSession} onLogout={async () => { await signOutCloud(); setAdminSession(null); setStudentUser(null); window.history.replaceState({}, '', '/'); }} />
      </>
    );
  }

  // The /admin route uses the same shared login screen, but opens it in Admin mode.
  if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
    return (
      <>
        <ArcReactorCursor />
        <LoginPage
          onLoginSuccess={(user) => { setStudentUser(user); window.history.replaceState({}, '', '/'); }}
          onAdminLoginSuccess={async () => { const profile = await getMyProfile(); setAdminSession(profile); }}
          initialMode="admin"
        />
      </>
    );
  }

  // If student is not logged in, show the Login Page before web opens
  if (!studentUser) {
    return (
      <>
        <ArcReactorCursor />
        <LoginPage
          onLoginSuccess={(user) => {
            setStudentUser(user);
            if (user.deptId) setSelectedDeptId(user.deptId);
          }}
          onAdminLoginSuccess={async () => { const profile = await getMyProfile(); setAdminSession(profile); }}
          initialMode={window.location.pathname === '/admin' ? 'admin' : 'student'}
        />
      </>
    );
  }

  const handleSelectDepartment = (dept: Department) => {
    setPortalDept(dept);
    setShowPortal(true);
    playWarpSound();

    setTimeout(() => {
      setSelectedDeptId(dept.id);
      setIsQuizOpen(true);

      setTimeout(() => {
        const quizSection = document.getElementById('quizzes');
        if (quizSection) {
          quizSection.scrollIntoView({ behavior: 'smooth' });
        }
        setShowPortal(false);
      }, 100);
    }, 850);
  };

  const handleStartQuizFromNavOrHero = () => {
    playClickSound();
    if (isQuizOpen) {
      const el = document.getElementById('quizzes');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Direct user to choose their preferred academic department first
      const el = document.getElementById('departments');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCloseQuiz = () => {
    setIsQuizOpen(false);
    const el = document.getElementById('departments');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    playClickSound();
    clearStoredUser();
    void signOutCloud();
    setStudentUser(null);
    setIsQuizOpen(false);
  };

  const scrollToDepartments = () => {
    const el = document.getElementById('departments');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <ArcReactorCursor />
      <div className="rit-app-shell min-h-screen bg-[#080a0f] text-[#f3f5f7] flex flex-col font-sans selection:bg-[#55e6a5]/20 selection:text-[#55e6a5]">
      {/* Warp Portal Transition Overlay */}
      <PortalTransition show={showPortal} department={portalDept} />

      {/* Main Navigation Header with Student Profile */}
      <Header 
        onStartQuizClick={handleStartQuizFromNavOrHero} 
        isQuizOpen={isQuizOpen}
        currentStudent={studentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Sections */}
      <main id="top" className="flex-1">
        <RIT3DWorld onJarvisClick={() => setJarvisOpen(true)} />
        <Hero 
          onExploreClick={scrollToDepartments} 
          onTakeQuizClick={handleStartQuizFromNavOrHero} 
        />
        
        <AboutSection />

        <DigitalCampusHub
          departments={DEPTS}
          studentName={studentUser.name}
          studentDeptId={studentUser.deptId}
          studentRollNo={studentUser.rollNo}
          onSelectDepartment={handleSelectDepartment}
        />
        
        <DepartmentsGrid 
          departments={DEPTS} 
          onSelectDepartment={handleSelectDepartment} 
        />
        
        {/* Quiz Arena only mounted and displayed when user clicks a department */}
        {isQuizOpen && (
          <QuizArena 
            departments={DEPTS} 
            selectedDeptId={selectedDeptId}
            onSelectDeptId={(id) => setSelectedDeptId(id)}
            onCloseQuiz={handleCloseQuiz}
            currentStudent={studentUser}
          />
        )}
        
        <CampusHighlights />
      </main>

      {/* Campus Footer */}
      <Footer />
      <JarvisAssistant open={jarvisOpen} onClose={() => setJarvisOpen(false)} onSelectDepartment={(id) => { setJarvisOpen(false); const dept = DEPTS.find((d) => d.id === id); if (dept) handleSelectDepartment(dept); }} />
      </div>
    </>
  );
}

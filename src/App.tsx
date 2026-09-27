/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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

export default function App() {
  const [studentUser, setStudentUser] = useState<StudentUser | null>(() => getStoredUser());
  const [selectedDeptId, setSelectedDeptId] = useState<string>('cse');
  const [portalDept, setPortalDept] = useState<Department | null>(null);
  const [showPortal, setShowPortal] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // If student is not logged in, show the Login Page before web opens
  if (!studentUser) {
    return (
      <LoginPage 
        onLoginSuccess={(user) => {
          setStudentUser(user);
          if (user.deptId) {
            setSelectedDeptId(user.deptId);
          }
        }} 
      />
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
    setStudentUser(null);
    setIsQuizOpen(false);
  };

  const scrollToDepartments = () => {
    const el = document.getElementById('departments');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#f3f5f7] flex flex-col font-sans selection:bg-[#55e6a5]/20 selection:text-[#55e6a5]">
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
        <RIT3DWorld />
        <Hero 
          onExploreClick={scrollToDepartments} 
          onTakeQuizClick={handleStartQuizFromNavOrHero} 
        />
        
        <AboutSection />
        
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
    </div>
  );
}

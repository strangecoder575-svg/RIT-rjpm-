import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Menu, X, ExternalLink, Award, Sparkles, User, LogOut } from 'lucide-react';
import { toggleSound, isSoundEnabled, playClickSound } from '../utils/sound';
import { StudentUser } from '../types/user';
import { getMyXp } from '../utils/cloud';

interface HeaderProps {
  onStartQuizClick: () => void;
  isQuizOpen?: boolean;
  currentStudent?: StudentUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onStartQuizClick, 
  isQuizOpen,
  currentStudent,
  onLogout
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const sync = () => { if (currentStudent) void getMyXp().then(setXp).catch(() => setXp(0)); };
    sync();
    window.addEventListener('rit:xp-change', sync);
    return () => window.removeEventListener('rit:xp-change', sync);
  }, [currentStudent?.rollNo, currentStudent?.name]);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playClickSound();
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    playClickSound();
  };

  const handleQuizArenaNav = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNavClick();
    onStartQuizClick();
  };

  return (
    <header className="h-[76px] px-4 sm:px-6 lg:px-12 flex items-center justify-between border-b border-[#20242c] bg-[#080a0f]/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4">
        <a 
          href="#top" 
          onClick={handleNavClick}
          className="font-heading font-bold text-2xl tracking-tight text-white flex items-center group"
        >
          RIT<span className="text-[#55e6a5] transition-transform duration-300 group-hover:scale-125">.</span>
        </a>
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#20242c] text-xs text-[#aeb5c0]">
          <span className="inline-flex items-center gap-1 bg-[#121720] border border-[#292f38] px-2 py-0.5 rounded-full font-medium text-emerald-400">
            <Award className="w-3 h-3" /> NAAC A+
          </span>
          <span className="hidden xl:inline font-normal">Autonomous | Affiliated to Anna University</span>
        </div>
      </div>

      <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#aeb5c0]">
        <a href="#top" className="hover:text-white transition-colors">Home</a>
        <a href="#about" className="hover:text-white transition-colors">About</a>
        <a href="#departments" className="hover:text-white transition-colors">Departments</a>
        <button 
          onClick={handleQuizArenaNav} 
          className="hover:text-white transition-colors flex items-center gap-1.5 text-emerald-400/90 hover:text-emerald-300 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" /> 
          <span>{isQuizOpen ? 'Active Quiz' : 'Quiz Arena'}</span>
        </button>
        <a href="#campus" className="hover:text-white transition-colors">Campus</a>
        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Fire XP pill */}
        {currentStudent && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#121720] border border-[#55e6a5]/25 text-[10px] font-bold font-mono text-[#55e6a5]">
            <span>🔥</span><span>{xp.toLocaleString()} XP</span>
          </div>
        )}

        {/* Student user pill */}
        {currentStudent && (
          <div className="flex items-center gap-2 pl-2 sm:pl-3 pr-2 py-1 bg-[#121720] border border-[#292f38] rounded-full text-xs">
            <div className="w-6 h-6 rounded-full bg-[#55e6a5]/20 border border-[#55e6a5]/50 flex items-center justify-center text-[#55e6a5] font-bold text-xs">
              {currentStudent.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-semibold text-white max-w-[110px] truncate leading-tight">
                {currentStudent.name}
              </span>
              <span className="text-[10px] text-[#55e6a5] font-mono leading-tight">
                {currentStudent.deptCode}
              </span>
            </div>
            {onLogout && (
              <button
                onClick={() => {
                  playClickSound();
                  onLogout();
                }}
                title="Switch student / Logout"
                className="p-1 hover:bg-[#1a2230] rounded-full text-[#aeb5c0] hover:text-red-400 transition-colors cursor-pointer ml-0.5"
                aria-label="Switch User"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Sound toggle */}
        <button
          onClick={handleToggleSound}
          title={soundOn ? "Mute audio effects" : "Enable audio effects"}
          className="p-2 rounded-lg border border-[#292f38] bg-[#121720] text-[#aeb5c0] hover:text-white hover:border-[#55e6a5]/50 transition-all"
          aria-label="Toggle Sound"
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-[#55e6a5]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
        </button>

        <button
          onClick={() => {
            playClickSound();
            onStartQuizClick();
          }}
          className="hidden sm:inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#55e6a5] text-[#06110d] font-bold text-xs tracking-wide uppercase hover:bg-[#6ef3b7] transition-all shadow-[0_0_20px_rgba(85,230,165,0.25)] hover:shadow-[0_0_25px_rgba(85,230,165,0.4)] cursor-pointer"
        >
          Challenge Quiz
        </button>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg border border-[#292f38] bg-[#121720] text-[#aeb5c0] hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[76px] left-0 right-0 bg-[#0d1117]/95 border-b border-[#20242c] p-6 backdrop-blur-xl flex flex-col gap-4 shadow-2xl z-50 animate-fadeIn">
          <a
            href="#top"
            onClick={handleNavClick}
            className="text-base font-medium text-[#f3f5f7] py-2 border-b border-[#20242c]/50"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={handleNavClick}
            className="text-base font-medium text-[#aeb5c0] hover:text-white py-2 border-b border-[#20242c]/50"
          >
            About RIT
          </a>
          <a
            href="#departments"
            onClick={handleNavClick}
            className="text-base font-medium text-[#aeb5c0] hover:text-white py-2 border-b border-[#20242c]/50"
          >
            Departments & Motifs
          </a>
          <button
            onClick={() => {
              handleNavClick();
              onStartQuizClick();
            }}
            className="text-base font-semibold text-[#55e6a5] py-2 border-b border-[#20242c]/50 flex items-center justify-between text-left w-full cursor-pointer"
          >
            <span>{isQuizOpen ? 'Resume Active Quiz' : 'RIT Quiz Challenge'}</span>
            <span className="text-xs bg-[#1c4635] px-2 py-0.5 rounded text-[#55e6a5]">9 Domains</span>
          </button>
          <a
            href="#campus"
            onClick={handleNavClick}
            className="text-base font-medium text-[#aeb5c0] hover:text-white py-2 border-b border-[#20242c]/50"
          >
            Campus & Infrastructure
          </a>
          <a
            href="#contact"
            onClick={handleNavClick}
            className="text-base font-medium text-[#aeb5c0] hover:text-white py-2"
          >
            Contact & Directions
          </a>
          <a
            href="https://www.ritrjpm.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#292f38] bg-[#121720] text-xs font-semibold text-[#aeb5c0] hover:text-white"
          >
            Official Website <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </header>
  );
};

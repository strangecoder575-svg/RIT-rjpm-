import React, { useState, useRef } from 'react';
import { ArrowRight, Sparkles, BookOpen, Users, Trophy, Award } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface HeroProps {
  onExploreClick: () => void;
  onTakeQuizClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onTakeQuizClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const py = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    setTilt({
      x: py * -18,
      y: px * 18,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section 
      className="relative min-h-[calc(100vh-76px)] px-6 lg:px-16 py-12 lg:py-20 flex flex-col justify-center overflow-hidden perspective-1400 border-b border-[#20242c]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background ambient radial gradients */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full -right-[150px] -top-[120px] pointer-events-none opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(22,77,60,0.8) 0%, rgba(12,34,28,0.4) 40%, transparent 70%)'
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full -left-[100px] bottom-[20px] pointer-events-none opacity-30 blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(90,169,255,0.4) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-8 flex flex-col">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121720] border border-[#292f38] text-xs font-semibold tracking-wider text-[#55e6a5] w-fit mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RAMCO INSTITUTE OF TECHNOLOGY</span>
            <span className="text-[#aeb5c0]/60">|</span>
            <span className="text-gray-400 font-normal">ESTD. 2013</span>
          </div>

          <h1 className="font-heading font-bold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.04] text-white">
            Build your <span className="text-[#55e6a5] underline decoration-[#55e6a5]/30 decoration-wavy">future</span>
            <br />
            with technology.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#aeb5c0] max-w-2xl leading-relaxed font-normal">
            A state-of-the-art engineering institution delivering experiential learning, cutting-edge research, and industry-ready skills across 9 specialized academic disciplines in Rajapalayam, Tamil Nadu.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => {
                playClickSound();
                onExploreClick();
              }}
              className="px-6 py-3.5 rounded-xl bg-[#55e6a5] text-[#06110d] font-bold text-sm sm:text-base hover:bg-[#6ef3b7] transition-all transform hover:-translate-y-0.5 shadow-[0_0_25px_rgba(85,230,165,0.3)] cursor-pointer flex items-center gap-2"
            >
              <span>Explore All Departments</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playClickSound();
                onTakeQuizClick();
              }}
              className="px-6 py-3.5 rounded-xl border border-[#303640] bg-[#121720]/80 text-[#f3f5f7] font-semibold text-sm sm:text-base hover:border-[#55e6a5]/50 hover:bg-[#161c27] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Take a Quiz Arena</span>
              <span className="text-[#55e6a5]">→</span>
            </button>
          </div>

          {/* Key Quick Badges */}
          <div className="mt-12 pt-8 border-t border-[#20242c] grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-bold text-white">9</div>
              <div className="text-xs text-[#aeb5c0] mt-0.5 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-emerald-400" /> Academic Programs
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-bold text-[#55e6a5]">100%</div>
              <div className="text-xs text-[#aeb5c0] mt-0.5 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-emerald-400" /> Placement Support
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-bold text-white">270+</div>
              <div className="text-xs text-[#aeb5c0] mt-0.5 flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-400" /> Technical Quiz Pool
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-bold text-[#4dd8e6]">17+</div>
              <div className="text-xs text-[#aeb5c0] mt-0.5 flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" /> Industry Labs & MOUs
              </div>
            </div>
          </div>
        </div>

        {/* 3D Tilt Card */}
        <div className="hidden lg:flex lg:col-span-4 justify-center">
          <div
            ref={cardRef}
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.4s ease-out' : 'transform 0.1s ease-out',
            }}
            className="w-[300px] h-[400px] rounded-3xl border border-[#292f38] p-8 flex flex-col justify-between bg-gradient-to-br from-[#161c28] via-[#0f131a] to-[#0a0d13] relative overflow-hidden preserve-3d shadow-2xl group hover:border-[#55e6a5]/50 transition-colors"
          >
            {/* Inner 3D depth elements */}
            <div className="relative z-10 preserve-3d">
              <span className="text-xs font-bold tracking-widest text-[#8b95a3] uppercase block">
                STUDENT HUB
              </span>
              <div 
                className="mt-6 flex flex-col gap-1 preserve-3d"
                style={{ transform: 'translateZ(35px)' }}
              >
                <span className="font-heading font-extrabold text-4xl text-white tracking-tight">Learn.</span>
                <span className="font-heading font-extrabold text-4xl text-[#55e6a5] tracking-tight">Build.</span>
                <span className="font-heading font-extrabold text-4xl text-white tracking-tight">Innovate.</span>
              </div>
            </div>

            <div 
              className="relative z-10 preserve-3d text-xs text-[#aeb5c0] leading-relaxed pt-4 border-t border-[#20242c]"
              style={{ transform: 'translateZ(20px)' }}
            >
              Explore department-specific curricula, research domains & test your mastery with the interactive Quiz Engine.
            </div>

            {/* Glowing 3D Orb */}
            <div
              className="absolute -right-16 -bottom-16 w-52 h-52 rounded-full pointer-events-none transition-transform duration-500 group-hover:scale-110"
              style={{
                background: 'radial-gradient(circle, #55e6a5 0%, #183d31 55%, transparent 70%)',
                opacity: 0.85
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

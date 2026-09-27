import React, { useState } from 'react';
import { DEPTS } from '../data/departments';
import { StudentUser } from '../types/user';
import { saveStoredUser } from '../utils/userStorage';
import { 
  User, 
  Hash, 
  GraduationCap, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { playClickSound, playWarpSound } from '../utils/sound';
import { RIT3DWorld } from './RIT3DWorld';

interface LoginPageProps {
  onLoginSuccess: (user: StudentUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [deptId, setDeptId] = useState('cse');
  const [year, setYear] = useState('3rd Year');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name to proceed.');
      return;
    }

    const selectedDept = DEPTS.find(d => d.id === deptId) || DEPTS[0];
    const studentUser: StudentUser = {
      name: name.trim(),
      rollNo: rollNo.trim() || `RIT-${Math.floor(100000 + Math.random() * 900000)}`,
      deptId: selectedDept.id,
      deptCode: selectedDept.code,
      year,
      loginTime: new Date().toISOString()
    };

    saveStoredUser(studentUser);
    playWarpSound();
    onLoginSuccess(studentUser);
  };

  const handleQuickDemo = (demoName: string, dept: string) => {
    playClickSound();
    const selectedDept = DEPTS.find(d => d.id === dept) || DEPTS[0];
    const studentUser: StudentUser = {
      name: demoName,
      rollNo: `953621${Math.floor(100000 + Math.random() * 900000)}`,
      deptId: selectedDept.id,
      deptCode: selectedDept.code,
      year: '3rd Year',
      loginTime: new Date().toISOString()
    };

    saveStoredUser(studentUser);
    playWarpSound();
    onLoginSuccess(studentUser);
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#f3f5f7] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full -right-[150px] -top-[150px] pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(85,230,165,0.4) 0%, rgba(22,77,60,0.2) 50%, transparent 70%)' }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full -left-[150px] -bottom-[150px] pointer-events-none opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(90,169,255,0.4) 0%, transparent 70%)' }}
      />

      <div className="absolute inset-0 opacity-45 pointer-events-none"><RIT3DWorld compact /></div>

      <div className="w-full max-w-md relative z-10">
        {/* College Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121720] border border-[#292f38] text-[11px] font-semibold tracking-wider text-[#55e6a5] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NAAC A+ ACCREDITED • AUTONOMOUS</span>
          </div>

          <div className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white flex items-center justify-center gap-1">
            RIT<span className="text-[#55e6a5]">.</span>
          </div>

          <h2 className="text-xs font-bold tracking-widest text-[#aeb5c0] uppercase mt-1">
            RAMCO INSTITUTE OF TECHNOLOGY
          </h2>
          <p className="text-xs text-[#707987] mt-0.5">
            North Venganallur, Rajapalayam, Tamil Nadu
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0d1117]/85 border border-[#55e6a5]/25 rounded-3xl p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,.75)] relative backdrop-blur-xl perspective-1000 preserve-3d">
          <div className="absolute -top-2 left-8 right-8 h-1 bg-[#55e6a5] shadow-[0_0_25px_#55e6a5] animate-pulse" />
          <div className="mb-6">
            <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#55e6a5]" />
              <span>Student Portal Login</span>
            </h3>
            <p className="text-xs text-[#aeb5c0] mt-1">
              Enter your student details to enter the portal. Your name will be recorded on the RIT Global Leaderboard!
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#aeb5c0] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#55e6a5]" />
                <span>Your Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Karthikeyan R."
                className="w-full px-4 py-2.5 bg-[#121720] border border-[#292f38] rounded-xl text-sm text-white placeholder-[#707987] focus:outline-none focus:border-[#55e6a5] transition-colors"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-[#aeb5c0] mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#4dd8e6]" />
                <span>Roll No / Register No (Optional)</span>
              </label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 953621104050"
                className="w-full px-4 py-2.5 bg-[#121720] border border-[#292f38] rounded-xl text-sm text-white placeholder-[#707987] focus:outline-none focus:border-[#55e6a5] transition-colors"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-[#aeb5c0] mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#f2b544]" />
                <span>Academic Department</span>
              </label>
              <select
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#121720] border border-[#292f38] rounded-xl text-sm text-white focus:outline-none focus:border-[#55e6a5] transition-colors cursor-pointer"
              >
                {DEPTS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#0d1117] text-white">
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-semibold text-[#aeb5c0] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#b98bff]" />
                <span>Year of Study</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#121720] border border-[#292f38] rounded-xl text-sm text-white focus:outline-none focus:border-[#55e6a5] transition-colors cursor-pointer"
              >
                <option value="1st Year">1st Year (Fresher)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior / Final)</option>
                <option value="Faculty / Guest">Faculty / Researcher / Guest</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#55e6a5] text-[#06110d] font-heading font-bold text-sm tracking-wide uppercase hover:bg-[#6ef3b7] transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-[0_0_25px_rgba(85,230,165,0.3)] flex items-center justify-center gap-2"
            >
              <span>Enter RIT Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Students */}
          <div className="mt-6 pt-5 border-t border-[#20242c]">
            <span className="block text-[11px] font-semibold text-[#707987] uppercase tracking-wider mb-2.5 text-center">
              Or quick launch as demo student
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Rithika Mohan', 'cse')}
                className="px-3 py-2 rounded-xl bg-[#121720] border border-[#292f38] hover:border-[#55e6a5]/50 text-xs text-[#aeb5c0] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-[#55e6a5]" />
                <span>Rithika (CSE)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('Abhishek Kumar', 'aids')}
                className="px-3 py-2 rounded-xl bg-[#121720] border border-[#292f38] hover:border-[#b98bff]/50 text-xs text-[#aeb5c0] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-[#b98bff]" />
                <span>Abhishek (AI&DS)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-[#707987]">
          © {new Date().getFullYear()} Ramco Institute of Technology. All rights reserved.
        </div>
      </div>
    </div>
  );
};

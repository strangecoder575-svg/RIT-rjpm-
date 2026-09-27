import React from 'react';
import { ShieldCheck, Cpu, Library, Compass, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-6 lg:px-16 border-b border-[#20242c] bg-[#090c12]/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <span className="text-xs font-bold tracking-widest text-[#55e6a5] uppercase">
              ABOUT RIT
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white mt-3 leading-tight">
              Engineering education with a future-facing mindset.
            </h2>
            <p className="mt-6 text-[#aeb5c0] text-base sm:text-lg leading-relaxed font-normal">
              Ramco Institute of Technology, established under the visionary guidance of the Raja Charity Trust, is an autonomous engineering institution situated at North Venganallur, Rajapalayam, Tamil Nadu.
            </p>
            <p className="mt-4 text-[#aeb5c0] text-base leading-relaxed">
              Equipped with world-class faculty, industry-sponsored incubation centers, advanced robotics and IoT facilities, RIT bridges the gap between academic theory and real-world industrial innovation. Each department carries its own distinctive 3D motif below — click any department card to enter its domain quiz!
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0d1117] border border-[#20242c]">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">NAAC 'A+' Accredited</h4>
                  <p className="text-xs text-[#aeb5c0] mt-1">Recognized for premier academic standards, governance & outcomes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0d1117] border border-[#20242c]">
                <Cpu className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Industry 4.0 Labs</h4>
                  <p className="text-xs text-[#aeb5c0] mt-1">Hands-on exposure to cloud infra, embedded systems and AI clusters.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0d1117] border border-[#20242c]">
                <Library className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Ramasamy Raja Central Library</h4>
                  <p className="text-xs text-[#aeb5c0] mt-1">Over 25,000+ volumes, IEEE digital access & research subscriptions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0d1117] border border-[#20242c]">
                <Compass className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Centers of Excellence</h4>
                  <p className="text-xs text-[#aeb5c0] mt-1">Partnerships with Tessolve, Harita Techserv, AWS & Lincoln Electric.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#121720] to-[#0c0f15] border border-[#292f38] relative overflow-hidden">
              <h3 className="font-heading font-bold text-xl text-white mb-4">Core Educational Pillars</h3>
              <div className="space-y-4">
                {[
                  "Outcome-based engineering curriculum tailored for modern industrial demands",
                  "Active entrepreneurship and incubation support through MSME approved Business Incubator",
                  "Dedicated training in Full-Stack, Machine Learning, Embedded Systems, and Structural Modeling",
                  "Global certification vouchers and competitive coding bootcamps for student placements",
                  "Green, eco-friendly 100-acre residential campus at the foothills of Western Ghats"
                ].map((pillar, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#55e6a5] shrink-0" />
                    <span className="text-sm text-[#f3f5f7]/90">{pillar}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#20242c] flex items-center justify-between text-xs text-[#aeb5c0]">
                <span>Affiliation: Anna University, Chennai</span>
                <span className="text-[#55e6a5] font-semibold">Autonomous Status</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

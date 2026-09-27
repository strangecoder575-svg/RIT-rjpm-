import React from 'react';
import { 
  Building2, 
  MapPin, 
  Wifi, 
  BookOpen, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Bus 
} from 'lucide-react';

export const CampusHighlights: React.FC = () => {
  return (
    <section id="campus" className="py-20 px-6 lg:px-16 border-b border-[#20242c] bg-[#080a0f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#55e6a5] uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> LIFE AT RAMCO INSTITUTE
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white mt-2">
            Campus Infrastructure & Facilities
          </h2>
          <p className="mt-3 text-[#aeb5c0] text-sm sm:text-base">
            Nestled in a serene green landscape in Rajapalayam, RIT provides holistic infrastructure engineered for innovation, physical fitness, and student excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-[#0d1117] border border-[#20242c] hover:border-[#55e6a5]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#121720] border border-[#292f38] flex items-center justify-center text-[#55e6a5] mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">High-Performance Computing</h3>
            <p className="text-xs sm:text-sm text-[#aeb5c0] leading-relaxed">
              Equipped with modern Dell & HP workstations, high-speed Gigabit LAN, NVIDIA GPUs for deep learning, and licensed industry software packages.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#55e6a5]" /> 1 Gbps Leased Internet Line</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#55e6a5]" /> High Performance Computing Lab</li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl bg-[#0d1117] border border-[#20242c] hover:border-[#55e6a5]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#121720] border border-[#292f38] flex items-center justify-center text-[#4dd8e6] mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">TBI & Innovation Cell</h3>
            <p className="text-xs sm:text-sm text-[#aeb5c0] leading-relaxed">
              Technology Business Incubator supported by MSME, helping student entrepreneurs turn prototype ideas into commercial enterprise patents and startups.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#4dd8e6]" /> Seed Funding & Mentorship</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#4dd8e6]" /> Intellectual Property Facilitation</li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl bg-[#0d1117] border border-[#20242c] hover:border-[#55e6a5]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#121720] border border-[#292f38] flex items-center justify-center text-[#f2b544] mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">Central Library & Digital Hub</h3>
            <p className="text-xs sm:text-sm text-[#aeb5c0] leading-relaxed">
              Air-conditioned modern library housing indexed journals, IEEE Xplore, DELNET, NPTEL video lectures, and silent reading zones.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#f2b544]" /> 25,000+ Print Volumes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#f2b544]" /> Digital E-Resource Access 24/7</li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl bg-[#0d1117] border border-[#20242c] hover:border-[#55e6a5]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#121720] border border-[#292f38] flex items-center justify-center text-[#ff8a4c] mb-5">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">Residential Hostels & Dining</h3>
            <p className="text-xs sm:text-sm text-[#aeb5c0] leading-relaxed">
              Separate secure hostels for men and women with hygienic multi-cuisine dining, solar water heating, Wi-Fi connectivity and indoor recreation.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff8a4c]" /> 24/7 RO Purified Drinking Water</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff8a4c]" /> Gymnasium & Sports Complex</li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl bg-[#0d1117] border border-[#20242c] hover:border-[#55e6a5]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#121720] border border-[#292f38] flex items-center justify-center text-[#34c9b0] mb-5">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">Transport & Connectivity</h3>
            <p className="text-xs sm:text-sm text-[#aeb5c0] leading-relaxed">
              Comprehensive fleet of college buses operating from Madurai, Srivilliputtur, Sivakasi, Virudhunagar, Kovilpatti, and Rajapalayam town.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#34c9b0]" /> GPS Tracked Fleet</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#34c9b0]" /> Daily Commute Across 8 Routes</li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl bg-[#0d1117] border border-[#20242c] hover:border-[#55e6a5]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#121720] border border-[#292f38] flex items-center justify-center text-[#ff6fa5] mb-5">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">Eco-Friendly Green Campus</h3>
            <p className="text-xs sm:text-sm text-[#aeb5c0] leading-relaxed">
              Rainwater harvesting reservoirs, 100 kW rooftop solar energy generation, sewage treatment plant, and clean pedestrianized green pathways.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff6fa5]" /> Zero Liquid Discharge</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff6fa5]" /> Solar Powered Pathways</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

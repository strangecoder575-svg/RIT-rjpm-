import React, { useState } from 'react';
import { Department } from '../data/departments';
import { DepartmentIcon } from './DepartmentIcon';
import { Department3DScene } from './Department3DScene';
import { getCursorForDepartment } from '../utils/cursor';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface DepartmentsGridProps {
  departments: Department[];
  onSelectDepartment: (dept: Department) => void;
}

export const DepartmentsGrid: React.FC<DepartmentsGridProps> = ({
  departments,
  onSelectDepartment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'computing' | 'core' | 'science'>('all');

  const filteredDepts = departments.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterCategory === 'all') return true;
    if (filterCategory === 'computing') return ['cse', 'aids', 'it', 'csbs'].includes(d.id);
    if (filterCategory === 'core') return ['ece', 'eee', 'mech', 'civil'].includes(d.id);
    if (filterCategory === 'science') return d.id === 'sh';
    return true;
  });

  return (
    <section id="departments" className="py-20 px-6 lg:px-16 border-b border-[#20242c]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#55e6a5] uppercase">
              ACADEMIC DEPARTMENTS
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white mt-2">
              Explore Departments
            </h2>
            <p className="mt-2 text-[#aeb5c0] text-sm sm:text-base max-w-xl">
              Hover over each department to experience its custom 3D signature cursor. Click any card to launch into its department quiz portal!
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-[#aeb5c0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search department or topic..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-[#121720] border border-[#292f38] rounded-xl text-xs sm:text-sm text-white placeholder-[#aeb5c0]/60 focus:outline-none focus:border-[#55e6a5]"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#121720] border border-[#292f38] rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'computing', label: 'Computing' },
                { id: 'core', label: 'Core Eng' },
                { id: 'science', label: 'Sciences' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClickSound();
                    setFilterCategory(tab.id as typeof filterCategory);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterCategory === tab.id
                      ? 'bg-[#55e6a5] text-[#06110d]'
                      : 'text-[#aeb5c0] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
          {filteredDepts.map((d) => {
            const cursorUrl = getCursorForDepartment(d.kind, d.accent);

            return (
              <div
                key={d.id}
                style={{
                  cursor: cursorUrl,
                  '--accent': d.accent
                } as React.CSSProperties}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('rit:department-hover', { detail: { active: true, dept: d } }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('rit:department-hover', { detail: { active: false } }))}
                onFocus={() => window.dispatchEvent(new CustomEvent('rit:department-hover', { detail: { active: true, dept: d } }))}
                onBlur={() => window.dispatchEvent(new CustomEvent('rit:department-hover', { detail: { active: false } }))}
                onClick={() => onSelectDepartment(d)}
                className="dept group min-h-[470px] rounded-2xl p-7 flex flex-col bg-[#0d1117] border border-[#292f38] hover:border-[var(--accent)] transition-all duration-300 relative preserve-3d shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] select-none hover:-translate-y-2 hover:rotate-x-[4deg] hover:-rotate-y-[4deg]"
              >
                <Department3DScene department={d} compact />

                {/* Header row with 3D icon and department number */}
                <div className="flex items-start justify-between mb-4">
                  <DepartmentIcon kind={d.kind} accent={d.accent} />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#121720] border border-[#292f38] text-[#aeb5c0]">
                      {d.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#707987]">
                      {d.n}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-xl text-white group-hover:text-white transition-colors leading-snug">
                  {d.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-[#aeb5c0] text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {d.desc}
                </p>

                {/* Highlights tags */}
                {d.highlights && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {d.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-[#121720]/80 border border-[#20242c] text-gray-300"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#20242c] text-xs font-bold text-[var(--accent)]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{d.q.length} Domain Questions</span>
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Take quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDepts.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0d1117] border border-[#20242c] text-[#aeb5c0]">
            No departments found matching "{searchQuery}". Try selecting "All" or a different keyword.
          </div>
        )}
      </div>
    </section>
  );
};

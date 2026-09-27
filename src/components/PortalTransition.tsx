import React from 'react';
import { Department } from '../data/departments';
import { DepartmentIcon } from './DepartmentIcon';
import { Department3DScene } from './Department3DScene';

interface PortalTransitionProps {
  show: boolean;
  department: Department | null;
}

export const PortalTransition: React.FC<PortalTransitionProps> = ({
  show,
  department
}) => {
  if (!show || !department) return null;

  return (
    <div 
      className="fixed inset-0 bg-[#080a0f]/90 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-6 transition-opacity duration-300 pointer-events-auto"
      style={{ '--accent': department.accent } as React.CSSProperties}
    >
      {/* Glowing backdrop circle */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${department.accent} 0%, transparent 70%)`
        }}
      />

      {/* Large 3D Icon Motif */}
      <div className="relative z-10 w-[min(90vw,620px)]"><Department3DScene department={department} /><div className="transform scale-75 absolute inset-0 grid place-items-center">
        <DepartmentIcon
          kind={department.kind}
          accent={department.accent}
          size="portal"
        />
      </div></div>

      <div className="relative z-10 text-center px-4">
        <div 
          className="font-heading font-bold text-2xl sm:text-3xl tracking-wide drop-shadow-md"
          style={{ color: department.accent }}
        >
          Entering {department.name}...
        </div>
        <p className="text-xs sm:text-sm text-[#aeb5c0] mt-2 font-mono">
          Initializing {department.code} Knowledge Arena & Timed Challenges
        </p>
      </div>

      {/* Loading bar animation */}
      <div className="w-48 h-1 bg-[#121720] rounded-full overflow-hidden border border-[#292f38] relative z-10">
        <div 
          className="h-full rounded-full animate-[progress_0.8s_ease-in-out_infinite]"
          style={{
            backgroundColor: department.accent,
            boxShadow: `0 0 10px ${department.accent}`
          }}
        />
      </div>
    </div>
  );
};

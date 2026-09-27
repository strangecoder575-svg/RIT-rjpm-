import React from 'react';
import { ExternalLink, Phone, Mail, MapPin, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-16 px-6 lg:px-16 border-t border-[#20242c] bg-[#06080b] text-[#aeb5c0]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div className="lg:col-span-2">
          <a href="#top" className="font-heading font-bold text-2xl tracking-tight text-white inline-block mb-3">
            RIT<span className="text-[#55e6a5]">.</span>
          </a>
          <h4 className="text-sm font-semibold text-white mb-2">Ramco Institute of Technology</h4>
          <p className="text-xs sm:text-sm leading-relaxed max-w-md text-[#8b95a3]">
            Approved by AICTE, New Delhi & Affiliated to Anna University, Chennai. An Autonomous Institution certified with NAAC 'A+' grade and recognized under Raja Charity Trust.
          </p>

          <div className="mt-5 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#55e6a5] shrink-0" />
              <span>North Venganallur, Rajapalayam – 626117, Tamil Nadu, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#55e6a5] shrink-0" />
              <span>+91 4563 233 400 / +91 4563 233 402</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#55e6a5] shrink-0" />
              <a href="mailto:info@ritrjpm.ac.in" className="hover:text-white transition-colors">
                info@ritrjpm.ac.in
              </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">
            QUICK NAVIGATION
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li><a href="#top" className="hover:text-white transition-colors">Home Portal</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About RIT & Vision</a></li>
            <li><a href="#departments" className="hover:text-white transition-colors">Academic Departments (9)</a></li>
            <li><a href="#quizzes" className="hover:text-white transition-colors text-emerald-400">RIT Challenge Arena</a></li>
            <li><a href="#campus" className="hover:text-white transition-colors">Campus & Facilities</a></li>
            <li>
              <a 
                href="https://www.ritrjpm.ac.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 text-[#55e6a5] hover:underline pt-1"
              >
                <span>Official College Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">
            ACADEMIC PROGRAMS
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>• B.E. Computer Science & Engg</li>
            <li>• B.Tech. AI & Data Science</li>
            <li>• B.Tech. Information Tech</li>
            <li>• B.Tech. CS & Business Systems</li>
            <li>• B.E. Electronics & Communication</li>
            <li>• B.E. Electrical & Electronics</li>
            <li>• B.E. Mechanical Engineering</li>
            <li>• B.E. Civil Engineering</li>
            <li>• Dept. of Science & Humanities</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#20242c] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#707987]">
        <p>© {new Date().getFullYear()} Ramco Institute of Technology. All Rights Reserved.</p>
        <a href="/admin" className="admin-footer-link"><Shield className="w-3 h-3" /> Admin Command Core</a><p className="flex items-center gap-1">
          Designed for excellence and student learning at RIT <Heart className="w-3 h-3 text-red-500 fill-red-500" />
        </p>
      </div>
    </footer>
  );
};

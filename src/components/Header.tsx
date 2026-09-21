import React from 'react';
import { Shield, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  filesCount: number;
}

export const Header: React.FC<HeaderProps> = ({ filesCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 font-['Vazirmatn']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Minimal Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                معماری نود شخصی
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 border-r border-slate-200 pr-2 mr-1" dir="ltr">
                v1.0
              </span>
            </div>
          </div>

          {/* Minimal Stats / Indicators */}
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 text-slate-600 text-xs font-medium"
              title={`${filesCount} فصل مستندات`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-mono text-[12px]">{filesCount}</span>
              <span className="hidden sm:inline text-[11px]">مستند</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Header } from './components/Header';
import { DocViewer } from './components/DocViewer';
import { DIRECT_DOCS } from './docsLoader';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Minimal Sticky Header */}
      <Header filesCount={DIRECT_DOCS.length} />

      {/* Main Documentation Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <DocViewer sections={DIRECT_DOCS} />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200/70 bg-white py-3.5 text-center text-xs text-slate-400 font-['Vazirmatn']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px]">
          <span>معماری نود شخصی و پروتکل اجماع شهادت</span>
          <span className="font-mono text-slate-400" dir="ltr">/docs/*.md</span>
        </div>
      </footer>
    </div>
  );
}

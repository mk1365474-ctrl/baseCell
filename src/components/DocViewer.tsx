import React, { useState, useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DocSection } from '../types';
import { MermaidDiagram } from './MermaidDiagram';
import { 
  Search, 
  X,
  Copy, 
  Check, 
  Clock, 
  ListTree, 
  Code2, 
  Eye, 
  ArrowRight, 
  ArrowLeft,
  BookOpen, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Network, 
  Lock, 
  Landmark,
  Boxes,
  Terminal,
  FileCheck,
  FileText
} from 'lucide-react';

interface DocViewerProps {
  sections: DocSection[];
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Minimal code block copy button
const CodeCopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
      title={copied ? 'کپی شد' : 'کپی'}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

export const DocViewer: React.FC<DocViewerProps> = ({ sections }) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || '');
  const [copiedDoc, setCopiedDoc] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [fontSize, setFontSize] = useState<'compact' | 'normal' | 'large'>('normal');
  const [showToc, setShowToc] = useState<boolean>(false);

  const currentSectionIndex = sections.findIndex(s => s.id === activeSectionId);
  const currentSection = sections[currentSectionIndex] || sections[0];

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q)
    );
  }, [sections, searchQuery]);

  // Extract headings for Table of Contents
  const tocItems = useMemo<TocItem[]>(() => {
    if (!currentSection?.content) return [];
    const lines = currentSection.content.split('\n');
    const items: TocItem[] = [];
    let inCode = false;

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCode = !inCode;
        continue;
      }
      if (inCode) continue;

      const h2 = line.match(/^##\s+(.+)$/);
      if (h2) {
        const text = h2[1].replace(/\*\*/g, '').trim();
        const id = 'sec-' + text.replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');
        items.push({ id, text, level: 2 });
      } else {
        const h3 = line.match(/^###\s+(.+)$/);
        if (h3) {
          const text = h3[1].replace(/\*\*/g, '').trim();
          const id = 'sec-' + text.replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');
          items.push({ id, text, level: 3 });
        }
      }
    }
    return items;
  }, [currentSection]);

  // Reading time
  const readTime = useMemo(() => {
    if (!currentSection?.content) return 1;
    const words = currentSection.content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 180));
  }, [currentSection]);

  const getSectionIcon = (name: string) => {
    switch (name) {
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Network': return <Network className="w-4 h-4" />;
      case 'Lock': return <Lock className="w-4 h-4" />;
      case 'Landmark': return <Landmark className="w-4 h-4" />;
      case 'Boxes': return <Boxes className="w-4 h-4" />;
      case 'Terminal': return <Terminal className="w-4 h-4" />;
      case 'FileCheck': return <FileCheck className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleCopyDoc = () => {
    if (currentSection?.content) {
      navigator.clipboard.writeText(currentSection.content);
      setCopiedDoc(true);
      setTimeout(() => setCopiedDoc(false), 1800);
    }
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const textSizeClass = fontSize === 'compact' 
    ? 'text-[14px]' 
    : fontSize === 'large' 
      ? 'text-[17px]' 
      : 'text-[15.5px]';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-['Vazirmatn']">
      
      {/* Minimal Sidebar: Document Navigation */}
      <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20 space-y-3">
        
        {/* Sleek Search Bar */}
        <div className="relative">
          <input
            id="doc-search"
            type="text"
            placeholder="جستجو در مستندات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-9 py-2 rounded-xl bg-white border border-slate-200/90 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-['Vazirmatn'] shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5"
              title="پاک کردن"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Minimal Navigation List */}
        <nav className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs space-y-0.5">
          {filteredSections.map((sec, idx) => {
            const isSelected = sec.id === activeSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSectionId(sec.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-right px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-indigo-50/90 text-indigo-950 font-bold shadow-2xs border-r-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <span className={`shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {getSectionIcon(sec.iconName)}
                </span>
                <span className="truncate flex-1">
                  {sec.title}
                </span>
                <span className="font-mono text-[10px] text-slate-400 shrink-0" dir="ltr">
                  {`0${idx}`.slice(-2)}
                </span>
              </button>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400">
              نتیجه‌ای یافت نشد
            </div>
          )}
        </nav>

        {/* Sticky On-This-Page TOC on wide screens */}
        {tocItems.length > 0 && viewMode === 'rendered' && (
          <div className="hidden xl:block bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 px-2 pb-2 mb-1 border-b border-slate-100">
              <ListTree className="w-3.5 h-3.5 text-indigo-600" />
              <span>سرفصل‌های این صفحه</span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-0.5 text-xs pr-1">
              {tocItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToHeading(item.id)}
                  className={`w-full text-right py-1 px-2 rounded-lg text-slate-600 hover:text-indigo-700 hover:bg-slate-50 transition-colors truncate block text-[11px] ${
                    item.level === 3 ? 'pr-4 text-slate-500' : 'font-medium'
                  }`}
                  title={item.text}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        )}

      </aside>

      {/* Main Reading Surface */}
      <main className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between min-h-[750px]">
        
        {/* Minimal Document Header & Icon Toolbar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between gap-3">
          
          {/* Breadcrumb / File & Read Time */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md" dir="ltr">
              {currentSection.file.split('/').pop()}
            </span>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span className="font-mono">{readTime}m</span>
            </div>
          </div>

          {/* Icon-Only Sleek Toolbar */}
          <div className="flex items-center gap-1.5">
            
            {/* Font Size Selector (A- / A / A+) */}
            <div className="flex items-center bg-slate-100/80 rounded-lg p-0.5 border border-slate-200/60 text-xs">
              <button
                type="button"
                onClick={() => setFontSize('compact')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  fontSize === 'compact' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="قلم کوچک"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  fontSize === 'normal' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="قلم معمولی"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  fontSize === 'large' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="قلم بزرگ"
              >
                A+
              </button>
            </div>

            {/* Mobile / Inline TOC Toggle */}
            {tocItems.length > 0 && (
              <button
                type="button"
                onClick={() => setShowToc(!showToc)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer xl:hidden ${
                  showToc 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                title="فهرست سرفصل‌ها"
              >
                <ListTree className="w-3.5 h-3.5" />
              </button>
            )}

            {/* View Mode Toggle: Formatted vs Raw Code */}
            <div className="flex items-center bg-slate-100/80 rounded-lg p-0.5 border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode('rendered')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'rendered' 
                    ? 'bg-white text-indigo-700 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="نمای خوانش"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'raw' 
                    ? 'bg-white text-indigo-700 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="متن خام Markdown"
              >
                <Code2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Copy Document Button */}
            <button
              type="button"
              onClick={handleCopyDoc}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              title={copiedDoc ? 'کپی شد' : 'کپی کل سند'}
            >
              {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

          </div>

        </div>

        {/* Collapsible Mobile TOC Dropdown */}
        {showToc && tocItems.length > 0 && viewMode === 'rendered' && (
          <div className="xl:hidden bg-slate-50 px-5 py-3 border-b border-slate-200/80">
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {tocItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    scrollToHeading(item.id);
                    setShowToc(false);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-indigo-700 hover:border-indigo-300 transition-colors"
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Document Content */}
        <div className="p-6 sm:p-10 flex-1">
          {viewMode === 'rendered' ? (
            <article className={`max-w-none text-slate-800 ${textSizeClass}`}>
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Title H1
                  h1: ({ children }) => (
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight mb-8 pb-4 border-b border-slate-100 font-['Vazirmatn']">
                      {children}
                    </h1>
                  ),
                  
                  // Heading H2
                  h2: ({ children }) => {
                    const rawText = React.Children.toArray(children).join('');
                    const id = 'sec-' + rawText.replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');
                    return (
                      <h2 
                        id={id} 
                        className="scroll-mt-20 text-lg sm:text-xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2 leading-snug font-['Vazirmatn'] group"
                      >
                        <span className="w-1.5 h-5 bg-indigo-600 rounded-full inline-block shrink-0"></span>
                        <span className="flex-1">{children}</span>
                        <a 
                          href={`#${id}`} 
                          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-600 transition-opacity text-xs font-mono" 
                          title="پیوند"
                        >
                          #
                        </a>
                      </h2>
                    );
                  },

                  // Heading H3
                  h3: ({ children }) => {
                    const rawText = React.Children.toArray(children).join('');
                    const id = 'sec-' + rawText.replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');
                    return (
                      <h3 
                        id={id} 
                        className="scroll-mt-20 text-base font-bold text-slate-800 mt-7 mb-3 leading-snug font-['Vazirmatn']"
                      >
                        {children}
                      </h3>
                    );
                  },

                  // Heading H4
                  h4: ({ children }) => (
                    <h4 className="text-sm font-bold text-slate-800 mt-5 mb-2 font-['Vazirmatn']">
                      {children}
                    </h4>
                  ),

                  // Paragraphs
                  p: ({ children }) => (
                    <p className="my-3.5 text-slate-700 leading-[1.95] text-justify">
                      {children}
                    </p>
                  ),

                  // Bold
                  strong: ({ children }) => (
                    <strong className="font-bold text-slate-900">
                      {children}
                    </strong>
                  ),

                  // Blockquotes
                  blockquote: ({ children }) => (
                    <blockquote className="my-5 p-4 rounded-xl bg-slate-50 border-r-3 border-indigo-500 text-slate-800 leading-[1.9] font-['Vazirmatn'] text-sm sm:text-base">
                      {children}
                    </blockquote>
                  ),

                  // Lists
                  ul: ({ children }) => (
                    <ul className="my-4 space-y-1.5 mr-5 list-disc text-slate-700 leading-[1.85]">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="my-4 space-y-1.5 mr-5 list-decimal text-slate-700 leading-[1.85] font-medium">
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => (
                    <li className="leading-[1.85]">
                      {children}
                    </li>
                  ),

                  hr: () => (
                    <hr className="my-8 border-slate-100" />
                  ),

                  // Tables
                  table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
                      <table className="w-full text-right text-xs sm:text-sm border-collapse font-['Vazirmatn']">
                        {children}
                      </table>
                    </div>
                  ),

                  thead: ({ children }) => (
                    <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200/80">
                      {children}
                    </thead>
                  ),

                  th: ({ children }) => (
                    <th className="p-3 font-bold border-l last:border-l-0 border-slate-200/80 text-slate-900">
                      {children}
                    </th>
                  ),

                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-slate-100">
                      {children}
                    </tbody>
                  ),

                  tr: ({ children }) => (
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      {children}
                    </tr>
                  ),

                  td: ({ children }) => (
                    <td className="p-3 border-l last:border-l-0 border-slate-100 text-slate-700 leading-relaxed">
                      {children}
                    </td>
                  ),

                  // Code & ASCII blocks
                  pre: ({ children }) => <>{children}</>,

                  code: ({ className, children, ...props }: any) => {
                    const strContent = String(children).replace(/\n$/, '');
                    const isMultiLine = strContent.includes('\n') || (className && className.includes('language-'));

                    // Inline code
                    if (!isMultiLine) {
                      return (
                        <code 
                          className="bg-slate-100 text-indigo-700 font-mono text-[12.5px] px-1.5 py-0.5 rounded-md border border-slate-200/80 mx-0.5" 
                          dir="ltr" 
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }

                    // Multi-line code / ASCII / Mermaid
                    const langMatch = /language-(\w+)/.exec(className || '');
                    const lang = langMatch ? langMatch[1] : '';

                    if (lang === 'mermaid') {
                      return <MermaidDiagram code={strContent} />;
                    }

                    return (
                      <div className="my-5 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden" dir="ltr">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                            {lang && <span className="font-mono text-[10px] text-slate-400 ml-2">{lang}</span>}
                          </div>
                          <CodeCopyButton text={strContent} />
                        </div>
                        <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300 leading-relaxed">
                          <pre className="font-mono whitespace-pre">{strContent}</pre>
                        </div>
                      </div>
                    );
                  }
                }}
              >
                {currentSection.content}
              </Markdown>
            </article>
          ) : (
            // Raw Markdown View
            <div className="py-2">
              <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800" dir="ltr">
                <pre className="whitespace-pre-wrap">{currentSection.content}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Bottom Pagination */}
        <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          {currentSectionIndex > 0 ? (
            <button
              type="button"
              onClick={() => {
                setActiveSectionId(sections[currentSectionIndex - 1].id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium py-1.5 px-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{sections[currentSectionIndex - 1].title}</span>
            </button>
          ) : <div />}

          {currentSectionIndex < sections.length - 1 && (
            <button
              type="button"
              onClick={() => {
                setActiveSectionId(sections[currentSectionIndex + 1].id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium py-1.5 px-3 rounded-lg hover:bg-indigo-50/50 transition-colors cursor-pointer"
            >
              <span className="truncate max-w-[200px]">{sections[currentSectionIndex + 1].title}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </main>

    </div>
  );
};

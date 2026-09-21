import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Copy, 
  Check, 
  Code2, 
  Eye, 
  Download,
  AlertCircle
} from 'lucide-react';

// Initialize mermaid with custom theme matching the app aesthetic
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'loose',
  fontFamily: 'Vazirmatn, sans-serif',
  themeVariables: {
    primaryColor: '#e0e7ff',       // Indigo 100
    primaryTextColor: '#1e1b4b',   // Indigo 950
    primaryBorderColor: '#6366f1', // Indigo 500
    lineColor: '#64748b',          // Slate 500
    secondaryColor: '#f1f5f9',     // Slate 100
    tertiaryColor: '#ffffff',
    noteBkgColor: '#fef3c7',
    noteTextColor: '#78350f',
    noteBorderColor: '#f59e0b',
    actorBkg: '#e0e7ff',
    actorBorder: '#6366f1',
    actorTextColor: '#1e1b4b',
    signalColor: '#475569',
    signalTextColor: '#0f172a',
    fontSize: '13px',
  },
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    curve: 'basis',
    nodeSpacing: 40,
    rankSpacing: 40,
  },
  sequence: {
    useMaxWidth: false,
    showSequenceNumbers: true,
    actorFontSize: 13,
    messageFontSize: 12,
  },
  state: {
    useMaxWidth: false,
  }
});

interface MermaidDiagramProps {
  code: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const uniqueId = useId().replace(/[^a-zA-Z0-9]/g, '_');

  useEffect(() => {
    let isMounted = true;
    setError(null);

    const renderChart = async () => {
      try {
        const id = `mermaid_${uniqueId}_${Date.now()}`;
        // Clean and prepare code
        const cleanedCode = code.trim();
        const { svg } = await mermaid.render(id, cleanedCode);
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Mermaid render error:', err);
          setError(err?.message || 'خطا در رندر نمودار');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [code, uniqueId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagram-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className={`my-6 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col' : 'relative'
      }`}
    >
      {/* Diagram Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs select-none">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold">
            Mermaid Diagram
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            فرمت استاندارد و بهینه هوش مصنوعی
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1">
          {/* Zoom Controls */}
          {!showCode && !error && (
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 mr-1 shadow-2xs">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 rounded text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                title="بزرگ‌نمایی"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 hover:text-indigo-600 transition-colors"
                title="اندازه طبیعی"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 rounded text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                title="کوچک‌نمایی"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 rounded text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                title="بازنشانی"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Toggle Code / Visual */}
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className={`p-1.5 rounded-lg border transition-colors shadow-2xs ${
              showCode 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title={showCode ? 'نمایش نمودار تصویری' : 'مشاهده کد ساختار'}
          >
            {showCode ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
          </button>

          {/* Download SVG */}
          {svgContent && !showCode && (
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-2xs"
              title="دانلود فایل وکتور SVG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Code */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-2xs"
            title={copied ? 'کپی شد' : 'کپی دستورات Mermaid'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-2xs"
            title={isFullscreen ? 'بستن تمام‌صفحه' : 'نمایش تمام‌صفحه'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Diagram Canvas or Raw Code View */}
      <div 
        ref={containerRef}
        className={`p-4 sm:p-6 overflow-auto bg-slate-50/40 flex items-center justify-center min-h-[180px] ${
          isFullscreen ? 'flex-1' : 'max-h-[600px]'
        }`}
        dir="ltr"
      >
        {error ? (
          <div className="w-full text-right p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2" dir="rtl">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>عدم امکان رندر گرافیکی نمودار، نمایش کد منبع:</span>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto text-left" dir="ltr">
              {code}
            </pre>
          </div>
        ) : showCode ? (
          <div className="w-full text-left bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800" dir="ltr">
            <pre className="whitespace-pre">{code}</pre>
          </div>
        ) : (
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            className="transition-transform duration-150 ease-out flex justify-center items-center w-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-1.5 bg-white border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="font-mono text-[10px]" dir="ltr">Mermaid DSL</span>
        <span>قابلیت تعاملی: بزرگ‌نمایی، کپی و دریافت SVG</span>
      </div>
    </div>
  );
};

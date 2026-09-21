import { DocSection } from './types';

// Directly load all markdown files from the docs/ directory using Vite's raw glob loader.
// This loads the original documents directly without modifying them.
const rawDocs = import.meta.glob<string>('../docs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// Meta definition for document ordering and display titles
const DOC_METADATA: Record<string, { id: string; title: string; order: number; iconName: string }> = {
  'README.md': {
    id: 'readme',
    title: 'مقدمه و مانیفست بنیادین (اصل میانه‌روی)',
    order: 0,
    iconName: 'BookOpen',
  },
  '01-architecture-overview.md': {
    id: '01-architecture',
    title: '۰۱. نمای کلی معماری و مدل میزبانی باز',
    order: 1,
    iconName: 'Layers',
  },
  '02-node-structure-and-storage.md': {
    id: '02-node-storage',
    title: '۰۲. ساختار نرم‌افزار نود و مدل داده محلی',
    order: 2,
    iconName: 'Cpu',
  },
  '03-witness-consensus-and-credit.md': {
    id: '03-witness-credit',
    title: '۰۳. اصالت مستقیم اسناد و استعلام ارگانیک اعتبار',
    order: 3,
    iconName: 'ShieldCheck',
  },
  '04-transaction-lifecycle-and-clearing.md': {
    id: '04-lifecycle-clearing',
    title: '۰۴. چرخه حیات تعهدات و تصفیه پایاپای',
    order: 4,
    iconName: 'Network',
  },
  '05-trust-web-and-dispute-resolution.md': {
    id: '05-trust-disputes',
    title: '۰۵. وب اعتماد محلی و حل‌وفصل دعاوی',
    order: 5,
    iconName: 'Lock',
  },
  '06-digital-polities-and-governance.md': {
    id: '06-polities-governance',
    title: '۰۶. حکومت‌های دیجیتال و پیمان‌های حاکمیتی',
    order: 6,
    iconName: 'Landmark',
  },
  '07-extensible-app-platform-and-sdk.md': {
    id: '07-app-platform-sdk',
    title: '۰۷. بستر باز توسعه خدمات، میکرو‌-اپ و SDK',
    order: 7,
    iconName: 'Boxes',
  },
  '08-inter-node-api-and-wire-protocol.md': {
    id: '08-wire-protocol-api',
    title: '۰۸. پروتکل سیمی، رابط‌های API و رویدادهای Push',
    order: 8,
    iconName: 'Terminal',
  },
  '09-developer-rfc-and-interop-spec.md': {
    id: '09-developer-rfc-interop',
    title: '۰۹. مشخصات فنی پیاده‌سازی مستقل، RFC و انطباق',
    order: 9,
    iconName: 'FileCheck',
  },
};

export function getLoadedDocs(): DocSection[] {
  const sections: DocSection[] = [];

  for (const [path, rawContent] of Object.entries(rawDocs)) {
    const content = typeof rawContent === 'string' ? rawContent : String(rawContent);
    const fileName = path.split('/').pop() || '';
    const meta = DOC_METADATA[fileName] || {
      id: fileName.replace('.md', ''),
      title: fileName,
      order: 99,
      iconName: 'FileText',
    };

    // Extract first meaningful line for summary
    const lines = content.split('\n');
    let summary = '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```') && !trimmed.startsWith('|')) {
        summary = trimmed.slice(0, 150);
        break;
      }
    }

    sections.push({
      id: meta.id,
      title: meta.title,
      file: `docs/${fileName}`,
      summary: summary || 'مستند فنی معماری شبکه',
      iconName: meta.iconName,
      content: content,
    });
  }

  // Sort according to defined order
  sections.sort((a, b) => {
    const fileA = a.file.replace('docs/', '');
    const fileB = b.file.replace('docs/', '');
    const orderA = DOC_METADATA[fileA]?.order ?? 99;
    const orderB = DOC_METADATA[fileB]?.order ?? 99;
    return orderA - orderB;
  });

  return sections;
}

export const DIRECT_DOCS: DocSection[] = getLoadedDocs();

/**
 * طبقة اللغة المشتركة: نصوص الواجهة ودوال تحديد اللغة من المسار.
 *
 * هذا ملف بيانات فقط — لا يُصدَّر كمكوّن لأنه خارج theme/components.
 * المكوّنات تستورده بـ `import { UI, langOf } from '../i18n.js'`.
 */

export const DEFAULT_LANG = 'ar'
export const LANGS = ['ar', 'en']
export const HOME = { ar: '/ar/', en: '/en/' }

/** العلامة/الاسم كما تُعرض في الترويسة والتذييل لكل لغة. */
export const BRAND = {
  ar: { name: 'نُور', full: 'نُور — تعرّف على الإسلام', tagline: 'منصة تعريف الإسلام وتعليمه' },
  en: { name: 'Noor', full: 'Noor — Discover Islam', tagline: 'A platform that introduces and teaches Islam' },
}

/** نصوص الواجهة. المفاتيح موحّدة بين اللغتين. */
export const UI = {
  ar: {
    skip: 'تجاوز إلى المحتوى',
    menu: 'القائمة',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    search: 'بحث',
    searchAria: 'البحث في الموقع',
    theme: 'تبديل الوضع الليلي',
    cycle: 'تبديل ألوان الموقع',
    langButton: 'English',
    langAria: 'التبديل إلى اللغة الإنجليزية',
    altVersion: 'النسخة الإنجليزية',
    langName: 'اللغة الإنجليزية',
    navHome: 'الرئيسية',
    navMore: 'المزيد',
    navGroupLife: 'حياة المسلم',
    navGroupContext: 'سياق وتصحيح',
    navGroupTools: 'أدوات ومراجعة',
    sbCore: 'الأساس',
    sbMore: 'مواضيع وإضافات',
    sbRead: 'تقدّم القراءة',
    sbPage: 'الصفحة',
    sbOf: 'من',
    sbPath: 'على المسار',
    sbTotalLabel: 'صفحة على المسار',
    sbVisited: 'الصفحات التي زرتها من هذا الباب',
    sbPrev: 'السابق',
    sbNext: 'التالي',
    sbTools: 'أدوات',
    sbQuiz: 'اختبر معرفتك',
    sbGlossary: 'المعجم',
    sbPrint: 'طباعة',
    onThisPage: 'في هذه الصفحة',
    searchPlaceholder: 'ابحث في صفحات الموقع…',
    searchEmpty: 'لا توجد نتائج',
    footerTag: 'منصة تعريف الإسلام وتعليمه',
    footerExplore: 'استكشف',
    footerLang: 'اللغة',
    footerContact: 'تواصل',
    credit: 'هذا الموقع مبنيّ على مكتبة JPROT — بلا خطوة بناء، ومصدره مفتوح.',
    readMore: 'اقرأ المزيد',
    related: 'مواضيع ذات صلة',
    quiz: {
      start: 'ابدأ الاختبار',
      next: 'السؤال التالي',
      finish: 'أنهِ الاختبار',
      restart: 'أعد المحاولة',
      score: 'نتيجتك',
      of: 'من',
      correct: 'إجابة صحيحة',
      wrong: 'إجابة غير صحيحة',
      pick: 'اختر إجابة واحدة',
      answerIs: 'الإجابة الصحيحة:',
      progress: 'السؤال',
      resultGreat: 'ممتاز! أساسك متين.',
      resultGood: 'جيد جداً — راجع ما فاتك وستتقنه.',
      resultRetry: 'بداية موفقة، أعِد القراءة ثم جرّب مجدداً.',
    },
    glossary: {
      filter: 'ابحث في المصطلحات…',
      empty: 'لا يوجد مصطلح مطابق.',
      count: 'مصطلح',
      letter: 'أبجدية',
    },
  },
  en: {
    skip: 'Skip to content',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    search: 'Search',
    searchAria: 'Search this site',
    theme: 'Toggle dark mode',
    cycle: 'Cycle site colors',
    langButton: 'العربية',
    langAria: 'Switch to Arabic',
    altVersion: 'The Arabic version',
    langName: 'Arabic',
    navHome: 'Home',
    navMore: 'More',
    navGroupLife: 'Muslim life',
    navGroupContext: 'Context & clarity',
    navGroupTools: 'Tools & review',
    sbCore: 'Core',
    sbMore: 'Topics & extras',
    sbRead: 'Reading progress',
    sbPage: 'Page',
    sbOf: 'of',
    sbPath: 'on the path',
    sbTotalLabel: 'pages on the path',
    sbVisited: 'Pages of this chapter you have visited',
    sbPrev: 'Previous',
    sbNext: 'Next',
    sbTools: 'Tools',
    sbQuiz: 'Quiz',
    sbGlossary: 'Glossary',
    sbPrint: 'Print',
    onThisPage: 'On this page',
    searchPlaceholder: 'Search pages, posts, tags…',
    searchEmpty: 'No results',
    footerTag: 'An educational platform that introduces Islam in clear language.',
    footerExplore: 'Explore',
    footerLang: 'Language',
    footerContact: 'Contact',
    credit: 'Built with JPROT — no build step, open source.',
    readMore: 'Read more',
    related: 'Related topics',
    quiz: {
      start: 'Start the quiz',
      next: 'Next question',
      finish: 'Finish',
      restart: 'Try again',
      score: 'Your score',
      of: 'of',
      correct: 'Correct',
      wrong: 'Not quite',
      pick: 'Pick one answer',
      answerIs: 'Correct answer:',
      progress: 'Question',
      resultGreat: 'Excellent — your foundations are solid.',
      resultGood: 'Very good — review what you missed and you will master it.',
      resultRetry: 'A good start: read again and try once more.',
    },
    glossary: {
      filter: 'Search terms…',
      empty: 'No matching term.',
      count: 'terms',
      letter: 'Letter',
    },
  },
}

/** لغة الصفحة من مسارها: /ar/… → ar، /en/… → en، وأي شيء آخر → الافتراضية. */
export function langOf(url) {
  const m = /^\/(ar|en)(?:\/|$)/.exec(String(url || '/'))
  return m ? m[1] : DEFAULT_LANG
}

/** صفحة البداية (اختيار اللغة)؟ */
export function isRoot(url) {
  return String(url || '/').split('?')[0] === '/'
}

export function otherLang(lang) {
  return lang === 'ar' ? 'en' : 'ar'
}

/** نفس الصفحة في لغة أخرى: /ar/pillars → /en/pillars (و / → /en/). */
export function switchUrl(url, target) {
  const path = String(url || '/').split('?')[0].split('#')[0]
  const m = /^\/(ar|en)(\/.*)?$/.exec(path)
  if (m) return `/${target}${m[2] || '/'}`
  return HOME[target]
}

/** كل الصفحات المقابلة في اللغتين (لروابط hreflang في plugin).
 *  صفحة الاختيار (/) ليست محتوى لغة واحدة: تشير إلى بيتي اللغة. */
export function alternateUrls(url, basePath = '') {
  const clean = String(url || '/').split('?')[0].split('#')[0]
  const m = /^\/(ar|en)(\/.*)?$/.exec(clean)
  const ar = m ? `/ar${m[2] || '/'}` : HOME.ar
  const en = m ? `/en${m[2] || '/'}` : HOME.en
  const base = String(basePath || '').replace(/\/$/, '')
  return {
    ar: `${base}${ar}`,
    en: `${base}${en}`,
    root: `${base}/`,
  }
}

/** رابط داخلي آمن (يترك الروابط الخارجية كما هي). */
export function internal(url) {
  const s = String(url || '')
  if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(s)) return s
  return s.startsWith('/') ? s : `/${s}`
}

/** أرقام لغة الصفحة: عربية-هندية للعربية، ولاطينية للإنجليزية. */
export function num(value, lang = DEFAULT_LANG) {
  const s = String(value)
  return lang === 'ar' ? s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]) : s
}

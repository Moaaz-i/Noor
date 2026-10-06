/**
 * plugin/i18n.js — لغة على مستوى الصفحة.
 *
 * jprot يضبط lang/dir على مستوى الموقع في <html>، ونصوص البحث على مستوى
 * الموقع أيضاً. هذا الـ plugin يجعل كليهما خاصاً بكل صفحة:
 *
 *   1. <html lang dir> صحيح لمسار الصفحة (/ar/* → ar/rtl، /en/* → en/ltr).
 *   2. <link rel="alternate" hreflang> للنسخة المقابلة من نفس الصفحة.
 *   3. في صفحات /en/ يُترجم اسم الموقع ونصوص البحث العربية المدمجة.
 *   4. يحمّل public/assets/site.js (سلوك التفاعل: الاختبار، المعجم، اللغة).
 *
 * يعتمد فقط على الـ hook `html:head` — أي على العقد المعلن في JPROT.
 */
import { esc } from 'jprot'
import { alternateUrls, langOf } from '../theme/i18n.js'

const SITE = { ar: 'نُور — تعرّف على الإسلام', en: 'Noor — Discover Islam' }

// النصوص العربية التي يضمّها محرّك jprot داخل الصفحة (بحث + og).
// نستبدلها في صفحات /en/ فقط؛ المفاتيح مطابقة حرفياً لـ jprot.config.js.
const EN_LITERALS = [
  ['ابحث في صفحات الموقع…', 'Search pages, posts, tags…'],
  ['لا توجد نتائج', 'No results'],
  // شريط التذييل: نصّه العربي مكتوب في jprot.config.js ويظهر كما هو في كل
  // اللغات، فنترجمه في صفحات /en/ ليبقى اسم المشروع ووصفه بلغتها.
  [
    '© نُور — تعرّف على الإسلام · محتوى مفتوح للنشر مع الإسناد.',
    '© Noor — Discover Islam · Content open to republish with attribution.',
  ],
]

function absUrl(base, path) {
  const origin = String(base || '').replace(/\/$/, '')
  return origin ? `${origin}${path}` : path
}

export default {
  name: 'i18n',
  setup({ on, config }) {
    const base = String(config?.basePath || '').replace(/\/$/, '')
    // config.url تصل مطويّة على مسار النشر أثناء التصدير (site.url + basePath)
    // بينما تضيفها alternateUrls بنفسها — فنُزيلها من الأصل لئلا تتكرّر:
    // …github.io/Noor/Noor/ar/pillars  بدل  …github.io/Noor/ar/pillars
    const rawUrl = String(config?.url || '').replace(/\/$/, '')
    const origin = base && rawUrl.endsWith(base) ? rawUrl.slice(0, -base.length).replace(/\/+$/, '') : rawUrl

    on('html:head', (html, page) => {
      const url = String(page?.url || '/')
      const lang = langOf(url)
      const isEn = lang === 'en'
      let out = html

      // 1 — اتجاه ولغة الوثيقة.
      out = out.replace(
        /<html lang="[^"]*" dir="[^"]*">/,
        `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`,
      )

      // 2 — og:locale + اسم الموقع في صفحات الإنجليزية.
      if (isEn) {
        out = out
          .split(SITE.ar)
          .join(SITE.en)
          .replace(
            '<meta property="og:locale" content="ar">',
            '<meta property="og:locale" content="en_US">',
          )
        for (const [from, to] of EN_LITERALS) out = out.split(from).join(to)
      }

      // 2b — <title>: «عنوان الصفحة — اسم الموقع»، دون تكرار إن كان العنوان
      // نفسه يحوي اسم الموقع (كالصفحة الجذرية مثلاً).
      const siteTitle = isEn ? SITE.en : SITE.ar
      const pageTitle = String(page?.data?.title || '')
      const combined = pageTitle.includes(siteTitle)
        ? pageTitle
        : pageTitle
          ? `${pageTitle} — ${siteTitle}`
          : siteTitle
      out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(combined)}</title>`)

      // 3 — روابط اللغات المقابلة + سكربت الواجهة.
      // ثلاثة روابط فقط: عربية، إنجليزية، وx-default يشير إلى صفحة اختيار
      // اللغة (/) — رابط ذاتي إضافي سيُقرأ تكراراً لا فائدة منه.
      const alt = alternateUrls(url, base)
      const links = [
        `    <link rel="alternate" hreflang="ar" href="${esc(absUrl(origin, alt.ar))}">`,
        `    <link rel="alternate" hreflang="en" href="${esc(absUrl(origin, alt.en))}">`,
        `    <link rel="alternate" hreflang="x-default" href="${esc(absUrl(origin, alt.root))}">`,
      ].join('\n')

      // مسار السكربت من جذر الموقع: الخادم التطويري يشغّل الموقع من «/»،
      // وترى عملية التصدير روابط src إلى /assets/ فتضيف إليها مسار النشر
      // (/Noor) — هكذا يعمل المساران معاً دون كتابة basePath يدوياً هنا.
      const script = `    <script defer src="/assets/site.js"></script>`

      out = out.replace('</head>', `${links}\n${script}\n  </head>`)
      return out
    })
  },
}

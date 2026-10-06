import { esc, safeHref } from 'jprot'
import { HOME, UI } from '../i18n.js'

const SPECS = {
  ar: {
    dir: 'rtl',
    native: 'العربية',
    latin: 'Arabic',
    title: 'ابدأ بالعربية',
    text: 'المحتوى كاملاً: الأركان، العقيدة، القرآن والسنة، السيرة، الأخلاق، التاريخ والحضارة، مع مسار تعلّم واختبار ومعجم.',
    cta: 'ادخل بالعربية',
  },
  en: {
    dir: 'ltr',
    native: 'English',
    latin: 'الإنجليزية',
    title: 'Start in English',
    text: 'The full path: pillars, beliefs, Qur’an and Sunnah, seerah, ethics, history and civilization — with a learning path, a quiz and a glossary.',
    cta: 'Enter in English',
  },
}

/**
 * صفحة اختيار اللغة — تعمل كـ layout للصفحة الجذرية (content/index.md
 * يحدد `layout: Lang`) فتعرض شاشة استقبال بلغتين بدل صفحة عادية.
 */
export default function LangChooser(props) {
  const { site, page, content } = props
  const lang = UI.ar
  const cards = ['ar', 'en']
    .map((code) => {
      const s = SPECS[code]
      return `
      <a class="lang-card lang-card--${code}" href="${esc(safeHref(HOME[code]))}" hreflang="${code}" lang="${code}" dir="${s.dir}">
        <span class="lang-native">${esc(s.native)}</span>
        <span class="lang-latin">${esc(s.latin)}</span>
        <span class="lang-title">${esc(s.title)}</span>
        <span class="lang-text">${esc(s.text)}</span>
        <span class="lang-cta">${esc(s.cta)} <span aria-hidden="true">→</span></span>
      </a>`
    })
    .join('')

  const title = (page && page.data && page.data.title) || 'نُور — تعرّف على الإسلام'

  return `
<section class="chooser">
  <div class="chooser-ornament" aria-hidden="true"></div>
  <header class="chooser-head">
    <p class="chooser-brand"><span aria-hidden="true">☾</span> ${esc(
      (site && site.title && String(site.title).split('—')[0].trim()) || 'نُور',
    )}</p>
    <h1 class="chooser-title">${esc(title)}</h1>
    <p class="chooser-sub">Choose your language <span aria-hidden="true">·</span> اختر لغتك</p>
  </header>
  <div class="chooser-grid">${cards}</div>
  ${content ? `<div class="chooser-note">${content}</div>` : ''}
</section>`
}

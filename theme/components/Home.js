import { esc, safeHref } from 'jprot'
import { HOME, langOf, otherLang, switchUrl, UI, BRAND, internal } from '../i18n.js'

/**
 * صفحة اللغة الرئيسية (/ar/ و /en/).
 *
 * البطل (hero) يُقرأ من مفاتيح مسطّحة في frontmatter حتى لا تعتمد الصفحة على
 * إعدادات الموقع المشتركة بين اللغتين:
 *
 *   heroKicker, heroTitle, heroSubtitle, heroVerse, heroVerseRef
 *   heroLinks: [{ label, url }, …]
 */
export default function Home(props) {
  const { site, page, content, sectionsHtml } = props
  const lang = langOf(page && page.url)
  const t = UI[lang]
  const d = page.data || {}

  const kicker = d.heroKicker ? `<span class="hero-kicker">${esc(d.heroKicker)}</span>` : ''
  const title = esc(d.heroTitle || d.title || BRAND[lang].full)
  const subtitle = d.heroSubtitle ? `<p class="hero-subtitle">${esc(d.heroSubtitle)}</p>` : ''
  const verse = d.heroVerse
    ? `<figure class="hero-verse">
        <blockquote>${esc(d.heroVerse)}</blockquote>
        ${d.heroVerseRef ? `<figcaption>${esc(d.heroVerseRef)}</figcaption>` : ''}
      </figure>`
    : ''

  const links = Array.isArray(d.heroLinks) && d.heroLinks.length
    ? `<div class="hero-links">${d.heroLinks
        .map(
          (l, i) =>
            `<a href="${esc(safeHref(internal(l.url)))}" class="btn btn-lg${i ? ' btn-outline' : ''}">${esc(l.label)}</a>`,
        )
        .join('')}</div>`
    : ''

  const altLang = otherLang(lang)
  const altLink = `<a class="hero-alt" href="${esc(safeHref(switchUrl(page && page.url, altLang)))}" hreflang="${altLang}" lang="${altLang}">${esc(
    t.altVersion,
  )} <span aria-hidden="true">→</span></a>`

  return `
    <section class="hero hero-islam">
      <div class="hero-ornament" aria-hidden="true"></div>
      ${kicker}
      <h1 class="hero-title">${title}</h1>
      ${subtitle}
      ${verse}
      ${links}
      ${altLink}
    </section>
    <div class="page-content">${content}</div>
    ${sectionsHtml || ''}
  `
}

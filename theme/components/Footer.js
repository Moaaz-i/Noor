import { esc, safeHref } from 'jprot'
import { HOME, langOf, otherLang, switchUrl, UI, BRAND, internal } from '../i18n.js'

/**
 * التذييل: يعرض نبذة اللغة الحالية، وروابط الاستكشاف المفلترة، ومبدّل اللغة.
 */
export default function Footer(props) {
  const { site, page, nav } = props
  const lang = langOf(page && page.url)
  const t = UI[lang]

  const links = (nav || [])
    .map((item) => {
      const href = internal(item.url)
      if (!href.startsWith(`/${lang}/`)) return ''
      return `<a href="${esc(safeHref(href))}">${esc(item.label)}</a>`
    })
    .filter(Boolean)
    .join('')

  const target = otherLang(lang)
  const year = new Date().getFullYear()

  return `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="footer-logo"><span class="brand-mark" aria-hidden="true">☾</span> ${esc(BRAND[lang].name)}</span>
          <p class="footer-tag">${esc(t.footerTag)}</p>
        </div>
        <div class="footer-col">
          <h4>${esc(t.footerExplore)}</h4>
          <nav class="footer-links">${links}</nav>
        </div>
        <div class="footer-col">
          <h4>${esc(t.footerLang)}</h4>
          <nav class="footer-links footer-langs">
            <a href="${esc(safeHref(HOME[lang]))}" lang="${lang}" aria-current="true">${esc(
              lang === 'ar' ? 'العربية' : 'English',
            )}</a>
            <a href="${esc(safeHref(switchUrl(page && page.url, target)))}" hreflang="${target}" lang="${target}">${esc(
              target === 'ar' ? 'العربية' : 'English',
            )}</a>
          </nav>
          <p class="footer-credit">${esc(t.credit)}</p>
        </div>
      </div>
      <div class="footer-bar">
        <p>${esc(site.footerText || `© ${year} ${BRAND[lang].full}`)}</p>
        <p class="footer-year">© ${year}</p>
      </div>
    </footer>
  `
}

import { esc } from 'jprot'
import { langOf, UI } from '../i18n.js'

/**
 * الهيكل العام للصفحة. يميّز عن المكوّن الافتراضي في أمرين:
 *   - اتجاه الصفحة ولغتها يُشتقّان من مسار الصفحة لا من إعداد الموقع،
 *     فصفحة /en/ تبقى LTR حتى يكون الموقع كله RTL افتراضياً.
 *   - نص رابط «تخطي إلى المحتوى» بلغة الصفحة.
 */
export default function Layout(props) {
  const { content, header, footer, sidebar, site, page } = props
  const lang = langOf(page && page.url)
  const t = UI[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const cls = sidebar ? 'site-main with-sidebar' : 'site-main'
  const body = sidebar
    ? `<div class="sidebar-layout"><aside class="sidebar-col">${sidebar}</aside><div class="main-col">${content}</div></div>`
    : content

  return `
    <a class="skip-link" href="#jprot-main">${esc(t.skip)}</a>
    <p class="sr-only" id="jprot-announce" role="status"></p>
    <div class="app" data-lang="${esc(lang)}" dir="${esc(dir)}">
      ${header}
      <main id="jprot-main" tabindex="-1" class="${cls}">${body}</main>
      ${footer}
    </div>
  `
}

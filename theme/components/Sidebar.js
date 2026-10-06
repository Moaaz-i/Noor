import { esc, safeHref } from 'jprot'
import { internal, langOf, num, UI } from '../i18n.js'

/**
 * الشريط الجانبي — «رفيق القراءة» وليس نسخة ثانية من الترويسة.
 *
 * الترويسة تُعطيك خريطة الموقع؛ هذا العمود يخدم الصفحة التي تقرأها الآن:
 *   1. مؤشر تقدّم القراءة + عدد الصفحات التي زرتها من هذا الباب.
 *   2. فهرس عناوين الصفحة الحالية («في هذه الصفحة»).
 *   3. زرّا السابق/التالي على مسار التعلّم المرتّب بـ order.
 *   4. أدوات سريعة: الاختبار، المعجم، طباعة الصفحة.
 *
 * السلوك (شريط التقدّم، عدّاد الزيارات، الطباعة) في public/assets/site.js.
 */
export default function Sidebar(props) {
  const { site, page, nav, docsNav } = props
  if (site.sidebar === false) return ''
  const lang = langOf(page && page.url)
  const t = UI[lang]
  const current = String((page && page.url) || '/').split('#')[0]

  // مسار الباب: صفحات اللغة الحالية المرتبة بـ order (كما تبنيها jprot).
  const list = (site.docs && Array.isArray(docsNav) && docsNav.length ? docsNav : nav || []).filter((n) => {
    const href = internal(n.url)
    return n.url !== '/' && href.startsWith(`/${lang}/`)
  })
  const index = list.findIndex((n) => {
    const target = internal(n.url).replace(/\/+$/, '')
    return current === target || current + '/' === internal(n.url)
  })
  const prev = index > 0 ? list[index - 1] : null
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : index < 0 ? list[0] || null : null
  const pages = list.map((n) => internal(n.url).replace(/\/+$/, '') || '/').join(',')
  const posLabel =
    index >= 0
      ? `${t.sbPage} ${num(index + 1, lang)} ${t.sbOf} ${num(list.length, lang)} ${t.sbPath}`
      : `${num(list.length, lang)} ${t.sbTotalLabel}`

  /* 1 — مؤشر التقدّم ------------------------------------------------- */
  const progress = `
      <div class="sb-progress" data-progress data-pages="${esc(pages)}">
        <div class="sb-progress-top">
          <span class="sb-progress-title">${esc(t.sbRead)}</span>
          <span class="sb-progress-pct" data-role="progress-pct">٠٪</span>
        </div>
        <div class="sb-progress-bar"><span class="sb-progress-fill" data-role="progress-fill"></span></div>
        <p class="sb-progress-meta">
          <span>${esc(posLabel)}</span>
          <span class="sb-visited" title="${esc(t.sbVisited)}">
            <span class="sr-only">${esc(t.sbVisited)}</span>
            <b data-role="visited-count" data-total="${esc(num(list.length, lang))}">${esc(num(0, lang))}</b>
            <span aria-hidden="true">/ ${esc(num(list.length, lang))}</span>
          </span>
        </p>
      </div>`

  /* 2 — فهرس عناوين الصفحة: نلتقط h2/h3 من HTML الصفحة. عنوان القسم بلا
         مُعرّف ذاته يرث مُعرّف <section> (فيبقى رابط التعميق إلى بداية القسم)،
         وما دونه من عناوين داخلية (عناوين البطاقات مثلاً) نتجنّبه. */
  const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  const found = []
  const seen = new Set()
  const tagRe = /<section[^>]*\bid="([^"]+)"[^>]*>|<\/section>|<h([23])([^>]*)>([\s\S]*?)<\/h\2>/g
  const src = String(props.content || '')
  let openId = null
  let match
  while ((match = tagRe.exec(src))) {
    const token = match[0]
    if (token.startsWith('<section')) {
      openId = match[1] || null
      continue
    }
    if (token === '</section>') {
      openId = null
      continue
    }
    const own = /\bid="([^"]+)"/.exec(match[3] || '')
    const level = Number(match[2])
    const id = own ? own[1] : level === 2 ? openId : null
    const text = strip(match[4])
    if (!id || !text || seen.has(id)) continue
    seen.add(id)
    found.push({ level, id, text })
  }
  const headings = found.length
    ? found
    : (page.headings || []).filter((h) => h.level >= 2 && h.level <= 3)
  const onpage = headings.length
    ? `<div class="sb-onpage"><h4>${esc(t.onThisPage)}</h4>${headings
        .map(
          (h) =>
            `<a href="#${esc(h.id)}" class="sb-anchor${h.level === 3 ? ' sb-anchor-3' : ''}">${esc(h.text)}</a>`,
        )
        .join('')}</div>`
    : ''

  /* 3 — السابق / التالي ---------------------------------------------- */
  const pagerItem = (n, kind) => {
    if (!n) return ''
    const label = n.label || n.text || ''
    return `<a href="${esc(safeHref(internal(n.url)))}" class="sb-pager-item ${kind}">
        <span class="sb-pager-dir">${esc(kind === 'is-prev' ? t.sbPrev : t.sbNext)}</span>
        <span class="sb-pager-title">${esc(label)}</span>
      </a>`
  }
  const pager = `<div class="sb-pager">${pagerItem(prev, 'is-prev')}${pagerItem(next, 'is-next')}</div>`

  /* 4 — أدوات سريعة --------------------------------------------------- */
  const tools = `
      <div class="sb-tools">
        <span class="sb-tools-label">${esc(t.sbTools)}</span>
        <div class="sb-tools-row">
          <a class="sb-chip" href="${esc(safeHref(`/${lang}/quiz`))}">${esc(t.sbQuiz)}</a>
          <a class="sb-chip" href="${esc(safeHref(`/${lang}/glossary`))}">${esc(t.sbGlossary)}</a>
          <button class="sb-chip" type="button" data-action="print">${esc(t.sbPrint)}</button>
        </div>
      </div>`

  return `
    <aside class="site-sidebar" id="sidebar">
      ${progress}
      ${onpage}
      ${pager}
      ${tools}
    </aside>`
}

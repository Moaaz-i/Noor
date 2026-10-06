import { esc, safeHref } from 'jprot'
import { HOME, langOf, otherLang, switchUrl, UI, BRAND, isRoot, internal } from '../i18n.js'

const SEARCH_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>`
const BURGER_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`

/**
 * الترويسة ثنائية اللغة:
 *   - روابط التنقل تُرشَّح حسب لغة الصفحة الحالية.
 *   - زر تبديل اللغة يشير إلى نفس الصفحة في اللغة الأخرى.
 *   - على صفحة اختيار اللغة (/) لا تظهر روابط تنقل إطلاقاً.
 */
export default function Header(props) {
  const { page, nav, site, sidebar } = props
  const current = String((page && page.url) || '/').split('?')[0]
  const lang = langOf(current)
  const t = UI[lang]
  const root = isRoot(current)

  // حدّ القائمة الأساسية: الصفحات السبع الأولى هي **مسار الانطلاق** لمن لا
  // يعرف شيئاً عن الإسلام (ما هو الإسلام ← الأركان ← العقيدة ← القرآن ←
  // السيرة ← العبادات ← الأخلاق)، وما بعدها مواضيع وأدوات يجمعه «المزيد»
  // داخل مراحل معنونة حتى لا تتفرّع الترويسة.
  const PRIMARY_ORDER = 7
  const STAGES = [
    { from: 8, to: 13, label: t.navGroupLife },
    { from: 14, to: 15, label: t.navGroupContext },
    { from: 16, to: Infinity, label: t.navGroupTools },
  ]

  const built = (root ? [] : nav || [])
    .map((item) => {
      const rel = internal(item.url)
      const href = /^(?:[a-z][a-z\d+.-]*:|#)/i.test(rel) ? rel : rel || '/'
      const isExternal = /^(?:[a-z][a-z\d+.-]*:|#)/i.test(rel)
      // ترشيح حسب اللغة: /ar/* أو /en/* — والروابط الخارجية تبقى كما هي.
      const mine = isExternal || href === `/${lang}` || href.startsWith(`/${lang}/`)
      if (!mine) return ''
      const target = href.replace(/\/+$/, '') || '/'
      const active = !isExternal && current.length > 1 && (current === target || current + '/' === href)
      const order = Number.isFinite(item.order) ? item.order : Infinity
      return {
        order,
        active,
        html: `<a href="${esc(safeHref(href))}" class="nav-link${active ? ' active' : ''}"${
          active ? ' aria-current="page"' : ''
        }>${esc(item.label)}</a>`,
      }
    })
    .filter(Boolean)

  const primary = built.filter((b) => b.order <= PRIMARY_ORDER)
  const secondary = built.filter((b) => b.order > PRIMARY_ORDER)
  const items = primary.map((b) => b.html).join('\n      ')
  const CARET = `<svg class="nav-more-caret" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`
  // قائمة «المزيد» مقسَّمة إلى مراحل التعلّم بعناوين صغيرة.
  const menuParts = []
  let lastStage = null
  for (const b of secondary) {
    const stage = STAGES.find((s) => b.order >= s.from && b.order <= s.to)
    const label = stage ? stage.label : ''
    if (label && label !== lastStage) {
      menuParts.push(`<div class="nav-more-group" role="presentation">${esc(label)}</div>`)
      lastStage = label
    }
    menuParts.push(b.html)
  }
  const more = secondary.length
    ? `
      <details class="nav-more${secondary.some((b) => b.active) ? ' has-active' : ''}">
        <summary class="nav-more-btn${secondary.some((b) => b.active) ? ' active' : ''}">${esc(t.navMore)} ${CARET}</summary>
        <div class="nav-more-menu">${menuParts.join('\n          ')}</div>
      </details>`
    : ''

  const hasNav = site.showNav !== false && built.length > 0
  const sidebarMenu = sidebar ? `<div class="sb-mobile">${sidebar.replace(' id="sidebar"', '')}</div>` : ''
  const hasMenu = hasNav || !!sidebar
  const navHtml = hasNav
    ? `<nav class="site-nav" id="site-nav">${items}${more}${sidebarMenu}</nav>`
    : sidebar
      ? `<nav class="site-nav" id="site-nav">${sidebarMenu}</nav>`
      : ''

  const navToggle = hasMenu
    ? `<button class="nav-toggle" data-action="toggle-nav" aria-label="${esc(t.openMenu)}" aria-expanded="false" aria-controls="site-nav" title="${esc(t.menu)}">${BURGER_ICON}</button>`
    : ''

  const variantCycle =
    site.themePicker !== false
      ? `
        <button class="variant-cycle" data-action="cycle-variant" aria-label="${esc(t.cycle)}" title="${esc(t.cycle)}">◈</button>`
      : ''

  const target = otherLang(lang)
  const langHref = root ? HOME[target] : switchUrl(current, target)
  const langSwitch = `
        <a class="lang-switch" href="${esc(safeHref(langHref))}" hreflang="${target}" lang="${target}" aria-label="${esc(
          t.langAria,
        )}" title="${esc(t.langAria)}">${esc(t.langButton)}</a>`

  return `
    <header class="site-header">
      <a class="brand" href="${esc(safeHref(HOME[lang]))}"${
        root ? '' : ` aria-label="${esc(BRAND[lang].full)}"`
      }><span class="brand-mark" aria-hidden="true">☾</span><span class="brand-name">${esc(BRAND[lang].name)}</span><span class="brand-tag">${esc(
        BRAND[lang].tagline,
      )}</span></a>
      ${navHtml}
      <div class="header-actions">
        ${navToggle}
        ${langSwitch}
        <button class="search-toggle" data-action="search" aria-label="${esc(t.searchAria)}" title="${esc(
          t.searchAria,
        )}">${SEARCH_ICON}</button>
        ${variantCycle}
        <button class="theme-toggle" data-action="toggle-theme" aria-label="${esc(t.theme)}" title="${esc(
          t.theme,
        )}">◐</button>
      </div>
    </header>
  `
}

import { esc, slugify } from 'jprot'

/**
 * حاوية قسم بعنوان فرعي اختياري. المحتوى داخله Markdown عادي من المحتوى.
 * العنوان يحصل على مُعرّف تلقائي ليظهر في فهرس «في هذه الصفحة» ويُقفل إليه.
 *
 *   :::Section title="أركان الإسلام" subtitle="..." tone="surface"
 *   …
 *   :::
 */
export default function Section({ title = '', subtitle = '', id = '', tone = '', children = '' }) {
  const cls = ['io-section', tone ? `io-section--${tone}` : ''].filter(Boolean).join(' ')
  const anchor = id || (title ? slugify(title) : '')
  const anchorAttr = anchor ? ` id="${esc(anchor)}"` : ''
  return `
<section class="${cls}"${anchorAttr}>
  ${title ? `<header class="io-section-head"><h2 class="section-title">${esc(title)}</h2></header>` : ''}
  ${subtitle ? `<p class="section-subtitle">${esc(subtitle)}</p>` : ''}
  <div class="io-section-body">${children}</div>
</section>`
}

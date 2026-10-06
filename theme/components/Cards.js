import { esc, safeHref } from 'jprot'

/**
 * شبكة بطاقات. الأبناء هم :::Card — محتوى البطاقة يُكتب Markdown داخل المحتوى.
 *
 *   :::Cards cols="3"
 *   :::Card title="الشهادة" icon="🕌" num="1"
 *   لا إله إلا الله…
 *   :::
 *   :::
 */
export default function Cards({ cols = 'auto', children = '' }) {
  const n = Number(cols)
  const style = n > 0 && n < 5 ? ` style="--cards-cols:${n}"` : ''
  return `<div class="io-cards"${style}>${children}</div>`
}

export function Card({ title = '', icon = '', num = '', kicker = '', href = '', label = '', children = '' }) {
  const head = `
    <span class="card-icon" aria-hidden="true">${esc(icon || (num ? String(num) : '◆'))}</span>
    ${kicker ? `<span class="card-kicker">${esc(kicker)}</span>` : ''}`
  const heading = title ? `<h3 class="card-title">${esc(title)}</h3>` : ''
  const body = children ? `<div class="card-body">${children}</div>` : ''
  const link = href
    ? `<a class="card-link" href="${esc(safeHref(href))}">${esc(label || title)} <span aria-hidden="true">→</span></a>`
    : ''
  return `<article class="io-card">${head}${heading}${body}${link}</article>`
}

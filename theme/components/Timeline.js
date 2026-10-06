import { esc } from 'jprot'

/**
 * خط زمني: حاوية :::Timeline وعناصر :::Event.
 *
 *   :::Timeline
 *   :::Event when="٦١٠ م" title="الوحي الأول"
 *   بدء الوحي بغار حراء…
 *   :::
 *   :::
 */
export default function Timeline({ children = '' }) {
  return `<ol class="io-timeline">${children}</ol>`
}

export function Event({ when = '', title = '', children = '' }) {
  return `
<li class="io-event">
  <span class="event-when">${esc(when)}</span>
  <div class="event-card">
    ${title ? `<h3 class="event-title">${esc(title)}</h3>` : ''}
    ${children ? `<div class="event-body">${children}</div>` : ''}
  </div>
</li>`
}

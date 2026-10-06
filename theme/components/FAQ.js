import { esc } from 'jprot'

/**
 * أسئلة شائعة قابلة للطي: حاوية :::FAQ وأسئلة :::QA.
 *
 *   :::FAQ
 *   :::QA q="هل الإسلام دين العنف؟"
 *   لا…
 *   :::
 *   :::
 *
 * تعتمد على <details> الأصلي: تعمل بلا جافاسكربت ومتاحة لقارئات الشاشة.
 */
export default function FAQ({ title = '', children = '' }) {
  return `
<section class="io-faq">
  ${title ? `<h2 class="section-title">${esc(title)}</h2>` : ''}
  <div class="faq-list">${children}</div>
</section>`
}

export function QA({ q = '', children = '' }) {
  if (!q) return ''
  return `
<details class="faq-item">
  <summary><span class="faq-q">${esc(q)}</span><span class="faq-toggle" aria-hidden="true"></span></summary>
  <div class="faq-answer">${children}</div>
</details>`
}

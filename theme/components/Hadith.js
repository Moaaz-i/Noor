import { esc } from 'jprot'

/**
 * حديث شريف أو قول صحابي. مثل الآية: النص عربي والإسناد اختياري.
 *
 *   :::Hadith text="إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ" ref="متفق عليه" note="…"
 *   :::
 */
export default function Hadith({ text = '', ref = '', tr = '', note = '' }) {
  if (!text) return ''
  return `
<figure class="hadith">
  <span class="hadith-mark" aria-hidden="true">❝</span>
  <blockquote class="hadith-text" lang="ar" dir="rtl">${esc(text)}</blockquote>
  ${tr ? `<figcaption class="hadith-tr">${esc(tr)}</figcaption>` : ''}
  ${ref ? `<cite class="hadith-ref">${esc(ref)}</cite>` : ''}
  ${note ? `<p class="hadith-note">${esc(note)}</p>` : ''}
</figure>`
}

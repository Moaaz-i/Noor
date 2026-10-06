import { esc } from 'jprot'

/**
 * آية قرآنية بخط أميري وترقيمها. النص بالعربية دائماً حتى في صفحات الإنجليزية،
 * و`tr` ترجمة/معنى يظهر بخط الصفحة.
 *
 *   :::Ayah text="إِنَّ اللَّهَ مَعَ الصَّابِرِينَ" ref="البقرة ١٥٣" tr="…"
 *   :::
 */
export default function Ayah({ text = '', ref = '', tr = '', note = '' }) {
  if (!text) return ''
  // القوسان ﴿﴾ يُضافان حول النص بدل علامة عائمة فوقه — أوضح بصرياً وأقرب
  // لما اعتاد عليه القارئ من مصحف.
  const framed = text.includes('﴿') ? text : `﴿${text}﴾`
  return `
<figure class="ayah">
  <blockquote class="ayah-text" lang="ar" dir="rtl">${esc(framed)}</blockquote>
  ${tr ? `<figcaption class="ayah-tr">${esc(tr)}</figcaption>` : ''}
  ${ref ? `<cite class="ayah-ref">${esc(ref)}</cite>` : ''}
  ${note ? `<p class="ayah-note">${esc(note)}</p>` : ''}
</figure>`
}

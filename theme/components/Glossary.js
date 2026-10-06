import { readFile } from 'node:fs/promises'
import { esc } from 'jprot'
import { langOf, UI } from '../i18n.js'

/**
 * معجم المصطلحات الإسلامية: يُبنى على الخادم من data/glossary.<lang>.json،
 * وpublic/assets/site.js يفلتر العناصر مباشرة (بلا طلب شبكة إضافي).
 *
 *   :::Glossary
 *   :::
 */
export default async function Glossary({ page, group = '' } = {}) {
  const lang = langOf(page && page.url)
  const t = UI[lang].glossary
  let data = null
  try {
    data = JSON.parse(await readFile(new URL(`../../data/glossary.${lang}.json`, import.meta.url), 'utf8'))
  } catch {
    data = null
  }
  const all = (data && data.terms) || []
  const terms = group ? all.filter((x) => x.group === group) : all
  if (!terms.length) return ''

  const rows = terms
    .map((x) => {
      const haystack = [x.term, x.latin || '', x.def].join(' ').toLowerCase()
      return `
      <div class="glossary-item" data-term="${esc(haystack)}">
        <dt class="glossary-term">${esc(x.term)}${x.latin ? `<span class="glossary-latin">${esc(x.latin)}</span>` : ''}</dt>
        <dd class="glossary-def">${esc(x.def)}</dd>
      </div>`
    })
    .join('')

  return `
<section class="glossary" data-glossary>
  <div class="glossary-bar">
    <input type="search" class="glossary-input" data-role="glossary-filter" placeholder="${esc(
      t.filter,
    )}" aria-label="${esc(t.filter)}" autocomplete="off">
    <span class="glossary-count" data-role="glossary-count">${terms.length} ${esc(t.count)}</span>
  </div>
  <dl class="glossary-list">${rows}</dl>
  <p class="glossary-empty" data-role="glossary-empty" hidden>${esc(t.empty)}</p>
</section>`
}

import { readFile } from 'node:fs/promises'
import { esc } from 'jprot'
import { langOf, UI } from '../i18n.js'

/**
 * اختبار تفاعلي متعدد الخيارات.
 *
 * الأسئلة تعيش في data/quiz.<lang>.json وتُبنى هنا على الخادم — الصفحة تعمل
 * بلا جافاسكربت، وpublic/assets/site.js يضيف التفاعل فقط (أحداث مفوّضة على
 * document حتى تبقى صالحة بعد التنقل الداخلي بدون إعادة تحميل).
 *
 *   :::Quiz
 *   :::
 */
export default async function Quiz({ page, title = '' } = {}) {
  const lang = langOf(page && page.url)
  const t = UI[lang].quiz
  let data = null
  try {
    data = JSON.parse(await readFile(new URL(`../../data/quiz.${lang}.json`, import.meta.url), 'utf8'))
  } catch {
    data = null
  }
  const items = (data && data.questions) || []
  if (!items.length) return ''

  const questions = items
    .map((q, qi) => {
      const options = (q.options || [])
        .map(
          (opt, i) => `
          <button type="button" class="quiz-option" data-i="${i}">
            <span class="quiz-letter" aria-hidden="true">${'أبجد'[i] || i + 1}</span>
            <span class="quiz-option-text">${esc(opt)}</span>
          </button>`,
        )
        .join('')
      return `
      <li class="quiz-q" data-correct="${Number(q.answer) || 0}" data-index="${qi}">
        <p class="quiz-question"><span class="quiz-num">${qi + 1}.</span> ${esc(q.q)}</p>
        <div class="quiz-options" role="group" aria-label="${esc(q.q)}">${options}</div>
        <p class="quiz-feedback" data-role="feedback" aria-live="polite" hidden></p>
        ${q.why ? `<p class="quiz-why" data-role="why" hidden>${esc(q.why)}</p>` : ''}
      </li>`
    })
    .join('')

  return `
<section class="quiz" data-quiz dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
  <header class="quiz-head">
    <span class="quiz-badge">${esc(title || data.title || (lang === 'ar' ? 'اختبر معرفتك' : 'Test yourself'))}</span>
    <p class="quiz-intro">${esc(data && data.intro ? data.intro : t.pick)}</p>
    <p class="quiz-progress"><span data-role="answered">0</span> / ${items.length} ${esc(
      lang === 'ar' ? 'سؤال تمت الإجابة عنه' : 'answered',
    )}</p>
  </header>
  <ol class="quiz-list">${questions}</ol>
  <footer class="quiz-score" data-role="score" hidden>
    <p class="quiz-score-value"><span data-role="score-num">0</span> <span class="quiz-score-of">${esc(
      t.of,
    )}</span> ${items.length}</p>
    <p class="quiz-score-msg" data-role="score-msg"></p>
    <button type="button" class="btn btn-quiz" data-action="quiz-restart">${esc(t.restart)}</button>
  </footer>
</section>`
}

/**
 * سلوك الواجهة — يُحقن من plugins/i18n.js كملف خارجي (CSP: script-src 'self').
 *
 * كل شيء هنا يعتمد على **الأحداث المفوّضة على document**، لأن التنقل الداخلي
 * في JPROT يستبدل <main> فقط: النصوص والبطاقات الجديدة تبقى صالحة تلقائياً.
 *
 * 1. تبديل اللغة يعيد تحميل الصفحة كاملة (اتجاه الوثيقة والترويسة يجب أن يتغيرا)،
 *    ورابطه يُعاد حسابه بعد كل تنقّل داخلي حتى يبقى في نفس الصفحة.
 * 2. البحث يُفلتر حسب لغة الصفحة الحالية.
 * 3. الاختبار: اختيار إجابة، تصحيح، نتيجة، إعادة.
 * 4. المعجم: فلترة فورية بالكتابة.
 * 5. رفيق القراءة في الشريط الجانبي: تقدّم القراءة، عدّاد الزيارات، الطباعة.
 * 6. مزامنة الترويسة (رابط اللغة + الحالة النشطة) بعد استبدال <main>.
 * 7. مرسات «#» في الشريط الجانبي: تمرير سليم إلى المعرّفات العربيّة.
 * 8. مسار النشر (GitHub Pages تحت مجلّد فرعي كـ /Noor): يُستنتج من موقع
 *    السكربت نفسه ويُطبَّق على حساب اللغة وبناء الروابط والزيارات.
 */
;(function () {
  'use strict'

  /* ---------------------------------------------------------------
   * مسار النشر (base path): الموقع يُنشر تحت مجلّد فرعي على GitHub Pages
   * (/Noor/ar/…) والتطوير يجري من الجذر (/ar/…). نستنتج المسار من موقع
   * السكربت نفسه — في التطوير «» وبعد التصدير «/Noor» — فتُوحَّد كل عمليات
   * حساب اللغة وبناء الروابط على المنسوب منه.
   * ------------------------------------------------------------- */
  var BASE = (function () {
    var src = ''
    var cur = document.currentScript
    if (cur && cur.src) src = cur.src
    else {
      var el = document.querySelector('script[src$="assets/site.js"]')
      if (el) src = el.src || ''
    }
    if (!src) return ''
    // src رابط كاملاً (نطاق + مسار) — نستخرج مساره فقط لئلا يصبح BASE نطاقاً.
    var p = ''
    try {
      p = new URL(src, location.href).pathname
    } catch (err) {
      p = ''
    }
    if (!p) return ''
    p = p.split('#')[0].split('?')[0]
    var i = p.indexOf('/assets/site.js')
    return i > 0 ? p.slice(0, i) : ''
  })()

  /** يزيل أصل النشر: /Noor/ar/pillars → /ar/pillars */
  function stripBase(p) {
    var s = String(p || '/')
    if (BASE && (s === BASE || s.indexOf(BASE + '/') === 0)) s = s.slice(BASE.length) || '/'
    return s
  }

  /** يضيف أصل النشر: /en/pillars → /Noor/en/pillars */
  function withBase(p) {
    var s = String(p || '/')
    if (s.charAt(0) !== '/') s = '/' + s
    return BASE + s
  }

  var LANG = (function () {
    var m = /^\/(ar|en)(?:\/|$)/.exec(stripBase(location.pathname))
    return m ? m[1] : 'ar'
  })()

  var UI = {
    ar: {
      correct: 'إجابة صحيحة',
      wrong: 'إجابة غير صحيحة',
      answerIs: 'الإجابة الصحيحة:',
      restart: 'أعد المحاولة',
      score: 'نتيجتك',
      of: 'من',
      resultGreat: 'ممتاز! أساسك متين.',
      resultGood: 'جيد جداً — راجع ما فاتك وستتقنه.',
      resultRetry: 'بداية موفقة، أعِد القراءة ثم جرّب مجدداً.',
      placeholder: 'ابحث في صفحات الموقع…',
      empty: 'لا توجد نتائج',
      termsCount: 'مصطلح',
      termsEmpty: 'لا يوجد مصطلح مطابق.',
    },
    en: {
      correct: 'Correct',
      wrong: 'Not quite',
      answerIs: 'Correct answer:',
      restart: 'Try again',
      score: 'Your score',
      of: 'of',
      resultGreat: 'Excellent — your foundations are solid.',
      resultGood: 'Very good — review what you missed and you will master it.',
      resultRetry: 'A good start: read again and try once more.',
      placeholder: 'Search pages, posts, tags…',
      empty: 'No results',
      termsCount: 'terms',
      termsEmpty: 'No matching term.',
    },
  }[LANG]

  /* ---------------------------------------------------------------
   * 1 — تبديل اللغة: تحميل كامل، لا تنقّل داخلي.
   * ------------------------------------------------------------- */
  document.addEventListener(
    'click',
    function (e) {
      var a = e.target.closest && e.target.closest('a[href]')
      if (!a) return
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      var href = a.getAttribute('href') || ''
      if (!href || (href.charAt(0) !== '#' && href.charAt(0) !== '/')) return
      var path = href.split('#')[0].split('?')[0]
      if (!path) return // رابط مرساة داخل الصفحة نفسها
      var m = /^\/(ar|en)(?:\/|$)/.exec(stripBase(path))
      var target = m ? m[1] : null
      var here = /^\/(ar|en)(?:\/|$)/.exec(stripBase(location.pathname))
      var current = here ? here[1] : null
      if (target === current) return // نفس اللغة → التنقّل الداخلي يكفي
      e.preventDefault()
      e.stopImmediatePropagation()
      location.href = path // يشمل أصل النشر أصلاً (مربوع في التصدير)
    },
    true,
  )

  /* ---------------------------------------------------------------
   * 2 — البحث داخل لغة واحدة.
   * ------------------------------------------------------------- */
  var nativeFetch = window.fetch
  if (typeof nativeFetch === 'function') {
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : input && input.url
      var p = nativeFetch.call(window, input, init)
      if (!url || String(url).indexOf('/@jprot/search.json') === -1) return p
      return p.then(function (res) {
        if (!res.ok) return res
        return res
          .clone()
          .json()
          .then(function (rows) {
            if (!Array.isArray(rows)) return res
            var filtered = rows.filter(function (r) {
              var u = String((r && r.url) || '')
              if (LANG === 'ar') return u.indexOf('/en/') === -1
              return u.indexOf('/ar/') === -1
            })
            return new Response(JSON.stringify(filtered), {
              status: 200,
              headers: { 'content-type': 'application/json' },
            })
          })
      })
    }
  }

  /* ---------------------------------------------------------------
   * 3 — الاختبار.
   * ------------------------------------------------------------- */
  function quizAnswered(quiz) {
    return quiz.querySelectorAll('.quiz-q[data-answered]').length
  }

  function quizScore(quiz) {
    return quiz.querySelectorAll('.quiz-q[data-result="correct"]').length
  }

  function quizUpdate(quiz) {
    var total = quiz.querySelectorAll('.quiz-q').length
    var badge = quiz.querySelector('[data-role="answered"]')
    if (badge) badge.textContent = String(quizAnswered(quiz))
    var box = quiz.querySelector('[data-role="score"]')
    if (!box) return
    if (quizAnswered(quiz) < total) return
    box.hidden = false
    var n = quizScore(quiz)
    var num = box.querySelector('[data-role="score-num"]')
    if (num) num.textContent = String(n)
    var msg = box.querySelector('[data-role="score-msg"]')
    var ratio = total ? n / total : 0
    if (msg) {
      msg.textContent =
        ratio === 1 ? UI.resultGreat : ratio >= 0.6 ? UI.resultGood : UI.resultRetry + ' (' + UI.score + ': ' + n + ' ' + UI.of + ' ' + total + ')'
    }
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.quiz-option')
    if (btn) {
      var li = btn.closest('.quiz-q')
      if (!li || li.getAttribute('data-answered') === '1') return
      var quiz = li.closest('.quiz')
      var correct = Number(li.getAttribute('data-correct')) || 0
      var picked = Number(btn.getAttribute('data-i')) || 0
      li.setAttribute('data-answered', '1')
      li.setAttribute('data-result', picked === correct ? 'correct' : 'wrong')
      btn.classList.add(picked === correct ? 'is-correct' : 'is-wrong')
      if (picked !== correct) {
        var right = li.querySelector('.quiz-option[data-i="' + correct + '"]')
        if (right) right.classList.add('is-correct')
      }
      var fb = li.querySelector('[data-role="feedback"]')
      var rightEl = li.querySelector('.quiz-option[data-i="' + correct + '"] .quiz-option-text')
      if (fb) {
        fb.hidden = false
        fb.className = 'quiz-feedback ' + (picked === correct ? 'is-correct' : 'is-wrong')
        fb.textContent =
          (picked === correct ? '✓ ' + UI.correct : '✕ ' + UI.wrong) +
          ' — ' +
          UI.answerIs +
          ' ' +
          (rightEl ? rightEl.textContent : '')
      }
      var why = li.querySelector('[data-role="why"]')
      if (why) why.hidden = false
      Array.prototype.forEach.call(li.querySelectorAll('.quiz-option'), function (b) {
        b.disabled = true
      })
      quizUpdate(quiz)
      return
    }

    var restart = e.target.closest && e.target.closest('[data-action="quiz-restart"]')
    if (restart) {
      var q = restart.closest('.quiz')
      if (!q) return
      Array.prototype.forEach.call(q.querySelectorAll('.quiz-q'), function (li) {
        li.removeAttribute('data-answered')
        li.removeAttribute('data-result')
        var fb = li.querySelector('[data-role="feedback"]')
        if (fb) { fb.hidden = true; fb.textContent = '' }
        var why = li.querySelector('[data-role="why"]')
        if (why) why.hidden = true
        Array.prototype.forEach.call(li.querySelectorAll('.quiz-option'), function (b) {
          b.disabled = false
          b.classList.remove('is-correct', 'is-wrong')
        })
      })
      var box = q.querySelector('[data-role="score"]')
      if (box) box.hidden = true
      quizUpdate(q)
      q.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })

  /* ---------------------------------------------------------------
   * 4 — فلترة المعجم.
   * ------------------------------------------------------------- */
  document.addEventListener('input', function (e) {
    var input = e.target
    if (!input || !input.matches || !input.matches('[data-role="glossary-filter"]')) return
    var root = input.closest('[data-glossary]')
    if (!root) return
    var q = String(input.value || '')
      .trim()
      .toLowerCase()
    var items = root.querySelectorAll('.glossary-item')
    var shown = 0
    Array.prototype.forEach.call(items, function (item) {
      var hay = (item.getAttribute('data-term') || '') + ' ' + (item.textContent || '')
      var ok = !q || hay.toLowerCase().indexOf(q) !== -1
      item.hidden = !ok
      item.style.display = ok ? '' : 'none'
      if (ok) shown++
    })
    var count = root.querySelector('[data-role="glossary-count"]')
    if (count) count.textContent = shown + ' ' + UI.termsCount
    var empty = root.querySelector('[data-role="glossary-empty"]')
    if (empty) empty.hidden = shown !== 0
  })

  /* ---------------------------------------------------------------
   * 5 — قائمة «المزيد» في الترويسة: إغلاق بالنقر خارجها أو بـ Escape.
   * ------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var inside = e.target.closest && e.target.closest('.nav-more')
    Array.prototype.forEach.call(document.querySelectorAll('details.nav-more[open]'), function (d) {
      if (d !== inside) d.open = false
    })
  })
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return
    var open = document.querySelector('details.nav-more[open]')
    if (open) {
      open.open = false
      var btn = open.querySelector('.nav-more-btn')
      if (btn) btn.focus()
    }
  })

  /* ---------------------------------------------------------------
   * 6 — رفيق القراءة في الشريط الجانبي:
   *     شريط تقدّم القراءة، عدّاد الصفحات المزارة من الباب، الطباعة.
   *     التنقل الداخلي يستبدل <main> فقط، فنُعاد التهيئة عند كل استبدال.
   * ------------------------------------------------------------- */
  var VISITED_KEY = 'noor:visited'

  function normalizePath(p) {
    return String(p || '/').replace(/\/+$/, '') || '/'
  }
  function readVisited() {
    try {
      return JSON.parse(localStorage.getItem(VISITED_KEY)) || []
    } catch (err) {
      return []
    }
  }
  function markVisited(path) {
    var key = normalizePath(path)
    var list = readVisited()
    if (list.indexOf(key) !== -1) return list
    list.push(key)
    try {
      localStorage.setItem(VISITED_KEY, JSON.stringify(list))
    } catch (err) {
      /* التخزين معطّل — نكتفي بالعدّ في هذه الجلسة */
    }
    return list
  }
  function localDigits(value) {
    var s = String(value)
    return LANG === 'ar' ? s.replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d] }) : s
  }

  function updateProgress() {
    var fills = document.querySelectorAll('[data-role="progress-fill"]')
    if (!fills.length) return
    var doc = document.documentElement
    var max = (doc.scrollHeight - doc.clientHeight) || 0
    var top = window.pageYOffset || doc.scrollTop || 0
    var pct = max > 0 ? Math.round((top / max) * 100) : 0
    if (pct < 0) pct = 0
    if (pct > 100) pct = 100
    var text = localDigits(pct) + (LANG === 'ar' ? '٪' : '%')
    for (var i = 0; i < fills.length; i++) fills[i].style.width = pct + '%'
    var labels = document.querySelectorAll('[data-role="progress-pct"]')
    for (var j = 0; j < labels.length; j++) labels[j].textContent = text
  }

  function initSidebar() {
    var boxes = document.querySelectorAll('[data-progress]')
    if (!boxes.length) return
    var visited = markVisited(stripBase(location.pathname))
    var pages = String(boxes[0].getAttribute('data-pages') || '').split(',').filter(Boolean)
    var seen = 0
    for (var i = 0; i < pages.length; i++) {
      if (visited.indexOf(normalizePath(stripBase(pages[i]))) !== -1) seen++
    }
    // الشريط الجانبي يظهر مرتين: عمود الصفحة، ونسخته داخل قائمة الجوال —
    // فنُحدّث النسختين معاً حتى لا يبقى أحدهما عالقاً عند القيمة الأولى.
    var counts = document.querySelectorAll('[data-role="visited-count"]')
    for (var k = 0; k < counts.length; k++) counts[k].textContent = localDigits(seen)
    updateProgress()
  }

  var progressTicking = false
  window.addEventListener(
    'scroll',
    function () {
      if (progressTicking) return
      progressTicking = true
      window.requestAnimationFrame(function () {
        progressTicking = false
        updateProgress()
      })
    },
    { passive: true },
  )

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-action="print"]')
    if (!btn) return
    e.preventDefault()
    window.print()
  })

  /* ---------------------------------------------------------------
   * 7 — مزامنة الترويسة بعد التنقّل الداخلي.
   *     JPROT يستبدل <main> فقط، فتبقى الترويسة محسوبة على الصفحة التي
   *     فُتحت بها أول مرة: رابط تبديل اللغة يشير إلى قديمها، والحالة
   *     النشطة (active) تظل على الرابط الأول. نُصلح ذلك بعد كل استبدال،
   *     فلا يلزم المستخدم عمل Refresh ليبقى في صفحته عند تبديل اللغة.
   * ------------------------------------------------------------- */
  function syncHeader() {
    // ارتفاع الترويسة اللاصقة ← متغيّر CSS تستعمله سمة scroll-padding-top
    // كي تقف المرساة تحت الترويسة لا خلفها.
    var hdr = document.querySelector('.site-header')
    if (hdr) {
      var h = Math.round(hdr.getBoundingClientRect().height)
      if (h > 0) document.documentElement.style.setProperty('--header-offset', h + 'px')
    }
    var here = normalizePath(stripBase(location.pathname.split('#')[0].split('?')[0]))
    var m = /^\/(ar|en)(\/.*)?$/.exec(here)
    var cur = m ? m[1] : null
    var other = cur === 'ar' ? 'en' : cur === 'en' ? 'ar' : null
    var sw = document.querySelector('a.lang-switch')
    if (sw && other) {
      // normalizePath قلّص الشرطة المائلة الأخيرة، فنعيدها ليبقى الرابط
      // كصفحة كاملة ويتجنّب redirectاً على المضيف الساكن.
      var suffix = m[2] || '/'
      if (suffix !== '/' && suffix.charAt(suffix.length - 1) !== '/') suffix += '/'
      sw.setAttribute('href', withBase('/' + other + suffix))
      sw.setAttribute('hreflang', other)
      sw.setAttribute('lang', other)
    }
    var links = document.querySelectorAll('.site-nav a.nav-link')
    var inMore = false
    for (var i = 0; i < links.length; i++) {
      var a = links[i]
      var p = normalizePath(stripBase((a.getAttribute('href') || '').split('#')[0].split('?')[0]))
      var isActive = here !== '/' && p === here
      a.classList.toggle('active', isActive)
      if (isActive) {
        a.setAttribute('aria-current', 'page')
        if (a.closest && a.closest('.nav-more-menu')) inMore = true
      } else {
        a.removeAttribute('aria-current')
      }
    }
    var more = document.querySelector('details.nav-more')
    if (more) {
      more.classList.toggle('has-active', inMore)
      var btn = more.querySelector('summary')
      if (btn) btn.classList.toggle('active', inMore)
    }
  }

  /* ---------------------------------------------------------------
   * 8 — روابط المرساة داخل الصفحة (#عنوان) في الشريط الجانبي.
   *     معالج JPROT يمنع الحركة الاصطلاحيّة ثم يبني getElementById من
   *     url.hash المُرمَّز (٪…) فلا يجد المعرّفات العربيّة، فلا تمرّ الصفحة.
   *     نعمل في **مرحلة التقاط** (نسبق معالجه فيمنع نفسه بـ defaultPrevented)
   *     ونُنفّذ التمرير نحن إلى الهدف الحقيقي.
   * ------------------------------------------------------------- */
  function anchorTarget(href) {
    if (!href || href.charAt(0) !== '#' || href.length < 2) return null
    var id = href.slice(1)
    try {
      id = decodeURIComponent(id)
    } catch (err) {
      /* المعرّف بلا ترميز خاص — يبقى كما هو */
    }
    return document.getElementById(id)
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target.closest && e.target.closest('a[href]')
      if (!a) return
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      var el = anchorTarget(a.getAttribute('href'))
      if (!el) return
      e.preventDefault()
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      try {
        history.replaceState(history.state, '', a.getAttribute('href'))
      } catch (err) {
        /* قد يمنع المستخدم تغيير العنوان — التمرير تمّ */
      }
    },
    true,
  )

  // تبديل الصفحات الداخلية يستبدل <main> داخل .app: لحظتها نُحدّث المؤشر
  // ونغلق قائمة «المزيد» المفتوحة ونُعيد ضبط الترويسة على المسار الجديد،
  // ونتمرّر إلى مرساة العنوان إن جاء الرابط بها (تمرير JPROT معطوب عربيّاً).
  if (window.MutationObserver) {
    var host = document.querySelector('.app') || document.body
    if (host) {
      new MutationObserver(function () {
        Array.prototype.forEach.call(document.querySelectorAll('details.nav-more[open]'), function (d) {
          d.open = false
        })
        syncHeader()
        initSidebar()
        if (location.hash) {
          var t = anchorTarget(location.hash)
          if (t) t.scrollIntoView()
        }
      }).observe(host, { childList: true, subtree: false })
    }
  }

  syncHeader()
  initSidebar()

  // فتح صفحةٍ بمرساة في عنوانها (#...) : قد تُلغى حركة المرساة الاصطلاحيّة
  // أثناء تهيئة JPROT، فنُكملها نحن بعد التحميل — مع احتساب ارتفاع الترويسة
  // (scroll-padding-top) كي لا يختفي القسم تحتها.
  function initialHashScroll() {
    if (!location.hash) return
    var t = anchorTarget(location.hash)
    if (!t) return
    var want =
      (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-offset'), 10) || 0) + 13
    if (Math.abs(Math.round(t.getBoundingClientRect().top) - want) > 8) t.scrollIntoView()
  }
  window.addEventListener('load', function () {
    window.setTimeout(initialHashScroll, 80)
  })

  // ارتفاع الترويسة يتغيّر بتقليم الشاشة وبانتهاء تحميل الخطوط: نُحدّث
  // --header-offset مع كل تغيّر كي تبقى المرساة تحت الترويسة لا خلفها.
  var offsetTicking = false
  function refreshOffset() {
    if (offsetTicking) return
    offsetTicking = true
    window.requestAnimationFrame(function () {
      offsetTicking = false
      syncHeader()
    })
  }
  window.addEventListener('resize', refreshOffset)
  window.addEventListener('load', refreshOffset)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshOffset, function () {})
  }
})()

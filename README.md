# نُور — تعرّف على الإسلام · Noor — Discover Islam

موقع تعريفي ثنائي اللغة (عربي / إنجليزي) لتعريف الإسلام وتعليمه، مبني بالكامل على
مكتبة [jprot](https://www.npmjs.com/package/jprot) بلا خطوة بناء.

A bilingual (Arabic + English) site that introduces and teaches Islam — pillars,
beliefs, Qur'an, Prophetic biography, ethics, history, a learning path, an
interactive quiz and a glossary — built entirely on the **jprot** static
renderer with no build step.

> 🚀 **النشر / Deploying:** ادفع إلى `main` فيستقبل الموقع على GitHub Pages
> تلقائياً عبر `.github/workflows/deploy.yml` — راجع قسم «النشر» أدناه.
> العنوان ومسار النشر مضبوطان في `jprot.config.js` (`url` + `basePath`)
> على <https://moaaz-i.github.io/Noor>.

---

## التشغيل / Commands

```bash
npm install          # مرة واحدة
npm run dev          # خادم التطوير → http://localhost:4321  (jprot)
npm run check        # فحص الإعدادات
npm run lint         # فحص الصفحات (SEO / 404 / …)
npm run export       # تصدير ثابت إلى dist/  (jprot export --out dist)
```

Arabic is the default language: `/` is a language chooser, `/ar/…` is the Arabic
edition (RTL) and `/en/…` the English edition (LTR).

---

## البنية / Structure

```
Noor/
├── jprot.config.js        # إعدادات الموقع: العنوان، اللغة الافتراضية (ar/rtl)،
│                          # نصوص الواجهة، وتسجيل plugin
├── plugins/
│   └── i18n.js            # hook «html:head»: lang/dir لكل صفحة، hreflang،
│                          # ترجمة نصوص jprot المدمجة في صفحات /en/، تحميل site.js
├── theme/
│   ├── i18n.js            # نصوص الواجهة + دوال اللغة (langOf, switchUrl, …)
│   ├── custom.css         # نظام التصميم كاملاً (خطوط، ألوان، مكوّنات، طباعة)
│   └── components/        # مكوّنات jprot (اسم الملف = اسم المكوّن)
│       ├── Layout.js  Header.js  Footer.js  Sidebar.js  Home.js  Lang.js
│       ├── Section.js Cards.js  Card.js     Timeline.js Event.js
│       ├── Ayah.js    Hadith.js FAQ.js      QA.js
│       └── Quiz.js    Glossary.js
├── content/
│   ├── index.md           # صفحة اختيار اللغة (layout: Lang → Home)
│   ├── 404.md             # صفحة غير موجودة (ثنائية اللغة)
│   ├── ar/*.md            # ٢٠ صفحة عربية (الرئيس + ١٩ صفحة في مسار التعلّم)
│   └── en/*.md            # 20 English pages (same slugs → easy hreflang)
├── data/
│   ├── quiz.ar.json  quiz.en.json        # أسئلة الاختبار التفاعلي
│   └── glossary.ar.json glossary.en.json # 24 مصطلحاً لكل لغة
├── public/
│   ├── assets/site.js     # تفاعل الصفحة (الاختبار، المعجم، تبديل اللغة)
│   ├── fonts/*.woff2      # خطوط مستضافة ذاتياً (Cairo, Reem Kufi, Amiri)
│   ├── data/  images/     # ملفات ثابتة تُنسخ كما هي
└── dist/                  # ناتج jprot export (قابل للنشر على أي استضافة)
```

---

## التنقل / Navigation

تُبنى القوائم من حقلَي `nav` و `order` في frontmatter لكل صفحة، و`order` هو
ترتيب **مسار التعلّم** نفسه، مصمَّم لمن لا يعرف شيئاً عن الإسلام: بداية سليمة
(ما هو الإسلام؟) ← أصول الدين ← حياة المسلم ← سياق وتصحيح ← أدوات ومراجعة.

| المرحلة | `order` | الصفحات |
| --- | --- | --- |
| الانطلاق | ١ – ٧ | ما هو الإسلام؟ · الأركان · العقيدة · القرآن · السيرة · العبادات · الأخلاق |
| حياة المسلم | ٨ – ١٣ | الأسرة · المرأة · المعاملات · الأذكار · المناسبات · قصص القرآن |
| سياق وتصحيح | ١٤ – ١٥ | التاريخ · مفاهيم خاطئة |
| أدوات ومراجعة | ١٦ – ١٩ | مسار التعلّم · أسئلة شائعة · المعجم · الاختبار |

- **١ – ٧** → روابط أساسية مباشرة في الترويسة (`PRIMARY_ORDER = 7` في
  `theme/components/Header.js`).
- **≥ ٨** → قائمة **«المزيد» / More** داخل `<details class="nav-more">`،
  مقسَّمة بعناوين المراحل أعلاه (`STAGES` في `Header.js`)، وتفتح بالنقر
  وتُغلق بالنقر خارجها أو بـ Escape (السلوك في `public/assets/site.js`).
- **بلا `nav`** → خارج القائمتين (صفحة اختيار اللغة و 404).

### الشريط الجانبي = رفيق القراءة

`theme/components/Sidebar.js` لا يكرّر الترويسة، بل يخدم الصفحة التي تُقرأ الآن:

1. **تقدّم القراءة** — شريط تقدّم للصفحة الحالية + «الصفحة ٣ من ١٩ على المسار»
   وعدّاد الصفحات التي زرتها من هذا الباب (محفوظ في `localStorage`).
2. **في هذه الصفحة** — فهرس عناوين الأقسام، روابطها تقفل إلى `<section id>`.
3. **السابق / التالي** — زرّان على مسار التعلّم بحسب `order`.
4. **أدوات** — الاختبار · المعجم · طباعة الصفحة.

- لإضافة صفحة جديدة: `nav: اسم قصير` + `order: رقم` في frontmatter، ولا تنسَ
  نسخ الصفحة في اللغة الأخرى بنفس `order` حتى يتطابق المساران.

---

## ثنائية اللغة / How the two languages work

| المسار | اللغة | الاتجاه |
| --- | --- | --- |
| `/` | اختيار اللغة | — |
| `/ar/*` | العربية | RTL (`lang="ar" dir="rtl"`) |
| `/en/*` | English | LTR (`lang="en" dir="ltr"`) |

- **الملكية:** كل محتوى في `content/ar/` و `content/en/` بنفس أسماء الملفات،
  فالمقابل يُشتق من المسار مباشرة (`/ar/pillars` ↔ `/en/pillars`).
- **plugin `plugins/i18n.js`** يضبط على كل صفحة: `<html lang dir>`، روابط
  `<link rel="alternate" hreflang>` (ar / en / x-default ← صفحة الاختيار)،
  ترجمة نصوص بحث jprot في صفحات الإنجليزية، تنظيف `<title>` من تكرار اسم
  الموقع، وحقن `site.js`.
- **تبديل اللغة** في الترويسة يستخدم رابطاً مباشراً مع إعادة تحميل الصفحة
  (الصفحات مُولّدة لكل لغة، فلا يوجد تبديل في الطرفية).
- **البحث** يفلتر النتائج حسب لغة الصفحة داخل `site.js`.
- مكتبة المصطلحات تُقرأ من `data/glossary.<lang>.json` والاختبار من
  `data/quiz.<lang>.json` عند التوليد (سيرفر-side)، والتفاعل في المتصفح.

## المحتوى / Writing content

الصفحة = Markdown + قِيَع (shortcodes) من مكوّنات `theme/components`:

```markdown
:::Section title='عنوان القسم' subtitle='سطر فرعي'
:::Cards cols=3
:::Card icon='1' title='عنوان البطاقة' tag='وسم'
نص البطاقة…
:::
:::
:::
:::Ayah text='وَأَقِمِ الصَّلَاةَ وَآتِ الزَّكَاةَ' ref='البقرة ٤٣' tr='…'
:::
:::Hadith text='إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ' ref='متفق عليه'
:::
:::QA q='سؤال؟' إجابة…
:::
```

قواعد مهمة / Important rules:

1. **كل `:::Name` يجب أن يُغلق بـ `:::`** — القِيَع غير المغلقة تُرجع المستند
   كاملاً إلى نص Markdown حرفياً (تظهر `:::Section` على الصفحة).
2. قيم الخصائص التي تحتوي مسافات **يُquoted** بـ `'"'` أو `"'"`.
3. اسم الملف = اسم المكوّن، والمُصدِّر الافتراضي (default export) دالة تُعيد HTML.
4. الأجزاء النصية كلها في ملفات `content/` — المكوّنات للبنية فقط.
5. تحقّق بعد أي تعديل: `npm run lint && npm run check`، ولا تنسَ
   `npm run export` قبل النشر.

## التصميم / Design

- خطوط عربية مستضافة ذاتياً في `public/fonts/` (سياسة CSP تمنع الخطوط
  الخارجية): **Cairo** للنصوص، **Reem Kufi** للعناوين، **Amiri** للآيات.
- وضع ليلي/نهاري، تباين مريح، دعم RTL كامل (خصائص `inline-*`/`inset-inline`)
  وطباعة نظيفة (`@media print`).
- كل الألوان والقياسات عبر متغيّرات CSS في `theme/custom.css` — غيّر
  `:root` فقط لتغيير الهوية كلها.

## النشر على GitHub Pages / Deploying

النشر **تلقائيّ بالكامل**: كل دفع إلى `main` (أو `master`) يبني الموقع ويرفعه
على GitHub Pages عبر `.github/workflows/deploy.yml` — بلا أسرار وبلا خطوات
يدوية بعد أول تشغيل.

```bash
git add . && git commit -m "update site" && git push
```

ما يفعله الـ workflow في كل دفعة:

1. `npm ci` ← `jprot check` ← `jprot lint` ← `jprot export --out dist`
2. رفع `dist` كـ Pages artifact ثم نشره (`actions/deploy-pages`).
3. العنوان النهائي: **<https://moaaz-i.github.io/Noor>**

- **أول مرة فقط:** إن رفض تفعيل Pages تلقائياً (يظهر تحذير في سجلّ الدفعة)،
  فعّله مرة واحدة من `Settings → Pages → Source: GitHub Actions` ثم أعد
  تشغيل الدفعة من تبويب Actions ← Run workflow. بعدها كل دفعٍ ينشر بلا تدخل.
- **جذر المستودع** يجب أن يكون محتوى مجلّد `Noor/` نفسه (الملفات
  `jprot.config.js` و `package.json` و `.github/` …). إن نشرت مستودعاً أوسع،
  طابِق `basePath` في `jprot.config.js` مع المسار الفعلي للمشروع.
- تغيّر اسم المستودع أو اسم الحساب ⇐ غيّر `url` و `basePath` معاً في
  `jprot.config.js` (يُعاد توليد canonical و sitemap و hreflang تلقائياً).
- GitHub Pages يقدّم الموقع بـ HTTPS، و`http://` يُعاد توجيهه إليه — لذلك
  `url` مضبوط على `https://moaaz-i.github.io`.

---

## حقوق النشر / License

محتوى الموقع مفتوح للنشر مع الإسناد · Site content is open to share with
attribution.

/**
 * نُور — موقع تعريفي ثنائي اللغة (عربي / إنجليزي) لتعريف الإسلام وتعليمه.
 *
 * اللغة الافتراضية عربية (RTL). اللغة الإنجليزية تعيش تحت /en/ والعربية تحت
 * /ar/، والتنقل بينهما يتم عبر المكوّنات في theme/components وعبر الـ plugin
 * في plugins/i18n.js الذي يضبط lang/dir و hreflang في كل صفحة.
 *
 * @type {import('jprot').JprotConfig}
 */
export default {
  title: 'نُور — تعرّف على الإسلام',
  tagline: 'منصة تعريف الإسلام وتعليمه',
  description:
    'موقع نُور: مقدمة شاملة للإسلام وأساليب تعليمه — الأركان، العقيدة، القرآن والسنة، السيرة، الأخلاق، التاريخ والحضارة، مع مسار تعلّم واختبار تفاعلي ومعجم مصطلحات، بالعربية والإنجليزية.',

  // عنوان النشر على GitHub Pages. الأصل (url) وحده هنا، ومسار المستودع في
  // basePath — يجمعهما jprot تلقائياً في canonical و sitemap و hreflang:
  //   https://moaaz-i.github.io + /Noor  →  https://moaaz-i.github.io/Noor
  // غيّر الاثنين معاً إن غيّرت اسم المستودع أو اسم حسابك.
  url: 'https://moaaz-i.github.io',
  basePath: '/Noor',

  // لغة الموقع الافتراضية: عربية RTL. صفحات الإنجليزية تُضبط عبر plugin.
  lang: 'ar',
  dir: 'rtl',

  author: 'فريق نُور',
  email: 'salam@example.com',

  themeColor: '#0f766e',
  ogColor: '#0f766e',
  ogTextColor: '#ffffff',

  // نصوص الواجهة العالمية (بحث + صفحة غير موجودة) بالعربية؛
  // plugin/i18n.js يترجمها داخل صفحات /en/.
  labels: {
    searchPlaceholder: 'ابحث في صفحات الموقع…',
    searchEmpty: 'لا توجد نتائج',
    pageNotFound: 'الصفحة غير موجودة',
    backToHome: 'العودة إلى',
    home: 'الرئيسية',
    onThisPage: 'في هذه الصفحة',
    all: 'الكل',
    details: 'التفاصيل',
    projects: 'المشاريع',
    blog: 'المقالات',
    noPosts: 'لا توجد مقالات بعد.',
    liveDemo: 'زيارة',
    source: 'المصدر',
    printResume: 'تحميل / طباعة',
    resumeExperience: 'الخبرات',
    resumeEducation: 'التعليم',
    resumeSkills: 'المهارات',
  },

  footerText: '© نُور — منصة تعريف الإسلام. محتوى مفتوح للنشر مع الإسناد.',

  // لا توجد أقسام عامة مشتركة بين اللغتين: كل صفحة تبني أقسامها بنفسها.
  sections: [],

  social: [],

  plugins: ['./plugins/i18n.js'],
}

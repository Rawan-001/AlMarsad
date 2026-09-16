export type Locale = "ar" | "en";
export const LOCALE_COOKIE = "marsad_lang";
export const defaultLocale: Locale = "en";

const ar = {
  siteTitle: "المرصد الجامعي للإنتاج العلمي والابتكاري في الذكاء الاصطناعي",
  siteSubtitle: "جامعة الباحة",
  navDashboard: "المؤشرات",
  navResearch: "الإنتاج البحثي",
  navResearchers: "الباحثون",
  langToggle: "English",
  footerDisclaimer:
    "بيانات أولية من Web of Science Core Collection حتى 16 سبتمبر 2026، قبل المراجعة اليدوية. استُبعدت 14 سجلًا: مكررة، أو مسحوبة، أو تصحيحات، أو افتتاحيات.",

  dashboardTitle: "مؤشرات الذكاء الاصطناعي في جامعة الباحة",
  dashboardSubtitle: "نظرة عامة على الإنتاج البحثي في مجالات الذكاء الاصطناعي، مستخرجة من Web of Science.",
  statTotalPapers: "عدد الأبحاث",
  statTotalPapersHint: "{pct}% من إنتاج الجامعة في WoS ({total})",
  statTotalCitations: "مجموع الاستشهادات",
  statTotalCitationsHint: "متوسط {mean} للبحث",
  statSince2020: "أبحاث منذ 2020",
  statOpenAccess: "نسبة الوصول المفتوح",
  statOpenAccessHint: "{n} بحثًا",
  statAuthorNames: "أسماء مؤلفين من الجامعة",
  statAuthorNamesHint: "أولية – غير موحّدة",
  statDocTypesTitle: "أنواع النشر",
  statDocTypesArticles: "مقالات",
  statDocTypesReviews: "مراجعات",
  statDocTypesProceedings: "أوراق مؤتمرات",

  chartByYear: "التطور السنوي لعدد الأبحاث",
  chartByYearNote: "{year} حتى 16 سبتمبر",
  chartByBranch: "فروع الذكاء الاصطناعي",
  chartByBranchNote: "البحث الواحد قد يندرج تحت أكثر من فرع.",
  chartByCollege: "التوزيع حسب الكلية (تقريبي)",
  chartByCollegeNote: "تصنيف تقريبي من عناوين المؤلفين، والبحث قد يُحسب في أكثر من كلية.",

  researchTitle: "الإنتاج البحثي",
  researchCount: "{n} بحث",
  topCitedTitle: "الأكثر استشهادًا",
  megaConsortiumBadge: "دراسة تعاونية ضخمة (+100 مؤلف)",
  filterSearchLabel: "بحث بالعنوان",
  filterSearchPlaceholder: "اكتب كلمة من العنوان...",
  filterBranchLabel: "الفرع",
  filterDomainLabel: "مجال التطبيق",
  filterDocTypeLabel: "نوع الوثيقة",
  filterYearLabel: "سنة النشر",
  filterYearPlaceholder: "مثلاً 2024",
  filterSortLabel: "الترتيب",
  sortRecent: "الأحدث",
  sortCited: "الأكثر استشهادًا",
  filterAll: "الكل",
  filterSubmit: "تصفية",
  filterClear: "مسح التصفية",
  tableTitle: "العنوان",
  tableYear: "السنة",
  tableJournal: "المجلة",
  tableBranch: "الفرع",
  tableCitations: "الاستشهادات",
  tableDoi: "DOI",
  viewDoi: "عرض DOI",
  noResults: "لا توجد نتائج مطابقة",
  backToResearch: "→ العودة إلى الإنتاج البحثي",
  paperAuthorsHeading: "الباحثون من جامعة الباحة",
  abstractHeading: "الملخص",
  fieldApplicationDomain: "مجال التطبيق",

  researchersTitle: "الباحثون",
  researchersApproxCount: "أكثر من {n} اسم مؤلف من جامعة الباحة",
  allResearchersTitle: "جميع الباحثين",
  searchByName: "بحث بالاسم",
  searchByNamePlaceholder: "اكتب اسم الباحث...",
  searchSubmit: "بحث",
  colName: "الاسم",
  colPapers: "عدد الأبحاث",
  colBranches: "الفروع",
  colDepartment: "القسم",
  departmentsTitle: "توزيع الأبحاث على الأقسام",
  researchersDisclaimer:
    "الأسماء والأقسام أولية كما وردت في البحث، ولم تُوحَّد بعد مع بيانات الجامعة أو ORCID. لا تُعرض بيانات شخصية غير الاسم.",
  backToResearchers: "→ العودة إلى الباحثين",
  researcherPapersHeading: "الأبحاث",
  researcherDeptHeading: "الأقسام",
  researcherBranchHeading: "الفروع",

  paginationPrev: "السابق",
  paginationNext: "التالي",
  paginationPage: "صفحة {page} من {total}",
};

const en: Record<keyof typeof ar, string> = {
  siteTitle: "Al Marsad University for Scientific and Innovative Production in Artificial Intelligence",
  siteSubtitle: "Al Baha University",
  navDashboard: "Dashboard",
  navResearch: "Research Output",
  navResearchers: "Researchers",
  langToggle: "العربية",
  footerDisclaimer:
    "Preliminary data from the Web of Science Core Collection as of 16 September 2026, pending manual review. 14 records were excluded: duplicates, retracted papers, corrections, or editorials.",

  dashboardTitle: "AI Indicators at Al Baha University",
  dashboardSubtitle: "Overview of AI-related research output, extracted from Web of Science.",
  statTotalPapers: "Papers",
  statTotalPapersHint: "{pct}% of university output in WoS ({total})",
  statTotalCitations: "Total Citations",
  statTotalCitationsHint: "Mean of {mean} per paper",
  statSince2020: "Papers since 2020",
  statOpenAccess: "Open Access Share",
  statOpenAccessHint: "{n} papers",
  statAuthorNames: "Author Names from the University",
  statAuthorNamesHint: "Preliminary — not yet unified",
  statDocTypesTitle: "Publication Types",
  statDocTypesArticles: "Articles",
  statDocTypesReviews: "Reviews",
  statDocTypesProceedings: "Conference Papers",

  chartByYear: "Yearly Evolution of Publications",
  chartByYearNote: "{year} as of 16 September",
  chartByBranch: "AI Branches",
  chartByBranchNote: "A paper may fall under more than one branch.",
  chartByCollege: "Distribution by College (Approximate)",
  chartByCollegeNote: "Approximate classification from author addresses; a paper may be counted under more than one college.",

  researchTitle: "Research Output",
  researchCount: "{n} papers",
  topCitedTitle: "Most Cited",
  megaConsortiumBadge: "Large consortium study (100+ authors)",
  filterSearchLabel: "Search by title",
  filterSearchPlaceholder: "Type a word from the title...",
  filterBranchLabel: "Branch",
  filterDomainLabel: "Application Domain",
  filterDocTypeLabel: "Document Type",
  filterYearLabel: "Publication year",
  filterYearPlaceholder: "e.g. 2024",
  filterSortLabel: "Sort by",
  sortRecent: "Most Recent",
  sortCited: "Most Cited",
  filterAll: "All",
  filterSubmit: "Filter",
  filterClear: "Clear filters",
  tableTitle: "Title",
  tableYear: "Year",
  tableJournal: "Journal",
  tableBranch: "Branch",
  tableCitations: "Citations",
  tableDoi: "DOI",
  viewDoi: "View DOI",
  noResults: "No matching results",
  backToResearch: "→ Back to Research Output",
  paperAuthorsHeading: "Al Baha Researchers",
  abstractHeading: "Abstract",
  fieldApplicationDomain: "Application Domain",

  researchersTitle: "Researchers",
  researchersApproxCount: "More than {n} author names from Al Baha University",
  allResearchersTitle: "All Researchers",
  searchByName: "Search by name",
  searchByNamePlaceholder: "Type a researcher's name...",
  searchSubmit: "Search",
  colName: "Name",
  colPapers: "Papers",
  colBranches: "Branches",
  colDepartment: "Department",
  departmentsTitle: "Papers by Department",
  researchersDisclaimer:
    "Names and departments are preliminary, as written in the paper, and have not yet been unified with university records or ORCID. No personal data beyond the name is shown.",
  backToResearchers: "→ Back to Researchers",
  researcherPapersHeading: "Papers",
  researcherDeptHeading: "Departments",
  researcherBranchHeading: "Branches",

  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPage: "Page {page} of {total}",
};

export const dictionaries: Record<Locale, typeof ar> = { ar, en };
export type DictKey = keyof typeof ar;

export function t(locale: Locale, key: DictKey, vars?: Record<string, string | number>): string {
  let text = dictionaries[locale][key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

const BRANCH_AR: Record<string, string> = {
  "Core AI & ML": "الذكاء الاصطناعي وتعلم الآلة",
  "Deep Learning & NN": "التعلم العميق والشبكات العصبية",
  "NLP & Generative AI": "معالجة اللغات الطبيعية والذكاء التوليدي",
  "Computer Vision & Pattern Recognition": "الرؤية الحاسوبية والتعرف على الأنماط",
  "Computational Intelligence": "الذكاء الحسابي والخوارزميات التطورية",
  "Knowledge & Reasoning": "تمثيل المعرفة والاستدلال",
  "Agents & Robotics": "الوكلاء الأذكياء والروبوتات",
  "Responsible AI & XAI": "الذكاء الاصطناعي المسؤول والقابل للتفسير",
  "Speech & Audio AI": "معالجة الكلام",
  "Recommender Systems": "أنظمة التوصية",
  "Ambient Intelligence": "الذكاء المحيطي",
  "Tier C (ambiguous)": "غير محدد (يحتاج مراجعة)",
};

const COLLEGE_GROUP_AR: Record<string, string> = {
  "Computing & IT": "الحاسب وتقنية المعلومات",
  Engineering: "الهندسة",
  Science: "العلوم",
  "Medicine & Health": "الطب والصحة",
  "Education & Humanities": "التربية والآداب",
  "Business & Administration": "إدارة الأعمال",
  Unspecified: "غير محدد",
};

const DOMAIN_AR: Record<string, string> = {
  "Computing & ICT": "الحوسبة وتقنية المعلومات",
  "Engineering, Energy & Materials": "الهندسة والطاقة والمواد",
  "Health & Life Sciences": "الصحة وعلوم الحياة",
  "Natural Sciences & Mathematics": "العلوم الطبيعية والرياضيات",
  "Environment, Agriculture & Water": "البيئة والزراعة والمياه",
  "Education, Social Sciences & Business": "التعليم والعلوم الاجتماعية والأعمال",
  "Multidisciplinary Sciences": "علوم متعددة التخصصات",
  Unclassified: "غير مصنف",
};

const DOC_TYPE_AR: Record<string, string> = {
  Article: "مقالة",
  "Proceedings Paper": "ورقة مؤتمر",
  Review: "مراجعة علمية",
  "Article; Early Access": "مقالة (نشر مبكر)",
  "Article; Proceedings Paper": "مقالة / ورقة مؤتمر",
};

export function branchLabel(locale: Locale, nameEn: string): string {
  return locale === "ar" ? BRANCH_AR[nameEn] ?? nameEn : nameEn;
}

export function domainLabel(locale: Locale, domain: string): string {
  return locale === "ar" ? DOMAIN_AR[domain] ?? domain : domain;
}

export function docTypeLabel(locale: Locale, docType: string): string {
  return locale === "ar" ? DOC_TYPE_AR[docType] ?? docType : docType;
}

export function collegeGroupLabel(locale: Locale, group: string): string {
  return locale === "ar" ? COLLEGE_GROUP_AR[group] ?? group : group;
}

export function formatNumber(locale: Locale, n: number): string {
  return n.toLocaleString(locale === "ar" ? "ar" : "en-US");
}

export function formatDecimal(locale: Locale, n: number, digits = 1): string {
  return n.toLocaleString(locale === "ar" ? "ar" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

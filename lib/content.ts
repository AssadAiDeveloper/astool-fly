import data from "./data.json";

export type Lang = "ar" | "en";
export const LANGS: Lang[] = ["ar", "en"];
export const DEFAULT_LANG: Lang = "ar";
export type Bi = { ar: string; en: string };
export type Service = { key: string; icon: string; title: Bi; desc: Bi; tags?: Bi[] };
export type City = { slug: string; ar: string; en: string };
export type Slide = { key: string; image: string; credit: string; region: Bi; title: Bi };
export type Airline = { key: string; name: Bi; logo: string };

export const isLang = (v: string): v is Lang => v === "ar" || v === "en";
export const tr = (lang: Lang) => (ar: string, en: string) => (lang === "ar" ? ar : en);
export const dirOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");

export const CORE = data.core as Service[];
export const DOCS = data.docs as Service[];
export const EXTRAS = data.extras as Service[];
export const ALL_SERVICES: Service[] = [...CORE, ...DOCS, ...EXTRAS];
export const STEPS = data.steps as { title: Bi; desc: Bi }[];
export const FAQ = data.faq as { q: Bi; a: Bi }[];
export const DOMESTIC = data.domestic as City[];
export const SAUDI = data.saudi as City[];
export const OMAN = data.oman as City[];
export const ALL_CITIES: City[] = [...DOMESTIC, ...SAUDI, ...OMAN];
export const ICONS = data.icons as Record<string, string>;
export const SLIDES = data.slides as Slide[];
export const AIRLINES = data.airlines as Airline[];

export { YEMEN_GOVERNORATES, COUNTRY_GROUPS } from "./destinations";
export type { CountryGroup } from "./destinations";

export type PageKey = "home" | "transport" | "routes" | "visas" | "more" | "contact" | "request";
export const PAGES: { key: PageKey; path: string; nav: Bi; title: Bi; desc: Bi }[] = [
  {
    key: "home", path: "", nav: { ar: "الرئيسية", en: "Home" },
    title: { ar: "أسطول فلاي | مكتب سفريات في اليمن: نقل وطرود وتأشيرات", en: "Astool Fly | Travel office in Yemen: transport, parcels and visas" },
    desc: { ar: "من المكلا، اليمن منذ 2013: كل خدمات السفر في مكان واحد — تذاكر وفنادق، نقل وطرود، تأشيرات وجوازات، ومساعدة أينما كنت في العالم.", en: "From Al-Mukalla, Yemen since 2013: all travel services in one place — flights, hotels, transport, parcels, visas and passports, with help wherever you are." },
  },
  {
    key: "transport", path: "transport", nav: { ar: "النقل والطرود", en: "Transport & parcels" },
    title: { ar: "النقل والطرود في اليمن | أسطول فلاي", en: "Transport and parcels in Yemen | Astool Fly" },
    desc: { ar: "نقل داخلي بين المدن اليمنية، نقل دولي إلى السعودية وعُمان، سيارات خاصة وباصات هايس، وإرسال الطرود داخل اليمن وإلى السعودية.", en: "Domestic transport between Yemeni cities, international transport to Saudi Arabia and Oman, private cars, HiAce buses, and parcels within Yemen and to Saudi Arabia." },
  },
  {
    key: "routes", path: "routes", nav: { ar: "الخطوط", en: "Routes" },
    title: { ar: "خطوط السفر من اليمن إلى السعودية وعُمان | أسطول فلاي", en: "Travel routes from Yemen to Saudi Arabia and Oman | Astool Fly" },
    desc: { ar: "الوجهات: عدن، إب، تعز، الحديدة، المكلا، المهرة، سيئون، المخا وغيرها داخل اليمن، ومكة وجدة والرياض والمدينة المنورة ومسقط وصلالة خارجه.", en: "Destinations: Aden, Ibb, Taiz, Al-Hudaydah, Mukalla, Al-Mahrah, Seiyun, Mokha and more in Yemen, plus Makkah, Jeddah, Riyadh, Madinah, Muscat and Salalah abroad." },
  },
  {
    key: "visas", path: "visas", nav: { ar: "التأشيرات والجوازات", en: "Visas & passports" },
    title: { ar: "تأشيرات العمرة وشرق آسيا وإصدار الجوازات | أسطول فلاي", en: "Umrah and East Asia visas, passports | Astool Fly" },
    desc: { ar: "تجهيز ومتابعة طلبات تأشيرات العمرة وتفويض الزيارات العائلية وتأشيرات شرق آسيا (عبور وزيارة وسياحة) وإصدار الجوازات وتجديدها.", en: "Preparing and following up Umrah visas, family-visit authorizations, East Asia visas (transit, visit, tourism) and passport issue and renewal." },
  },
  {
    key: "more", path: "more", nav: { ar: "خدمات أخرى", en: "More services" },
    title: { ar: "خدمات سفر أخرى: تذاكر وفنادق وسياحة وسفر علاجي | أسطول فلاي", en: "More travel services: tickets, hotels, tourism, medical travel | Astool Fly" },
    desc: { ar: "تذاكر طيران، حجز فنادق، برامج سياحية، ترتيب السفر للعلاج والدراسة. أخبر المكتب بما تحتاجه.", en: "Flight tickets, hotel booking, tourism programs, and travel arrangements for treatment and study. Tell the office what you need." },
  },
  {
    key: "contact", path: "contact", nav: { ar: "تواصل", en: "Contact" },
    title: { ar: "تواصل مع أسطول فلاي وأسئلة شائعة", en: "Contact Astool Fly and common questions" },
    desc: { ar: "تواصل مع مكتب أسطول فلاي عبر واتساب، وإجابات عن أسئلة شائعة حول الطلبات والمستندات والأسعار.", en: "Contact the Astool Fly office on WhatsApp, with answers to common questions about requests, documents and prices." },
  },
  {
    key: "request", path: "request", nav: { ar: "طلب خدمة", en: "Request a service" },
    title: { ar: "اطلب خدمة سفر عبر واتساب | أسطول فلاي", en: "Request a travel service on WhatsApp | Astool Fly" },
    desc: { ar: "اختر الخدمة واكتب تفاصيلك، ونجهز رسالة واتساب جاهزة ترسلها إلى مكتب أسطول فلاي.", en: "Pick the service and add your details; we prepare a WhatsApp message to send to the Astool Fly office." },
  },
];
export const NAV_PAGES = PAGES.filter((p) => p.key !== "request");
export const pageByKey = (k: PageKey) => PAGES.find((p) => p.key === k)!;

/** Curated landmark sets per page; the home set keeps its original slides. */
export type HeroPageKey = PageKey;
export const HERO_SETS = data.heroSets as Record<HeroPageKey, string[]>;
export const slidesFor = (page: HeroPageKey): Slide[] =>
  (HERO_SETS[page] ?? []).map((key) => SLIDES.find((s) => s.key === key)).filter((s): s is Slide => !!s);

export const pathFor = (lang: Lang, path: string) => `/${lang}/${path ? path + "/" : ""}`;

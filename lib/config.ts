// ===== Office settings: update when details change, then rebuild. =====
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");

/** GitHub Pages serves project sites under /<repo>; custom domains keep this empty. */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Prefix a path from /public with the deployment base path. */
export const assetPath = (path: string) => `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;

/** Remove the base path from usePathname() so language/nav logic keeps working. */
export const stripBasePath = (path: string) =>
  BASE_PATH && (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`))
    ? path.slice(BASE_PATH.length) || "/"
    : path;

const SALES_WHATSAPP = "967773434881";
const COMPLAINTS_WHATSAPP = "967733166552";

export type CustomerServiceCountry = {
  key: string;
  ar: string;
  en: string;
  flag: string;
  /** WhatsApp digits with country code. Empty = shown as "To be added" until supplied. */
  whatsapp: string;
};

/** Country-specific WhatsApp support. Fill these in when the office sends the separate numbers. */
export const CUSTOMER_SERVICE: CustomerServiceCountry[] = [
  { key: "malaysia", ar: "ماليزيا", en: "Malaysia", flag: "/flags/my.png", whatsapp: "" },
  { key: "egypt", ar: "مصر", en: "Egypt", flag: "/flags/eg.png", whatsapp: "" },
  { key: "uae", ar: "الإمارات", en: "UAE", flag: "/flags/ae.png", whatsapp: "" },
  { key: "europe", ar: "أوروبا", en: "Europe", flag: "/flags/eu.png", whatsapp: "" },
  { key: "indonesia", ar: "إندونيسيا", en: "Indonesia", flag: "/flags/id.png", whatsapp: "" },
];

export type PaymentMethod = {
  key: string;
  ar: string;
  en: string;
  kind: "bank" | "wallet";
  /** Logo path in /public, e.g. /payments/one-cash.png */
  logo: string;
};

/** Payment methods accepted by the office. */
export const PAYMENTS: PaymentMethod[] = [
  { key: "kuraimi", ar: "بنك الكريمي", en: "Al-Kuraimi Bank", kind: "bank", logo: "/payments/kuraimi.png" },
  { key: "onecash", ar: "محفظة ون كاش", en: "One Cash Wallet", kind: "wallet", logo: "/payments/one-cash.png" },
  { key: "qutabi", ar: "بنك القطيبي", en: "Al-Qutaibi Bank", kind: "bank", logo: "/payments/qutabi.png" },
];

export const OFFICE = {
  nameEn: "Astool Fly",
  nameAr: "أسطول فلاي",
  /** Sales WhatsApp, digits only with country code. Used by the request form and the floating button. */
  whatsapp: SALES_WHATSAPP,
  whatsappSales: SALES_WHATSAPP,
  whatsappComplaints: COMPLAINTS_WHATSAPP,
  /** Display phone as supplied by the office. tel: links are normalized by telLink(). */
  phone: "009671601268",
  address: {
    ar: "اليمن، صنعاء، شارع الستنين الجنوبي، بجانب فندق القصر الذهبي، مقابل فتحة القادسية",
    en: "Yemen, Sana'a, Al-Sittin Street South, next to Al-Qasr Al-Dahabi Hotel, opposite Al-Qadisiyah Junction",
  },
  hours: { ar: "يومياً، 8:00 صباحاً – 10:00 مساءً", en: "Daily, 8:00 AM – 10:00 PM" },
};

/** Full profile URLs. Empty = the footer icon is shown but not linked until the office supplies it. */
export const SOCIAL = {
  facebook: "https://www.facebook.com/profile.php?id=61596754205403",
  instagram: "https://www.instagram.com/astoolfly/",
  tiktok: "https://www.tiktok.com/@astoolfly?lang=en",
  linkedin: "",
};

/** Build a wa.me link. Accepts numbers with or without a leading 00. */
export function waLink(number: string, text?: string): string {
  const digits = number.replace(/\D/g, "").replace(/^00/, "");
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Build a tel: link from 00..., +... or a local Yemeni number. */
export function telLink(number: string): string {
  const cleaned = number.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
  if (/^0\d+/.test(cleaned)) return `+967${cleaned.slice(1)}`;
  return cleaned;
}

/** Normalize an international number (with or without 00) for structured data. */
export function dialNumber(number: string): string {
  return `+${number.replace(/\D/g, "").replace(/^00/, "")}`;
}

/** Display a Yemeni mobile in groups; leaves other numbers as supplied. */
export function displayPhone(number: string): string {
  const digits = number.replace(/\D/g, "").replace(/^00/, "");
  if (/^967\d{9}$/.test(digits)) {
    return `+967 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return number;
}

import type { Metadata } from "next";
import { CUSTOMER_SERVICE, SITE_URL, OFFICE, assetPath, dialNumber, telLink } from "./config";
import { CORE, DOCS, EXTRAS, FAQ, LANGS, type Lang, pageByKey, pathFor, type PageKey, tr } from "./content";

const abs = (p: string) => `${SITE_URL}${p}`;

export function buildMetadata(lang: Lang, key: PageKey): Metadata {
  const page = pageByKey(key);
  const url = abs(pathFor(lang, page.path));
  const languages: Record<string, string> = Object.fromEntries(LANGS.map((l) => [l, abs(pathFor(l, page.path))]));
  languages["x-default"] = abs(pathFor("ar", page.path));
  return {
    metadataBase: new URL(SITE_URL),
    title: page.title[lang],
    description: page.desc[lang],
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      siteName: lang === "ar" ? OFFICE.nameAr : OFFICE.nameEn,
      title: page.title[lang],
      description: page.desc[lang],
      locale: lang === "ar" ? "ar_AR" : "en_US",
      alternateLocale: lang === "ar" ? ["en_US"] : ["ar_AR"],
      images: [{ url: abs("/og.png"), width: 1200, height: 630, alt: "Astool Fly | أسطول فلاي" }],
    },
    twitter: { card: "summary_large_image", title: page.title[lang], description: page.desc[lang], images: [abs("/og.png")] },
    icons: { icon: assetPath("/favicon.png") },
    robots: { index: true, follow: true },
  };
}

export function orgJsonLd(lang: Lang) {
  const t = tr(lang);
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": abs("/#organization"),
    name: lang === "ar" ? OFFICE.nameAr : OFFICE.nameEn,
    alternateName: lang === "ar" ? OFFICE.nameEn : OFFICE.nameAr,
    url: abs(pathFor(lang, "")),
    logo: abs("/logo-en.webp"),
    image: abs("/og.png"),
    description: t(
      "مكتب سفريات يمني تأسس في صنعاء عام 2013: تذاكر وفنادق، نقل وطرود، تأشيرات وجوازات، ومساعدة أينما كنت في العالم.",
      "Yemeni travel office founded in Sana'a in 2013: flights, hotels, transport, parcels, visas and passports, with help wherever you are."
    ),
    foundingDate: "2013",
    foundingLocation: { "@type": "City", name: lang === "ar" ? "صنعاء" : "Sana'a" },
    knowsLanguage: ["ar", "en"],
    areaServed: [
      ...["Yemen", "Saudi Arabia", "Oman"].map((n) => ({ "@type": "Country", name: n })),
      { "@type": "Place", name: "Worldwide" },
    ],
    ...(OFFICE.phone ? { telephone: telLink(OFFICE.phone) } : {}),
    ...(OFFICE.whatsappSales || OFFICE.whatsappComplaints || CUSTOMER_SERVICE.some((c) => c.whatsapp)
      ? {
          contactPoint: [
            ...(OFFICE.whatsappSales
              ? [{ "@type": "ContactPoint", contactType: "sales", telephone: dialNumber(OFFICE.whatsappSales), availableLanguage: ["Arabic", "English"] }]
              : []),
            ...(OFFICE.whatsappComplaints
              ? [{ "@type": "ContactPoint", contactType: "complaints", telephone: dialNumber(OFFICE.whatsappComplaints), availableLanguage: ["Arabic", "English"] }]
              : []),
            ...CUSTOMER_SERVICE.filter((c) => c.whatsapp).map((c) => ({
              "@type": "ContactPoint",
              contactType: "customer service",
              telephone: dialNumber(c.whatsapp),
              areaServed: c.en,
              availableLanguage: ["Arabic", "English"],
            })),
          ],
        }
      : {}),
    ...(OFFICE.address[lang] ? { address: { "@type": "PostalAddress", streetAddress: OFFICE.address[lang], addressCountry: "YE" } } : {}),
    makesOffer: [...CORE, ...DOCS, ...EXTRAS].map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title[lang], description: s.desc[lang] },
    })),
  };
}

export function breadcrumbJsonLd(lang: Lang, key: PageKey) {
  const page = pageByKey(key);
  const home = pageByKey("home");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: home.nav[lang], item: abs(pathFor(lang, "")) },
      { "@type": "ListItem", position: 2, name: page.nav[lang], item: abs(pathFor(lang, page.path)) },
    ],
  };
}

export function faqJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q[lang], acceptedAnswer: { "@type": "Answer", text: f.a[lang] } })),
  };
}

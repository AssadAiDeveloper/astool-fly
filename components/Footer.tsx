import Link from "next/link";
import { NAV_PAGES, pathFor, tr, type Lang } from "../lib/content";
import { OFFICE, SOCIAL, assetPath, displayPhone, telLink, waLink } from "../lib/config";
import { reqHref } from "./Blocks";
import { Arrow, ContactIcon, type ContactIconKind, WhatsAppIcon } from "./Icon";
import CustomerService from "./CustomerService";
import PaymentMethods from "./PaymentMethods";
import SocialIcon, { type SocialName } from "./SocialIcon";
import AirlinesStrip from "./AirlinesStrip";

type FooterLink = { key: string; ar: string; en: string };

export default function Footer({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const other: Lang = lang === "ar" ? "en" : "ar";
  const waHref = OFFICE.whatsapp ? waLink(OFFICE.whatsapp) : pathFor(lang, "request");
  const tbd = t("سيُضاف قريباً", "To be added");

  const quick: FooterLink[] = [
    { key: "domestic", ar: "نقل داخلي", en: "Domestic transport" },
    { key: "international", ar: "نقل دولي", en: "International transport" },
    { key: "parcel", ar: "إرسال الطرود", en: "Parcel delivery" },
    { key: "umrah", ar: "تأشيرة العمرة", en: "Umrah visas" },
    { key: "passport", ar: "الجوازات", en: "Passports" },
    { key: "flight", ar: "تذاكر الطيران", en: "Flights" },
  ];

  const contact: { label: string; value: string; href?: string; ltr?: boolean; external?: boolean; icon?: ContactIconKind }[] = [
    {
      label: t("اتصال المبيعات", "Sales call"),
      value: OFFICE.whatsappSales ? displayPhone(OFFICE.whatsappSales) : "",
      href: OFFICE.whatsappSales ? `tel:${telLink(OFFICE.whatsappSales)}` : undefined,
      ltr: true,
      icon: "call",
    },
    {
      label: t("واتساب المبيعات", "Sales WhatsApp"),
      value: OFFICE.whatsappSales ? displayPhone(OFFICE.whatsappSales) : "",
      href: OFFICE.whatsappSales ? waLink(OFFICE.whatsappSales) : undefined,
      ltr: true,
      external: true,
      icon: "whatsapp",
    },
    {
      label: t("واتساب الشكاوى", "Complaints WhatsApp"),
      value: OFFICE.whatsappComplaints ? displayPhone(OFFICE.whatsappComplaints) : "",
      href: OFFICE.whatsappComplaints ? waLink(OFFICE.whatsappComplaints) : undefined,
      ltr: true,
      external: true,
      icon: "whatsapp",
    },
    {
      label: t("الهاتف الثابت", "Landline"),
      value: OFFICE.phone,
      href: OFFICE.phone ? `tel:${telLink(OFFICE.phone)}` : undefined,
      ltr: true,
      icon: "landline",
    },
    { label: t("العنوان", "Address"), value: OFFICE.address[lang] },
    { label: t("ساعات العمل", "Opening hours"), value: OFFICE.hours[lang] },
  ];

  const social: { key: SocialName; label: string; href: string }[] = [
    { key: "facebook", label: "Facebook", href: SOCIAL.facebook },
    { key: "instagram", label: "Instagram", href: SOCIAL.instagram },
    { key: "tiktok", label: "TikTok", href: SOCIAL.tiktok },
    { key: "linkedin", label: "LinkedIn", href: SOCIAL.linkedin },
  ];

  return (
    <>
      <AirlinesStrip lang={lang} />
      <footer>
        <div className="wrap ft-main">
          <div className="ft-brand">
            <Link href={pathFor(lang, "")} aria-label={t("أسطول فلاي | الرئيسية", "Astool Fly | Home")}>
              <img src={assetPath(`/logo-${lang}.webp`)} alt={t("أسطول فلاي", "Astool Fly")} width={138} height={46} />
            </Link>
            <p>{t("مكتب سفريات في اليمن للنقل داخلياً ودولياً، وإرسال الطرود، وتجهيز التأشيرات والجوازات.", "A travel office in Yemen for domestic and international transport, parcels, visas and passports.")}</p>
            <Link className="btn orange" href={pathFor(lang, "request")}>
              {t("اطلب خدمة", "Request a service")}
            </Link>
            <div className="ft-social">
              <span className="ft-social-label">{t("تابعنا", "Follow us")}</span>
              <div className="ft-social-list">
                {social.map((s) => s.href ? (
                  <a key={s.key} href={s.href} target="_blank" rel="noopener" aria-label={s.label} title={s.label}>
                    <SocialIcon name={s.key} />
                  </a>
                ) : (
                  <span key={s.key} className="off" role="img" aria-label={`${s.label} — ${tbd}`} title={`${s.label} — ${tbd}`}>
                    <SocialIcon name={s.key} />
                  </span>
                ))}
              </div>
              <PaymentMethods lang={lang} variant="footer" />
            </div>
          </div>

          <div className="ft-col">
            <h2>{t("استكشف", "Explore")}</h2>
            <ul>
              {NAV_PAGES.map((p) => (
                <li key={p.key}>
                  <Link href={pathFor(lang, p.path)}>{p.nav[lang]}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-col">
            <h2>{t("خدمات سريعة", "Quick services")}</h2>
            <ul>
              {quick.map((s) => (
                <li key={s.key}>
                  <Link href={reqHref(lang, s.key)}>
                    {s[lang]} <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-col">
            <h2>{t("تواصل", "Contact")}</h2>
            <ul className="ft-contact">
              {contact.map((c) => (
                <li key={c.label}>
                  <small>{c.label}</small>
                  {c.value ? (
                    <strong dir={c.ltr ? "ltr" : undefined}>
                      {c.icon && <ContactIcon kind={c.icon} />}
                      {c.href ? (
                        <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener" } : {})}>
                          {c.value}
                        </a>
                      ) : c.value}
                    </strong>
                  ) : (
                    <strong className="tbd">{tbd}</strong>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-cs">
            <h2>{t("خدمة العملاء حسب الدولة", "Customer service by country")}</h2>
            <CustomerService lang={lang} variant="footer" />
          </div>
        </div>

        <div className="wrap ft-bottom">
          <span>© 2026 {t("أسطول فلاي", "Astool Fly")}</span>
          <span>{t("نقل · طرود · تأشيرات · جوازات", "Transport · Parcels · Visas · Passports")}</span>
          <Link
            className="ft-lang"
            href={pathFor(other, "")}
            hrefLang={other}
            lang={other}
            aria-label={lang === "ar" ? "التبديل إلى الإنجليزية" : "Switch to Arabic"}
          >
            {other === "en" ? "English" : "العربية"}
          </Link>
        </div>
      </footer>

      <a
        className="wa"
        href={waHref}
        {...(OFFICE.whatsapp ? { target: "_blank", rel: "noopener" } : {})}
        aria-label={t("واتساب", "WhatsApp")}
      >
        <WhatsAppIcon />
        <span>{t("واتساب", "WhatsApp")}</span>
      </a>
    </>
  );
}

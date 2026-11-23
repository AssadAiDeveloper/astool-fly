import { CUSTOMER_SERVICE, assetPath, displayPhone, waLink } from "../lib/config";
import { tr, type Lang } from "../lib/content";
import { WhatsAppIcon } from "./Icon";

/** Flags + WhatsApp links for country-specific customer service. Numbers are added in lib/config.ts. */
export default function CustomerService({ lang, variant = "page" }: { lang: Lang; variant?: "page" | "footer" }) {
  const t = tr(lang);
  const waLabel = t("واتساب", "WhatsApp");

  if (variant === "footer") {
    return (
      <ul className="cs-list">
        {CUSTOMER_SERVICE.map((c) => (
          <li key={c.key}>
            <img className="cs-flag" src={assetPath(c.flag)} alt="" aria-hidden="true" width={28} height={20} loading="lazy" />
            <span className="cs-name">{c[lang]}</span>
            {c.whatsapp && (
              <a className="cs-link" href={waLink(c.whatsapp)} target="_blank" rel="noopener" aria-label={`${waLabel} ${c[lang]}`}>
                <WhatsAppIcon />
                <span dir="ltr">{displayPhone(c.whatsapp)}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="cs-grid">
      {CUSTOMER_SERVICE.map((c) => (
        <article className="cc cs-card" key={c.key}>
          <img className="cs-flag" src={assetPath(c.flag)} alt="" aria-hidden="true" width={32} height={22} loading="lazy" />
          <div className="cs-text">
            <small>{t("خدمة عملاء", "Customer service")}</small>
            <strong>{c[lang]}</strong>
          </div>
          {c.whatsapp && (
            <a className="cs-link" href={waLink(c.whatsapp)} target="_blank" rel="noopener" aria-label={`${waLabel} ${c[lang]}`}>
              <WhatsAppIcon />
              <span dir="ltr">{displayPhone(c.whatsapp)}</span>
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

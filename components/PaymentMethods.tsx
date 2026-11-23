import { PAYMENTS } from "../lib/config";
import { tr, type Lang } from "../lib/content";

export default function PaymentMethods({ lang, variant = "page" }: { lang: Lang; variant?: "page" | "footer" }) {
  const t = tr(lang);

  if (variant === "footer") {
    return (
      <div className="pm-footer-wrap">
        <span className="pm-footer-label">{t("وسائل الدفع المتاحة", "Accepted payment methods")}</span>
        <div className="pm-footer" aria-label={t("وسائل الدفع المتاحة", "Accepted payment methods")}>
          {PAYMENTS.map((p) => (
            <span className="pm-footer-logo" key={p.key} title={p[lang]}>
              <img src={p.logo} alt={p[lang]} width={28} height={28} loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pm-grid">
      {PAYMENTS.map((p) => (
        <article className="cc pm-card" key={p.key}>
          <span className="pm-logo">
            <img src={p.logo} alt={p[lang]} width={48} height={48} loading="lazy" />
          </span>
          <div className="pm-text">
            <small>{p.kind === "bank" ? t("بنك", "Bank") : t("محفظة", "Wallet")}</small>
            <strong>{p[lang]}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

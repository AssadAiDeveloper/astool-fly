import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { PageHero } from "../../../components/Blocks";
import { ContactIcon, type ContactIconKind } from "../../../components/Icon";
import CustomerService from "../../../components/CustomerService";
import PaymentMethods from "../../../components/PaymentMethods";
import { FAQ, isLang, pathFor, tr } from "../../../lib/content";
import { OFFICE, displayPhone, telLink, waLink } from "../../../lib/config";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "../../../lib/seo";

type P = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? buildMetadata(lang, "contact") : {};
}

export default async function Page({ params }: P) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  const items: { label: string; value: string; ltr?: boolean; href?: string; external?: boolean; icon?: ContactIconKind }[] = [
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
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(lang, "contact")} />
      <JsonLd data={faqJsonLd(lang)} />
      <PageHero lang={lang} page="contact" title={t("تواصل مع أسطول فلاي", "Contact Astool Fly")} desc={t("أسرع طريقة هي رسالة واتساب من صفحة الطلب.", "The fastest way is a WhatsApp message from the request page.")} />
      <section className="contact">
        <div className="wrap">
          <div className="cgrid">
            {items.map((c) => (
              <div className="cc" key={c.label}>
                <small>{c.label}</small>
                {c.value ? (
                  <strong className="val" dir={c.ltr ? "ltr" : undefined}>
                    {c.icon && <ContactIcon kind={c.icon} />}
                    {c.href ? (
                      <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener" } : {})}>
                        {c.value}
                      </a>
                    ) : c.value}
                  </strong>
                ) : (
                  <strong className="tbd">{t("سيُضاف قريباً", "To be added")}</strong>
                )}
              </div>
            ))}
          </div>
          <div className="cs-block">
            <div className="shead"><h2>{t("خدمة العملاء حسب الدولة", "Customer service by country")}</h2></div>
            <CustomerService lang={lang} />
          </div>
          <div className="cs-block">
            <div className="shead"><h2>{t("وسائل الدفع المتاحة", "Accepted payment methods")}</h2></div>
            <PaymentMethods lang={lang} />
          </div>
          <div className="cta"><Link className="btn orange" href={pathFor(lang, "request")}>{t("اكتب طلبك", "Write your request")}</Link></div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="shead"><h2>{t("أسئلة شائعة", "Common questions")}</h2></div>
          <div className="faq">
            {FAQ.map((f, i) => (
              <details key={i}><summary>{f.q[lang]}</summary><p>{f.a[lang]}</p></details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

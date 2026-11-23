import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import RequestForm from "../../../components/RequestForm";
import { PageHero, StepsBox } from "../../../components/Blocks";
import { isLang, tr } from "../../../lib/content";
import { breadcrumbJsonLd, buildMetadata } from "../../../lib/seo";

type P = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? buildMetadata(lang, "request") : {};
}

export default async function Page({ params }: P) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(lang, "request")} />
      <PageHero lang={lang} page="request" title={t("طلب خدمة", "Request a service")} desc={t("اختر الخدمة واكتب تفاصيلك. نجهز لك رسالة تُرسل إلى المكتب عبر واتساب.", "Pick the service and add your details. We prepare a message you send to the office on WhatsApp.")} />
      <section><div className="wrap"><div className="req"><RequestForm lang={lang} /><StepsBox lang={lang} /></div></div></section>
    </>
  );
}

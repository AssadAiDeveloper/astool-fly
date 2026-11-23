import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { CtaBand, PageHero, ServiceCard } from "../../../components/Blocks";
import { CORE, isLang, pageByKey, tr } from "../../../lib/content";
import { breadcrumbJsonLd, buildMetadata } from "../../../lib/seo";

type P = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? buildMetadata(lang, "transport") : {};
}

export default async function Page({ params }: P) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(lang, "transport")} />
      <PageHero lang={lang} page="transport" title={pageByKey("transport").nav[lang]} desc={t("اختر الخدمة وسنجهز طلبك في صفحة الطلب.", "Choose a service and we fill in the request page for you.")} />
      <section><div className="wrap"><div className="grid4">{CORE.map((s) => <ServiceCard key={s.key} s={s} lang={lang} />)}</div></div></section>
      <CtaBand lang={lang} />
    </>
  );
}

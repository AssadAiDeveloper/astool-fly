import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { CtaBand, DocRow, PageHero, StepsBox } from "../../../components/Blocks";
import { DOCS, isLang, tr } from "../../../lib/content";
import { breadcrumbJsonLd, buildMetadata } from "../../../lib/seo";

type P = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? buildMetadata(lang, "visas") : {};
}

export default async function Page({ params }: P) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(lang, "visas")} />
      <PageHero lang={lang} page="visas" title={t("التأشيرات والجوازات", "Visas and passports")} desc={t("نجهز الطلب ونتابعه معك. المتطلبات تختلف بحسب الخدمة والوجهة ويؤكدها المكتب لحالتك.", "We prepare the request and follow it up with you. Requirements vary by service and destination, and the office confirms them for your case.")} />
      <section><div className="wrap"><div className="split">
        <div className="dlist">{DOCS.map((s) => <DocRow key={s.key} s={s} lang={lang} />)}</div>
        <StepsBox lang={lang} />
      </div></div></section>
      <CtaBand lang={lang} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { CtaBand, PageHero, ServiceCard } from "../../../components/Blocks";
import { EXTRAS, isLang, tr } from "../../../lib/content";
import { breadcrumbJsonLd, buildMetadata } from "../../../lib/seo";

type P = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? buildMetadata(lang, "more") : {};
}

export default async function Page({ params }: P) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(lang, "more")} />
      <PageHero lang={lang} page="more" title={t("خدمات سفر أخرى", "More travel services")} desc={t("للسياحة والعلاج والدراسة وغيرها. أخبر المكتب بما تحتاجه.", "For tourism, treatment, study and more. Tell the office what you need.")} />
      <section><div className="wrap"><div className="grid4">{EXTRAS.map((s) => <ServiceCard key={s.key} s={s} lang={lang} soft />)}</div></div></section>
      <CtaBand lang={lang} />
    </>
  );
}

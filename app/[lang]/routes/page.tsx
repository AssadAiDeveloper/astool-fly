import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { PageHero, RoutePanel } from "../../../components/Blocks";
import { DOMESTIC, OMAN, SAUDI, isLang, pageByKey, tr } from "../../../lib/content";
import { breadcrumbJsonLd, buildMetadata } from "../../../lib/seo";

type P = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? buildMetadata(lang, "routes") : {};
}

export default async function Page({ params }: P) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(lang, "routes")} />
      <PageHero lang={lang} page="routes" title={t("الخطوط والوجهات", "Routes and destinations")} desc={t("اضغط على المدينة لتنتقل إلى صفحة الطلب بوجهة محددة.", "Tap a city to go to the request page with that destination.")} />
      <section className="board" style={{ paddingBlock: "44px 64px" }}>
        <div className="wrap">
          <div className="panels">
            <RoutePanel lang={lang} svc="domestic" cities={DOMESTIC} title={t("داخل اليمن", "Within Yemen")} sub={t("نقل داخلي بين المدن", "Domestic transport between cities")} />
            <RoutePanel lang={lang} svc="international" cities={SAUDI} title={t("إلى السعودية", "To Saudi Arabia")} sub={t("نقل دولي", "International transport")} />
            <RoutePanel lang={lang} svc="international" cities={OMAN} title={t("إلى عُمان", "To Oman")} sub={t("نقل دولي", "International transport")} />
          </div>
          <p className="foot">{t("وجهتك غير مذكورة؟ اكتبها في صفحة الطلب واسأل المكتب.", "Your destination is not listed? Type it on the request page and ask the office.")}</p>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Arrow, Icon } from "../../components/Icon";
import HeroSlideshow from "../../components/HeroSlideshow";
import JsonLd from "../../components/JsonLd";
import { CtaBand, StepsBox, reqHref } from "../../components/Blocks";
import { ALL_CITIES, ALL_SERVICES, isLang, pathFor, slidesFor, tr } from "../../lib/content";
import { buildMetadata, orgJsonLd } from "../../lib/seo";

type P = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? buildMetadata(lang, "home") : {};
}

const QUICK = ["flight", "domestic", "international", "visas", "privatecar", "haicebus", "parcel", "passport"];

export default async function Home({ params }: P) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  const d = (s: string) => ({ "--d": s }) as CSSProperties;
  const tiles = [
    { path: "transport", icon: "bus", title: t("النقل والطرود", "Transport and parcels"), desc: t("نقل داخلي ودولي، سيارات خاصة وباصات هايس، وإرسال الطرود.", "Domestic and international transport, private cars, HiAce buses and parcels.") },
    { path: "routes", icon: "map", title: t("الخطوط والوجهات", "Routes and destinations"), desc: t("مدن اليمن والسعودية وعُمان التي نخدمها.", "The cities we serve in Yemen, Saudi Arabia and Oman.") },
    { path: "visas", icon: "passport", title: t("التأشيرات والجوازات", "Visas and passports"), desc: t("عمرة، تفويض زيارات عائلية، جوازات، وتأشيرات شرق آسيا.", "Umrah, family-visit authorizations, passports and East Asia visas.") },
    { path: "more", icon: "globe", title: t("خدمات سفر أخرى", "More travel services"), desc: t("تذاكر، فنادق، سياحة، سفر علاجي ودراسي.", "Tickets, hotels, tourism, medical and study travel.") },
  ];
  const ticker = ALL_CITIES.map((c) => <span className="item" key={c.slug}>{c[lang]}</span>);
  return (
    <>
      <JsonLd data={orgJsonLd(lang)} />
      <section className="hero dark">
        <HeroSlideshow lang={lang} slides={slidesFor("home")} />
        <div className="wrap">
          <div>
            <span className="eyebrow rise"><Icon name="plane" />{t("اليمن · السعودية · عُمان · أنحاء العالم", "Yemen · Saudi Arabia · Oman · Around the world")}</span>
            <h1 className="rise" style={d(".1s")}>{lang === "ar" ? <>نربط اليمن <em>بالعالم</em></> : <>Connecting Yemen <em>to the world</em></>}</h1>
            <p className="sub rise" style={d(".2s")}>{t("سفرك وشحنتك ووثائقك في مكتب واحد: نقل داخلي ودولي، طرود، تأشيرات وجوازات وخدمات سفر أخرى.", "Your trip, your parcel and your papers in one office: domestic and international transport, parcels, visas, passports and other travel services.")}</p>
            <div className="hcta rise" style={d(".3s")}>
              <Link className="btn orange pulse" href={pathFor(lang, "request")}>{t("اطلب الآن", "Request now")}</Link>
              <Link className="btn line" href={pathFor(lang, "routes")}>{t("الخطوط والوجهات", "Routes and destinations")}</Link>
            </div>
            <p className="hnote rise" style={d(".4s")}>{t("الأسعار والمواعيد يحددها المكتب بعد استلام طلبك.", "The office confirms prices and dates after receiving your request.")}</p>
          </div>
        </div>
      </section>

      <section className="quick" style={{ paddingBlock: 0 }}>
        <div className="wrap"><div className="box"><div className="qlist">
          <h2>{t("ابدأ طلبك", "Start your request")}</h2>
          <div className="qgrid">
            {QUICK.map((k) => {
              const s = ALL_SERVICES.find((x) => x.key === k)!;
              return <Link key={k} href={reqHref(lang, k)}><span className="ic"><Icon name={s.icon} /></span><span>{s.title[lang]}</span><Arrow /></Link>;
            })}
          </div>
        </div></div></div>
      </section>

      <div className="ticker" aria-hidden="true"><div className="tick">{ticker}{ticker.map((n, i) => ({ ...n, key: "b" + i }))}</div></div>

      <section>
        <div className="wrap">
          <div className="shead">
            <h2>{t("خدماتنا", "Our services")}</h2>
            <p>{t("اختر القسم الذي تريده.", "Pick the section you need.")}</p>
          </div>
          <div className="grid4">
            {tiles.map((x) => (
              <Link className="card" key={x.path} href={pathFor(lang, x.path)}>
                <span className="ic"><Icon name={x.icon} /></span>
                <h3>{x.title}</h3><p>{x.desc}</p>
                <span className="more">{t("عرض الصفحة", "Open page")}<Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pad0">
        <div className="wrap">
          <div className="shead">
            <h2>{t("من صنعاء إلى العالم", "From Sana'a to the world")}</h2>
            <p>{t(
              "أسطول فلاي مكتب سفريات يمني تأسس في صنعاء عام 2013، يجمع لك جميع خدمات السفر في مكان واحد: تذاكر الطيران وحجز الفنادق، والنقل بين المدن اليمنية وإلى السعودية وعُمان، وإرسال الطرود داخل اليمن وإلى السعودية، وتجهيز طلبات تأشيرات العمرة وشرق آسيا وتفويضات الزيارة العائلية، وإصدار جواز السفر وتجديده. أينما كنت في العالم، نساعدك ونتابع طلبك معك.",
              "Astool Fly is a Yemeni travel office founded in Sana'a in 2013. We bring all your travel services together in one place: flight tickets and hotel booking, transport between Yemeni cities and to Saudi Arabia and Oman, parcels within Yemen and to Saudi Arabia, Umrah and East Asia visa applications, family-visit authorizations, and passport issuance and renewal. Wherever you are in the world, we are here to help and follow up with you."
            )}</p>
          </div>
        </div>
      </section>

      <section className="pad0"><div className="wrap"><StepsBox lang={lang} wide /></div></section>
      <CtaBand lang={lang} />
    </>
  );
}

import Link from "next/link";
import type { CSSProperties } from "react";
import { Arrow, Icon } from "./Icon";
import HeroSlideshow from "./HeroSlideshow";
import WorldMap from "./WorldMap";
import { STEPS, pathFor, slidesFor, tr, type City, type HeroPageKey, type Lang, type Service } from "../lib/content";

export const reqHref = (lang: Lang, hash: string) => `${pathFor(lang, "request")}#${hash}`;

export function PageHero({ lang, page, title, desc }: { lang: Lang; page: HeroPageKey; title: string; desc: string }) {
  return (
    <section className="phero">
      <HeroSlideshow lang={lang} slides={slidesFor(page)} />
      <WorldMap variant="banner" />
      <div className="wrap">
        <h1 className="rise">{title}</h1>
        <p className="rise" style={{ "--d": ".12s" } as CSSProperties}>{desc}</p>
      </div>
    </section>
  );
}

export function ServiceCard({ s, lang, soft = false }: { s: Service; lang: Lang; soft?: boolean }) {
  const t = tr(lang);
  return (
    <Link className={"card" + (soft ? " soft" : "")} href={reqHref(lang, s.key)}>
      <span className="ic"><Icon name={s.icon} /></span>
      {soft && <span className="chip">{t("عند الطلب", "On request")}</span>}
      <h3>{s.title[lang]}</h3>
      <p>{s.desc[lang]}</p>
      <span className="more">{t("اطلب الخدمة", "Request this")}<Arrow /></span>
    </Link>
  );
}

export function DocRow({ s, lang }: { s: Service; lang: Lang }) {
  return (
    <Link className="drow" href={reqHref(lang, s.key)}>
      <span className="ic"><Icon name={s.icon} /></span>
      <span className="dtxt">
        <strong>{s.title[lang]}</strong>
        <span className="dsub">{s.desc[lang]}</span>
        {s.tags && <span className="tags">{s.tags.map((g) => <span className="tag" key={g.en}>{g[lang]}</span>)}</span>}
      </span>
      <span className="go"><Arrow /></span>
    </Link>
  );
}

export function StepsBox({ lang, wide = false }: { lang: Lang; wide?: boolean }) {
  const t = tr(lang);
  return (
    <div className={"steps" + (wide ? " wide" : "")}>
      <h3>{t("كيف تسير الخدمة", "How it works")}</h3>
      <ol>
        {STEPS.map((s, i) => (
          <li key={i}>
            <span className="n">{i + 1}</span>
            <div><strong>{s.title[lang]}</strong><p>{s.desc[lang]}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CtaBand({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <section className="pad0">
      <div className="wrap">
        <div className="band">
          <span className="trail" />
          <Icon name="plane" className="ico fly" />
          <div>
            <h2>{t("جاهز للسفر أو الإرسال؟", "Ready to travel or send?")}</h2>
            <p>{t("اكتب طلبك وأرسله إلى المكتب عبر واتساب.", "Write your request and send it to the office on WhatsApp.")}</p>
          </div>
          <Link className="btn orange pulse" href={pathFor(lang, "request")}>{t("اكتب طلبك", "Write your request")}</Link>
        </div>
      </div>
    </section>
  );
}

export function RoutePanel({ lang, title, sub, cities, svc }: { lang: Lang; title: string; sub: string; cities: City[]; svc: string }) {
  const t = tr(lang);
  return (
    <div className="panel">
      <div className="phead"><h3>{title}</h3><p>{sub}</p></div>
      <div className="rows">
        {cities.map((c, i) => (
          <Link className="rrow" key={c.slug} href={reqHref(lang, `${svc}-${c.slug}`)}>
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            <span className="nm">{c[lang]}</span>
            <span className="go">{t("اطلب", "Request")}<Arrow /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

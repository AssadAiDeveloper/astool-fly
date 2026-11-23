import Link from "next/link";
import { AIRLINES, tr, type Lang } from "../lib/content";
import { reqHref } from "./Blocks";

export default function AirlinesStrip({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const logos = (copy: "a" | "b") => AIRLINES.map((a) => (
    <Link
      className="as-item"
      key={`${copy}-${a.key}`}
      href={reqHref(lang, "flight")}
      title={a.name[lang]}
      aria-hidden={copy === "b"}
      tabIndex={copy === "b" ? -1 : undefined}
    >
      <span className="as-logo"><img src={a.logo} alt={a.name[lang]} /></span>
    </Link>
  ));
  return (
    <section className="airlines-strip" aria-label={t("شركات الطيران", "Airlines")}>
      <div className="as-track">{logos("a")}{logos("b")}</div>
    </section>
  );
}

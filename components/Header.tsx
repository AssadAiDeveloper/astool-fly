"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_PAGES, pathFor, tr, type Lang } from "../lib/content";

const trim = (s: string) => s.replace(/\/+$/, "");

export default function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const t = tr(lang);
  const other: Lang = lang === "ar" ? "en" : "ar";
  const altHref = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${other}`);
  return (
    <header className="top">
      <div className="wrap">
        <Link className="brand" href={pathFor(lang, "")} aria-label={t("أسطول فلاي | الرئيسية", "Astool Fly | Home")}>
          <img src={`/logo-${lang}.webp`} alt={t("أسطول فلاي", "Astool Fly")} width={138} height={46} />
        </Link>
        <nav className={"nav" + (open ? " open" : "")} id="nav" aria-label={t("القائمة الرئيسية", "Main")}>
          {NAV_PAGES.map((p) => {
            const h = pathFor(lang, p.path);
            return (
              <Link key={p.key} href={h} aria-current={trim(pathname) === trim(h) ? "page" : undefined} onClick={() => setOpen(false)}>
                {p.nav[lang]}
              </Link>
            );
          })}
        </nav>
        <div className="tools">
          <Link className="lang" href={altHref} hrefLang={other} lang={other} aria-label={other === "en" ? "Switch to English" : "التبديل إلى العربية"}>
            {other === "en" ? "English" : "العربية"}
          </Link>
          <Link className="btn orange" href={pathFor(lang, "request")}>
            {t("اطلب الآن", "Request now")}
          </Link>
        </div>
        <button type="button" className="menu" aria-label={t("القائمة", "Menu")} aria-expanded={open} aria-controls="nav" onClick={() => setOpen((v) => !v)}>
          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

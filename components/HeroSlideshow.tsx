"use client";
import { useEffect, useState } from "react";
import { SLIDES, tr, type Lang, type Slide } from "../lib/content";

const DELAY = 5000;

export default function HeroSlideshow({ lang, slides = SLIDES }: { lang: Lang; slides?: Slide[] }) {
  const t = tr(lang);
  const list = slides.length ? slides : SLIDES;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    setActive((v) => (v >= list.length ? 0 : v));
  }, [list.length]);

  useEffect(() => {
    if (reduce || paused || list.length < 2) return;
    const id = window.setInterval(() => setActive((v) => (v + 1) % list.length), DELAY);
    return () => window.clearInterval(id);
  }, [reduce, paused, list.length]);

  const current = list[active] ?? list[0];

  return (
    <div
      className="slides"
      role="region"
      aria-label={t("صور من حول العالم", "Images from around the world")}
      aria-roledescription={t("عرض شرائح", "slideshow")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      {list.map((s, i) => (
        <div className={"slide" + (i === active ? " on" : "")} key={s.image} aria-hidden={i !== active}>
          <img
            src={s.image}
            alt={`${s.title[lang]} — ${s.region[lang]}`}
            loading={i === 0 || list.length <= 6 ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      ))}
      <div className="slide-shade" aria-hidden="true" />
      <div className="slide-cap">
        <span className="slide-region">{current.region[lang]}</span>
        <strong className="slide-title">{current.title[lang]}</strong>
      </div>
      <div className="slide-bar">
        <div className="slide-dots" aria-label={t("اختر صورة", "Choose an image")}>
          {list.map((s, i) => (
            <button
              key={s.image}
              type="button"
              className={"dot" + (i === active ? " on" : "")}
              aria-label={`${s.title[lang]} — ${s.region[lang]}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scroll reveal: elements already on screen stay visible; the rest rise in. */
export default function Effects() {
  const pathname = usePathname();
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = document.querySelectorAll<HTMLElement>(".card,.drow,.steps,.panel,.band,.shead,details,.cc,.ticket");
    const vh = window.innerHeight;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.add("in");
          timers.push(window.setTimeout(() => { el.classList.remove("rv", "in"); el.style.transitionDelay = ""; }, 1100));
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.95) return;
      const i = Array.prototype.indexOf.call(el.parentNode!.children, el);
      el.classList.add("rv");
      el.style.transitionDelay = Math.min(i, 5) * 70 + "ms";
      io.observe(el);
    });
    return () => { io.disconnect(); timers.forEach(clearTimeout); els.forEach((el) => el.classList.remove("rv", "in")); };
  }, [pathname]);
  return null;
}

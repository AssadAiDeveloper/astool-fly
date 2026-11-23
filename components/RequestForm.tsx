"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ALL_CITIES, ALL_SERVICES, COUNTRY_GROUPS, CORE, DOCS, EXTRAS, OMAN, SAUDI,
  YEMEN_GOVERNORATES, tr, type Lang,
} from "../lib/content";
import { OFFICE, waLink } from "../lib/config";
import { Icon } from "./Icon";
import {
  ComboField, DateField, SelectField, formatISODate, type ComboGroup, type SelectGroup,
} from "./FormFields";

type DestKind = "yemen" | "international" | "parcel" | "world" | "none";

/** Which destination options fit each service. Visa services stay free-text so no countries are implied. */
const DEST_KIND: Record<string, DestKind> = {
  domestic: "yemen",
  privatecar: "yemen",
  haicebus: "yemen",
  international: "international",
  parcel: "parcel",
  flight: "world",
  hotel: "world",
  tour: "world",
  medical: "world",
  study: "world",
  other: "world",
  visas: "none",
  umrah: "none",
  family: "none",
  eastasia: "none",
  passport: "none",
};

const DEFAULT_SERVICE = "flight";

export default function RequestForm({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const [svc, setSvc] = useState(DEFAULT_SERVICE);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const salesWa = OFFICE.whatsappSales;
  const wa = salesWa ? waLink(salesWa) : "";

  // #service or #service-city (e.g. #international-jeddah) pre-fills the form
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.slice(1);
      if (!h) return;
      const [key, ...rest] = h.split("-");
      if (ALL_SERVICES.some((s) => s.key === key)) setSvc(key);
      const city = ALL_CITIES.find((c) => c.slug === rest.join("-"));
      if (city) setTo(city[lang]);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [lang]);

  const flight = EXTRAS.find((s) => s.key === "flight");
  const serviceGroups: SelectGroup[] = [
    {
      label: t("النقل والطرود", "Transport & parcels"),
      options: [...(flight ? [flight] : []), ...CORE].map((s) => ({ value: s.key, label: s.title[lang], icon: s.icon })),
    },
    {
      label: t("التأشيرات والجوازات", "Visas & passports"),
      options: DOCS.map((s) => ({ value: s.key, label: s.title[lang], icon: s.icon })),
    },
    {
      label: t("خدمات أخرى", "More services"),
      options: EXTRAS.filter((s) => s.key !== "flight").map((s) => ({ value: s.key, label: s.title[lang], icon: s.icon })),
    },
  ];

  const other = lang === "ar" ? "en" : "ar";
  const items = (list: { ar: string; en: string }[]) => list.map((x) => ({ value: x[lang], alt: x[other] }));
  const yemenGroup: ComboGroup = {
    label: t("المحافظات اليمنية", "Yemeni governorates"),
    items: items(YEMEN_GOVERNORATES),
  };
  const saudiGroup: ComboGroup = {
    label: t("المملكة العربية السعودية", "Saudi Arabia"),
    items: items(SAUDI),
  };
  const omanGroup: ComboGroup = {
    label: t("سلطنة عُمان", "Oman"),
    items: items(OMAN),
  };
  const worldGroups: ComboGroup[] = COUNTRY_GROUPS.map((g) => ({
    label: g.label[lang],
    items: items(g.items),
  }));

  const kind = DEST_KIND[svc] ?? "world";
  const fromGroups: ComboGroup[] = kind === "world" ? worldGroups : kind === "none" ? [] : [yemenGroup];
  const toGroups: ComboGroup[] =
    kind === "world" ? worldGroups
      : kind === "yemen" ? [yemenGroup]
        : kind === "international" ? [saudiGroup, omanGroup]
          : kind === "parcel" ? [yemenGroup, saudiGroup]
            : [];

  const fromPlaceholder = kind === "world"
    ? t("دولة الانطلاق", "Departure country")
    : kind === "none" ? t("غير مطلوب", "Not required") : t("محافظة الانطلاق", "Departure governorate");
  const toPlaceholder = kind === "world"
    ? t("الدولة الوجهة", "Destination country")
    : kind === "yemen" ? t("المحافظة الوجهة", "Destination governorate")
      : kind === "international" ? t("الدولة والوجهة", "Country & destination")
        : kind === "parcel" ? t("داخل اليمن أو السعودية", "Within Yemen or Saudi Arabia")
          : t("اكتب الوجهة إن لزم", "Destination if needed");
  const emptyText = kind === "none"
    ? t("اكتب التفاصيل في الملاحظات؛ المكتب يؤكد المطلوب.", "Add the details in notes; the office confirms what is needed.")
    : t("لا توجد نتيجة مطابقة. اكتبها كما تحتاجها.", "No match. Type it as you need.");

  function compose() {
    const label = ALL_SERVICES.find((s) => s.key === svc)!.title[lang];
    const lines = [t("السلام عليكم، أرغب بطلب خدمة من أسطول فلاي.", "Hello, I would like to request a service from Astool Fly."), "",
      `${t("الخدمة", "Service")}: ${label}`, `${t("الاسم", "Name")}: ${name.trim()}`];
    if (from.trim()) lines.push(`${t("من", "From")}: ${from.trim()}`);
    if (to.trim()) lines.push(`${t("إلى", "To")}: ${to.trim()}`);
    if (date) lines.push(`${t("التاريخ", "Date")}: ${formatISODate(date, lang)}`);
    if (notes.trim()) lines.push(`${t("ملاحظات", "Notes")}: ${notes.trim()}`);
    return lines.join("\n");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr(t("اكتب اسمك لنجهز الرسالة.", "Enter your name so we can prepare the message.")); nameRef.current?.focus(); return; }
    setErr("");
    setMsg(compose());
    setHint(wa ? t("الرسالة جاهزة. اضغط «فتح واتساب» ثم أرسلها.", "Your message is ready. Tap “Open WhatsApp” and send it.")
      : t("رقم واتساب المكتب لم يُضف بعد. انسخ الرسالة وأرسلها للمكتب.", "The office WhatsApp number has not been added yet. Copy the message and send it to the office."));
  }

  async function copy() {
    try { await navigator.clipboard.writeText(msg ?? ""); setHint(t("تم نسخ الرسالة.", "Message copied.")); }
    catch { setHint(t("تعذّر النسخ. حدد النص وانسخه يدوياً.", "Could not copy. Select the text and copy it manually.")); }
  }

  return (
    <div className="ticket">
      <div className="thead">
        <h2>{t("طلب خدمة", "Service request")}</h2>
        <Icon name="plane" />
      </div>
      <div className="tear" />
      <form onSubmit={onSubmit} noValidate>
        <SelectField
          id="svc"
          label={t("الخدمة", "Service")}
          placeholder={t("اختر الخدمة", "Choose a service")}
          value={svc}
          groups={serviceGroups}
          onChange={(v) => { setSvc(v); setFrom(""); setTo(""); }}
        />
        <div className="f">
          <label htmlFor="name">{t("الاسم", "Your name")}</label>
          <input id="name" ref={nameRef} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("الاسم الكامل", "Full name")} />
          <div className="err" role="alert">{err}</div>
        </div>
        <div className="g2">
          <ComboField
            id="from"
            label={t("من", "From")}
            placeholder={fromPlaceholder}
            emptyText={emptyText}
            value={from}
            groups={fromGroups}
            onChange={setFrom}
          />
          <ComboField
            id="to"
            label={t("إلى", "To")}
            placeholder={toPlaceholder}
            emptyText={emptyText}
            value={to}
            groups={toGroups}
            onChange={setTo}
          />
        </div>
        <DateField
          id="date"
          label={t("التاريخ (اختياري)", "Date (optional)")}
          placeholder={t("اختر التاريخ", "Choose a date")}
          value={date}
          lang={lang}
          todayText={t("اليوم", "Today")}
          clearText={t("مسح", "Clear")}
          prevText={t("الشهر السابق", "Previous month")}
          nextText={t("الشهر التالي", "Next month")}
          onChange={setDate}
        />
        <div className="f">
          <label htmlFor="notes">{t("ملاحظات (اختياري)", "Notes (optional)")}</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("عدد الركاب، نوع الطرد، الدولة المطلوبة للتأشيرة…", "Passengers, parcel type, visa country…")} />
        </div>
        <button className="btn orange" type="submit">{t("جهّز رسالة واتساب", "Prepare WhatsApp message")}</button>
        {msg !== null && (
          <div className="out">
            <pre>{msg}</pre>
            <div className="acts">
              <a className="btn navy" href={salesWa ? waLink(salesWa, msg ?? "") : "#"} aria-disabled={!salesWa} target="_blank" rel="noopener">{t("فتح واتساب", "Open WhatsApp")}</a>
              <button className="btn ghost" type="button" onClick={copy}>{t("نسخ الرسالة", "Copy message")}</button>
            </div>
            <p className="hint" aria-live="polite">{hint}</p>
          </div>
        )}
      </form>
    </div>
  );
}

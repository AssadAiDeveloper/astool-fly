"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import type { Lang } from "../lib/content";
import { Icon } from "./Icon";

export type SelectOption = { value: string; label: string; icon?: string };
export type SelectGroup = { label: string; options: SelectOption[] };
export type ComboItem = { value: string; alt?: string };
export type ComboGroup = { label: string; items: ComboItem[] };

const pad = (n: number) => String(n).padStart(2, "0");
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function parseISO(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const da = Number(m[3]);
  if (mo < 1 || mo > 12 || da < 1 || da > 31) return null;
  const d = new Date(y, mo - 1, da);
  return d.getFullYear() === y && d.getMonth() === mo - 1 && d.getDate() === da ? d : null;
}

export function formatISODate(value: string, lang: Lang): string {
  const d = parseISO(value);
  if (!d) return value;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG-u-nu-latn" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  }).format(d);
}

function useOutside(ref: RefObject<HTMLDivElement | null>, active: boolean, close: () => void) {
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [active, close, ref]);
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s6.5-6.1 6.5-11a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

function ArrowIcon({ className, back = false }: { className?: string; back?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {back ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

type SelectProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  groups: SelectGroup[];
  onChange: (value: string) => void;
};

export function SelectField({ id, label, placeholder, value, groups, onChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const flat = useMemo(() => groups.flatMap((g) => g.options), [groups]);
  const selectedIndex = flat.findIndex((o) => o.value === value);
  const selected = flat[selectedIndex];
  const close = useCallback(() => setOpen(false), []);
  useOutside(root, open, close);

  const openMenu = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => optionRefs.current[active]?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open, active]);

  const choose = (i: number) => {
    const option = flat[i];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    trigger.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(flat.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  let optionIndex = 0;
  return (
    <div className="field" ref={root} onKeyDown={onKeyDown}>
      <label htmlFor={id}>{label}</label>
      <button
        id={id}
        ref={trigger}
        type="button"
        className={"field-control select-control" + (open ? " open" : "")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => (open ? setOpen(false) : openMenu())}
      >
        {selected?.icon && <span className="field-icon-box"><Icon name={selected.icon} className="ico mini" /></span>}
        <span className={"field-value" + (selected ? "" : " placeholder")}>{selected?.label ?? placeholder}</span>
        <ChevronIcon className="field-chevron" />
      </button>
      {open && (
        <div className="field-menu" id={`${id}-menu`} role="listbox" aria-label={label}>
          {groups.map((group) => (
            <div key={group.label}>
              <div className="field-group" role="presentation">{group.label}</div>
              {group.options.map((option) => {
                const i = optionIndex++;
                return (
                  <div
                    key={option.value}
                    ref={(el) => { optionRefs.current[i] = el; }}
                    role="option"
                    aria-selected={option.value === value}
                    tabIndex={-1}
                    className={"field-option" + (i === active ? " active" : "")}
                    onClick={() => choose(i)}
                  >
                    <span className="field-icon-box"><Icon name={option.icon ?? "globe"} className="ico mini" /></span>
                    <span>{option.label}</span>
                    <CheckIcon className="field-check" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type ComboProps = {
  id: string;
  label: string;
  placeholder: string;
  emptyText: string;
  value: string;
  groups: ComboGroup[];
  onChange: (value: string) => void;
};

export function ComboField({ id, label, placeholder, emptyText, value, groups, onChange }: ComboProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutside(root, open, close);

  const filtered = useMemo(() => {
    const q = value.trim().toLocaleLowerCase();
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => !q || i.value.toLocaleLowerCase().includes(q) || (i.alt ?? "").toLocaleLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, value]);
  const options = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  const openMenu = () => {
    setActive(options.findIndex((o) => o.value === value));
    setOpen(true);
  };

  const choose = (item: ComboItem) => {
    onChange(item.value);
    setOpen(false);
    setActive(-1);
    input.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((i) => (options.length ? (i + 1 + options.length) % options.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((i) => (options.length ? (i - 1 + options.length) % options.length : -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" && open && active >= 0 && options[active]) {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  let optionIndex = 0;
  return (
    <div className="field" ref={root} onKeyDown={onKeyDown}>
      <label htmlFor={id}>{label}</label>
      <div className={"field-control combo-control" + (open ? " open" : "")}>
        <PinIcon className="field-icon" />
        <input
          id={id}
          ref={input}
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
          onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={openMenu}
        />
        <ChevronIcon className="field-chevron" />
      </div>
      {open && (
        <div className="field-menu combo-menu" id={`${id}-menu`} role="listbox" aria-label={label}>
          {options.length ? filtered.map((group) => (
            <div key={group.label}>
              <div className="field-group" role="presentation">{group.label}</div>
              {group.items.map((item) => {
                const i = optionIndex++;
                return (
                  <div
                    key={item.value}
                    id={`${id}-opt-${i}`}
                    role="option"
                    aria-selected={item.value === value}
                    className={"field-option" + (i === active ? " active" : "")}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(item)}
                  >
                    <PinIcon className="field-icon soft" />
                    <span title={item.alt ? `${item.value} · ${item.alt}` : item.value}>{item.value}</span>
                    <CheckIcon className="field-check" />
                  </div>
                );
              })}
            </div>
          )) : <div className="field-empty">{emptyText}</div>}
        </div>
      )}
    </div>
  );
}

type DateProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  lang: Lang;
  todayText: string;
  clearText: string;
  prevText: string;
  nextText: string;
  onChange: (value: string) => void;
};

export function DateField({ id, label, placeholder, value, lang, todayText, clearText, prevText, nextText, onChange }: DateProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const focusedOnce = useRef(false);
  const close = useCallback(() => setOpen(false), []);
  useOutside(root, open, close);

  const selected = parseISO(value);
  const todayISO = toISO(new Date());
  const monthFmt = useMemo(
    () => new Intl.DateTimeFormat(lang === "ar" ? "ar-EG-u-nu-latn" : "en-US", { month: "long", year: "numeric" }),
    [lang],
  );
  const fullFmt = useMemo(
    () => new Intl.DateTimeFormat(lang === "ar" ? "ar-EG-u-nu-latn" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    [lang],
  );
  const weekdays = lang === "ar"
    ? ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const d = parseISO(value) ?? new Date();
    setView(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [value]);

  useEffect(() => {
    if (!open) { focusedOnce.current = false; return; }
    if (focusedOnce.current || !view) return;
    focusedOnce.current = true;
    const d = selected ?? new Date();
    const frame = window.requestAnimationFrame(() => {
      grid.current?.querySelector<HTMLButtonElement>(`[data-date="${toISO(d)}"]`)?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, view, value]);

  const openMenu = () => {
    if (!view) {
      const d = selected ?? new Date();
      setView(new Date(d.getFullYear(), d.getMonth(), 1));
    }
    setOpen(true);
  };

  const choose = (d: Date) => {
    onChange(toISO(d));
    setOpen(false);
    trigger.current?.focus();
  };

  const moveMonth = (delta: number) => {
    setView((v) => (v ? new Date(v.getFullYear(), v.getMonth() + delta, 1) : v));
  };

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-date]");
    if (!el) return;
    const current = parseISO(el.dataset.date ?? "");
    if (!current) return;
    let next = new Date(current);
    if (e.key === "ArrowLeft") next.setDate(next.getDate() - 1);
    else if (e.key === "ArrowRight") next.setDate(next.getDate() + 1);
    else if (e.key === "ArrowUp") next.setDate(next.getDate() - 7);
    else if (e.key === "ArrowDown") next.setDate(next.getDate() + 7);
    else if (e.key === "Home") next.setDate(next.getDate() - current.getDay());
    else if (e.key === "End") next.setDate(next.getDate() + (6 - current.getDay()));
    else if (e.key === "PageUp" || e.key === "PageDown") {
      const delta = e.key === "PageUp" ? -1 : 1;
      const target = new Date(current.getFullYear(), current.getMonth() + delta, 1);
      const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
      next = new Date(target.getFullYear(), target.getMonth(), Math.min(current.getDate(), last));
    } else return;
    e.preventDefault();
    setView(new Date(next.getFullYear(), next.getMonth(), 1));
    const frame = window.requestAnimationFrame(() => {
      grid.current?.querySelector<HTMLButtonElement>(`[data-date="${toISO(next)}"]`)?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  };

  const firstDay = view ? new Date(view.getFullYear(), view.getMonth(), 1).getDay() : 0;
  const daysInMonth = view ? new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate() : 0;
  const cells = Array.from({ length: 42 }, (_, i) => {
    const n = i - firstDay + 1;
    return n >= 1 && n <= daysInMonth ? n : null;
  });

  const onRootKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    }
  };

  return (
    <div className="field" ref={root} onKeyDown={onRootKeyDown}>
      <label htmlFor={id}>{label}</label>
      <button
        id={id}
        ref={trigger}
        type="button"
        className={"field-control date-control" + (open ? " open" : "")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => (open ? setOpen(false) : openMenu())}
      >
        <CalendarIcon className="field-icon" />
        <span className={"field-value" + (selected ? "" : " placeholder")}>{selected ? formatISODate(value, lang) : placeholder}</span>
        <ChevronIcon className="field-chevron" />
      </button>
      {open && view && (
        <div className="cal-popover" id={`${id}-menu`} role="dialog" aria-label={label}>
          <div className="cal-head">
            <button type="button" className="cal-nav" aria-label={prevText} onClick={() => moveMonth(-1)}><ArrowIcon className="cal-arrow" back /></button>
            <strong className="cal-title">{monthFmt.format(view)}</strong>
            <button type="button" className="cal-nav" aria-label={nextText} onClick={() => moveMonth(1)}><ArrowIcon className="cal-arrow" /></button>
          </div>
          <div className="cal-grid" ref={grid} onKeyDown={onGridKeyDown}>
            {weekdays.map((d) => <div key={d} className="cal-week">{d}</div>)}
            {cells.map((n, i) => {
              if (!n) return <span key={`e${i}`} className="cal-day empty" aria-hidden="true" />;
              const d = new Date(view.getFullYear(), view.getMonth(), n);
              const iso = toISO(d);
              const isSelected = iso === value;
              const isToday = iso === todayISO;
              return (
                <button
                  key={iso}
                  type="button"
                  data-date={iso}
                  className={"cal-day" + (isSelected ? " selected" : "") + (isToday ? " today" : "")}
                  aria-label={fullFmt.format(d)}
                  aria-pressed={isSelected}
                  onClick={() => choose(d)}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="cal-foot">
            <button type="button" onClick={() => choose(new Date())}>{todayText}</button>
            <button type="button" onClick={() => { onChange(""); setOpen(false); trigger.current?.focus(); }}>{clearText}</button>
          </div>
        </div>
      )}
    </div>
  );
}

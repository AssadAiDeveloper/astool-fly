import { ICONS } from "../lib/content";

export function Icon({ name, className = "ico" }: { name: string; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}

export function Arrow() {
  return (
    <svg className="arr" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "ico" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.7-5.2A8.5 8.5 0 1 1 21 12z" />
    </svg>
  );
}

export type ContactIconKind = "whatsapp" | "call" | "landline";

/** Small colored icons placed next to phone numbers in contact lists. */
export function ContactIcon({ kind }: { kind: ContactIconKind }) {
  if (kind === "whatsapp") {
    return (
      <svg className="ct-ico" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#25D366"
          d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.14a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.37c0-4.53 3.68-8.22 8.22-8.22a8.18 8.18 0 0 1 5.81 2.41 8.17 8.17 0 0 1 2.41 5.81c0 4.54-3.69 8.23-8.21 8.23zm4.52-6.16c-.25-.12-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.61-1.23-1.36-1.37-1.59-.14-.23-.15-.44.08-.61.2-.15.44-.5.61-.75.17-.25.23-.44.34-.73.12-.28.06-.52-.03-.64-.08-.12-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.12.17 1.78 2.72 4.32 3.81 2.54 1.09 2.54.73 3 .69.46-.05 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z"
        />
      </svg>
    );
  }
  if (kind === "call") {
    return (
      <svg className="ct-ico" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#0B63D9"
          d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 2v13h8V4H8zm4 14.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"
        />
      </svg>
    );
  }
  return (
    <svg className="ct-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#012382"
        d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.28.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.22.2 2.4.57 3.5a1 1 0 0 1-.25 1L6.6 10.8z"
      />
    </svg>
  );
}

export type SocialName = "facebook" | "instagram" | "tiktok" | "linkedin";

// Inline styles win over the global `.ico` rule so the brand colors show through.
const base = {
  viewBox: "0 0 24 24",
  className: "ico",
  "aria-hidden": true,
  style: { fill: "none", stroke: "none" },
} as const;

const ttGlyph =
  "M14.1 3h2.8c.2 1.7 1.3 2.9 3 3.1v2.8c-1.2.1-2.3-.2-3.2-.9v5.8c0 3.1-2.5 5.6-5.6 5.6S5.5 17.8 5.5 14.7s2.5-5.6 5.6-5.6c.3 0 .6 0 .9.1v2.9c-.3-.1-.6-.2-.9-.2-1.6 0-2.8 1.3-2.8 2.8s1.3 2.8 2.8 2.8 2.8-1.3 2.8-2.8V3z";

export default function SocialIcon({ name }: { name: SocialName }) {
  if (name === "facebook") {
    return (
      <svg {...base}>
        <path fill="#1877F2" d="M14.6 8.4h2.3V5.4h-2.5c-2.6 0-4.3 1.7-4.3 4.3v2H8v3h2.1V21h3.4v-6.3h2.5l.4-3h-2.9V9.9c0-.8.3-1.5 1.1-1.5z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...base}>
        <defs>
          <linearGradient id="ig-brand" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEDA75" />
            <stop offset="28%" stopColor="#FA7E1E" />
            <stop offset="55%" stopColor="#D62976" />
            <stop offset="78%" stopColor="#962FBF" />
            <stop offset="100%" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="url(#ig-brand)" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.9" fill="none" stroke="url(#ig-brand)" strokeWidth="2" />
        <circle cx="17.2" cy="6.8" r="1.3" fill="url(#ig-brand)" />
      </svg>
    );
  }

  if (name === "tiktok") {
    return (
      <svg {...base}>
        <path d={ttGlyph} fill="#25F4EE" transform="translate(-0.5 0.4)" />
        <path d={ttGlyph} fill="#FE2C55" transform="translate(0.5 -0.4)" />
        <path d={ttGlyph} fill="#010101" />
      </svg>
    );
  }

  return (
    <svg {...base}>
      <path
        fill="#0A66C2"
        d="M6.4 8.1H3.3V21h3.1V8.1zM4.9 3a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM20.8 13.4c0-3.2-1.7-4.7-4-4.7-1.8 0-2.7 1-3.1 1.7V8.1h-3.1c0 1.2.1 3.2.1 5.6V21h3.1v-6.8c0-1.8.7-2.9 2.2-2.9 1.4 0 2 .9 2 2.9V21h2.8v-7.6z"
      />
    </svg>
  );
}

# Astool Fly | أسطول فلاي

Static bilingual website (Next.js 15, TypeScript, static export).

```bash
npm install
npm run dev                                   # development
NEXT_PUBLIC_SITE_URL=https://yourdomain.com npm run build   # production -> out/
npx serve out                                 # preview
```

Upload the contents of `out/` to any static host (Netlify, Vercel, Cloudflare Pages, cPanel, S3...).
Office details (WhatsApp, phone, address, hours): `lib/config.ts`. Content: `lib/data.json`. Guide for agents: `AGENTS.md`.

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

## GitHub Pages

`.github/workflows/deploy.yml` builds and publishes `out/` on every push to `master`.
Default site: https://assadaideveloper.github.io/astool-fly/ (base path `/astool-fly`).

To use a custom domain instead, add these repository variables (Settings → Secrets and variables → Actions → Variables):

- `NEXT_PUBLIC_SITE_URL` — e.g. `https://yourdomain.com`
- `NEXT_PUBLIC_BASE_PATH` — set to `/` (or leave empty) for root hosting

Then add the domain in Settings → Pages. Enable Pages with **GitHub Actions** as the source if prompted.

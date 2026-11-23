# Prompt to paste into opencode (from the project folder)

Read AGENTS.md first. Then:

1. Run `npm install` and `npm run build`. Confirm it builds without errors and `out/` is created.
2. Run `npx serve out` and check `/ar/` and `/en/`: nav, language switch, the request form (select a city on /routes/ and confirm the request page is pre-filled), and the animated map.
3. Ask me for the open items listed at the end of AGENTS.md (WhatsApp number, phone, address, hours, domain). When I answer, put them in `lib/config.ts` and the `NEXT_PUBLIC_SITE_URL` env value, rebuild, and show me the diff.
4. Do not invent prices, visa countries or legal requirements. Keep every text in Arabic and English.

---

(عربي) اقرأ AGENTS.md أولاً، ثم ابنِ المشروع وتحقق أنه يعمل، واسألني عن البيانات الناقصة (رقم واتساب، هاتف، عنوان، ساعات العمل، الدومين) قبل أن تضعها في lib/config.ts. لا تخترع أسعاراً أو دولاً أو شروطاً.

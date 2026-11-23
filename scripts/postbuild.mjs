// Writes out/index.html: a language-aware redirect from "/" to "/ar/" or "/en/" (static hosts can't redirect server-side).
import fs from "node:fs";
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>Astool Fly | أسطول فلاي</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="أسطول فلاي: مكتب سفريات في اليمن. Astool Fly: travel office in Yemen.">
<link rel="canonical" href="${site}/ar/">
<link rel="alternate" hreflang="ar" href="${site}/ar/">
<link rel="alternate" hreflang="en" href="${site}/en/">
<link rel="alternate" hreflang="x-default" href="${site}/ar/">
<meta http-equiv="refresh" content="0; url=/ar/">
<script>var l=(navigator.language||"ar").toLowerCase().indexOf("en")===0?"en":"ar";location.replace("/"+l+"/");</script>
</head>
<body>
<p><a href="/ar/">العربية</a> · <a href="/en/">English</a></p>
</body>
</html>
`;
fs.writeFileSync("out/index.html", html);
console.log("postbuild: out/index.html written");

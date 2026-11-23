// Writes out/index.html: a language-aware redirect from "/<base>/" to "/<base>/ar/" or "/<base>/en/".
import fs from "node:fs";
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const home = (lang) => `${base}/${lang}/`;
const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>Astool Fly | أسطول فلاي</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="أسطول فلاي: مكتب سفريات في اليمن. Astool Fly: travel office in Yemen.">
<link rel="canonical" href="${site}${home("ar")}">
<link rel="alternate" hreflang="ar" href="${site}${home("ar")}">
<link rel="alternate" hreflang="en" href="${site}${home("en")}">
<link rel="alternate" hreflang="x-default" href="${site}${home("ar")}">
<meta http-equiv="refresh" content="0; url=${home("ar")}">
<script>var l=(navigator.language||"ar").toLowerCase().indexOf("en")===0?"en":"ar";location.replace("${base}/"+l+"/");</script>
</head>
<body>
<p><a href="${home("ar")}">العربية</a> · <a href="${home("en")}">English</a></p>
</body>
</html>
`;
fs.writeFileSync("out/index.html", html);
console.log("postbuild: out/index.html written");

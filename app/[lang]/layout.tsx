import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Effects from "../../components/Effects";
import { LANGS, dirOf, isLang, tr } from "../../lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}
export const metadata: Metadata = { applicationName: "Astool Fly" };

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  return (
    <html lang={lang} dir={dirOf(lang)}>
      <head>
        <meta name="theme-color" content="#012382" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a className="skip" href="#main">{t("تخطَّ إلى المحتوى", "Skip to content")}</a>
        <Header lang={lang} />
        <main id="main">{children}</main>
        <Footer lang={lang} />
        <Effects />
      </body>
    </html>
  );
}

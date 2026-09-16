import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { LanguageToggle } from "@/components/LanguageToggle";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "مرصد الذكاء الاصطناعي - جامعة الباحة",
  description: "مرصد رصد وتوثيق وتحليل الإنتاج البحثي في مجالات الذكاء الاصطناعي بجامعة الباحة",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const navLinks = [
    { href: "/", label: t(locale, "navDashboard") },
    { href: "/research", label: t(locale, "navResearch") },
    { href: "/researchers", label: t(locale, "navResearchers") },
  ];

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-md bg-white px-2 py-1.5 shrink-0">
                <Image
                  src="/albaha-university-logo.png"
                  alt="Al-Baha University"
                  width={130}
                  height={53}
                  className="h-8 w-auto"
                  priority
                />
                <span className="w-px h-6 bg-black/10" />
                <Image
                  src="/year-of-ai-logo.svg"
                  alt="Year of AI"
                  width={132}
                  height={49}
                  className="h-7 w-auto"
                  priority
                />
              </span>
              <span className="font-bold text-lg text-text-primary">
                {t(locale, "siteTitle")}
                <span className="block text-xs font-normal text-text-muted">{t(locale, "siteSubtitle")}</span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <nav className="flex gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-page hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <LanguageToggle locale={locale} label={t(locale, "langToggle")} />
            </div>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-text-muted">{t(locale, "footerDisclaimer")}</div>
        </footer>
      </body>
    </html>
  );
}

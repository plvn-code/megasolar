import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Montserrat, Onest, Unbounded } from "next/font/google";
import { CartToast } from "@/components/CartToast";
import { CursorLabel } from "@/components/CursorLabel";
import { Effects } from "@/components/Effects";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { LeadModal } from "@/components/LeadModal";
import { MobileBar } from "@/components/MobileBar";
import { site } from "@/lib/site";
import "./globals.css";

const display = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], variable: "--font-display", display: "swap" });
const body = Onest({ subsets: ["latin", "cyrillic"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-mono", display: "swap" });
const brand = Montserrat({ subsets: ["latin", "cyrillic"], weight: ["800"], variable: "--font-brand", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "MEGASOLAR — сонячні електростанції та обладнання в Полтаві", template: "%s — MEGASOLAR" },
  description: site.description,
  openGraph: { type: "website", locale: "uk_UA", siteName: "MEGASOLAR", images: ["/images/hero-poster.webp"] },
  // The redesign stays out of search until the client approves the launch.
  robots: process.env.NEXT_PUBLIC_SITE_LIVE === "1" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#050a06" };

const organization = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "MEGASOLAR",
  url: site.url,
  telephone: "+380960216960",
  email: site.email,
  areaServed: "Полтавська область",
  openingHours: "Mo-Fr 09:00-18:00",
  address: { "@type": "PostalAddress", streetAddress: "вул. Автобазівська, 2/9, корпус 16", addressLocality: "Полтава", addressCountry: "UA" },
  sameAs: [site.instagram],
};

/** Runs before paint: shows the intro only once per session, only on the home page, never with reduced motion. */
const introScript = `try{var d=document.documentElement;if(sessionStorage.getItem('ms-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches||location.pathname!=='/'){d.classList.add('no-intro')}sessionStorage.setItem('ms-intro','1')}catch(e){document.documentElement.classList.add('no-intro')}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${mono.variable} ${brand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Перейти до змісту
        </a>
        <Intro />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <LeadModal />
        <CartToast />
        <MobileBar />
        <CursorLabel />
        <Effects />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </body>
    </html>
  );
}

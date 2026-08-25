import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: "/brand/og-flames-menu.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: ["/brand/og-flames-menu.jpg"],
  },
  /*
   * The mark alone, never the full logo: the wordmark is illegible below about
   * 48px, and a favicon is usually rendered at 16. src/app/favicon.ico carries
   * the same mark at six sizes for browsers and tools that ask for it by path.
   */
  icons: {
    icon: [{ url: "/brand/flames-mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/flames-icon-180.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0908" },
    { media: "(prefers-color-scheme: light)", color: "#0a0908" },
  ],
};

/**
 * Applied before first paint, so nothing the visitor has chosen arrives late.
 *
 * Theme: dark is the default, so no attribute is set unless light was chosen.
 *
 * Menu view: list or grid, stamped on <html> so the menu's CSS can paint the
 * right layout on the very first frame. Without this the server always renders
 * the list and the client jumps to the grid after hydration — a visible layout
 * jump on every refresh for anyone who prefers the grid. Grid is the default on
 * narrow screens, matching the old site.
 */
const bootScript = `(()=>{try{var d=document.documentElement;
if(localStorage.getItem("flames-theme")==="light"){d.dataset.theme="light"}
var v=localStorage.getItem("flames-menu-view");
if(v!=="grid"&&v!=="list"){v=window.matchMedia("(max-width: 620px)").matches?"grid":"list"}
d.dataset.menuView=v}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      {/*
        Deliberately bare. The public site's header, footer and <main> live in
        the (site) route group, so /studio renders as its own application
        instead of inside our page chrome.
      */}
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Navigation from "@/components/Navigation";
import PWARegistration from "@/components/PWARegistration";
import logo from "../../public/logo.webp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Preppers Panamá - Preparación y Supervivencia",
  description: "Blog sobre preparacionismo, mochilas de emergencia, primeros auxilios y tecnologías de comunicación para situaciones de crisis en Panamá.",
  icons: {
    icon: "/blog/favicon.ico",
    apple: "/blog/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Security Headers (Meta Tag implementations for Static Sites) */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests;"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-cyan-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-mono"
        >
          Saltar al contenido principal
        </a>
        <PWARegistration />
        <Navigation />
        <main id="main-content" className="flex-grow">{children}</main>
        <footer className="bg-zinc-900 border-t border-zinc-800 text-zinc-400 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image src={logo} alt="Logo Preppers Panamá" width={32} height={32} className="h-8 w-auto" />
                  <h3 className="text-white font-bold">Preppers Panamá</h3>
                </div>
                <p className="text-sm">Fomentando la resiliencia y la preparación en la República de Panamá. Tecnología, equipo y conocimiento para lo inesperado.</p>
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-800 text-center text-xs">
              <p>© 2026 Preppers Panamá. La preparación es responsabilidad de todos.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

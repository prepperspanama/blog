"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import logo from "../../public/logo.webp";

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for glassmorphism effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/blog", label: "Blog" },
  ];

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 shadow-lg shadow-black/40"
          : "bg-zinc-950 border-b border-zinc-900"
          }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="font-bold text-xl flex items-center gap-3 group"
            >
              <Image
                src={logo}
                alt="Logo Preppers Panamá"
                width={36}
                height={36}
                className="h-9 w-auto transition-transform group-hover:scale-105"
              />
              {/* <span className="text-white group-hover:text-cyan-400 transition-colors">
                Preppers <span className="text-cyan-500">Panamá</span>
              </span> */}
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              <ul className="flex gap-6">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative py-1 text-sm font-medium transition-colors hover:text-cyan-400 ${isActive(link.href)
                        ? "text-cyan-400"
                        : "text-zinc-300"
                        }`}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-500 rounded-full" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

            </div>

            {/* Mobile: hamburger */}
            <div className="flex md:hidden items-center gap-3">

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:border-cyan-600 transition-colors"
                aria-label="Abrir menú de navegación"
                aria-expanded={menuOpen}
                aria-controls="mobile-drawer"
              >
                <span
                  className={`block w-5 h-0.5 bg-zinc-300 rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-zinc-300 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""
                    }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-zinc-300 rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-16 right-0 bottom-0 z-50 w-72 bg-zinc-950 border-l border-zinc-800 flex flex-col md:hidden transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col gap-2 flex-grow">
          <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-4">
            Navegación
          </p>
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(link.href)
                ? "bg-cyan-900/30 text-cyan-400 border border-cyan-800/50"
                : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-cyan-600 font-mono text-xs">
                {String(i + 1).padStart(2, "0")}
              </span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

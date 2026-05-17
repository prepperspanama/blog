"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 bg-cyan-600 hover:bg-cyan-500 text-white w-12 h-12 rounded-full shadow-lg shadow-cyan-900/30 transition-all hover:scale-110 flex items-center justify-center text-xl"
      aria-label="Volver arriba"
    >
      ↑
    </button>
  );
}

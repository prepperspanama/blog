"use client";

import { SITE_URL } from "@/lib/constants";

export default function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const url = `${SITE_URL}/blog/${slug}/`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: "📱",
    },
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: "✕",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: "📘",
    },
    {
      name: "Copiar enlace",
      href: "#",
      icon: "🔗",
      copy: true,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-center gap-3 mt-8 pt-8 border-t border-zinc-800/40">
      <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Compartir</span>
      {shareLinks.map((link) =>
        link.copy ? (
          <button
            key={link.name}
            onClick={handleCopy}
            className="text-zinc-400 hover:text-cyan-400 transition-colors text-lg"
            aria-label={link.name}
            title={link.name}
          >
            {link.icon}
          </button>
        ) : (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-cyan-400 transition-colors text-lg"
            aria-label={link.name}
            title={link.name}
          >
            {link.icon}
          </a>
        )
      )}
    </div>
  );
}

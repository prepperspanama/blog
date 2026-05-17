import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Preppers Panamá',
    short_name: 'PreppersPTY',
    description: 'Blog sobre preparacionismo y resiliencia soberana en Panamá.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#0891b2',
    icons: [
      { src: "/logo.webp", sizes: "192x192", type: "image/webp" },
      { src: "/logo.webp", sizes: "512x512", type: "image/webp" },
      { src: "/logo.webp", sizes: "any", type: "image/webp" },
    ],
  }
}

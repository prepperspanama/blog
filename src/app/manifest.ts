import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Preppers Panamá',
    short_name: 'PreppersPTY',
    description: 'Blog sobre preparacionismo y resiliencia soberana en Panamá.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b', // zinc-950
    theme_color: '#0891b2', // cyan-600
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      }
    ],
  }
}

# Preppers Panamá

Blog sobre preparacionismo, mochilas de emergencia, primeros auxilios y tecnologías de comunicación para situaciones de crisis en Panamá.

## Requisitos

- [Bun](https://bun.sh) >= 1.2

## Ejecutar en desarrollo

```bash
bun install
bun dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Build para producción

```bash
bun run build
bun start
```

## Crear una nueva entrada de blog

### 1. Crear el archivo MDX

Dentro de `src/content/blog/` crear un archivo `.mdx` con frontmatter:

```mdx
export const metadata = {
  title: "Título del Artículo",
  date: "15 de mayo de 2026",
  category: "Equipo",         // Tecnología | Equipo | Salud | Introducción
  tags: ["Tag1", "Tag2", "Panamá"]
}

Contenido del artículo en **Markdown**.
```

### 2. Registrar el post en la fuente de datos

Editar `src/lib/posts.ts` y agregar una entrada al array `ALL_POSTS`:

```ts
{
  slug: "nombre-del-articulo",          // Debe coincidir con el nombre del .mdx
  title: "Título del Artículo",
  date: "15 de mayo de 2026",
  readTime: "5 min",
  excerpt: "Resumen breve para la homepage y listado.",
  category: "Equipo",
  tags: ["Tag1", "Tag2", "Panamá"],
  featured: false,
  homeAccent: "from-zinc-800/40 to-zinc-900",
  homeTag: "GEAR",
  borderAccent: "border-zinc-800 bg-zinc-900/20",
  tagColor: "bg-amber-900/30 text-amber-400 border-amber-800/50",
  textAccent: "text-amber-400",
}
```

Los valores de `homeAccent`, `homeTag`, `borderAccent`, `tagColor` y `textAccent` varían según la categoría. Como referencia:

| Categoría | homeAccent | homeTag | textAccent |
|---|---|---|---|
| Tecnología | `from-cyan-900/40 to-zinc-900` | TECH | `text-cyan-400` |
| Introducción | `from-emerald-900/40 to-zinc-900` | INTRO | `text-zinc-400` |
| Equipo | `from-amber-900/30 to-zinc-900` | GEAR | `text-amber-400` |
| Salud | `from-zinc-800/40 to-zinc-900` | HEALTH | `text-emerald-400` |

### 3. Verificar

El post aparecerá automáticamente en:

- Homepage (sección "Del Blog")
- Listado `/blog`
- RSS `/api/rss`
- Barra de estadísticas (el contador de artículos se actualiza solo)

La navegación entre artículos (anterior/siguiente) se ordena según el orden del array `ALL_POSTS` en `src/lib/posts.ts`.

## Estructura del proyecto

```
src/
├── app/               # Páginas y layouts (App Router)
│   ├── about/         # Sobre nosotros
│   ├── api/rss/       # Feed RSS
│   ├── blog/          # Listado y detalle de posts
│   └── mapa/          # Mapa satelital GOES-19
├── components/        # Componentes reutilizables
├── content/blog/      # Posts en MDX
├── lib/               # Datos y utilidades
└── mdx-components.tsx # Mapeo de componentes MDX
```

## Tecnologías

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Contenido:** MDX
- **Mapas:** Leaflet + NOAA WMS + Open-Meteo
- **Runtime:** Bun

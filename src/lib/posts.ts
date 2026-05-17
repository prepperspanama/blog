export interface Post {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  category: "Tecnología" | "Equipo" | "Salud" | "Táctica" | "Geografía";
  tags: string[];
  ogImage?: string;
}

export const ALL_POSTS: Post[] = [
  {
    slug: "microclimas-y-riesgos-en-panama",
    title: "Microclimas y Riesgos en Panamá: Por qué el Istmo es Propenso a Desastres",
    date: "12 de Mayo, 2026",
    readTime: "8 min",
    excerpt: "Panamá es un laboratorio climático de 75,517 km². Analizamos sus 8 microclimas, la matriz de riesgos por provincia y por qué el Istmo ya no es una zona libre de desastres.",
    category: "Geografía",
    tags: ["Clima", "Riesgos", "Panamá", "Desastres"],
  },
  {
    slug: "que-es-ser-prepper",
    title: "¿Qué es ser Prepper? Más allá de los mitos del fin del mundo",
    date: "11 de Mayo, 2026",
    readTime: "10 min",
    excerpt: "El preparacionismo no es paranoia, es responsabilidad. Analizamos la filosofía prepper y por qué es vital en el siglo XXI.",
    category: "Táctica",
    tags: ["Filosofía", "Resiliencia", "Fundamentos"],
  },
];

export function getPostsByCategory(category: string) {
  return ALL_POSTS.filter((p) => p.category === category);
}

export function getPostsByTag(tag: string) {
  return ALL_POSTS.filter((p) => p.tags.includes(tag));
}

export function getAllCategories() {
  return [...new Set(ALL_POSTS.map((p) => p.category))];
}

export function getAllTags() {
  return [...new Set(ALL_POSTS.flatMap((p) => p.tags))];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  category: "Tecnología" | "Equipo" | "Salud" | "Táctica";
  tags: string[];
}

export const ALL_POSTS: Post[] = [
  {
    slug: "que-es-ser-prepper",
    title: "¿Qué es ser Prepper? Más allá de los mitos del fin del mundo",
    date: "11 de Mayo, 2026",
    readTime: "10 min",
    excerpt: "El preparacionismo no es paranoia, es responsabilidad. Analizamos la filosofía prepper y por qué es vital en el siglo XXI.",
    category: "Táctica",
    tags: ["Filosofía", "Resiliencia", "Fundamentos"],
  }
];

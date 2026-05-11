export interface Post {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  category: "Tecnología" | "Equipo" | "Salud" | "Táctica";
  tags: string[];
}

export const ALL_POSTS: Post[] = [];

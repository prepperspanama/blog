import { notFound } from "next/navigation";
import { ALL_POSTS } from "@/lib/posts";
import dynamic from "next/dynamic";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = ALL_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Dynamically import the MDX content
  const Content = dynamic(() => import(`../../../content/blog/${slug}.mdx`), {
    loading: () => <div className="animate-pulse h-96 bg-zinc-900/50 rounded-3xl" />,
  });

  return (
    <article className="bg-zinc-950 min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <Link 
          href="/blog" 
          className="text-cyan-500 font-mono text-xs uppercase tracking-widest mb-12 inline-block hover:text-cyan-400 transition-colors"
        >
          ← Volver al blog
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest px-2 py-1 bg-cyan-950/40 rounded border border-cyan-800/50">
              {post.category}
            </span>
            <span className="text-zinc-500 text-xs font-mono">
              {post.date} • {post.readTime}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
            {post.title}
          </h1>
        </header>

        <div className="prose prose-invert prose-prepper max-w-none">
          <Content />
        </div>
        
        <div className="mt-20 pt-10 border-t border-zinc-800/60">
          <h3 className="text-white font-bold mb-4">Tags</h3>
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-sm font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link"
import { ALL_POSTS } from "@/lib/posts"


const pillars = [
  {
    icon: "📡",
    label: "Antena",
    title: "Comunicaciones",
    color: "border-cyan-800 bg-cyan-900/10",
    glow: "hover:border-cyan-600 hover:shadow-cyan-900/20",
  },
  {
    icon: "⚡",
    label: "Rayo",
    title: "Energía",
    color: "border-amber-800/60 bg-amber-900/10",
    glow: "hover:border-amber-600 hover:shadow-amber-900/20",
  },
  {
    icon: "🎒",
    label: "Mochila",
    title: "Equipo",
    color: "border-emerald-800/60 bg-emerald-900/10",
    glow: "hover:border-emerald-600 hover:shadow-emerald-900/20",
  },
  {
    icon: "🗺️",
    label: "Mapa",
    title: "Táctica",
    color: "border-violet-800/60 bg-violet-900/10",
    glow: "hover:border-violet-600 hover:shadow-violet-900/20",
  },
]

export function QuoteSection() {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="w-8 h-1 bg-cyan-600 mx-auto mb-8 rounded-full" />
        <blockquote className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-serif italic">
          &ldquo;En un mundo donde las redes tradicionales son vulnerables, la soberanía
          tecnológica no es un lujo — es la base de la libertad.&rdquo;
        </blockquote>
        <p className="mt-6 text-cyan-700 font-mono text-xs tracking-widest uppercase">
          — Preppers Panamá
        </p>
      </div>
    </section>
  )
}

export function PillarsSection() {
  return (
    <section className="py-24 border-y border-zinc-800/40 bg-zinc-900/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-14 text-center">
          <p className="text-cyan-600 font-mono text-xs tracking-widest uppercase mb-3">
            Áreas de preparación
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Cuatro Pilares de la Resiliencia
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className={`border rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default text-center flex flex-col items-center justify-center ${p.color} ${p.glow}`}
            >
              <div className="text-5xl mb-6" role="img" aria-label={p.label}>{p.icon}</div>
              <h3 className="text-white font-bold text-xl mb-0">{p.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}







export function BlogSection() {
  const recentPosts = ALL_POSTS.slice(0, 2);

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-cyan-600 font-mono text-xs tracking-widest uppercase mb-3">
              Del Blog
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Recientes
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-zinc-500 hover:text-cyan-400 font-mono text-xs uppercase tracking-widest transition-colors mb-2"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group p-8 rounded-3xl bg-zinc-900/20 border border-zinc-800/40 hover:border-cyan-900/60 transition-all"
            >
              <div className="flex gap-4 mb-4">
                <span className="text-[10px] font-mono text-cyan-500 border border-cyan-500/30 px-2 py-0.5 rounded uppercase">
                  {post.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-600 uppercase">
                  {post.date}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
export function CtaSection() {
  return (
    <section className="py-24 border-t border-zinc-800/40">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-br from-cyan-900/20 to-zinc-900 border border-cyan-800/30 rounded-3xl p-12 glow-cyan">
          <p className="text-cyan-500 font-mono text-xs tracking-widest uppercase mb-4">
            Únete a la comunidad
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            La preparación empieza hoy
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            No esperes a la próxima temporada de huracanes. Comienza con lo básico:
            agua, comunicación y un plan.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:prepperspanama@proton.me"
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-cyan-900/30 inline-block"
            >
              Contactar Comunidad
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

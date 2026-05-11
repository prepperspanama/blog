import Link from "next/link"

export default function NotFound() {
  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-cyan-600 font-mono text-xs tracking-widest uppercase mb-4">
          Error 404
        </p>
        <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
          FUERA DE<br />
          <span className="text-shimmer">COBERTURA</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
          La página que buscas no existe o fue movida. Como en una red mesh,
          a veces hay que reenrutar.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
          >
            ← Volver al inicio
          </Link>
        </div>
        <div className="mt-12 font-mono text-xs text-zinc-700">
          <span className="text-green-500/50">$</span> traceroute --resilient
          <br />
          <span className="text-zinc-400"> destino no encontrado · redirigiendo a /</span>
        </div>
      </div>
    </div>
  )
}

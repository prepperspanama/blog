"use client";

import dynamic from "next/dynamic";

const GoesMap = dynamic(() => import("@/components/GoesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[500px] bg-zinc-900">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 text-sm font-mono">Inicializando GOES-19...</p>
      </div>
    </div>
  ),
});

export default function MapContainer() {
  return (
    <div className="flex-grow flex flex-col min-h-0">
      <GoesMap />
    </div>
  );
}

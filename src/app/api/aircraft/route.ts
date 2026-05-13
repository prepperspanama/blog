import { NextResponse } from "next/server";
import { checkRateLimit, isValidLat, isValidLng, getClientIp } from "@/lib/api-security";

let cache: { data: any; ts: number; bbox: string } | null = null;
const CACHE_TTL = 10_000;

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfter } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: `Demasiadas solicitudes. Intente en ${retryAfter}s.`, states: [] },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawLamin = searchParams.get("lamin") || "6";
    const rawLamax = searchParams.get("lamax") || "12";
    const rawLomin = searchParams.get("lomin") || "-85";
    const rawLomax = searchParams.get("lomax") || "-75";

    const lamin = parseFloat(rawLamin);
    const lamax = parseFloat(rawLamax);
    const lomin = parseFloat(rawLomin);
    const lomax = parseFloat(rawLomax);

    if (!isValidLat(lamin) || !isValidLat(lamax) ||
        !isValidLng(lomin) || !isValidLng(lomax) ||
        lamin >= lamax || lomin >= lomax) {
      return NextResponse.json(
        { error: "Coordenadas de bounding box inválidas.", states: [] },
        { status: 400 }
      );
    }

    const bboxKey = `${lamin},${lamax},${lomin},${lomax}`;
    const now = Date.now();

    if (cache && now - cache.ts < CACHE_TTL && cache.bbox === bboxKey) {
      return NextResponse.json(cache.data);
    }

    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lamax=${lamax}&lomin=${lomin}&lomax=${lomax}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "PreppersPanama/1.0" },
      signal: AbortSignal.timeout(8_000),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({ error: "Límite de OpenSky excedido.", states: [] }, { status: 429 });
      }
      return NextResponse.json({ error: "Servicio de aviones no disponible.", states: [] }, { status: 502 });
    }

    const json = await res.json();
    cache = { data: json, ts: now, bbox: bboxKey };
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ error: "Error al consultar aviones.", states: [] }, { status: 502 });
  }
}

"use client";

import { useEffect, useRef, useState } from "react";

interface City {
  lat: number;
  lng: number;
  name: string;
}

interface GoesLayer {
  id: string;
  label: string;
  desc: string;
  layer: string;
  baseUrl: string;
  style: string;
  icon: string;
  opacity: number;
}

interface OpenMeteoCurrent {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
  precipitation: number;
  surface_pressure: number;
}

interface OpenMeteoDaily {
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  weather_code: number[];
  wind_speed_10m_max: number[];
  wind_direction_10m_dominant: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}

interface OpenMeteoResponse {
  current: OpenMeteoCurrent;
  daily: OpenMeteoDaily;
}

interface CacheEntry {
  data: OpenMeteoResponse;
  ts: number;
}

interface AircraftState {
  icao24: string;
  callsign: string;
  origin_country: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  heading: number;
  on_ground: boolean;
}

const getLatestGoesTime = () => {
  const now = new Date();
  const date = new Date(now.getTime() - 15 * 60000);
  const minutes = date.getMinutes();
  const roundedMinutes = Math.floor(minutes / 5) * 5;
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.toISOString().split(".")[0] + "Z";
};

const GOES_LAYERS: GoesLayer[] = [
  { id: "visible", label: "Visible", desc: "Mosaico Global Visible · 3 km", layer: "observations:global_visible_imagery_mosaic", baseUrl: "https://nowcoast.noaa.gov/geoserver/observations/satellite/ows", style: "", icon: "☀️", opacity: 0.85 },
  { id: "infrared", label: "Infrarrojo", desc: "Mosaico Global Térmico · 3 km", layer: "observations:global_longwave_imagery_mosaic", baseUrl: "https://nowcoast.noaa.gov/geoserver/observations/satellite/ows", style: "", icon: "🌡️", opacity: 0.80 },
  { id: "vapor", label: "Vapor de Agua", desc: "Mosaico Global Vapor · 3 km", layer: "observations:global_water_vapor_imagery_mosaic", baseUrl: "https://nowcoast.noaa.gov/geoserver/observations/satellite/ows", style: "", icon: "💧", opacity: 0.75 },
];

const PANAMA_CITIES: City[] = [
  { lat: 8.9943, lng: -79.5188, name: "Ciudad de Panamá" },
  { lat: 8.8776, lng: -79.7801, name: "La Chorrera" },
  { lat: 8.4269, lng: -82.4311, name: "David, Chiriquí" },
  { lat: 8.7729, lng: -82.6382, name: "Volcán, Chiriquí" },
  { lat: 8.7802, lng: -82.4414, name: "Boquete, Chiriquí" },
  { lat: 8.2763, lng: -82.8687, name: "Puerto Armuelles" },
  { lat: 9.3403, lng: -82.2420, name: "Bocas del Toro" },
  { lat: 9.4300, lng: -82.5200, name: "Changuinola" },
  { lat: 9.3589, lng: -79.8978, name: "Colón" },
  { lat: 8.1057, lng: -80.9711, name: "Santiago, Veraguas" },
  { lat: 8.5189, lng: -80.3573, name: "Penonomé, Coclé" },
  { lat: 8.6042, lng: -80.1414, name: "El Valle de Antón" },
  { lat: 8.2394, lng: -80.5484, name: "Aguadulce, Coclé" },
  { lat: 7.9601, lng: -80.4288, name: "Chitré, Herrera" },
  { lat: 7.7667, lng: -80.2833, name: "Las Tablas, Los Santos" },
  { lat: 8.4100, lng: -78.1500, name: "La Palma, Darién" },
];

function wmoToLabel(code: number): { emoji: string; desc: string } {
  if (code === 0) return { emoji: "☀️", desc: "Despejado" };
  if (code <= 3) return { emoji: "⛅", desc: "Parcialmente nublado" };
  if (code <= 49) return { emoji: "🌫️", desc: "Neblina / Niebla" };
  if (code <= 59) return { emoji: "🌦️", desc: "Llovizna" };
  if (code <= 69) return { emoji: "🌧️", desc: "Lluvia" };
  if (code <= 79) return { emoji: "🌨️", desc: "Nieve / Aguanieve" };
  if (code <= 84) return { emoji: "🌦️", desc: "Chubascos" };
  if (code <= 94) return { emoji: "⛈️", desc: "Tormenta" };
  return { emoji: "⛈️", desc: "Tormenta severa" };
}

function windDirToArrow(deg: number): string {
  const dirs = ["↑N", "↗NE", "→E", "↘SE", "↓S", "↙SO", "←O", "↖NO"];
  return dirs[Math.round(deg / 45) % 8];
}

function uvLabel(index: number): string {
  if (index <= 2) return "Bajo";
  if (index <= 5) return "Moderado";
  if (index <= 7) return "Alto";
  if (index <= 10) return "Muy alto";
  return "Extremo";
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-PA", { hour: "2-digit", minute: "2-digit", hour12: false });
}

const weatherCache: Record<string, CacheEntry> = {};

async function fetchWeatherData(lat: number, lng: number): Promise<OpenMeteoResponse> {
  const key = `${lat},${lng}`;
  const now = Date.now();
  if (weatherCache[key] && now - weatherCache[key].ts < 10 * 60 * 1000) {
    return weatherCache[key].data;
  }
  const current = "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,precipitation,surface_pressure";
  const daily = "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max,sunrise,sunset";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=${current}&daily=${daily}&wind_speed_unit=kmh&timezone=America%2FPanama`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener datos climáticos");
  const data: OpenMeteoResponse = await res.json();
  weatherCache[key] = { data, ts: now };
  return data;
}

async function fetchAircraft(bounds?: { lamin: number; lamax: number; lomin: number; lomax: number }): Promise<AircraftState[]> {
  const query = bounds 
    ? `?lamin=${bounds.lamin}&lamax=${bounds.lamax}&lomin=${bounds.lomin}&lomax=${bounds.lomax}`
    : "";
  const res = await fetch(`/api/aircraft${query}`);
  if (!res.ok) throw new Error("Error al obtener datos de aviones");
  const json = await res.json();
  if (!json.states) return [];
  return json.states
    .filter((s: (number | string | boolean | null)[]) => s[5] && s[6])
    .map((s: (number | string | boolean | null)[]) => ({
      icao24: String(s[0]),
      callsign: String(s[1] || "").trim(),
      origin_country: String(s[2]),
      latitude: Number(s[6]),
      longitude: Number(s[5]),
      altitude: Number(s[7]) || 0,
      velocity: Number(s[9]) || 0,
      heading: Number(s[10]) || 0,
      on_ground: Boolean(s[8]),
    }));
}

function buildPopupHtml(cityName: string, d: OpenMeteoResponse): string {
  const c = d.current;
  const day = d.daily;
  const { emoji, desc } = wmoToLabel(c.weather_code);
  const arrow = windDirToArrow(c.wind_direction_10m);
  const todayEmoji = wmoToLabel(day.weather_code[0]);
  const sunrise = formatTime(day.sunrise[0]);
  const sunset = formatTime(day.sunset[0]);
  return `
    <div style="font-family:'Inter',monospace;min-width:230px;background:#09090b;border-radius:10px;overflow:hidden;border:1px solid #27272a">
      <div style="background:linear-gradient(135deg,#0e7490,#0369a1);padding:10px 12px 8px">
        <div style="font-size:13px;font-weight:700;color:#fff;letter-spacing:0.02em">${cityName}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px">
          <span style="font-size:11px;color:#bae6fd">${emoji} ${desc}</span>
          <span style="font-size:10px;color:#7dd3fc">Ahora</span>
        </div>
      </div>
      <div style="padding:8px 10px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
        <div style="background:#18181b;border-radius:6px;padding:6px 8px">
          <div style="font-size:9px;color:#71717a;text-transform:uppercase;letter-spacing:0.08em">Temperatura</div>
          <div style="font-size:18px;font-weight:700;color:#22d3ee">${c.temperature_2m}°C</div>
          <div style="font-size:9px;color:#52525b">Sensación ${c.apparent_temperature}°</div>
        </div>
        <div style="background:#18181b;border-radius:6px;padding:6px 8px">
          <div style="font-size:9px;color:#71717a;text-transform:uppercase;letter-spacing:0.08em">Humedad</div>
          <div style="font-size:16px;font-weight:700;color:#34d399">${c.relative_humidity_2m}%</div>
          <div style="font-size:9px;color:#52525b">Precip. ${c.precipitation} mm</div>
        </div>
        <div style="background:#18181b;border-radius:6px;padding:6px 8px">
          <div style="font-size:9px;color:#71717a;text-transform:uppercase;letter-spacing:0.08em">Viento</div>
          <div style="font-size:14px;font-weight:700;color:#fb923c">${c.wind_speed_10m} km/h</div>
          <div style="font-size:9px;color:#52525b">${arrow} ${c.wind_direction_10m}°</div>
        </div>
        <div style="background:#18181b;border-radius:6px;padding:6px 8px">
          <div style="font-size:9px;color:#71717a;text-transform:uppercase;letter-spacing:0.08em">Presión</div>
          <div style="font-size:14px;font-weight:700;color:#a78bfa">${c.surface_pressure} hPa</div>
          <div style="font-size:9px;color:#52525b">${c.precipitation > 0 ? "🌧️ " + c.precipitation + " mm" : "Sin lluvia"}</div>
        </div>
      </div>
      <div style="padding:6px 10px 4px;border-top:1px solid #27272a">
        <div style="font-size:9px;color:#71717a;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;text-align:center">Pronóstico del día</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
          <div style="background:#18181b;border-radius:6px;padding:5px 8px">
            <div style="font-size:8px;color:#71717a;text-transform:uppercase">Temp. máx/mín</div>
            <div style="font-size:13px;font-weight:700;color:#fbbf24">${day.temperature_2m_max[0]}° / ${day.temperature_2m_min[0]}°</div>
            <div style="font-size:9px;color:#52525b">${todayEmoji.emoji} ${todayEmoji.desc}</div>
          </div>
          <div style="background:#18181b;border-radius:6px;padding:5px 8px">
            <div style="font-size:8px;color:#71717a;text-transform:uppercase">Lluvia</div>
            <div style="font-size:13px;font-weight:700;color:#60a5fa">${day.precipitation_probability_max[0]}%</div>
            <div style="font-size:9px;color:#52525b">${day.precipitation_sum[0]} mm estimados</div>
          </div>
          <div style="background:#18181b;border-radius:6px;padding:5px 8px">
            <div style="font-size:8px;color:#71717a;text-transform:uppercase">Viento máx.</div>
            <div style="font-size:13px;font-weight:700;color:#fb923c">${day.wind_speed_10m_max[0]} km/h</div>
            <div style="font-size:9px;color:#52525b">${windDirToArrow(day.wind_direction_10m_dominant[0])} ${day.wind_direction_10m_dominant[0]}°</div>
          </div>
          <div style="background:#18181b;border-radius:6px;padding:5px 8px">
            <div style="font-size:8px;color:#71717a;text-transform:uppercase">Sol / UV</div>
            <div style="font-size:11px;font-weight:700;color:#fcd34d">${sunrise} — ${sunset}</div>
            <div style="font-size:9px;color:#52525b">☂️ UV ${day.uv_index_max[0]} (${uvLabel(day.uv_index_max[0])})</div>
          </div>
        </div>
      </div>
      <div style="padding:4px 12px 8px;font-size:9px;color:#3f3f46;text-align:right">
        Open-Meteo · Pronóstico del día
      </div>
    </div>
  `;
}

function buildAircraftPopupHtml(a: AircraftState): string {
  return `
    <div style="font-family:'Inter',monospace;min-width:180px;background:#09090b;border-radius:10px;overflow:hidden;border:1px solid #27272a">
      <div style="background:linear-gradient(135deg,#1e3a5f,#0c4a6e);padding:8px 10px 6px">
        <div style="font-size:13px;font-weight:700;color:#fff">${a.callsign || "N/D"}</div>
        <div style="font-size:10px;color:#93c5fd">${a.origin_country}</div>
      </div>
      <div style="padding:8px 10px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
        <div style="background:#18181b;border-radius:6px;padding:5px 7px">
          <div style="font-size:8px;color:#71717a;text-transform:uppercase">Altitud</div>
          <div style="font-size:13px;font-weight:700;color:#60a5fa">${(a.altitude * 3.28084).toFixed(0)} ft</div>
        </div>
        <div style="background:#18181b;border-radius:6px;padding:5px 7px">
          <div style="font-size:8px;color:#71717a;text-transform:uppercase">Velocidad</div>
          <div style="font-size:13px;font-weight:700;color:#34d399">${(a.velocity * 1.94384).toFixed(0)} kn</div>
        </div>
        <div style="background:#18181b;border-radius:6px;padding:5px 7px">
          <div style="font-size:8px;color:#71717a;text-transform:uppercase">Rumbo</div>
          <div style="font-size:13px;font-weight:700;color:#fb923c">${a.heading.toFixed(0)}°</div>
        </div>
        <div style="background:#18181b;border-radius:6px;padding:5px 7px">
          <div style="font-size:8px;color:#71717a;text-transform:uppercase">Estado</div>
          <div style="font-size:12px;font-weight:700;color:${a.on_ground ? "#a1a1aa" : "#22d3ee"}">${a.on_ground ? "En tierra" : "En vuelo"}</div>
        </div>
      </div>
      <div style="padding:2px 10px 6px;font-size:8px;color:#3f3f46;text-align:right">OpenSky Network</div>
    </div>
  `;
}

type LeafletInstance = typeof import("leaflet");
type LeafletMap = import("leaflet").Map;
type LeafletLayerGroup = import("leaflet").LayerGroup;
type LeafletTileLayerWMS = import("leaflet").TileLayer.WMS;

export default function GoesMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const goesLayerRef = useRef<LeafletTileLayerWMS | null>(null);
  const LRef = useRef<LeafletInstance | null>(null);
  const weatherLayerGroupRef = useRef<LeafletLayerGroup | null>(null);
  const aircraftLayerGroupRef = useRef<LeafletLayerGroup | null>(null);
  const [activeLayer, setActiveLayer] = useState<GoesLayer>(GOES_LAYERS[0]);
  const [goesOpacity, setGoesOpacity] = useState(GOES_LAYERS[0].opacity);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showAircraft, setShowAircraft] = useState(false);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setLastUpdate(now.toLocaleTimeString("es-PA", { hour: "2-digit", minute: "2-digit" }));
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;
        LRef.current = L;

        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const map = L.map(mapRef.current!, {
          center: [8.5, -80.0],
          zoom: 7,
          zoomControl: false,
          attributionControl: false,
        });

        mapInstanceRef.current = map;

        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 18, opacity: 1 }
        ).addTo(map);

        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 18, opacity: 0.7, pane: "overlayPane" }
        ).addTo(map);

        const wmsTime = getLatestGoesTime();
        const goesLayer = L.tileLayer.wms(activeLayer.baseUrl, {
          layers: activeLayer.layer,
          styles: activeLayer.style,
          format: "image/png",
          transparent: true,
          version: "1.3.0",
          opacity: goesOpacity,
          attribution: "NOAA/NESDIS GOES-19",
          time: wmsTime,
        } as any);

        goesLayer.addTo(map);
        goesLayerRef.current = goesLayer;
        goesLayer.on("load", () => setIsLoading(false));
        goesLayer.on("loading", () => setIsLoading(true));

        L.control.zoom({ position: "bottomright" }).addTo(map);
        L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

        const FullscreenControl = L.Control.extend({
          options: { position: "bottomright" },
          onAdd: function () {
            const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
            const btn = L.DomUtil.create("a", "", container);
            btn.innerHTML = "⛶";
            btn.href = "#";
            btn.title = "Pantalla completa";
            btn.style.cssText = "font-size:20px;display:flex;align-items:center;justify-content:center;width:34px;height:34px;cursor:pointer;background:#fff;color:#222;font-weight:700";

            const updateBtn = () => {
              const isFull = document.fullscreenElement === map.getContainer();
              btn.style.background = isFull ? "#09090b" : "#fff";
              btn.style.color = isFull ? "#22d3ee" : "#222";
              btn.innerHTML = isFull ? "✕" : "⛶";
              btn.title = isFull ? "Salir de pantalla completa" : "Pantalla completa";
            };

            L.DomEvent.on(btn, "click", (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              const el = map.getContainer();
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                el.requestFullscreen();
              }
            });

            document.addEventListener("fullscreenchange", updateBtn);
            return container;
          },
        });

        new FullscreenControl().addTo(map);

        weatherLayerGroupRef.current = L.layerGroup().addTo(map);
        aircraftLayerGroupRef.current = L.layerGroup().addTo(map);
      } catch (error) {
        console.error("Error al inicializar el mapa:", error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        goesLayerRef.current = null;
        weatherLayerGroupRef.current = null;
        aircraftLayerGroupRef.current = null;
      }
    };
  }, [mounted]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    if (!map || !L || !goesLayerRef.current) return;

    setIsLoading(true);
    map.removeLayer(goesLayerRef.current);

    const wmsTime = getLatestGoesTime();
    const newLayer = L.tileLayer.wms(activeLayer.baseUrl, {
      layers: activeLayer.layer,
      styles: activeLayer.style,
      format: "image/png",
      transparent: true,
      version: "1.3.0",
      opacity: goesOpacity,
      attribution: "NOAA/NESDIS GOES-19",
      time: wmsTime,
    } as any);

    newLayer.addTo(map);
    goesLayerRef.current = newLayer;
    newLayer.on("load", () => setIsLoading(false));
    newLayer.on("loading", () => setIsLoading(true));
  }, [activeLayer]);

  useEffect(() => {
    if (goesLayerRef.current) {
      goesLayerRef.current.setOpacity(goesOpacity);
    }
  }, [goesOpacity]);

  useEffect(() => {
    const L = LRef.current;
    const group = weatherLayerGroupRef.current;
    if (!L || !group) return;

    group.clearLayers();
    if (!showWeather) return;

    PANAMA_CITIES.forEach((city) => {
      const icon = L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:16px;height:16px">
            <div style="position:absolute;inset:0;border-radius:50%;background:#22d3ee;opacity:0.25;animation:weatherPulse 2s ease-in-out infinite"></div>
            <div style="position:absolute;top:3px;left:3px;width:10px;height:10px;border-radius:50%;background:#22d3ee;border:2px solid #fff;box-shadow:0 0 8px rgba(34,211,238,0.8)"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([city.lat, city.lng], { icon });

      const popup = L.popup({
        className: "weather-popup",
        closeButton: false,
        maxWidth: 300,
        offset: [0, -8],
      }).setContent(`
        <div style="font-family:monospace;font-size:11px;color:#a1a1aa;padding:6px 8px">
          <span style="color:#22d3ee">⌛</span> Cargando datos de <b style="color:#fff">${city.name}</b>…
        </div>
      `);

      marker.bindPopup(popup);

      let pinned = false;

      const handleHover = async (e: { target: { openPopup: () => void } }) => {
        if (pinned) return;
        e.target.openPopup();
        try {
          const data = await fetchWeatherData(city.lat, city.lng);
          popup.setContent(buildPopupHtml(city.name, data));
        } catch {
          popup.setContent(`<div style="font-family:monospace;font-size:11px;color:#f87171;padding:6px 8px">Error al obtener datos climáticos.</div>`);
        }
      };

      const handleUnhover = (e: { target: { closePopup: () => void } }) => {
        if (pinned) return;
        e.target.closePopup();
      };

      const handleClick = async (e: { target: { openPopup: () => void; closePopup: () => void } }) => {
        pinned = !pinned;
        if (pinned) {
          e.target.openPopup();
          try {
            const data = await fetchWeatherData(city.lat, city.lng);
            popup.setContent(buildPopupHtml(city.name, data));
          } catch {
            popup.setContent(`<div style="font-family:monospace;font-size:11px;color:#f87171;padding:6px 8px">Error al obtener datos climáticos.</div>`);
          }
        } else {
          e.target.closePopup();
        }
      };

      marker.on("mouseover", handleHover);
      marker.on("mouseout", handleUnhover);
      marker.on("click", handleClick);

      group.addLayer(marker);
    });
  }, [showWeather, mounted]);

  useEffect(() => {
    const L = LRef.current;
    const group = aircraftLayerGroupRef.current;
    if (!L || !group) return;

    group.clearLayers();
    if (!showAircraft) return;

    let active = true;

    const loadAircraft = async () => {
      try {
        const map = mapInstanceRef.current;
        let bounds;
        if (map) {
          const b = map.getBounds();
          bounds = {
            lamin: b.getSouth(),
            lamax: b.getNorth(),
            lomin: b.getWest(),
            lomax: b.getEast()
          };
        }
        
        const aircraft = await fetchAircraft(bounds);
        if (!active || !showAircraft) return;
        group.clearLayers();

        aircraft.forEach((a) => {
          const rot = a.heading;
          const icon = L.divIcon({
            className: "",
            html: `
              <div style="position:relative;width:24px;height:24px;transform:rotate(${rot}deg);transition:transform 0.3s">
                <div style="font-size:20px;line-height:24px;text-align:center;filter:drop-shadow(0 0 4px rgba(251,191,36,0.6))">✈️</div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([a.latitude, a.longitude], { icon });
          const popup = L.popup({
            className: "weather-popup",
            closeButton: false,
            maxWidth: 260,
            offset: [0, -12],
          }).setContent(buildAircraftPopupHtml(a));

          marker.bindPopup(popup);

          let pinned = false;
          marker.on("mouseover", function (e: { target: { openPopup: () => void } }) {
            if (pinned) return;
            e.target.openPopup();
          });
          marker.on("mouseout", function (e: { target: { closePopup: () => void } }) {
            if (pinned) return;
            e.target.closePopup();
          });
          marker.on("click", function (e: { target: { openPopup: () => void; closePopup: () => void } }) {
            pinned = !pinned;
            if (pinned) e.target.openPopup();
            else e.target.closePopup();
          });

          group.addLayer(marker);
        });
      } catch {
        // silently retry
      }
    };

    loadAircraft();
    const interval = setInterval(loadAircraft, 30000);

    return () => {
      active = false;
      clearInterval(interval);
      group.clearLayers();
    };
  }, [showAircraft, mounted]);

  if (!mounted) return null;

  const activeCount = [showWeather, showAircraft].filter(Boolean).length;

  return (
    <div className="flex flex-col flex-grow min-h-0">
      <div className="bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800 px-4 py-3 flex flex-wrap items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-400 text-xs font-mono uppercase tracking-wider mr-1">Canal:</span>
          {GOES_LAYERS.map((layer) => (
            <button
              key={layer.id}
              onClick={() => { setActiveLayer(layer); setGoesOpacity(layer.opacity); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${activeLayer.id === layer.id
                  ? "bg-cyan-600 text-white border border-cyan-500 shadow-lg shadow-cyan-900/30"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
                }`}
            >
              <span>{layer.icon}</span>
              {layer.label}
            </button>
          ))}
        </div>

        <span className="w-px h-6 bg-zinc-700 hidden sm:block" />

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowWeather((v) => !v)}
            title={showWeather ? "Ocultar clima" : "Mostrar clima por ciudad"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${showWeather
                ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-400/30"
                : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
              }`}
          >
            <span>🌡️</span>
            Clima
          </button>

          <button
            onClick={() => setShowAircraft((v) => !v)}
            title={showAircraft ? "Ocultar aviones" : "Mostrar aviones en tiempo real"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${showAircraft
                ? "bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/30"
                : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
              }`}
          >
            <span>✈️</span>
            Aviones
          </button>

        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-zinc-400 text-xs font-mono hidden sm:inline">Opac:</span>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={goesOpacity}
            onChange={(e) => setGoesOpacity(parseFloat(e.target.value))}
            className="w-16 sm:w-20 accent-cyan-500"
          />
          <span className="text-zinc-400 text-xs font-mono w-8">{Math.round(goesOpacity * 100)}%</span>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse inline-block" />
              Cargando...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-green-400 text-xs font-mono">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
              GOES LIVE
            </span>
          )}
        </div>
      </div>

      <div className="relative flex-grow min-h-0">
        <div ref={mapRef} className="absolute inset-0" />

        {activeCount > 0 && (
          <div className="absolute top-3 left-3 z-[999] flex flex-col gap-1.5 max-w-[220px]">
            {showWeather && (
              <div className="bg-emerald-950/90 border border-emerald-700 rounded-lg px-3 py-1.5 pointer-events-none">
                <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                  Clima: cursor o clic en ciudad
                </span>
              </div>
            )}
            {showAircraft && (
              <div className="bg-amber-950/90 border border-amber-700 rounded-lg px-3 py-1.5 pointer-events-none">
                <span className="text-amber-400 text-[11px] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse inline-block" />
                  Aviones en tiempo real · 30s
                </span>
              </div>
            )}

          </div>
        )}

        <div className="absolute bottom-4 right-20 z-[999] bg-zinc-950/90 border border-zinc-700 rounded-lg px-3 py-2 pointer-events-none">
          <div className="text-xs font-mono text-zinc-400">
            <span className="text-cyan-400">{activeLayer.icon} {activeLayer.label}</span>
            <br />
            <span className="text-zinc-400">{activeLayer.desc}</span>
            <br />
            <span className="text-zinc-400">Actualizado: {lastUpdate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

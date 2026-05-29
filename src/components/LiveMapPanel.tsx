import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MAP_CITIES = [
  { name: "Delhi NCR",  lat: 28.6139, lng: 77.2090, active: 18, utilization: 81 },
  { name: "Mumbai",     lat: 19.0760, lng: 72.8777, active: 14, utilization: 78 },
  { name: "Bengaluru",  lat: 12.9716, lng: 77.5946, active: 11, utilization: 72 },
  { name: "Hyderabad",  lat: 17.3850, lng: 78.4867, active: 7,  utilization: 55 },
  { name: "Pune",       lat: 18.5204, lng: 73.8567, active: 9,  utilization: 64 },
  { name: "Chennai",    lat: 13.0827, lng: 80.2707, active: 8,  utilization: 68 },
  { name: "Ahmedabad",  lat: 23.0225, lng: 72.5714, active: 6,  utilization: 60 },
];

type Status = "available" | "en-route" | "on-site";

type TechDot = {
  id: string;
  status: Status;
  baseLat: number;
  baseLng: number;
  angle: number;
  angularSpeed: number;
  maxRadius: number;
};

const DOT_STYLE: Record<Status, { color: string; fillColor: string }> = {
  available:  { color: "#15803d", fillColor: "#22c55e" },
  "en-route": { color: "#1d4ed8", fillColor: "#3b82f6" },
  "on-site":  { color: "#b45309", fillColor: "#f59e0b" },
};

const INITIAL_DOTS: TechDot[] = [
  // Delhi NCR
  { id: "d1", status: "en-route",  baseLat: 28.6139, baseLng: 77.2090, angle: 0,   angularSpeed: 0.042, maxRadius: 0.14 },
  { id: "d2", status: "available", baseLat: 28.6139, baseLng: 77.2090, angle: 2.1, angularSpeed: 0.021, maxRadius: 0.10 },
  { id: "d3", status: "on-site",   baseLat: 28.6139, baseLng: 77.2090, angle: 4.2, angularSpeed: 0.008, maxRadius: 0.05 },
  { id: "d4", status: "en-route",  baseLat: 28.6139, baseLng: 77.2090, angle: 1.0, angularSpeed: 0.051, maxRadius: 0.16 },
  // Mumbai
  { id: "m1", status: "available", baseLat: 19.0760, baseLng: 72.8777, angle: 0.5, angularSpeed: 0.024, maxRadius: 0.10 },
  { id: "m2", status: "en-route",  baseLat: 19.0760, baseLng: 72.8777, angle: 2.5, angularSpeed: 0.047, maxRadius: 0.15 },
  { id: "m3", status: "on-site",   baseLat: 19.0760, baseLng: 72.8777, angle: 4.8, angularSpeed: 0.009, maxRadius: 0.05 },
  { id: "m4", status: "available", baseLat: 19.0760, baseLng: 72.8777, angle: 1.8, angularSpeed: 0.019, maxRadius: 0.09 },
  // Bengaluru
  { id: "b1", status: "en-route",  baseLat: 12.9716, baseLng: 77.5946, angle: 1.0, angularSpeed: 0.038, maxRadius: 0.13 },
  { id: "b2", status: "available", baseLat: 12.9716, baseLng: 77.5946, angle: 3.2, angularSpeed: 0.022, maxRadius: 0.09 },
  { id: "b3", status: "on-site",   baseLat: 12.9716, baseLng: 77.5946, angle: 5.1, angularSpeed: 0.010, maxRadius: 0.05 },
  // Hyderabad
  { id: "h1", status: "available", baseLat: 17.3850, baseLng: 78.4867, angle: 0.8, angularSpeed: 0.020, maxRadius: 0.09 },
  { id: "h2", status: "en-route",  baseLat: 17.3850, baseLng: 78.4867, angle: 3.5, angularSpeed: 0.044, maxRadius: 0.13 },
  // Pune
  { id: "p1", status: "available", baseLat: 18.5204, baseLng: 73.8567, angle: 1.5, angularSpeed: 0.022, maxRadius: 0.09 },
  { id: "p2", status: "en-route",  baseLat: 18.5204, baseLng: 73.8567, angle: 4.0, angularSpeed: 0.041, maxRadius: 0.13 },
  { id: "p3", status: "on-site",   baseLat: 18.5204, baseLng: 73.8567, angle: 2.5, angularSpeed: 0.011, maxRadius: 0.05 },
  // Chennai
  { id: "c1", status: "available", baseLat: 13.0827, baseLng: 80.2707, angle: 0.3, angularSpeed: 0.023, maxRadius: 0.10 },
  { id: "c2", status: "en-route",  baseLat: 13.0827, baseLng: 80.2707, angle: 2.8, angularSpeed: 0.043, maxRadius: 0.14 },
  // Ahmedabad
  { id: "a1", status: "available", baseLat: 23.0225, baseLng: 72.5714, angle: 1.2, angularSpeed: 0.021, maxRadius: 0.09 },
  { id: "a2", status: "on-site",   baseLat: 23.0225, baseLng: 72.5714, angle: 3.7, angularSpeed: 0.009, maxRadius: 0.05 },
];

export function LiveMapPanel() {
  const [mounted, setMounted] = useState(false);
  const [dots, setDots] = useState<TechDot[]>(INITIAL_DOTS);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setDots((prev) =>
        prev.map((d) => ({
          ...d,
          angle: d.angle + d.angularSpeed,
        }))
      );
    }, 80);
    return () => clearInterval(id);
  }, []);

  const totalActive = MAP_CITIES.reduce((s, c) => s + c.active, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold">Live Field Map</h3>
          <p className="text-xs text-muted-foreground">Technician &amp; driver locations · live</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">{totalActive} active</span>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-border" style={{ height: 320 }}>
        {!mounted ? (
          <div className="h-full bg-muted animate-pulse" />
        ) : (
          <MapContainer
            center={[22, 79]}
            zoom={4.6}
            zoomControl={false}
            attributionControl={false}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={19}
            />

            {/* City hub rings */}
            {MAP_CITIES.map((city) => (
              <CircleMarker
                key={`hub-${city.name}`}
                center={[city.lat, city.lng]}
                radius={14}
                pathOptions={{
                  color: "#2563eb",
                  fillColor: "#3b82f6",
                  fillOpacity: 0.10,
                  weight: 1.2,
                }}
              >
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -14]}
                  opacity={1}
                  className="leaflet-city-label"
                >
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap" }}>
                    {city.name} · {city.active}
                  </span>
                </Tooltip>
              </CircleMarker>
            ))}

            {/* City center pins */}
            {MAP_CITIES.map((city) => (
              <CircleMarker
                key={`pin-${city.name}`}
                center={[city.lat, city.lng]}
                radius={3.5}
                pathOptions={{ color: "#1d4ed8", fillColor: "#1d4ed8", fillOpacity: 1, weight: 1 }}
              />
            ))}

            {/* Animated technician / driver dots */}
            {dots.map((d) => {
              const lat = d.baseLat + Math.cos(d.angle) * d.maxRadius * (0.55 + 0.45 * Math.abs(Math.sin(d.angle * 0.47)));
              const lng = d.baseLng + Math.sin(d.angle) * d.maxRadius * 1.25 * (0.55 + 0.45 * Math.abs(Math.sin(d.angle * 0.47)));
              const { color, fillColor } = DOT_STYLE[d.status];
              return (
                <CircleMarker
                  key={d.id}
                  center={[lat, lng]}
                  radius={5}
                  pathOptions={{ color, fillColor, fillOpacity: 0.9, weight: 1.2 }}
                />
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3">
        {(["available", "en-route", "on-site"] as Status[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: DOT_STYLE[s].fillColor }}
            />
            <span className="text-[11px] text-muted-foreground capitalize">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

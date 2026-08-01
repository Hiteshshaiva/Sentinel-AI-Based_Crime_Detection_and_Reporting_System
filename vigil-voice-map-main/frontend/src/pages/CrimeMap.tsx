import { useEffect, useRef } from "react";
import { useCrimeReports } from "@/hooks/use-crime-reports";
import { getCrimeColor } from "@/lib/crime-store";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function CrimeMap() {
  const reports = useCrimeReports();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([40.7128, -74.006], 13);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when reports change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    reports.forEach((report) => {
      const marker = L.circleMarker([report.latitude, report.longitude], {
        radius: 8,
        fillColor: getCrimeColor(report.crime_type),
        color: "#000",
        weight: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-size:12px"><b style="text-transform:uppercase">${report.crime_type}</b><br/>${report.description}<br/><span style="color:#999">${new Date(report.timestamp).toLocaleString()}</span></div>`
      );

      markersRef.current.push(marker);
    });

    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map((r) => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [reports]);

  return (
    <div className="h-[calc(100vh-3rem)] relative">
      <div className="absolute top-3 left-3 z-[1000] bg-card shadow-card rounded-lg px-4 py-2.5">
        <p className="text-xs font-semibold">LIVE CRIME MAP</p>
        <p className="text-[10px] text-muted-foreground font-mono-data">{reports.length} incidents plotted</p>
      </div>

      <div className="absolute bottom-4 left-3 z-[1000] bg-card shadow-card rounded-lg px-4 py-3 space-y-1.5">
        {(["theft", "assault", "fraud", "vandalism"] as const).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getCrimeColor(type) }} />
            <span className="text-[10px] uppercase tracking-wider">{type}</span>
          </div>
        ))}
      </div>

      <div ref={containerRef} className="h-full w-full" style={{ background: "#f5f5f5" }} />
    </div>
  );
}

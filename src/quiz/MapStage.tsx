import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet.heat";
import "leaflet.markercluster";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, Polyline, Polygon, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { motion } from "framer-motion";
import type { Lesson, Place, PlaceCategory } from "../types";
import type { DrawAction } from "./types";
import { categoryEmoji } from "../utils/categories";
import PlaceDrawer from "../components/PlaceDrawer";
import type { Layers } from "../components/LayerControls";
import type { CategoryFilter } from "../components/FilterControls";
import type { BaseMapId } from "../components/BaseMapControls";
import { GIS_LAYERS } from "../data/gisLayers";
import { GisLayerWrapper } from "../components/GisLayerWrapper";
import MapDecoration from "../components/MapDecoration";
import MapDecorationsGroup from "../components/MapDecorationsGroup";
import clsx from "clsx";




function ScaleControl({ enabled }: { enabled: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled) return;
    const ctl = L.control.scale({ imperial: false, position: "bottomright" });
    ctl.addTo(map);
    return () => {
      try { ctl.remove(); } catch { }
    };
  }, [enabled, map]);
  return null;
}

function HeatLayer({ points, enabled }: { points: [number, number, number][]; enabled: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled) return;
    const layer = (L as any).heatLayer(points, { radius: 26, blur: 18, maxZoom: 12 });
    layer.addTo(map);
    return () => {
      try { map.removeLayer(layer); } catch { }
    };
  }, [enabled, map, points]);
  return null;
}

function mkTextIcon(label: string) {
  return L.divIcon({
    className: "map-note",
    html: `<div class="map-note-bubble">${label}</div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

function mkIcon(em: string, active: boolean) {
  return L.divIcon({
    className: "kids-marker",
    html: `<div class="kids-pin ${active ? "active" : ""}"><span class="emoji">${em}</span><span class="pulse"></span><span class="halo"></span><span class="spark s1">✦</span><span class="spark s2">✦</span><span class="spark s3">✦</span></div>`,
    iconSize: [active ? 74 : 62, active ? 74 : 62],
    iconAnchor: [active ? 37 : 31, active ? 74 : 62],
    popupAnchor: [0, active ? -64 : -56],
  });
}

const BASEMAPS: Record<BaseMapId, { url: string; attribution: string }> = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap contributors, © CARTO",
  },
  osm: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "© OpenStreetMap contributors" },
  hot: { url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", attribution: "© OpenStreetMap contributors, HOT" },
  carto: { url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", attribution: "© OpenStreetMap contributors, © CARTO" },
  esri: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: "© Esri" },
  nova: { url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", attribution: "© OpenStreetMap contributors, © CARTO" },
};

const categoryColors: Record<PlaceCategory, string> = {
  fresh: "#22c55e",
  salty: "#3b82f6",
  mineral: "#f97316",
  energy: "#eab308",
  renewable: "#14b8a6",
  problem: "#ef4444",
  project: "#a855f7",
  agri: "#bbf7d0",
  transport: "#38bdf8",
  urban: "#c084fc",
  aquaculture: "#0ea5e9",
  waterway: "#22d3ee",
  mega: "#f472b6",
};

const categoryLabels: Partial<Record<PlaceCategory, string>> = {
  fresh: "عذبة",
  salty: "مالحة",
  mineral: "معادن",
  energy: "طاقة",
  renewable: "متجددة",
  problem: "مشكلات",
  project: "مشروعات",
  agri: "زراعي",
  transport: "نقل",
  urban: "حضري",
  aquaculture: "استزراع سمكي",
  waterway: "ممر مائي",
  mega: "قومي",
};

export default function MapStage(props: {
  lesson: Lesson;
  layers: Layers;
  filters: CategoryFilter;
  baseMap: BaseMapId;
  voiceEnabled: boolean;
  autoSpeak: boolean;
  activePlaceId: string | null;
  highlightIds: string[];
  draw: DrawAction[];
  discovered: Set<string>;
  xp: number;
  onSelectPlace: (id: string) => void;
  setFilters: (filters: CategoryFilter) => void;
  onClosePlace: () => void;
}) {
  const { lesson, layers, filters, baseMap, voiceEnabled, autoSpeak, activePlaceId, highlightIds, draw, discovered, xp, onSelectPlace, onClosePlace } = props;
  const { setFilters } = props;

  const [zoomIndex, setZoomIndex] = useState(1);
  const zoomLevels = [4.4, 5.2, 6];
  const zoomLabel = `${zoomLevels[zoomIndex].toFixed(1)}x`;

  const gameCheck = (id: string) => {
    try { (window as any).__kidsGeoGameCheck?.(id); } catch { }
  };
  const mapRef = useRef<LeafletMap | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setZoom(zoomLevels[zoomIndex]);
  }, [zoomIndex]);

  const [mapFilters, setMapFilters] = useState(filters);
  useEffect(() => {
    setMapFilters(filters);
  }, [filters]);

  const toggleCategory = (category: PlaceCategory) => {
    const next = { ...mapFilters, [category]: !mapFilters[category] };
    setMapFilters(next);
    setFilters(next);
    setZoomIndex(0);
  };

  const showAllPlaces = () => {
    const next: CategoryFilter = Object.keys(mapFilters).reduce((acc, key) => {
      acc[key as PlaceCategory] = true;
      return acc;
    }, {} as CategoryFilter);
    setMapFilters(next);
    setFilters(next);
    setZoomIndex(0);
  };

  const categoryKeys = useMemo(() => Object.keys(mapFilters || {}).sort(), [mapFilters]);

  const visiblePlaces = useMemo(() => {
    return lesson.places.filter((p) => (mapFilters[p.category] ?? true));
  }, [lesson.places, mapFilters]);

  const activePlace = useMemo(() => {
    return lesson.places.find((p) => p.id === activePlaceId) ?? null;
  }, [lesson.places, activePlaceId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activePlaceId) return;
    const p = lesson.places.find((x) => x.id === activePlaceId);
    if (!p) return;
    map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 6), { animate: true, duration: 0.9 });
  }, [activePlaceId, lesson.places]);

  const bm = BASEMAPS[baseMap] ?? BASEMAPS.hot;
  const heatPoints = useMemo<[number, number, number][]>(() => {
    return lesson.places.map((place) => {
      const weight = Math.min(1, (place.metrics?.score ?? 60) / 100 + 0.2);
      return [place.lat, place.lng, weight];
    });
  }, [lesson.places]);

  const nilePath: [number, number][] = [
    [30.0444, 31.2357],
    [30.2000, 31.5000],
    [30.5500, 31.7500],
    [30.9500, 32.1000],
    [31.3000, 32.3000],
    [31.8000, 32.5500],
    [32.3000, 33.0000],
    [33.0000, 33.8000],
  ];

  const haloZones = useMemo(() => {
    return visiblePlaces.map((place) => ({
      id: place.id,
      center: [place.lat, place.lng] as [number, number],
      radius: 20000 + (place.metrics?.importance ?? 60) * 220,
      color: categoryColors[place.category] ?? "#fff",
    }));
  }, [visiblePlaces]);

  const filteredPolygons = useMemo(() => {
    const polygons = visiblePlaces.map((place) => {
      const radius = 0.1;
      const lat = place.lat;
      const lng = place.lng;
      const pts: [number, number][] = [
        [lat - radius, lng - radius],
        [lat - radius, lng + radius],
        [lat + radius, lng + radius],
        [lat + radius, lng - radius],
      ];
      return {
        id: place.id,
        points: pts,
        color: categoryColors[place.category] ?? "#FFF",
      };
    });
    return polygons;
  }, [visiblePlaces]);

  const [riverPulse, setRiverPulse] = useState(false);
  useEffect(() => {
    setRiverPulse(true);
    const timer = window.setTimeout(() => setRiverPulse(false), 2500);
    return () => window.clearTimeout(timer);
  }, [filters]);

  return (
    <div className="relative h-full w-full rounded-[28px] overflow-hidden border border-white/10 bg-black/20 map-frame">
      <div className="map-beams" />
      <div className="map-grain" />
      <div className="map-corners" />
      {layers.showLegend ? (
        <div className="legend">
          <div className="legend-card">
            <div className="row"><span>الخريطة</span><span className="pill"><span className="dot"></span> تفاعلية</span></div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="chip"><span className="sw" style={{ background: "var(--accentA)" }}></span>مياه</span>
              <span className="chip"><span className="sw" style={{ background: "var(--accentB)" }}></span>مشروعات</span>
              <span className="chip"><span className="sw" style={{ background: "var(--accentC)" }}></span>معادن</span>
              <span className="chip"><span className="sw" style={{ background: "var(--accentD)" }}></span>زراعة</span>
            </div>
            <div className="mt-2 text-xs font-extrabold text-white/65">افتح الفلاتر علشان تقلّل الزحمة</div>
          </div>
        </div>
      ) : null}
      <div className="north"><div className="arrow"></div></div>
      <MapContainer
        ref={mapRef}
        center={[26.8, 30.8]}
        zoom={zoomLevels[zoomIndex]}
        className="h-full w-full"
        style={{ height: "100%", width: "100%", backgroundColor: "#020204" }}
      >
        <MapDecoration />

        {(layers.activeGisLayers || []).map((id) => {
          const cfg = GIS_LAYERS.find((l) => l.id === id);
          if (!cfg) return null;
          return <GisLayerWrapper key={id} config={cfg} />;
        })}

        <MapDecorationsGroup />

        {layers.showHeat ? <HeatLayer enabled={true} points={heatPoints} /> : null}
        {haloZones.map((zone) => (
          <Circle
            key={`halo-${zone.id}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              className: "map-pulse-circle",
              color: zone.color,
              weight: 1.5,
              opacity: 0.35,
              fillOpacity: 0,
            }}
          />
        ))}
        {layers.showPlaces ? visiblePlaces.map((p) => (
          <CircleMarker
            key={`sym-${p.id}`}
            center={[p.lat, p.lng]}
            radius={10}
            pathOptions={{ className: "map-symbology", color: categoryColors[p.category] ?? "#fff", weight: 1.5, fillOpacity: 0.35, fillColor: "#000" }}
          />
        )) : null}
        {filteredPolygons.map((patch) => (
          <Polygon
            key={`poly-${patch.id}`}
            positions={patch.points as any}
            pathOptions={{
              className: riverPulse ? "map-filter-patch map-filter-anim" : "map-filter-patch",
              color: patch.color,
              weight: 2,
              opacity: 0.6,
              fillOpacity: 0.06,
            }}
          />
        ))}
        <ScaleControl enabled={true} />
        <TileLayer url={bm.url} attribution={bm.attribution} />
        <Polyline positions={nilePath} pathOptions={{ className: "map-nile-river" }} />


        {/* Auto draw shapes */}
        {draw.map((d, idx) => {
          if (d.kind === "circle") {
            return (
              <>
                <Circle key={idx} center={d.center} radius={d.radiusM} pathOptions={{ className: "dash-anim-fill dash-glow" }} />
                {d.label ? <Marker position={d.center as any} icon={mkTextIcon(d.label)} /> : null}
              </>
            );
          }
          if (d.kind === "polyline") {
            const mid = d.points[Math.max(0, Math.floor(d.points.length / 2))] as any;
            return (
              <>
                <Polyline key={idx} positions={d.points} pathOptions={{ className: "dash-anim dash-glow" }} />
                {d.label ? <Marker position={mid} icon={mkTextIcon(d.label)} /> : null}
              </>
            );
          }
          if (d.kind === "polygon") {
            const mid = (d.rings?.[0]?.[0] ?? [26.8, 30.8]) as any;
            return (
              <>
                <Polygon key={idx} positions={d.rings as any} pathOptions={{ className: "dash-anim-fill dash-glow" }} />
                {d.label ? <Marker position={mid} icon={mkTextIcon(d.label)} /> : null}
              </>
            );
          }
          if (d.kind === "text") {
            return <Marker key={idx} position={d.at as any} icon={mkTextIcon(d.text)} />;
          }
          return null;
        })}

        {/* Places */}
        {layers.showPlaces ? (
          layers.showClusters ? (
            <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} maxClusterRadius={56}>
              {visiblePlaces.map((p) => {
                const em = categoryEmoji(p.category);
                const isActive = p.id === activePlaceId || highlightIds.includes(p.id);
                return (
                  <Marker
                    key={p.id}
                    position={[p.lat, p.lng]}
                    icon={mkIcon(em, isActive)}
                    eventHandlers={{ click: () => { gameCheck(p.id); setZoomIndex(zoomLevels.length - 1); onSelectPlace(p.id); } }}
                  >
                    {layers.showLabels ? (
                      <Tooltip direction="top" offset={[0, -24]} opacity={1} permanent>
                        {p.title}
                      </Tooltip>
                    ) : null}
                    <Popup>
                      <div className="min-w-[220px]">
                        <div className="font-bold">{p.title}</div>
                        <div className="text-sm opacity-80">{p.summary}</div>
                        <div className="mt-2 text-xs opacity-70">اضغط (اختيار) علشان يفتح كارت الشرح.</div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          ) : (
            visiblePlaces.map((p) => {
              const em = categoryEmoji(p.category);
              const isActive = p.id === activePlaceId || highlightIds.includes(p.id);
              return (
                <Marker
                  key={p.id}
                  position={[p.lat, p.lng]}
                  icon={mkIcon(em, isActive)}
                  eventHandlers={{ click: () => { gameCheck(p.id); setZoomIndex(zoomLevels.length - 1); onSelectPlace(p.id); } }}
                >
                  {layers.showLabels ? (
                    <Tooltip direction="top" offset={[0, -24]} opacity={1} permanent>
                      {p.title}
                    </Tooltip>
                  ) : null}
                  <Popup>
                    <div className="min-w-[220px]">
                      <div className="font-bold">{p.title}</div>
                      <div className="text-sm opacity-80">{p.summary}</div>
                      <div className="mt-2 text-xs opacity-70">اضغط (اختيار) علشان يفتح كارت الشرح.</div>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          )
        ) : null}
      </MapContainer>
      <div className="map-aurora-grid pointer-events-none" />
      <div className="map-zoom-controls glass" aria-label="zoom controls">
        <button
          className="btn text-[11px]"
          onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
          disabled={zoomIndex === 0}
        >
          اتسع
        </button>
        <span className="text-[11px] text-white/70">{zoomLabel}</span>
        <button
          className="btn text-[11px]"
          onClick={() => setZoomIndex((i) => Math.min(zoomLevels.length - 1, i + 1))}
          disabled={zoomIndex === zoomLevels.length - 1}
        >
          اقرب
        </button>
      </div>

      {/* Place drawer (rich info + image/video + voice) */}
      <PlaceDrawer
        lesson={lesson}
        place={activePlace}
        discovered={discovered}
        voiceEnabled={voiceEnabled}
        autoSpeak={autoSpeak}
        onClose={onClosePlace}
        onNavigateNext={() => {
          const idx = lesson.places.findIndex((p) => p.id === activePlaceId);
          const next = lesson.places[(idx + 1) % lesson.places.length];
          onSelectPlace(next.id);
        }}
        xp={xp}
      />

      {/* Map hint */}
      <div className="absolute left-3 bottom-3 z-[800] pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl px-3 py-2 text-xs text-white/80">
          الخريطة بتتفاعل: اختار سؤال → هتروح للمعلم تلقائي + رسم/تظليل + شرح بصوت
        </motion.div>
      </div>
    </div>
  );
}

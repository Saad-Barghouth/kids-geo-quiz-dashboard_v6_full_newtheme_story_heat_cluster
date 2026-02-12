import clsx from "clsx";
import { GIS_LAYERS } from "../data/gisLayers";

export type Layers = {
  showPlaces: boolean;
  showLabels: boolean;
  showEgypt: boolean;
  showNile: boolean;
  showDelta: boolean;
  showHeat: boolean;
  showClusters: boolean;
  showLegend: boolean;
  showCoords: boolean;
  activeGisLayers: string[];
};

export default function LayerControls(props: {
  layers: Layers;
  setLayers: (v: Layers) => void;
  headless?: boolean;
}) {
  const { layers, setLayers, headless } = props;
  const toggle = (k: keyof Layers) => {
    // @ts-ignore
    setLayers({ ...layers, [k]: !layers[k] });
  };

  const toggleGis = (id: string) => {
    const current = layers.activeGisLayers || [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    setLayers({ ...layers, activeGisLayers: next });
  };

  const Item = (p: { k: keyof Layers; label: string }) => (
    <button className={clsx("btn text-xs", layers[p.k] && "border-white/35 bg-white/10")} onClick={() => toggle(p.k)}>
      {p.label}
    </button>
  );

  const content = (
    <div className="space-y-3">
      <div>
        <div className="panel-title mb-2 text-[11px] opacity-70">طبقات الخريطة</div>
        <div className="flex flex-wrap gap-2">
          <Item k="showPlaces" label="أماكن" />
          <Item k="showLabels" label="أسماء" />
          <Item k="showEgypt" label="مصر" />
          <Item k="showNile" label="النيل" />
          <Item k="showDelta" label="الدلتا" />
          <Item k="showHeat" label="Heat" />
          <Item k="showClusters" label="تجميع" />
        </div>
      </div>

      <div>
        <div className="panel-title mb-2 text-[11px] opacity-70">خدمات GIS</div>
        <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
          {GIS_LAYERS.map((gl) => (
            <button
              key={gl.id}
              className={clsx("btn text-[10px]", (layers.activeGisLayers || []).includes(gl.id) && "border-white/35 bg-white/10")}
              onClick={() => toggleGis(gl.id)}
            >
              {gl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 border-t border-white/10 pt-2">
        <Item k="showLegend" label="Legend" />
        <Item k="showCoords" label="Coordinates" />
      </div>
    </div>
  );

  if (headless) return content;

  return (
    <div className="glass rounded-3xl p-3 shadow-soft">
      <div className="panel-title mb-2">إعدادات الطبقات</div>
      {content}
    </div>
  );
}

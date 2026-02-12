import clsx from "clsx";

export type BaseMapId = "dark" | "carto" | "osm" | "hot" | "esri" | "nova";

export default function BaseMapControls(props: {
  baseMap: BaseMapId;
  setBaseMap: (v: BaseMapId) => void;
  headless?: boolean;
}) {
  const { baseMap, setBaseMap, headless } = props;

  const Item = (p: { id: BaseMapId; label: string }) => (
    <button className={clsx("btn text-xs", baseMap === p.id && "border-white/35 bg-white/10")} onClick={() => setBaseMap(p.id)}>
      {p.label}
    </button>
  );

  const content = (
    <div className="flex flex-wrap gap-2">
      <Item id="dark" label="Dark" />
      <Item id="carto" label="Carto (أفتح)" />
      <Item id="osm" label="OSM" />
      <Item id="hot" label="OSM HOT" />
      <Item id="esri" label="Satellite" />
      <Item id="nova" label="Nova الزرقاء" />
    </div>
  );

  if (headless) return content;

  return (
    <div className="glass rounded-3xl p-3 shadow-soft">
      <div className="panel-title mb-2">شكل الخريطة</div>
      {content}
    </div>
  );
}

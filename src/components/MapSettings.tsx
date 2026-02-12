import { useState } from "react";
import clsx from "clsx";
import LayerControls, { Layers } from "./LayerControls";
import BaseMapControls, { BaseMapId } from "./BaseMapControls";
import FilterControls, { CategoryFilter } from "./FilterControls";

export default function MapSettings(props: {
    layers: Layers;
    setLayers: (v: Layers) => void;
    baseMap: BaseMapId;
    setBaseMap: (v: BaseMapId) => void;
    filters: CategoryFilter;
    setFilters: (v: CategoryFilter) => void;
}) {
    const [activeTab, setActiveTab] = useState<"layers" | "basemap" | "filters">("layers");

    return (
        <div className="glass rounded-[28px] p-2 shadow-soft flex flex-col min-h-[300px]">
            <div className="flex bg-black/20 rounded-2xl p-1 gap-1 mb-2">
                <button
                    className={clsx("flex-1 py-1.5 text-xs rounded-xl transition", activeTab === "layers" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60")}
                    onClick={() => setActiveTab("layers")}
                >
                    الطبقات
                </button>
                <button
                    className={clsx("flex-1 py-1.5 text-xs rounded-xl transition", activeTab === "filters" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60")}
                    onClick={() => setActiveTab("filters")}
                >
                    الفلاتر
                </button>
                <button
                    className={clsx("flex-1 py-1.5 text-xs rounded-xl transition", activeTab === "basemap" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60")}
                    onClick={() => setActiveTab("basemap")}
                >
                    الشكل
                </button>
            </div>

            <div className="px-1 overflow-auto flex-1">
                {activeTab === "layers" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <LayerControls layers={props.layers} setLayers={props.setLayers} headless />
                    </div>
                )}
                {activeTab === "filters" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <FilterControls filters={props.filters} setFilters={props.setFilters} headless />
                    </div>
                )}
                {activeTab === "basemap" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <BaseMapControls baseMap={props.baseMap} setBaseMap={props.setBaseMap} headless />
                    </div>
                )}
            </div>
        </div>
    );
}

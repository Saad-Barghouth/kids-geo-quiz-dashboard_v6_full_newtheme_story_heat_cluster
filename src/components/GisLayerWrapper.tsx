import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as esri from "esri-leaflet";
import L from "leaflet";
import type { GisLayerConfig } from "../data/gisLayers";

export function GisLayerWrapper({ config }: { config: GisLayerConfig }) {
    const map = useMap();

    useEffect(() => {
        let layer: L.Layer | null = null;
        console.log("Adding GIS Layer:", config.id, config.url);

        try {
            if (config.type === "feature-layer") {
                layer = esri.featureLayer({
                    url: config.url,
                    simplifyFactor: 0.5,
                    precision: 5,
                    style: () => ({
                        opacity: config.opacity ?? 0.7,
                        fillOpacity: (config.opacity ?? 0.7) * 0.5,
                    })
                });
            } else if (config.type === "map-server") {
                // Check if it's a dynamic map layer or tiled based on capabilities, 
                // but explicit type helps. Most govt mapservers are dynamic or tiled.
                // using tiledMapLayer for better performance if supported, or dynamicMapLayer.
                // Safest is dynamicMapLayer for "MapServer" unless we know it's tiled.
                // However, user said "MapServer".
                // Let's try tiled first, if it fails, fallback? No, let's use dynamicMapLayer for generic MapServers as they are often dynamic.
                // Actually, many public servers support dynamic.
                layer = esri.dynamicMapLayer({
                    url: config.url,
                    opacity: config.opacity ?? 0.7,
                    attribution: config.attribution
                });
            } else if (config.type === "wms") {
                // WMS
                layer = L.tileLayer.wms(config.url, {
                    layers: config.layers ?? '',
                    format: config.format ?? 'image/png',
                    transparent: true,
                    attribution: config.attribution,
                    opacity: config.opacity ?? 0.7
                });
            }

            if (layer) {
                layer.addTo(map);
            }
        } catch (e) {
            console.error("Failed to add layer", config.id, e);
        }

        return () => {
            if (layer) {
                map.removeLayer(layer);
            }
        };
    }, [map, config]);

    return null;
}

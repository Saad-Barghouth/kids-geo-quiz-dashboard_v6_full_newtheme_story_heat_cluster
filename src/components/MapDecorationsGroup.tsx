import { memo } from "react";
import { Polyline, CircleMarker } from "react-leaflet";

const MapDecorations = memo(() => {
    return (
        <>
            {/* Decorative Flow Lines */}
            <Polyline
                positions={[[30.0444, 31.2357], [31.2018, 29.9161]] as any}
                pathOptions={{ color: "#06B6D4", weight: 2, dashArray: "10, 10", className: "dash-anim" }}
            />
            <Polyline
                positions={[[30.0444, 31.2357], [27.2579, 33.8116]] as any}
                pathOptions={{ color: "#7C3AED", weight: 2, dashArray: "10, 10", className: "dash-anim" }}
            />
            <Polyline
                positions={[[30.0444, 31.2357], [24.0889, 32.8998]] as any}
                pathOptions={{ color: "#F97316", weight: 2, dashArray: "10, 10", className: "dash-anim" }}
            />

            {/* Dynamic Pulse Points */}
            <CircleMarker center={[30.0444, 31.2357]} radius={10} pathOptions={{ color: "#06B6D4", weight: 2, fillOpacity: 0.1, className: "pulse-ring" }} />
            <CircleMarker center={[31.2018, 29.9161]} radius={8} pathOptions={{ color: "#06B6D4", weight: 2, fillOpacity: 0.1, className: "pulse-ring" }} />
            <CircleMarker center={[24.0889, 32.8998]} radius={8} pathOptions={{ color: "#06B6D4", weight: 2, fillOpacity: 0.1, className: "pulse-ring" }} />
            <CircleMarker center={[27.2579, 33.8116]} radius={8} pathOptions={{ color: "#06B6D4", weight: 2, fillOpacity: 0.1, className: "pulse-ring" }} />
        </>
    );
});

export default MapDecorations;

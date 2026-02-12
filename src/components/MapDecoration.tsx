import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

export default function MapDecoration() {
    const map = useMap();

    useEffect(() => {
        // Add a simple graticule (grid lines) using Leaflet's built-in capabilities or custom SVG
        // For simplicity, we can use a custom SVG overlay or just draw lines.
        // Let's use a decorative SVG overlay for that "tech" look.

        return () => { };
    }, [map]);

    return (
        <div className="absolute inset-0 pointer-events-none z-[800] overflow-hidden">
            {/* HUD Corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-xl" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-xl" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/30 rounded-bl-xl" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-xl" />

            {/* Decorative Scanline */}
            <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none" />

            {/* Compass / Dashboard Element */}
            <div className="absolute right-6 top-6 w-24 h-24 border border-white/10 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="w-[90%] h-[90%] border border-dashed border-white/20 rounded-full animate-spin-slow" />
                <div className="absolute font-mono text-[10px] text-white/40 top-1">N</div>
                <div className="absolute font-mono text-[10px] text-white/40 bottom-1">S</div>
                <div className="absolute font-mono text-[10px] text-white/40 left-1">W</div>
                <div className="absolute font-mono text-[10px] text-white/40 right-1">E</div>
                <div className="w-1 h-8 bg-gradient-to-t from-transparent via-white/50 to-transparent rounded-full" />
            </div>

            {/* Data Readout Overlay */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-4 hidden lg:block">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: `${i * 0.5}s` }} />
                        <div className="w-12 h-[1px] bg-gradient-to-r from-white/40 to-transparent" />
                    </div>
                ))}
            </div>
        </div>
    );
}

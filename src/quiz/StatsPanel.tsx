import { motion } from "framer-motion";
import { Layers } from "../components/LayerControls";
import { CategoryFilter } from "../components/FilterControls";
import { Place } from "../types";

type StatsPanelProps = {
    discoveredCount: number;
    totalCount: number;
    xp: number;
    filters: CategoryFilter;
    places: Place[];
    activeGisLayers?: string[];
    discoveredIds: Set<string>;
};

const categoryLabels: Record<string, string> = {
    fresh: "مياه عذبة",
    salty: "مياه مالحة",
    mineral: "معادن",
    energy: "طاقة",
    renewable: "متجددة",
    project: "مشروعات",
    agri: "زراعة",
    transport: "نقل",
    urban: "مدن",
    aquaculture: "سمكي",
    waterway: "ممر مائي",
};

export default function StatsPanel({
    discoveredCount,
    totalCount,
    xp,
    filters,
    places,
    activeGisLayers = [],
    discoveredIds
}: StatsPanelProps) {
    const progressPercent = Math.round((discoveredCount / totalCount) * 100) || 0;

    // Advanced Geographical Analytics
    const categoryCounts = places.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const hasMediaCount = places.filter(p => p.media?.image || p.media?.video).length;
    const highImportancePlaces = places.filter(p => (p.metrics?.importance ?? 0) > 85);
    const discoveredImportance = highImportancePlaces.filter(p => discoveredIds.has(p.id)).length;

    const lastDiscovered = Array.from(discoveredIds).slice(-3).reverse().map(id => places.find(p => p.id === id)).filter(Boolean) as Place[];

    // Map Health / Sync Simulation
    const mapHealth = 95 + (activeGisLayers.length * 1);

    return (
        <div className="glass rounded-[28px] border border-white/10 p-5 shadow-soft relative overflow-hidden scanline flex flex-col gap-6">
            <div className="glow-ring animate-pulseGlow opacity-25" />

            {/* Header with Connectivity Status */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="panel-title flex items-center gap-2 text-blue-400">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        مركز ذكاء الخريطة
                    </div>
                    <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Real-time Geo-Informatics</div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-[10px] font-black text-white/80">{mapHealth}%</div>
                    <div className="text-[8px] text-green-500 font-bold uppercase">Map Syncing</div>
                </div>
            </div>

            {/* Primary Pulse Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-600/20 to-transparent rounded-3xl p-4 border border-blue-500/20 relative overflow-hidden group">
                    <div className="text-[10px] text-blue-300/60 font-bold mb-1 uppercase">إجمال الاستكشاف</div>
                    <div className="text-3xl font-black text-white tracking-tighter">{progressPercent}<span className="text-sm opacity-50 ml-0.5">%</span></div>
                    <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-transparent rounded-3xl p-4 border border-purple-500/20 relative overflow-hidden group">
                    <div className="text-[10px] text-purple-300/60 font-bold mb-1 uppercase">تفاعل البيانات</div>
                    <div className="text-3xl font-black text-white tracking-tighter">{xp}</div>
                    <div className="text-[9px] text-white/40 font-bold mt-1">Level {Math.floor(xp / 100) + 1} Architect</div>
                </div>
            </div>

            {/* Strategic Landmarks Tracer */}
            <div className="bg-white/5 rounded-3xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] text-white/50 font-bold uppercase tracking-tight">تتبع المواقع الاستراتيجية</div>
                    <div className="badge bg-orange-500/20 text-orange-400 text-[9px] border-orange-500/30">H-IMPORTANCE</div>
                </div>
                <div className="flex gap-1.5 h-1.5 mb-2">
                    {highImportancePlaces.map((p, idx) => (
                        <div
                            key={p.id}
                            className={`flex-1 rounded-full transition-all duration-500 ${discoveredIds.has(p.id) ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`}
                            title={p.title}
                        />
                    ))}
                </div>
                <div className="text-[10px] text-white/40 flex justify-between">
                    <span>{discoveredImportance} من أصل {highImportancePlaces.length} معالم كبرى</span>
                    <span className="font-bold text-white/60">{Math.round((discoveredImportance / highImportancePlaces.length) * 100) || 0}%</span>
                </div>
            </div>

            {/* Live Discovery Log */}
            <div>
                <div className="text-[11px] text-white/30 font-bold uppercase mb-3 flex items-center gap-2">
                    <span className="h-1 w-1 bg-white/30 rounded-full"></span>
                    آخر الاكتشافات الميدانية
                </div>
                <div className="space-y-2">
                    {lastDiscovered.length > 0 ? lastDiscovered.map((p, i) => (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={p.id}
                            className="flex items-center justify-between bg-black/40 rounded-2xl px-3 py-2.5 border border-white/5 hover:border-blue-500/30 transition cursor-default"
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-[10px]">📍</div>
                                <div className="text-xs font-bold text-white/90">{p.title}</div>
                            </div>
                            <div className="text-[9px] font-bold text-blue-400/70 border border-blue-500/20 rounded-md px-1.5 py-0.5">
                                {categoryLabels[p.category] || p.category}
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-[10px] text-white/20 text-center py-4 border border-dashed border-white/10 rounded-2xl italic">
                            ابدأ بالضغط على المعالم لبدء التحليل الميداني
                        </div>
                    )}
                </div>
            </div>

            {/* System Sensors Distribution */}
            <div>
                <div className="text-[11px] text-white/30 font-bold uppercase mb-3 px-1">كثافة البيانات الجغرافية</div>
                <div className="grid grid-cols-4 gap-2 px-1">
                    {Object.entries(categoryCounts).slice(0, 8).map(([cat, count]) => (
                        <div key={cat} className="flex flex-col items-center gap-1.5">
                            <div className="relative h-10 w-full bg-white/5 rounded-lg overflow-hidden border border-white/5">
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 bg-blue-500/40"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(count / totalCount) * 100}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black">{count}</div>
                            </div>
                            <div className="text-[8px] text-white/30 truncate w-full text-center uppercase tracking-tighter">{categoryLabels[cat] || cat}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer System Meta */}
            <div className="mt-2 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-white/20 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 opacity-50"></span>
                    GIS Engine Active
                </div>
                <div>Lat-Sync: {places[0]?.lat.toFixed(2)}</div>
            </div>
        </div>
    );
}

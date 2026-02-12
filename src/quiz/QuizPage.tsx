import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GlowBackground from "../components/GlowBackground";
import MapSettings from "../components/MapSettings";
import { Layers } from "../components/LayerControls";
import { CategoryFilter } from "../components/FilterControls";
import { BaseMapId } from "../components/BaseMapControls";
import type { Lesson } from "../types";
import MapStage from "./MapStage";
import QuizAssistant from "./QuizAssistant";
import type { QuizQuestion } from "./types";
import { DEFAULT_VOICE, stopSpeak } from "./voice";
import StatsPanel from "./StatsPanel";
import { buildLessonDeck } from "./questionDeck";

const DEFAULT_LAYERS: Layers = {
  showPlaces: true,
  showLabels: true,
  showEgypt: true,
  showNile: true,
  showDelta: true,
  showHeat: false,
  showClusters: true,
  showLegend: true,
  showCoords: true,
  activeGisLayers: ["egypt_minerals_overview", "world_power_plants", "egypt_water_bodies"],
};

function allOn(): CategoryFilter {
  return {
    fresh: true, salty: true, problem: true,
    project: true, mega: true,
    agri: true, transport: true, urban: true, aquaculture: true, waterway: true,
    energy: true, renewable: true, mineral: true,
  };
}

export default function QuizPage(props: { lesson: Lesson; onBack: () => void }) {
  const { lesson, onBack } = props;

  const [layers, setLayers] = useState<Layers>(DEFAULT_LAYERS);
  const [filters, setFilters] = useState<CategoryFilter>(allOn());
  const [baseMap, setBaseMap] = useState<BaseMapId>("dark");

  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [draw, setDraw] = useState<any[]>([]);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(0);


  const gainXp = (d: number) => setXp((v) => v + d);
  const [voiceEnabled, setVoiceEnabled] = useState(DEFAULT_VOICE.enabled);
  const [autoSpeak, setAutoSpeak] = useState(DEFAULT_VOICE.autoSpeak);
  const [focusedQuestion, setFocusedQuestion] = useState<QuizQuestion | null>(null);
  const deckQuestions = useMemo(() => buildLessonDeck(lesson), [lesson]);

  const totalCount = lesson.places.length;

  useEffect(() => {
    if (!focusedQuestion) return;
    const timer = window.setTimeout(() => setFocusedQuestion(null), 7000);
    return () => window.clearTimeout(timer);
  }, [focusedQuestion]);

  const focusPlace = useMemo(() => {
    if (!focusedQuestion) return null;
    const targetId = focusedQuestion.action?.flyToPlaceId ?? focusedQuestion.action?.highlightPlaceIds?.[0];
    return lesson.places.find((p) => p.id === targetId) ?? null;
  }, [focusedQuestion, lesson.places]);

  const onAnswerAction = (q: QuizQuestion) => {
    setFocusedQuestion(q);
    const a = q.action || {};

    // layers
    if (a.setLayers) setLayers((prev) => ({ ...prev, ...a.setLayers }));

    // map navigation / highlighting / draw
    if (a.flyToPlaceId) {
      setActivePlaceId(a.flyToPlaceId);
      setDiscovered((prev) => new Set(prev).add(a.flyToPlaceId!));
      setXp((x) => x + 8);
    }

    if (a.highlightPlaceIds?.length) {
      setHighlightIds(a.highlightPlaceIds);
    } else {
      setHighlightIds([]);
    }

    if (a.draw?.length) {
      setDraw(a.draw);
      setXp((x) => x + 5);
      // auto clear after a while
      window.setTimeout(() => setDraw([]), 9000);
    }

    // add bonus XP per difficulty
    setXp((x) => x + q.difficulty * 2);
  };

  const discoveredCount = discovered.size;

  return (
    <div className="h-screen w-screen text-white relative overflow-hidden">

      <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between gap-2">
        <div className="glass rounded-3xl px-4 py-2 flex items-center gap-4 relative overflow-hidden scanline">
          <div className="flex flex-col">
            <div className="text-lg font-extrabold leading-tight">{lesson.title}</div>
            <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">الخريطة التفاعلية الذكية</div>
          </div>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/50 font-bold">المكتشف</span>
              <span className="text-sm font-extrabold">{discoveredCount} / {totalCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/50 font-bold">XP</span>
              <span className="text-sm font-extrabold text-blue-400">{xp}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => { stopSpeak(); setVoiceEnabled((v) => !v); }}>
            {voiceEnabled ? "الصوت: شغال" : "الصوت: مقفول"}
          </button>
          <button className="btn" onClick={() => setAutoSpeak((v) => !v)}>
            {autoSpeak ? "AutoSpeak: ON" : "AutoSpeak: OFF"}
          </button>
          <button className="btn-strong" onClick={onBack}>رجوع للدروس</button>
        </div>
      </div>

      <div className="absolute top-[78px] left-3 right-3 bottom-3 z-30 grid grid-cols-1 lg:grid-cols-12 gap-3">

        <div className="lg:col-span-3 flex flex-col gap-3 order-3 lg:order-1 h-full pr-1 pb-2 min-h-0">
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <QuizAssistant
              onGainXp={gainXp}
              lesson={lesson}
              voiceEnabled={voiceEnabled}
              autoSpeak={autoSpeak}
              onAnswerAction={(q) => onAnswerAction(q)}
            />
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 min-h-[320px] relative">
          <MapStage
            lesson={lesson}
            layers={layers}
            filters={filters}
            baseMap={baseMap}
            voiceEnabled={voiceEnabled}
            autoSpeak={autoSpeak}
            activePlaceId={activePlaceId}
            highlightIds={highlightIds}
            draw={draw}
            discovered={discovered}
            xp={xp}
            onSelectPlace={(id) => {
              setActivePlaceId(id);
              setDiscovered((prev) => new Set(prev).add(id));
              setXp((x) => x + 6);
            }}
            setFilters={setFilters}
            onClosePlace={() => setActivePlaceId(null)}
          />
          <AnimatePresence>
            {focusedQuestion ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="absolute right-4 top-[140px] z-50 pointer-events-none"
              >
                <div className="glass rounded-2xl border border-white/20 bg-black/50 px-4 py-3 shadow-glow">
                  <div className="font-semibold">{focusedQuestion.prompt}</div>
                  {focusPlace ? (
                    <div className="text-xs text-white/60">
                      {focusPlace.title} • {focusPlace.lat.toFixed(3)}, {focusPlace.lng.toFixed(3)}
                    </div>
                  ) : (
                    <div className="text-xs text-white/60">تركيز الخريطة</div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-3 order-2 lg:order-3 h-full overflow-y-auto pr-1 pb-2 scrollbar-hide">
          <StatsPanel
            discoveredCount={discovered.size}
            totalCount={totalCount}
            xp={xp}
            filters={filters}
            places={lesson.places}
            activeGisLayers={layers.activeGisLayers}
            discoveredIds={discovered}
          />
          <MapSettings
            layers={layers}
            setLayers={setLayers}
            baseMap={baseMap}
            setBaseMap={setBaseMap}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </div>

    </div>
  );
}

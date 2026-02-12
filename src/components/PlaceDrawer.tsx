import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Lesson, Place } from "../types";

function speak(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    // Try to pick an Arabic voice if available.
    const voices = synth.getVoices?.() ?? [];
    const ar = voices.find((v) => (v.lang || "").toLowerCase().startsWith("ar"));
    if (ar) u.voice = ar;
    u.lang = ar?.lang || "ar-EG";
    u.rate = 1.02;
    u.pitch = 1.05;
    synth.speak(u);
  } catch {
    // ignore
  }
}

export default function PlaceDrawer(props: {
  lesson: Lesson;
  place: Place | null;
  discovered: Set<string>;
  onClose: () => void;
  onNavigateNext: () => void;
  xp: number;
}) {
  const { place, onClose, onNavigateNext, discovered, xp } = props;
  const [speaking, setSpeaking] = useState(false);

  const speakText = useMemo(() => {
    if (!place) return "";
    const lines: string[] = [];
    lines.push(`أهلاً! أنت الآن عند: ${place.title}.`);
    lines.push(place.summary);
    for (const d of place.details ?? []) lines.push(d);
    lines.push("لو عندك سؤال، اسأل الشات على يمين الشاشة.");
    return lines.join(" ");
  }, [place]);

  const onSpeak = () => {
    if (!place) return;
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    speak(speakText);
    setSpeaking(true);
    // stop flag automatically after a while
    window.setTimeout(() => setSpeaking(false), 9000);
  };

  return (
    <AnimatePresence>
      {place ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
          className="absolute left-4 top-4 z-[999] w-[380px] max-w-[92vw] glass rounded-[28px] p-4 shadow-glow overflow-hidden scanline"
        >
          <div className="glow-ring animate-pulseGlow" />
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-lg font-extrabold">{place.title}</div>
              <div className="text-xs text-white/70 mt-1">
                {discovered.has(place.id) ? "تم اكتشافه ✅" : "جديد ✨"} • XP: {xp}
              </div>
            </div>
            <button className="btn text-xs" onClick={onClose}>إغلاق</button>
          </div>

          {/* Media */}
          {place.media?.image ? (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 bg-black/25">
              <img src={place.media.image} alt={place.title} className="w-full h-[140px] object-cover" loading="lazy" />
            </div>
          ) : null}

          <div className="mt-3 text-sm text-white/90 leading-relaxed">{place.summary}</div>

          {place.details?.length ? (
            <ul className="mt-2 text-sm text-white/85 list-disc pl-5 space-y-1">
              {place.details.slice(0, 5).map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          ) : null}

          {place.media?.video ? (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 bg-black/25">
              <iframe
                className="w-full h-[170px]"
                src={place.media.video}
                title={place.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="panel-title">إحداثيات</div>
              <div className="font-extrabold mt-1 text-sm">
                {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="panel-title">نوع</div>
              <div className="font-extrabold mt-1 text-sm">{place.category}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button className="btn flex-1" onClick={onSpeak}>{speaking ? "إيقاف الصوت" : "اسمع الشرح 🔊"}</button>
            <button className="btn-strong flex-1" onClick={onNavigateNext}>اكمل الاستكشاف ➜</button>
          </div>

          {place.media?.source ? (
            <div className="mt-2 text-[11px] text-white/70">
              مصدر/مرجع:{" "}
              <a className="underline decoration-white/30 hover:decoration-white/70" href={place.media.source} target="_blank" rel="noreferrer">
                {place.media.attribution ?? "فتح المصدر"}
              </a>
            </div>
          ) : null}

          <div className="mt-3 text-xs text-white/70">
            تلميح: جرّب تقول للشات: "ليه المكان ده مهم؟" — "اديني أرقام/نِسَب" — "شغّل أسماء المعالم" — "ورّيني فيديو عن المكان".
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import type { QuizQuestion } from "./types";

export default function QuestionDeckPanel(props: {
  questions: QuizQuestion[];
  onPick: (q: QuizQuestion) => void;
  focusedId: string | null;
}) {
  const { questions, onPick, focusedId } = props;
  const deck = questions;

  return (
    <div className="glass relative overflow-hidden scanline rounded-[28px] border border-white/10 p-4 shadow-soft">
      <div className="glow-ring animate-pulseGlow" />

      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="panel-title">أسئلة جاهزة</div>
          <div className="text-xs text-white/60">ضغط على أي سؤال للهبوط فوراً</div>
        </div>
        <span className="badge text-[11px] font-bold bg-white/10">{deck.length} سؤال</span>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <AnimatePresence>
          {deck.map((q) => {
            const isActive = focusedId === q.id;
            return (
              <motion.button
                key={q.id}
                type="button"
                onClick={() => onPick(q)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                whileHover={{ y: -2 }}
                className={`w-full rounded-2xl border px-3 py-3 text-left transition focus:ring-2 focus:ring-white/40 ${isActive
                    ? "border-white/40 bg-white/10 shadow-[0_10px_40px_rgba(124,58,237,0.25)]"
                    : "border-white/10 bg-black/20"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-[15px] font-extrabold leading-tight text-white/95">{q.prompt}</div>
                  <span className="badge text-[10px] opacity-80">{["سهل", "متوسط", "متقدم"][q.difficulty - 1]}</span>
                </div>
                <p className="text-sm text-white/60 mt-1 line-clamp-2">{q.answer.paragraphs[0] ?? ""}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {q.answer.quickFacts?.map((fact) => (
                    <span key={fact.k} className="text-[11px] text-white/70 bg-white/10 rounded-full px-2 py-1 border border-white/10">
                      {fact.k}: {fact.v}
                    </span>
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-white/60">
                  <div>خريطة مباشرة</div>
                  <span className="badge">انطلق</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

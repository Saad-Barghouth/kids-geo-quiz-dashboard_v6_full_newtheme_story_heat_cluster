import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lesson, Place } from "../types";
import { QUESTION_BANK } from "./questionBank";
import type { QuizQuestion } from "./types";
import { findPlaceByText, pickBestQuestion, randomSample } from "./match";
import { speakEgyptian } from "./voice";

type Msg = { id: string; role: "user" | "bot"; text: string };

function joinAnswer(q: QuizQuestion) {
  const lines = [q.answer.title, ...q.answer.paragraphs];
  if (q.answer.quickFacts?.length) {
    lines.push("حقائق سريعة:");
    for (const f of q.answer.quickFacts) lines.push(`${f.k}: ${f.v}`);
  }
  return lines.join(" ");
}

export default function QuizAssistant({
  lesson,
  voiceEnabled,
  autoSpeak,
  onAnswerAction,
  onGainXp
}: {
  lesson: Lesson;
  voiceEnabled: boolean;
  autoSpeak: boolean;
  onAnswerAction: (q: QuizQuestion, place?: Place | null) => void;
  onGainXp?: (d: number) => void;
}) {
  const bank = useMemo(() => {
    const f = QUESTION_BANK.filter((q) => q.lessonId === (lesson.id as any));
    return f.length ? f : QUESTION_BANK.slice(0, 10);
  }, [lesson.id]);

  const chips = useMemo(() => randomSample(bank, 22), [bank]);

  const [messages, setMessages] = useState<Msg[]>([
    { id: "init", role: "bot", text: `أهلاً! أنا مساعدك في درس: ${lesson.title}. اسألني أي سؤال أو اختار من المقترحات.` }
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const msgContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic fix - specifically using scrollTop to avoid page shift
  useEffect(() => {
    const container = msgContainerRef.current;
    if (!container) return;

    const scrollToBottom = () => {
      container.scrollTop = container.scrollHeight;
    };

    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 50); // Fast retry
    const timer2 = setTimeout(scrollToBottom, 200); // Decent retry for heavy images/text

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [messages, typing]);

  const reply = (q: QuizQuestion, place?: Place | null) => {
    setTyping(true);
    setTimeout(() => {
      const msg: Msg = {
        id: `bot-${Date.now()}-${Math.random()}`,
        role: "bot",
        text: `【 ${q.answer.title} 】\n\n${q.answer.paragraphs.join("\n\n")}`
      };
      setMessages(prev => [...prev, msg]);
      setTyping(false);

      if (autoSpeak && voiceEnabled) {
        speakEgyptian(joinAnswer(q), { enabled: true, autoSpeak: true, rate: 1, pitch: 1, volume: 1, lang: "ar-EG" });
      }
      onGainXp?.(q.difficulty * 5);
    }, 400);
    onAnswerAction(q, place);
  };

  const send = (forced?: string) => {
    const msgText = (forced ?? text).trim();
    if (!msgText) return;

    const userMsg: Msg = { id: `user-${Date.now()}-${Math.random()}`, role: "user", text: msgText };
    setMessages(prev => [...prev, userMsg]);
    setText("");

    const picked = pickBestQuestion(bank, msgText);
    const place = findPlaceByText(lesson, msgText);

    if (picked) {
      reply(picked, place);
    } else if (place) {
      const adhoc: QuizQuestion = {
        id: `adhoc-${Date.now()}`, lessonId: lesson.id as any, difficulty: 1, prompt: msgText,
        answer: { title: place.title, paragraphs: [place.summary, ...(place.details || [])], nextSuggestions: [] },
        action: { flyToPlaceId: place.id, highlightPlaceIds: [place.id] }
      };
      reply(adhoc, place);
    } else {
      setTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: "bot", text: "عذراً، لم أفهم السؤال. حاول اختيار أحد الأسئلة المقترحة." }]);
        setTyping(false);
      }, 500);
    }
  };

  return (
    <div className="glass rounded-[32px] p-0 shadow-soft relative overflow-hidden h-full max-h-full flex flex-col border border-white/10 bg-black/10">
      {/* Header - Strictly fixed */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30 z-20">
        <div className="flex flex-col">
          <h3 className="text-sm font-black text-blue-400 leading-tight">ساحة الدردشة الذكية</h3>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none mt-1">MAP BRAIN V6</p>
        </div>
        <button
          onClick={() => setMessages([{ id: "clr", role: "bot", text: "تمت إعادة المحادثة!" }])}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-white/50 font-black transition active:scale-95"
        >
          تصفير
        </button>
      </div>

      {/* Suggested Chips Area - Fixed height with scroll */}
      <div className="shrink-0 px-5 pt-4 pb-2 z-10 bg-black/10">
        <div className="text-[10px] text-white/40 font-black uppercase mb-2 tracking-tighter">أسئلة مقترحة للنقاش</div>
        <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar-thin">
          {chips.map(c => (
            <button
              key={c.id}
              onClick={() => send(c.prompt)}
              className="bg-blue-600/10 hover:bg-blue-600/30 border border-blue-500/20 hover:border-blue-500/50 px-3 py-2 rounded-2xl text-[12px] font-black text-white/90 transition active:scale-95 shadow-md flex-grow-0"
            >
              {c.prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List Area - The only growing part with min-h-0 to trigger scroll */}
      <div
        ref={msgContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 flex flex-col gap-6 z-0 custom-scrollbar-heavy bg-black/5"
        style={{ minHeight: 0 }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className={`text-[9px] font-black uppercase mb-1.5 ${m.role === "user" ? "text-blue-400 mr-2" : "text-white/30 ml-2"}`}>
                {m.role === "user" ? "أنت" : "المساعد الذكي"}
              </div>
              <div
                className={`max-w-[88%] px-5 py-3.5 rounded-[24px] border-2 shadow-2xl whitespace-pre-line ${m.role === "user"
                    ? "bg-blue-600 border-blue-400 text-white font-black"
                    : "bg-white/10 border-white/10 text-white font-black"
                  }`}
              >
                <div className="text-[15px] leading-relaxed drop-shadow-md">{m.text}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <div className="flex gap-1.5 ml-2 py-2">
            {[0, 1, 2].map(i => (
              <span key={i} className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        )}
      </div>

      {/* Input Group Area - Fixed at bottom */}
      <div className="shrink-0 p-5 border-t border-white/10 bg-black/40 z-10">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="اسألني أي سؤال..."
            className="flex-1 bg-black/60 border-2 border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white font-black focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={() => send()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg active:scale-95"
          >
            إسال
          </button>
        </div>
      </div>
    </div>
  );
}

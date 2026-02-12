import { motion } from "framer-motion";
import type { Lesson } from "../types";

function AnimatedMascot() {
  return (
    <motion.div
      className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center p-4 bg-blue-500/10 rounded-full border-2 border-blue-400/20 shadow-[0_0_50px_rgba(59,130,246,0.2)]"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        {/* Robot Head/Body */}
        <motion.ellipse
          cx="100" cy="100" rx="70" ry="75"
          fill="url(#robotGrad)"
          stroke="#3b82f6"
          strokeWidth="4"
          animate={{
            ry: [75, 80, 75],
            y: [0, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Face Display */}
        <motion.rect
          x="55" y="65" width="90" height="60" rx="15"
          fill="#0f172a"
          stroke="#60a5fa"
          strokeWidth="2"
        />

        {/* Animated Eyes */}
        <motion.g
          animate={{
            opacity: [1, 1, 0, 1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.9, 0.92, 0.94, 1] }}
        >
          <motion.circle
            cx="80" cy="95" r="8" fill="#60a5fa"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle
            cx="120" cy="95" r="8" fill="#60a5fa"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.g>

        {/* Antenna */}
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "100px", originY: "30px" }}
        >
          <line x1="100" y1="25" x2="100" y2="45" stroke="#3b82f6" strokeWidth="4" />
          <motion.circle
            cx="100" cy="20" r="6" fill="#3b82f6"
            animate={{
              filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.g>

        {/* Arms */}
        <motion.path
          d="M30,100 Q10,100 15,130"
          fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "30px", originY: "100px" }}
        />
        <motion.path
          d="M170,100 Q190,100 185,130"
          fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round"
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "170px", originY: "100px" }}
        />

        <defs>
          <radialGradient id="robotGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>
      </svg>

      {/* Magic Aura */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-blue-400/30"
        animate={{ scale: [1, 1.2], opacity: [0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

export default function LessonSelect(props: { lessons: Lesson[]; onPick: (id: string) => void }) {
  const { lessons, onPick } = props;

  const floatingIcons = [
    { emoji: "🌍", top: "10%", left: "5%", delay: 0 },
    { emoji: "✈️", top: "20%", right: "8%", delay: 1 },
    { emoji: "🚢", bottom: "15%", left: "12%", delay: 2 },
    { emoji: "🧭", bottom: "10%", right: "10%", delay: 1.5 },
    { emoji: "🏔️", top: "50%", right: "3%", delay: 0.5 },
    { emoji: "🗺️", bottom: "40%", left: "4%", delay: 2.5 },
  ];

  return (
    <div className="h-screen w-screen text-white relative overflow-hidden flex items-center justify-center px-4 bg-aurora">
      <div className="pattern-overlay absolute inset-0 opacity-20" />

      {/* Background Floating Elements */}
      {floatingIcons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-40 select-none pointer-events-none floating-item"
          style={{ ...icon }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ delay: icon.delay, duration: 1 }}
        >
          {icon.emoji}
        </motion.div>
      ))}

      <div className="lesson-hero glass rounded-[44px] p-8 shadow-soft relative overflow-hidden scanline w-full max-w-[1200px] z-10 border-2 border-white/20">
        <div className="hero-glow" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-20">
          {/* Mascot Section - Now Pure Animation */}
          <div className="shrink-0">
            <AnimatedMascot />
          </div>

          <div className="flex-1">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-black rainbow-title text-center md:text-right"
            >
              أهلاً بك يا مستكشف! 🚀
            </motion.div>
            <motion.p
              className="mt-4 text-lg text-white/90 leading-relaxed font-bold text-center md:text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              اختر رحلتك اليوم لتبدأ في اكتشاف عجائب الخريطة التفاعلية والرد على الأسئلة الذكية!
            </motion.p>
          </div>
        </div>

        <motion.div
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hero-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {lessons.map((l, idx) => (
            <motion.button
              key={l.id}
              onClick={() => onPick(l.id)}
              className="text-right glass rounded-[32px] p-6 shadow-soft relative overflow-hidden magic-card border-2 border-white/10"
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
            >
              <div className="glow-ring opacity-30 animate-pulse" />
              <div className="flex justify-between items-start mb-3">
                <span className="text-3xl">🌟</span>
                <div className="badge bg-blue-500/20 border-blue-400/40 font-black">المستوى {idx + 1}</div>
              </div>
              <div className="text-2xl font-black mb-3">{l.title}</div>
              <div className="space-y-1.5 opacity-80">
                {l.objectives.slice(0, 2).map((o) => (
                  <div key={o} className="text-sm font-bold">• {o}</div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs">🗺️</span>
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs">🔊</span>
                </div>
                <div className="btn-strong py-2 px-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg">
                  هيا بنا! ➔
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Decorative Sparks */}
        <div className="spark s1">✨</div>
        <div className="spark s2">⭐</div>
        <div className="spark s3">✨</div>
      </div>

      {/* Screen Effects */}
      <div className="map-grain opacity-20" />
      <div className="map-aurora-grid opacity-30" />
    </div>
  );
}

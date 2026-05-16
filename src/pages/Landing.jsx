import { useMemo } from "react"
import { motion } from "framer-motion"
import { Activity, Bell, Droplets, Gauge, Sparkles } from "lucide-react"

const titleWords = ["Water", "Warden"]

const titleContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const titleWord = {
  hidden: {
    opacity: 0,
    y: 48,
    rotateX: -35,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 22, stiffness: 120, mass: 0.8 },
  },
}

const fadeSlide = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.55 + i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
}

function RippleField() {
  const rings = [0, 1, 2, 3, 4]
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      {rings.map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 h-[min(85vw,520px)] w-[min(85vw,520px)] -translate-x-1/2 -translate-y-1/2 animate-ripple-expand rounded-full border border-cyan-400/25 bg-cyan-500/[0.02] shadow-[inset_0_0_60px_rgba(34,211,238,0.06)]"
          style={{ animationDelay: `${i * 0.85}s` }}
        />
      ))}
    </div>
  )
}

function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => ({
      id: i,
      x: `${(i * 17.3) % 100}%`,
      y: `${(i * 23.7) % 100}%`,
      size: 1 + (i % 3),
      duration: 14 + (i % 9),
      delay: (i % 8) * 0.4,
    }))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-300/30 shadow-[0_0_6px_rgba(34,211,238,0.35)]"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -18, 6, -12, 0],
            x: [0, 8, -6, 4, 0],
            opacity: [0.15, 0.55, 0.25, 0.45, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

const statCards = [
  {
    label: "Aquifer head",
    value: "12.4 m",
    delta: "+0.2 m",
    icon: Droplets,
    positive: true,
  },
  {
    label: "Pump efficiency",
    value: "94%",
    delta: "+1.1%",
    icon: Gauge,
    positive: true,
  },
  {
    label: "Live drawdown",
    value: "0.8 m/h",
    delta: "Stable",
    icon: Activity,
    positive: true,
  },
  {
    label: "Alerts",
    value: "0 critical",
    delta: "2 info",
    icon: Bell,
    positive: true,
  },
]

function DashboardStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel mt-10 grid w-full max-w-4xl grid-cols-2 gap-3 p-3 sm:grid-cols-4 sm:gap-4 sm:p-4"
    >
      {statCards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + idx * 0.08, duration: 0.5 }}
          className="rounded-xl border border-white/5 bg-slate-950/40 px-3 py-3 sm:px-4 sm:py-3.5"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
              {card.label}
            </span>
            <card.icon className="h-3.5 w-3.5 shrink-0 text-cyan-400/80 sm:h-4 sm:w-4" strokeWidth={1.75} />
          </div>
          <div className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
            {card.value}
          </div>
          <div
            className={`mt-1 text-[10px] font-medium sm:text-xs ${card.positive ? "text-emerald-400/90" : "text-amber-400/90"}`}
          >
            {card.delta}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function Landing() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#020617] text-white">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 animate-float-slow" aria-hidden>
        <div className="absolute -left-[20%] top-[-10%] h-[55vh] w-[55vh] rounded-full bg-gradient-to-br from-cyan-500/25 via-sky-600/15 to-transparent blur-3xl" />
        <div className="absolute -right-[15%] bottom-[-5%] h-[50vh] w-[50vh] rounded-full bg-gradient-to-tl from-teal-400/20 via-blue-700/20 to-transparent blur-3xl" />
        <div className="absolute left-[35%] top-[60%] h-[35vh] w-[35vh] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[100px]" />
      </div>

      {/* Grid + vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[length:48px_48px] opacity-[0.65]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_72%)]"
        aria-hidden
      />

      <FloatingParticles />
      <RippleField />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
            <Droplets className="h-4 w-4 text-cyan-300" strokeWidth={2} />
          </div>
          <span className="font-display text-sm font-semibold tracking-wide text-slate-200 sm:text-base">
            Water Warden
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md sm:flex"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live monitoring
        </motion.div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-10 pt-4 text-center sm:px-8 sm:pb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/90 shadow-[0_0_40px_rgba(34,211,238,0.12)] sm:text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" strokeWidth={2} />
          Intelligence layer
        </motion.div>

        <motion.div
          variants={titleContainer}
          initial="hidden"
          animate="visible"
          className="font-display [perspective:1000px]"
        >
          <h1 className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-5xl font-extrabold leading-[1.05] tracking-tight sm:gap-x-6 sm:text-7xl md:text-8xl">
            {titleWords.map((word, i) => (
              <motion.span
                key={word}
                variants={titleWord}
                className="inline-block origin-bottom"
                style={{ perspective: "800px" }}
              >
                {i === 0 ? (
                  <span className="text-gradient-aqua drop-shadow-[0_0_40px_rgba(34,211,238,0.35)]">
                    {word}
                  </span>
                ) : (
                  <span className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(255,255,255,0.12)]">
                    {word}
                  </span>
                )}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.p
          custom={0}
          variants={fadeSlide}
          initial="hidden"
          animate="visible"
          className="mt-5 max-w-xl text-base font-medium leading-relaxed text-slate-400 sm:mt-6 sm:text-lg md:text-xl"
        >
          Smart Borewell Intelligence Platform
        </motion.p>

        <motion.p
          custom={1}
          variants={fadeSlide}
          initial="hidden"
          animate="visible"
          className="mt-3 max-w-lg text-sm text-slate-500 sm:text-base"
        >
          Unified telemetry, predictive stress signals, and operator-grade clarity for every well in your network.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <motion.button
            type="button"
            className="group relative overflow-hidden rounded-2xl px-10 py-4 text-base font-semibold tracking-wide text-slate-950 sm:px-12 sm:py-4 sm:text-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            animate={{ boxShadow: ["0 0 0 0 rgba(34,211,238,0.35)", "0 0 0 12px rgba(34,211,238,0)", "0 0 0 0 rgba(34,211,238,0)"] }}
            transition={{
              boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeOut" },
              type: "spring",
              stiffness: 400,
              damping: 22,
            }}
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 opacity-100 transition-opacity duration-300 group-hover:opacity-95" />
            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.4)_45%,transparent_55%)] bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-shimmer" />
            <span className="relative z-[1] flex items-center justify-center gap-2">
              Start
              <motion.span
                aria-hidden
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        <DashboardStrip />
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-slate-950/30 px-5 py-4 text-center text-[11px] text-slate-500 backdrop-blur-sm sm:px-8 sm:text-xs">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          Encrypted edge sync · ISO-ready audit trails · Built for field teams
        </motion.span>
      </footer>
    </div>
  )
}

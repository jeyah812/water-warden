import { useEffect, useId, useMemo, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion"

const R = 82
const CIRC = 2 * Math.PI * R
const CX = 100
const CY = 100

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n))
}

function tierForRisk(p) {
  const v = clamp(p, 0, 100)
  if (v >= 75) return "critical"
  if (v >= 50) return "high"
  if (v >= 25) return "moderate"
  return "safe"
}

const tierVisual = {
  safe: {
    label: "Safe",
    caption: "Demand within forecast buffer",
    glow: "shadow-[0_0_40px_rgba(52,211,153,0.25),0_0_80px_rgba(16,185,129,0.08)]",
    chip: "border-emerald-400/35 bg-emerald-500/15 text-emerald-100",
    ambient: "from-emerald-400/35 via-teal-400/15 to-cyan-500/25",
    pulse: false,
  },
  moderate: {
    label: "Moderate",
    caption: "Elevated stress — monitor next 24 h",
    glow: "shadow-[0_0_36px_rgba(250,204,21,0.22),0_0_72px_rgba(234,179,8,0.08)]",
    chip: "border-amber-400/40 bg-amber-500/15 text-amber-100",
    ambient: "from-amber-400/40 via-yellow-400/20 to-orange-400/20",
    pulse: false,
  },
  high: {
    label: "High Risk",
    caption: "Allocate contingency · prep tankers",
    glow: "shadow-[0_0_40px_rgba(249,115,22,0.28),0_0_80px_rgba(234,88,12,0.12)]",
    chip: "border-orange-400/45 bg-orange-500/18 text-orange-100",
    ambient: "from-orange-500/45 via-amber-500/25 to-red-500/20",
    pulse: false,
  },
  critical: {
    label: "Critical",
    caption: "Immediate curtailment protocol advised",
    glow: "shadow-[0_0_48px_rgba(239,68,68,0.4),0_0_100px_rgba(220,38,38,0.2)]",
    chip: "border-red-500/50 bg-red-500/20 text-red-100",
    ambient: "from-red-500/50 via-rose-500/35 to-red-600/25",
    pulse: true,
  },
}

function Particles({ accentClass }) {
  const pts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: `${(i * 23) % 100}%`,
        y: `${(i * 31) % 100}%`,
        d: 10 + (i % 5),
        delay: (i % 8) * 0.2,
      })),
    []
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      {pts.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute h-1 w-1 rounded-full opacity-40 ${accentClass}`}
          style={{ left: p.x, top: p.y }}
          animate={{ opacity: [0.15, 0.45, 0.2], scale: [1, 1.4, 1] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  )
}

/**
 * Apartment shortage risk — radial gauge, spring value, tiered colors and AI-monitor chrome.
 * @param {{ riskPercentage?: number; title?: string; subtitle?: string }} props
 */
export function ShortageRiskGauge({
  riskPercentage = 32,
  title = "Shortage risk",
  subtitle = "72h composite · demand vs buffer",
}) {
  const rid = useId().replace(/:/g, "")
  const grad = useMemo(
    () => ({
      safe: `srg-s-${rid}`,
      moderate: `srg-m-${rid}`,
      high: `srg-h-${rid}`,
      critical: `srg-c-${rid}`,
      filter: `srg-f-${rid}`,
    }),
    [rid]
  )

  const target = clamp(riskPercentage, 0, 100)
  const mv = useMotionValue(target)
  const spring = useSpring(mv, { stiffness: 48, damping: 17, mass: 0.5 })

  useEffect(() => {
    mv.set(target)
  }, [target, mv])

  const dashOffset = useTransform(spring, (v) => CIRC * (1 - clamp(v, 0, 100) / 100))

  const [display, setDisplay] = useState(() => Math.round(target))
  const [tier, setTier] = useState(() => tierForRisk(target))

  useMotionValueEvent(spring, "change", (v) => {
    setDisplay(Math.round(v))
    setTier(tierForRisk(v))
  })

  const tv = tierVisual[tier] ?? tierVisual.safe
  const strokeGradId = grad[tier] ?? grad.safe

  const particleTint =
    tier === "critical"
      ? "bg-red-400/50"
      : tier === "high"
        ? "bg-orange-400/50"
        : tier === "moderate"
          ? "bg-amber-400/50"
          : "bg-emerald-400/50"

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 22 } }}
      className={`relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 shadow-[0_16px_48px_rgba(2,6,23,0.55)] backdrop-blur-xl transition-shadow duration-500 sm:p-6 ${tv.glow}`}
      role="img"
      aria-label={`${title}: ${display} percent, status ${tv.label}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-30" />
      <motion.div
        className={`pointer-events-none absolute -inset-[40%] rounded-full bg-gradient-to-r opacity-25 blur-3xl ${tv.ambient}`}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      />
      <Particles accentClass={particleTint} />

      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.12]"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)",
          backgroundSize: "220% 100%",
        }}
        animate={{ backgroundPosition: ["0% center", "100% center", "0% center"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {tv.pulse ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-red-500/30"
          animate={{ opacity: [0.2, 0.65, 0.2], scale: [1, 1.015, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      <div className="relative flex flex-col items-center">
        <div className="mb-4 w-full text-left">
          <h3 className="font-display text-sm font-semibold tracking-tight text-white sm:text-base">
            {title}
          </h3>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-500 sm:text-xs">{subtitle}</p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[200px] sm:max-w-[220px]">
          <motion.div
            className={`pointer-events-none absolute inset-[-8%] rounded-full bg-gradient-to-r opacity-30 blur-2xl ${tv.ambient}`}
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />

          <svg
            className="relative z-[1] h-full w-full -rotate-90 drop-shadow-[0_0_14px_rgba(34,211,238,0.12)]"
            viewBox="0 0 200 200"
            aria-hidden
          >
            <defs>
              <linearGradient id={grad.safe} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id={grad.moderate} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <linearGradient id={grad.high} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id={grad.critical} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="55%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <filter id={grad.filter} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="rgba(148,163,184,0.12)"
              strokeWidth={11}
              strokeLinecap="round"
            />
            <motion.circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={`url(#${strokeGradId})`}
              strokeWidth={11}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              style={{ strokeDashoffset: dashOffset }}
              filter={`url(#${grad.filter})`}
            />
          </svg>

          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center pt-2">
            <span className="font-display text-4xl font-bold tabular-nums tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {display}
              <span className="text-xl font-semibold text-slate-500 sm:text-2xl">%</span>
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="mt-2 text-center"
              >
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] sm:text-xs ${tv.chip}`}
                >
                  {tv.label}
                </span>
                <p className="mx-auto mt-2 max-w-[11rem] text-[11px] font-medium leading-snug text-slate-500 sm:max-w-none sm:text-xs">
                  {tv.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

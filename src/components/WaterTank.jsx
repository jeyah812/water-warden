import { useEffect, useMemo, useState } from "react"
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion"

const THRESHOLD_WARNING = 45
const THRESHOLD_CRITICAL = 20

function tierFromLevel(pct) {
  if (pct < THRESHOLD_CRITICAL) return "critical"
  if (pct < THRESHOLD_WARNING) return "warning"
  return "healthy"
}

const tierStyles = {
  healthy: {
    liquid:
      "from-sky-700/90 via-cyan-500/85 to-teal-400/75 shadow-[inset_0_-20px_40px_rgba(34,211,238,0.35),inset_0_8px_24px_rgba(255,255,255,0.12)]",
    glow: "shadow-[0_0_48px_rgba(34,211,238,0.28),0_0_120px_rgba(14,165,233,0.12)]",
    ring: "border-cyan-400/35",
    wave: "rgba(165,243,252,0.5)",
    label: "text-cyan-200/90",
    badge: "border-cyan-400/30 bg-cyan-500/15 text-cyan-100",
  },
  warning: {
    liquid:
      "from-amber-800/90 via-amber-500/80 to-yellow-400/70 shadow-[inset_0_-16px_36px_rgba(251,191,36,0.35),inset_0_6px_20px_rgba(255,255,255,0.08)]",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.35),0_0_90px_rgba(245,158,11,0.15)]",
    ring: "border-amber-400/45",
    wave: "rgba(254,243,199,0.55)",
    label: "text-amber-200/95",
    badge: "border-amber-400/35 bg-amber-500/15 text-amber-100",
  },
  critical: {
    liquid:
      "from-red-950/95 via-red-600/85 to-rose-500/75 shadow-[inset_0_-18px_40px_rgba(248,113,113,0.45),inset_0_6px_20px_rgba(255,255,255,0.06)]",
    glow: "shadow-[0_0_52px_rgba(239,68,68,0.5),0_0_100px_rgba(220,38,38,0.3)]",
    ring: "border-red-500/55",
    wave: "rgba(254,202,202,0.6)",
    label: "text-red-200/95",
    badge: "border-red-500/40 bg-red-500/20 text-red-100",
  },
}

function WaveBand({ color, duration }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 w-[200%] -translate-y-[38%]"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <svg
        className="block h-9 w-full sm:h-11"
        viewBox="0 0 480 36"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill={color}
          d="M0,18 Q40,4 80,18 T160,18 T240,18 T320,18 T400,18 T480,18 L480,44 L0,44 Z"
        />
      </svg>
    </motion.div>
  )
}

function Bubbles({ count = 9 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 10 + ((i * 41) % 80),
        size: 2.5 + (i % 3) * 0.9,
        duration: 2.8 + (i % 6) * 0.4,
        delay: i * 0.32,
        drift: i % 2 === 0 ? 8 : -8,
      })),
    [count]
  )

  return (
    <>
      {items.map((b) => (
        <motion.div
          key={b.id}
          className="pointer-events-none absolute rounded-full bg-white/40 shadow-[0_0_6px_rgba(255,255,255,0.5)]"
          style={{
            left: `${b.left}%`,
            bottom: "0%",
            width: b.size,
            height: b.size,
          }}
          animate={{
            y: [0, -120, -200],
            x: [0, b.drift * 0.6, b.drift],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1, 0.35],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeOut",
            delay: b.delay,
          }}
        />
      ))}
    </>
  )
}

/**
 * Glass buffer tank — spring-smoothed level, aqua / amber / red tiers, waves and bubbles.
 * @param {{ level?: number; title?: string }} props
 */
export function WaterTank({ level = 68, title = "Buffer tank" }) {
  const clamped = Math.max(0, Math.min(100, level))
  const motionLevel = useMotionValue(clamped)
  const springLevel = useSpring(motionLevel, {
    stiffness: 40,
    damping: 19,
    mass: 0.52,
  })

  const heightPct = useTransform(springLevel, (v) => `${Math.max(0, Math.min(100, v))}%`)

  const [displayPct, setDisplayPct] = useState(() => Math.round(clamped))
  const [tier, setTier] = useState(() => tierFromLevel(clamped))

  useEffect(() => {
    motionLevel.set(clamped)
  }, [clamped, motionLevel])

  useMotionValueEvent(springLevel, "change", (v) => {
    const r = Math.round(v)
    setDisplayPct(r)
    setTier(tierFromLevel(v))
  })

  const styles = tierStyles[tier] ?? tierStyles.healthy
  const isWarning = tier === "warning"
  const isCritical = tier === "critical"

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[220px] sm:max-w-[260px]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className={`relative rounded-[28px] border border-white/[0.12] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-3 shadow-[0_16px_48px_rgba(2,6,23,0.55)] backdrop-blur-xl transition-shadow duration-500 ${styles.glow}`}
      >
        {isWarning ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[29px] border border-amber-400/35"
            animate={{ opacity: [0.2, 0.55, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        {isCritical ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[29px] border-2 border-red-500/50"
            animate={{ opacity: [0.25, 0.9, 0.25], boxShadow: ["0 0 0 0 rgba(239,68,68,0)", "0 0 28px 2px rgba(239,68,68,0.45)", "0 0 0 0 rgba(239,68,68,0)"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-25" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[52%] rounded-t-[28px] bg-gradient-to-b from-white/14 to-transparent opacity-35" />

        <div className="relative">
          <div className="mb-3 flex items-center justify-between gap-2 px-0.5">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">
              {title}
            </p>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tabular-nums sm:text-xs ${styles.badge}`}
            >
              {displayPct}%
            </span>
          </div>

          <div
            className={`relative mx-auto aspect-[10/17] w-[72%] overflow-hidden rounded-[22px] border bg-slate-950/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-colors duration-500 ${styles.ring}`}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={displayPct}
            aria-valuetext={`${displayPct} percent`}
            aria-label={`${title} fill level`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_38%,transparent_62%,rgba(255,255,255,0.05))]" />

            <motion.div
              className="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-[18px]"
              style={{ height: heightPct }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-t ${styles.liquid} transition-[background-image,box-shadow] duration-700`}
              />
              <div className="absolute inset-x-0 top-0 h-14 overflow-hidden sm:h-16">
                <WaveBand color={styles.wave} duration={4.2} />
                <WaveBand color={styles.wave} duration={2.9} />
              </div>
              <Bubbles count={9} />
            </motion.div>

            <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_14px_28px_rgba(255,255,255,0.07)]" />
          </div>

          <div className="mt-3 space-y-1 px-0.5 text-center">
            <p className={`font-display text-2xl font-bold tabular-nums sm:text-3xl ${styles.label}`}>
              {displayPct}
              <span className="text-lg font-semibold text-slate-500 sm:text-xl">%</span>
            </p>
            <p className="text-[11px] font-medium leading-snug text-slate-500 sm:text-xs">
              {isCritical
                ? "Critical reserve — dispatch contingency protocol"
                : isWarning
                  ? "Low buffer — schedule top-up within 6 h"
                  : "Nominal headroom · distribution stable"}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

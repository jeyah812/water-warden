import { motion } from "framer-motion"
import { useCountUp } from "../../hooks/useCountUp"

export function MetricCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  decimals = 0,
  sublabel,
  trend,
  accent = "cyan",
  delay = 0,
  enabled,
  countDuration = 1600,
}) {
  const numeric = typeof value === "number" ? value : null
  const animated = useCountUp(numeric ?? 0, {
    duration: countDuration,
    enabled: Boolean(enabled && numeric != null),
  })

  const display =
    numeric != null
      ? decimals > 0
        ? animated.toFixed(decimals)
        : Math.round(animated).toLocaleString()
      : value

  const accentRing =
    accent === "violet"
      ? "from-violet-400/40 via-fuchsia-400/15 to-transparent"
      : accent === "amber"
        ? "from-amber-400/45 via-orange-400/15 to-transparent"
        : accent === "rose"
          ? "from-rose-400/40 via-pink-400/12 to-transparent"
          : "from-cyan-400/45 via-sky-400/15 to-transparent"

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 420, damping: 22 } }}
      className="glass-card group p-5 sm:p-6"
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${accentRing} opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-xs">
            {label}
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
              {display}
            </span>
            {suffix ? (
              <span className="text-sm font-semibold text-slate-400 sm:text-base">{suffix}</span>
            ) : null}
          </div>
          {sublabel ? (
            <p className="mt-1.5 text-xs font-medium text-slate-500 sm:text-sm">{sublabel}</p>
          ) : null}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.15)] transition group-hover:border-cyan-400/35 group-hover:shadow-[0_0_32px_rgba(34,211,238,0.28)]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>

      {trend ? (
        <p className="relative mt-4 border-t border-white/[0.06] pt-3 text-xs font-semibold leading-relaxed text-cyan-200/90">
          {trend}
        </p>
      ) : null}
    </motion.article>
  )
}

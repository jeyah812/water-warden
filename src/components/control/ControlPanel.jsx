import { motion } from "framer-motion"
import { CloudRain, Flame, Waves } from "lucide-react"
import { useSimulation } from "../../context/SimulationContext"

function SliderRow({
  label,
  hint,
  icon: Icon,
  value,
  onChange,
  iconWrapClass,
  thumbClass,
  trackGradient,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01 }}
      className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-shadow hover:border-cyan-400/20 hover:shadow-[0_0_32px_rgba(34,211,238,0.08)] sm:p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] ${iconWrapClass}`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100 sm:text-base">
              {label}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">{hint}</p>
          </div>
        </div>
        <motion.span
          key={value}
          initial={{ scale: 0.88, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className={`shrink-0 rounded-lg border px-2.5 py-1 font-mono text-sm font-bold tabular-nums sm:text-base ${thumbClass}`}
        >
          {Math.round(value)}
          <span className="text-xs font-semibold text-slate-500">%</span>
        </motion.span>
      </div>

      <div className="relative pt-1">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-white/[0.07]">
          <motion.div
            className="h-full rounded-full"
            layout
            initial={false}
            animate={{ width: `${value}%` }}
            transition={{ type: "spring", stiffness: 220, damping: 32 }}
            style={{ background: trackGradient }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="ww-range relative z-[1] w-full"
          aria-label={label}
        />
      </div>
    </motion.div>
  )
}

export function ControlPanel() {
  const { rainfall, waterDemand, summerHeat, setRainfall, setWaterDemand, setSummerHeat } = useSimulation()

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.55),0_0_0_1px_rgba(34,211,238,0.08)_inset] backdrop-blur-2xl sm:p-7"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sky-600/20 blur-3xl" />

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background:
            "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["0% center", "100% center", "0% center"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400/90 sm:text-xs">
            Simulation console
          </p>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            Environmental controls
          </h3>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            Adjust inputs — reservoir levels, shortage gauges, and fleet KPIs update in real time from the shared
            model.
          </p>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2 self-start rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200/95"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live model
        </motion.div>
      </div>

      <div className="relative grid gap-4 lg:grid-cols-3">
        <SliderRow
          label="Rainfall"
          hint="Recharge & surface runoff — lifts buffers"
          icon={CloudRain}
          value={rainfall}
          onChange={setRainfall}
          iconWrapClass="text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          thumbClass="border-cyan-400/35 bg-cyan-500/15 text-cyan-100"
          trackGradient="linear-gradient(90deg, #22d3ee, #0ea5e9)"
          delay={0.04}
        />
        <SliderRow
          label="Water demand"
          hint="Apartment draw & irrigation load"
          icon={Waves}
          value={waterDemand}
          onChange={setWaterDemand}
          iconWrapClass="text-violet-300 shadow-[0_0_20px_rgba(167,139,250,0.2)]"
          thumbClass="border-violet-400/35 bg-violet-500/15 text-violet-100"
          trackGradient="linear-gradient(90deg, #a78bfa, #6366f1)"
          delay={0.1}
        />
        <SliderRow
          label="Summer heat"
          hint="Evaporation & thermal load on pumps"
          icon={Flame}
          value={summerHeat}
          onChange={setSummerHeat}
          iconWrapClass="text-orange-300 shadow-[0_0_20px_rgba(251,146,60,0.22)]"
          thumbClass="border-orange-400/35 bg-orange-500/15 text-orange-100"
          trackGradient="linear-gradient(90deg, #fb923c, #f97316)"
          delay={0.16}
        />
      </div>
    </motion.section>
  )
}

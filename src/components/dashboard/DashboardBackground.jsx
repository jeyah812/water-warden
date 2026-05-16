import { useMemo } from "react"
import { motion } from "framer-motion"

export function DashboardBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: `${(i * 19.1) % 100}%`,
        y: `${(i * 27.3) % 100}%`,
        s: 1 + (i % 2),
        d: 16 + (i % 11),
        delay: (i % 10) * 0.35,
      })),
    []
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 animate-float-slow"
        aria-hidden
      >
        <div className="absolute -left-[18%] top-[-8%] h-[52vh] w-[52vh] rounded-full bg-gradient-to-br from-cyan-500/22 via-sky-600/12 to-transparent blur-3xl" />
        <div className="absolute -right-[12%] bottom-[-6%] h-[48vh] w-[48vh] rounded-full bg-gradient-to-tl from-teal-400/16 via-blue-700/18 to-transparent blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[38vh] w-[38vh] -translate-x-1/2 rounded-full bg-cyan-400/8 blur-[120px]" />
      </motion.div>
      <div
        className="absolute inset-0 bg-grid-faint bg-[length:40px_40px] opacity-50"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(34,211,238,0.12),transparent_55%)]"
        aria-hidden
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-200/25 shadow-[0_0_8px_rgba(34,211,238,0.25)]"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
          animate={{
            y: [0, -14, 8, -10, 0],
            x: [0, 6, -5, 4, 0],
            opacity: [0.12, 0.45, 0.2, 0.38, 0.12],
          }}
          transition={{
            duration: p.d,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

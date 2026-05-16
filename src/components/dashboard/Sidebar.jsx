import { motion } from "framer-motion"
import {
  BarChart3,
  Binary,
  LayoutDashboard,
  Layers,
  PanelLeftClose,
  PanelLeft,
  Settings,
  Sparkles,
} from "lucide-react"
import { useMedia } from "../../hooks/useMedia"

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "prediction", label: "Prediction", icon: Sparkles },
  { id: "allocation", label: "Allocation", icon: Layers },
  { id: "simulation", label: "Simulation", icon: Binary },
  { id: "settings", label: "Settings", icon: Settings },
]

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  activeId,
  setActiveId,
}) {
  const isLg = useMedia("(min-width: 1024px)")

  const width = !isLg ? 280 : collapsed ? 76 : 268

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <motion.aside
        initial={false}
        animate={{ width }}
        transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.7 }}
        className={`fixed left-0 top-0 z-50 flex h-full max-h-screen flex-col border-r border-white/[0.09] bg-slate-950/75 shadow-[8px_0_48px_rgba(2,6,23,0.65)] backdrop-blur-2xl transition-transform duration-300 ease-out lg:relative lg:z-20 lg:max-h-none lg:translate-x-0 lg:shadow-none lg:transition-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] px-3">
          <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/35 bg-cyan-500/15 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
              <span className="font-display text-sm font-bold text-cyan-200">W</span>
            </div>
            <motion.span
              animate={{ opacity: collapsed && isLg ? 0 : 1, width: collapsed && isLg ? 0 : "auto" }}
              className="font-display truncate text-sm font-semibold tracking-wide text-slate-100 lg:whitespace-nowrap"
            >
              Water Warden
            </motion.span>
          </div>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((c) => !c)}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-400/30 hover:bg-white/[0.04] hover:text-cyan-200 lg:flex"
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2.5">
          {NAV.map((item, i) => {
            const active = activeId === item.id
            return (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => {
                  setActiveId(item.id)
                  setMobileOpen(false)
                }}
                className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${
                  active
                    ? "bg-cyan-500/15 text-cyan-100"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="navGlow"
                    className="absolute inset-0 rounded-xl border border-cyan-400/25 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <item.icon
                  className={`relative z-[1] h-[18px] w-[18px] shrink-0 ${
                    active ? "text-cyan-300" : "text-slate-500 group-hover:text-cyan-200/90"
                  }`}
                  strokeWidth={1.75}
                />
                <span
                  className={`relative z-[1] text-sm font-medium transition-opacity ${
                    collapsed && isLg ? "sr-only" : ""
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </nav>

        <div className="shrink-0 border-t border-white/[0.06] p-3">
          <div
            className={`rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-2 ${
              collapsed && isLg ? "px-1.5" : ""
            }`}
          >
            <p
              className={`text-[10px] font-medium uppercase tracking-wider text-slate-500 ${
                collapsed && isLg ? "sr-only" : ""
              }`}
            >
              City cluster
            </p>
            <p
              className={`truncate text-xs font-semibold text-slate-300 ${
                collapsed && isLg ? "sr-only" : ""
              }`}
            >
              Bengaluru Metro · Zone 4
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

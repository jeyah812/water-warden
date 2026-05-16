import { motion } from "framer-motion"
import { Bell, Droplets, Menu, User } from "lucide-react"

export function TopNav({ onOpenMobileSidebar }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/60 px-4 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10">
            <Droplets className="h-4 w-4 text-cyan-300" />
          </div>

          <div>
            <h1 className="font-bold text-white">Water Warden</h1>
            <p className="text-xs text-slate-500">
              Smart-city water intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 sm:flex">
          ● Live
        </div>

        <button className="relative rounded-xl border border-white/10 p-2 text-slate-300">
          <Bell className="h-5 w-5" />
        </button>

        <button className="rounded-xl border border-white/10 p-2 text-slate-300">
          <User className="h-5 w-5" />
        </button>
      </div>
    </motion.header>
  )
}
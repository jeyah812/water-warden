import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, Droplets, Gauge, Truck, Waves } from "lucide-react"
import { ControlPanel } from "../components/control/ControlPanel"
import { ShortageRiskGauge } from "../components/ShortageRiskGauge"
import { WaterTank } from "../components/WaterTank"
import { SimulationProvider, useSimulation } from "../context/SimulationContext"
import { DashboardBackground } from "../components/dashboard/DashboardBackground"
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton"
import { MetricCard } from "../components/dashboard/MetricCard"
import { Sidebar } from "../components/dashboard/Sidebar"
import { TopNav } from "../components/dashboard/TopNav"

function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeId, setActiveId] = useState("dashboard")
  const [loading, setLoading] = useState(true)

  const { metrics, rainfall, waterDemand, summerHeat } = useSimulation()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750)
    return () => clearTimeout(t)
  }, [])

  const trends = useMemo(() => {
    const { shortageRiskPct, tankerTrips } = metrics
    return {
      supply:
        rainfall > 65
          ? "Rain-assisted inflow · network headroom expanding"
          : rainfall < 28
            ? "Dry pattern · conserve non-priority draws"
            : "Municipal blend tracking near forecast",
      demand:
        waterDemand > 72
          ? "Peak load surge · evening window stressed"
          : waterDemand < 32
            ? "Subdued apartment draw · off-peak curve"
            : "Diurnal demand within design band",
      borewell:
        summerHeat > 72
          ? "Thermal derating · watch pump vibration & intake temp"
          : summerHeat < 30
            ? "Cool-run efficiency · optimal band"
            : "Fleet margin nominal vs heat index",
      shortage:
        shortageRiskPct >= 75
          ? "Critical corridor · execute curtailment playbook"
          : shortageRiskPct >= 50
            ? "High stress · prep tanker escalations"
            : shortageRiskPct >= 25
              ? "Buffer watch · maintain 12 h slack"
              : "Contingency lanes idle · buffers healthy",
      tanker:
        tankerTrips > 26
          ? "Dispatch probability elevated across wards"
          : tankerTrips < 10
            ? "Low contingency routing · fleet standby"
            : "Escalation rate within weekly norm",
    }
  }, [metrics, rainfall, waterDemand, summerHeat])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020617] text-slate-100">
      <DashboardBackground />

      <div className="relative flex min-h-screen w-full">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          activeId={activeId}
          setActiveId={setActiveId}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav onOpenMobileSidebar={() => setMobileOpen(true)} />

          <motion.main
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-1"
          >
            <div className="mx-auto max-w-[1600px] px-4 pb-12 pt-2 sm:px-6 sm:pt-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.45 }}
                className="mb-6 flex flex-col gap-1 sm:mb-8"
              >
                <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Operations overview
                </h2>
                <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
                  Environmental simulation drives KPIs below — adjust rainfall, demand, and heat to stress-test the
                  estate model.
                </p>
              </motion.div>

              <div className="mb-10">
                <ControlPanel />
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="sk"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <DashboardSkeleton />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-10"
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                      <MetricCard
                        icon={Droplets}
                        label="Water Supply"
                        value={metrics.supplyMld}
                        suffix="MLD"
                        decimals={2}
                        sublabel="Municipal blend · Zone 4"
                        trend={trends.supply}
                        accent="cyan"
                        delay={0}
                        enabled={!loading}
                        countDuration={520}
                      />
                      <MetricCard
                        icon={Waves}
                        label="Demand"
                        value={metrics.demandMld}
                        suffix="MLD"
                        decimals={2}
                        sublabel="Modeled consumption"
                        trend={trends.demand}
                        accent="violet"
                        delay={0.05}
                        enabled={!loading}
                        countDuration={520}
                      />
                      <MetricCard
                        icon={Gauge}
                        label="Borewell State"
                        value={metrics.borewellPct}
                        suffix="%"
                        decimals={0}
                        sublabel="Fleet health index"
                        trend={trends.borewell}
                        accent="cyan"
                        delay={0.1}
                        enabled={!loading}
                        countDuration={520}
                      />
                      <MetricCard
                        icon={AlertTriangle}
                        label="Shortage Risk"
                        value={metrics.shortageRiskPct}
                        suffix="%"
                        decimals={0}
                        sublabel="72h forward stress"
                        trend={trends.shortage}
                        accent="amber"
                        delay={0.15}
                        enabled={!loading}
                        countDuration={520}
                      />
                      <MetricCard
                        icon={Truck}
                        label="Tanker Requirement"
                        value={metrics.tankerTrips}
                        suffix="trips / day"
                        decimals={0}
                        sublabel="Escalations + routing"
                        trend={trends.tanker}
                        accent="rose"
                        delay={0.2}
                        enabled={!loading}
                        countDuration={520}
                      />
                    </div>

                    <section className="border-t border-white/[0.06] pt-10">
                      <div className="mb-6 flex flex-col gap-1 sm:mb-8">
                        <h3 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                          Apartment shortage risk
                        </h3>
                        <p className="max-w-2xl text-sm text-slate-500">
                          Per-tower view from the live model. Bands: Safe below 25%, Moderate 25–49%, High Risk 50–74%,
                          Critical 75% and above.
                        </p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {metrics.gauges.map((g) => (
                          <ShortageRiskGauge
                            key={g.id}
                            title={g.title}
                            subtitle={g.subtitle}
                            riskPercentage={g.risk}
                          />
                        ))}
                      </div>
                    </section>

                    <motion.section
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="border-t border-white/[0.06] pt-10"
                    >
                      <div className="mb-6 flex flex-col gap-1 sm:mb-8">
                        <h3 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                          Reservoir monitors
                        </h3>
                        <p className="max-w-2xl text-sm text-slate-500">
                          Buffer levels respond to rainfall (recharge), demand (drawdown), and heat (evaporation /
                          losses).
                        </p>
                      </div>
                      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                        {metrics.tanks.map((t) => (
                          <WaterTank key={t.id} title={t.title} level={t.level} />
                        ))}
                      </div>
                    </motion.section>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <SimulationProvider>
      <DashboardShell />
    </SimulationProvider>
  )
}

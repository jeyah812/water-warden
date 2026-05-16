import { createContext, useContext, useMemo, useState } from "react"
import { computeMetrics } from "../simulation/computeMetrics"

const SimulationContext = createContext(null)

const DEFAULT = {
  rainfall: 44,
  waterDemand: 46,
  summerHeat: 32,
}

export function SimulationProvider({ children }) {
  const [rainfall, setRainfall] = useState(DEFAULT.rainfall)
  const [waterDemand, setWaterDemand] = useState(DEFAULT.waterDemand)
  const [summerHeat, setSummerHeat] = useState(DEFAULT.summerHeat)

  const sliders = useMemo(
    () => ({ rainfall, waterDemand, summerHeat }),
    [rainfall, waterDemand, summerHeat]
  )

  const metrics = useMemo(() => computeMetrics(sliders), [sliders])

  const value = useMemo(
    () => ({
      ...sliders,
      setRainfall,
      setWaterDemand,
      setSummerHeat,
      metrics,
    }),
    [sliders, metrics]
  )

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}

export function useSimulation() {
  const ctx = useContext(SimulationContext)
  if (!ctx) throw new Error("useSimulation must be used within SimulationProvider")
  return ctx
}

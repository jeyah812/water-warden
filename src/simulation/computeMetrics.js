function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n))
}

/**
 * @param {{ rainfall: number; waterDemand: number; summerHeat: number }} s — each 0–100
 */
export function computeMetrics(s) {
  const r = clamp(s.rainfall, 0, 100) / 100
  const d = clamp(s.waterDemand, 0, 100) / 100
  const h = clamp(s.summerHeat, 0, 100) / 100

  const supplyMld = clamp(3.45 + r * 1.15 - h * 0.42 + d * 0.06, 2.75, 5.45)
  const demandMld = clamp(2.85 + d * 1.42 + h * 0.18 - r * 0.1, 2.35, 5.85)

  const borewellPct = Math.round(clamp(95 - h * 44 - d * 14 + r * 11, 16, 100))

  const shortageRiskPct = Math.round(clamp(6 + d * 56 - r * 40 + h * 24, 0, 100))

  const tankerTrips = Math.round(clamp(4 + d * 24 - r * 14 + h * 9, 0, 44))

  const baseTank = clamp(54 + r * 36 - d * 30 - h * 12, 5, 96)
  const tanks = [
    { id: "north", title: "North buffer", level: Math.round(clamp(baseTank + 10 - d * 8, 5, 98)) },
    { id: "metro", title: "Metro ring", level: Math.round(clamp(baseTank - 6 + h * 5, 5, 98)) },
    { id: "reserve", title: "Deep reserve", level: Math.round(clamp(baseTank - 16 + r * 8, 5, 98)) },
  ]

  const gaugeOffsets = [-14, 4, 14, 22]
  const gauges = [
    { id: "t-a", title: "Tower A · North", subtitle: "Residential · 240 units" },
    { id: "t-b", title: "Tower B · Metro", subtitle: "Mixed-use · peak load" },
    { id: "t-c", title: "Tower C · East", subtitle: "High-rise · aging pumps" },
    { id: "t-d", title: "Tower D · South", subtitle: "Stress test corridor" },
  ].map((g, i) => ({
    ...g,
    risk: Math.round(clamp(shortageRiskPct + gaugeOffsets[i], 0, 100)),
  }))

  return {
    supplyMld,
    demandMld,
    borewellPct,
    shortageRiskPct,
    tankerTrips,
    tanks,
    gauges,
  }
}

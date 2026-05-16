import { useEffect, useRef, useState } from "react"

export function useCountUp(target, { duration = 1500, enabled = true } = {}) {
  const [value, setValue] = useState(0)
  const latestRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      setValue(0)
      latestRef.current = 0
      return
    }

    const from = latestRef.current
    const start = performance.now()
    let raf

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      const v = from + (target - from) * eased
      setValue(v)
      latestRef.current = v
      if (t < 1) raf = requestAnimationFrame(tick)
      else latestRef.current = target
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, enabled])

  return value
}

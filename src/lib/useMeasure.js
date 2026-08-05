import { useEffect, useRef, useState } from 'react'

/**
 * Width of an element, tracked live.
 *
 * Charts need it because they stretch to fill their card: drawing
 * into a fixed viewBox and letting the SVG scale would squash the
 * horizontal axis, which flattens every curve. Measuring lets each
 * chart plot in real pixels, so a slope reads the same at 170px in a
 * vitals tile as it does at 560px in a pattern card.
 */
export function useMeasure(fallback = 240) {
  const ref = useRef(null)
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width)
      if (w > 0) setWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, width]
}

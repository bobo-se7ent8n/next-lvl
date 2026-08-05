import { createContext, useCallback, useContext, useMemo, useState } from 'react'

/* ============================================================
   BACKGROUND STATE

   Three independent layers sit behind everything: vertical lines,
   grain, and a generated ASCII character field. Each has its own
   `on` switch, so any combination — including all three off, which
   leaves a plain canvas — is a valid state.

   Everything a layer needs is here rather than inside the layer, so
   the dev panel can drive them live without the layers re-mounting.
   ============================================================ */

const DEFAULTS = {
  lines: {
    on: true,
    count: 24, // lines across the viewport
    width: 1, // px
    opacity: 0.5, // 0..1, scaled again by the ink tint below
  },
  grain: {
    on: true,
    amount: 0.7, // contrast of the noise itself
    scale: 1.4, // larger = coarser noise
    opacity: 0.3, // how strongly the layer sits over the page
  },
  ascii: {
    on: true,
    mode: 'random', // 'random' | 'image'
    /* Defaults are deliberately sparse and pale: the field is meant
       to read as faint paper texture from across the room, not as a
       screen full of digits competing with the content. Everything
       below is live-tunable from the panel. */
    cell: 26, // px per grid cell — the pattern's resolution
    fontSize: 10,
    opacity: 0.1,
    seed: 20260805,
    imageSrc: null, // data URL from the file input
  },
}

const Ctx = createContext(null)

export const useBackground = () => useContext(Ctx)

export function BackgroundProvider({ children }) {
  const [lines, setLines] = useState(DEFAULTS.lines)
  const [grain, setGrain] = useState(DEFAULTS.grain)
  const [ascii, setAscii] = useState(DEFAULTS.ascii)

  const patch = (setter) => (key, value) =>
    setter((s) => ({ ...s, [key]: value }))

  const regenerate = useCallback(
    () =>
      setAscii((s) => ({
        ...s,
        mode: 'random',
        seed: Math.floor(Math.random() * 2 ** 31),
      })),
    []
  )

  const loadImage = useCallback((file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () =>
      setAscii((s) => ({ ...s, mode: 'image', imageSrc: reader.result }))
    reader.readAsDataURL(file)
  }, [])

  const value = useMemo(
    () => ({
      lines,
      grain,
      ascii,
      setLine: patch(setLines),
      setGrain: patch(setGrain),
      setAscii: patch(setAscii),
      regenerate,
      loadImage,
      reset: () => {
        setLines(DEFAULTS.lines)
        setGrain(DEFAULTS.grain)
        setAscii(DEFAULTS.ascii)
      },
    }),
    [lines, grain, ascii, regenerate, loadImage]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

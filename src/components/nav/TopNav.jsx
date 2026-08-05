import { useLayoutEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NAV_TABS } from '../../data/mock'
import { cx } from '../../lib/utils'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * A single fill-only pill rail. No rule under the bar, no privacy
 * microcopy under the labels — the active tab is the only state the
 * nav needs to express.
 *
 * The bar publishes its own height as `--nav-h`, because Home's left
 * column pins itself directly below it and the bar wraps at narrow
 * widths — a hardcoded offset would drift.
 */
export function TopNav() {
  const reduced = useReducedMotion()
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const publish = () =>
      document.documentElement.style.setProperty(
        '--nav-h',
        `${Math.round(el.getBoundingClientRect().height)}px`
      )
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <nav
      ref={ref}
      className="sticky top-[var(--ruler-h)] z-40 bg-canvas/85 backdrop-blur-md"
    >
      <div className="wrap flex flex-wrap items-center gap-md py-md">
        {/* brand */}
        <div className="mr-md flex items-center gap-[7px]">
          <b className="font-display text-[22px] font-semibold uppercase leading-none tracking-[0.02em] text-ink">
            aera
          </b>
          <span
            aria-hidden="true"
            className="block h-[7px] w-[7px] rounded-pill"
            style={{ background: '#D7F24B' }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-[4px] rounded-pill bg-surface p-[4px]">
          {NAV_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cx(
                  'relative rounded-pill px-md py-[9px] text-[13px] font-medium transition-colors duration-180',
                  isActive ? 'text-panel' : 'text-ink2 hover:text-ink'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive &&
                    (reduced ? (
                      <span className="absolute inset-0 rounded-pill bg-ink" />
                    ) : (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-pill bg-ink"
                        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.3, 1] }}
                      />
                    ))}
                  <span className="relative">{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

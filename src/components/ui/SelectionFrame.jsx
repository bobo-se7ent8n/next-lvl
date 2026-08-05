import { cx } from '../../lib/utils'

/* ============================================================
   FIGMA SELECTION HOVER

   The treatment you get selecting a frame on a canvas: a 1px dashed
   blue box sitting just outside the element, filled square handles
   on the four corners, and the layer's name in a small monospace
   chip above the top-left corner.

   Purely presentational — the whole overlay is pointer-events-none,
   so it can never take a click away from the card it decorates, its
   ••• menu, or the handles it is drawn over.

   Drop it inside any element that carries `group relative`. It is
   used on the two card types that read as objects on a canvas —
   pattern cards and vitals cards — and nowhere else.
   ============================================================ */

const HANDLE = 'absolute block h-[6px] w-[6px] bg-select ring-1 ring-white/70'

/**
 * The frame sits 3px outside the element and the handles straddle it,
 * so the whole treatment needs exactly 6px of room. That budget is
 * deliberate: the Home columns are scroll containers, and a scroll
 * container clips its overflow on *both* axes — anything reaching
 * further than their gutter would simply be cut off.
 */
export function SelectionFrame({ name, radius = 14, className }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute -inset-[3px] z-20 opacity-0 transition-opacity duration-150 group-hover:opacity-100',
        className
      )}
    >
      <span
        className="absolute inset-0 border border-dashed border-select sq"
        style={{ borderRadius: radius }}
      />

      <span className={cx(HANDLE, '-left-[3px] -top-[3px]')} />
      <span className={cx(HANDLE, '-right-[3px] -top-[3px]')} />
      <span className={cx(HANDLE, '-bottom-[3px] -left-[3px]')} />
      <span className={cx(HANDLE, '-bottom-[3px] -right-[3px]')} />

      <span className="absolute -top-[17px] left-0 max-w-full truncate rounded-[4px] bg-select px-[6px] py-[3px] font-mono text-[9px] font-medium leading-none text-white">
        {name}
      </span>
    </span>
  )
}

import { cx } from '../../lib/utils'

/* Inputs are recessed wells, not outlined boxes — focus deepens the
   fill and raises the ink instead of drawing a ring. */
const base =
  'w-full rounded-pill bg-surface px-[18px] py-[12px] text-[13px] text-ink placeholder:text-ink3 transition-colors duration-180 focus:bg-surface2 focus:outline-none'

export function Input({ className, ...rest }) {
  return <input className={cx(base, className)} {...rest} />
}

export function Select({ className, children, ...rest }) {
  return (
    <select className={cx(base, 'appearance-none', className)} {...rest}>
      {children}
    </select>
  )
}

/** Smooth-cornered checkbox; the ink fill is the "on" state. */
export function Checkbox({ checked, onChange, label, className }) {
  return (
    <label
      className={cx(
        'flex cursor-pointer items-center gap-[12px] py-[10px] text-[13px] text-ink2 transition-colors hover:text-ink',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[7px] bg-surface2 transition-colors sq peer-checked:bg-ink peer-checked:[&>span]:scale-100"
      >
        <span className="block h-[7px] w-[7px] scale-0 rounded-[2px] bg-panel transition-transform duration-180" />
      </span>
      {label}
    </label>
  )
}

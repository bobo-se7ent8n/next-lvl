import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { FOCUSES } from '../../data/mock'
import { Highlight, ScreenHeader } from '../../components/ui'
import { Stagger, StaggerItem } from '../../components/motion/Stagger'

export default function FocusArchive() {
  return (
    <div className="wrap pb-4xl pt-xl">
      <Link
        to="/"
        className="mb-md inline-flex items-center gap-[6px] rounded-pill bg-surface px-md py-[8px] text-[12px] font-medium text-ink2 transition-colors hover:bg-surface2 hover:text-ink"
      >
        <ArrowLeft size={13} strokeWidth={2.2} />
        Home
      </Link>

      <ScreenHeader title="Focus archive" />

      <Stagger className="flex flex-col gap-sm">
        {FOCUSES.map((f) => (
          <StaggerItem key={f.date}>
            <div className="lift flex flex-wrap gap-lg rounded-card bg-surface p-md sq md:p-lg">
              <div className="w-[168px] shrink-0">
                <Highlight tone="tan" size="sm">
                  {f.date}
                </Highlight>
              </div>

              {/* the row spans the page; the prose inside it does not */}
              <div className="measure min-w-[280px] flex-1">
                <p className="m-0 text-[16px] font-medium leading-relaxed text-ink">
                  {f.read}
                </p>
                <div className="well mt-md px-md py-sm">
                  <span className="sec-label mb-[8px] block">the experiment</span>
                  <p className="m-0 text-[13px] leading-relaxed text-ink2">
                    {f.experiment}
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

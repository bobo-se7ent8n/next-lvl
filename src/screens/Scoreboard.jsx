import { useCallback, useState } from 'react'

import {
  FRIENDS,
  GOAL_STATS,
  GOAL_WHEN_OPTIONS,
  MAX_GOALS,
  SESSIONS,
  SESSION_SUMMARY,
  SHARE_LABEL,
  SHARE_SECTIONS,
  SHOT_MECHANICS,
  SKILLS,
  SKILL_TREND,
  drift,
} from '../data/mock'
import { cx, heatTone, skillHeat } from '../lib/utils'
import { useEscape } from '../lib/useEscape'
import { useAppState } from '../state/AppState'

import {
  Button,
  Card,
  Checkbox,
  EmptyState,
  HeroStat,
  Highlight,
  Inked,
  Input,
  Meter,
  Modal,
  Placeholder,
  ScreenHeader,
  SectionLabel,
  Segmented,
  Select,
  Sparkline,
  Tag,
  useToast,
} from '../components/ui'
import { Num } from '../components/motion/Num'
import { Stagger, StaggerItem } from '../components/motion/Stagger'
import { ShotZones } from '../components/viz/ShotZones'

/* ============================================================
   Section head — a small Oswald title, plus a chip when the
   section is one the player chose to share.
   ============================================================ */

function SecHead({ label, shared, className }) {
  return (
    <div className={cx('mb-md flex flex-wrap items-center gap-sm', className)}>
      <Inked as="h2" className="text-[clamp(20px,2.4vw,30px)]">
        {label}
      </Inked>
      {shared && <Highlight tone="mint">shared</Highlight>}
    </div>
  )
}

/* ============================================================
   Skills — label, bar, numeral. The row opens for extra stats;
   the composition line rides in on hover.
   ============================================================ */

function SkillRow({ skill, open, onToggle }) {
  const [name, score, composition] = skill
  const heat = skillHeat(score)

  return (
    <div
      className={cx(
        'group rounded-sm px-md transition-colors duration-180 sq',
        open ? 'bg-surface2/60' : 'hover:bg-surface2/40'
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-md py-[13px]"
      >
        <span
          className={cx(
            'w-[152px] shrink-0 text-[13px] transition-colors',
            open ? 'font-medium text-ink' : 'text-ink2'
          )}
        >
          {name}
        </span>

        <Meter value={score} tone={heatTone(heat)} className="min-w-[80px] flex-1" />

        <Num
          value={String(score)}
          className="w-[38px] text-right text-[17px] font-bold text-ink"
        />
      </div>

      {/* composition — revealed on hover or while the row is open */}
      <div
        className={cx(
          'grid transition-[grid-template-rows] duration-180 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] group-hover:grid-rows-[1fr]'
        )}
      >
        <div className="overflow-hidden">
          <p className="m-0 pb-sm text-[11px] leading-relaxed text-ink3">
            {composition}
          </p>
        </div>
      </div>

      {open && (
        <div className="flex flex-wrap items-center gap-lg pb-md">
          <Sparkline points={SKILL_TREND} />
          <div>
            <div className="readout-label">session-over-session</div>
            <Num
              value="+4"
              className="mt-[6px] block text-[26px] font-extrabold leading-none tracking-tightest text-ink"
            />
            <div className="quiet mt-[4px]">vs Session 13</div>
          </div>
          <Placeholder className="h-[48px] w-[110px]" />
        </div>
      )}
    </div>
  )
}

function Skills() {
  const [open, setOpen] = useState(null)

  useEscape(useCallback(() => setOpen(null), []))

  const group = (list, prefix) =>
    list.map((s, i) => {
      const id = prefix + i
      return (
        <SkillRow
          key={id}
          skill={s}
          open={open === id}
          onToggle={() => setOpen(open === id ? null : id)}
        />
      )
    })

  return (
    <>
      <SectionLabel className="mb-sm px-md">Shooting</SectionLabel>
      <div>{group(SKILLS.shooting, 's')}</div>

      <SectionLabel className="mb-sm mt-lg px-md">
        Handling &amp; movement
      </SectionLabel>
      <div>{group(SKILLS.handling, 'h')}</div>
    </>
  )
}

/* ============================================================
   Goals — max 3, neutral trend status, undo on delete
   ============================================================ */

function Goals() {
  const { goals, setGoals } = useAppState()
  const showToast = useToast()

  const [statIdx, setStatIdx] = useState(0)
  const [target, setTarget] = useState('')
  const [when, setWhen] = useState('end of week')
  const [date, setDate] = useState('')

  const full = goals.length >= MAX_GOALS

  const add = () => {
    if (full) return
    const stat = GOAL_STATS[statIdx]
    const parsed = parseInt(target, 10)
    const t = parsed || Math.min(100, stat.v + 8) // placeholder default
    const w = when === 'custom' ? date || 'custom date' : when
    setGoals([...goals, { stat, target: t, when: w }])
    setTarget('')
  }

  const remove = (i) => {
    const removed = goals[i]
    setGoals(goals.filter((_, j) => j !== i))
    showToast('Goal removed', () =>
      setGoals((g) => {
        const next = [...g]
        next.splice(i, 0, removed)
        return next
      })
    )
  }

  return (
    <div className="flex flex-wrap items-start gap-lg">
      <div className="min-w-[340px] max-w-[760px] flex-1">
        {goals.length ? (
          <Stagger>
            {goals.map((g, i) => {
              const s = g.stat
              const d = drift(s)
              const gap = g.target - s.v
              // neutral wording only — the product never scolds
              const status =
                gap <= 0
                  ? 'on pace'
                  : d > 0
                    ? 'trending toward target'
                    : 'trending away from target'
              const pace = Math.max(0, s.v + d * 2)
              const pct = Math.max(4, Math.min(100, (s.v / g.target) * 100))

              return (
                <StaggerItem key={`${s.n}-${g.target}-${i}`}>
                  <div className="lift mb-md rounded-card bg-surface p-md sq md:p-lg">
                    <div className="mb-md flex flex-wrap items-baseline gap-sm">
                      <span className="text-[13px] text-ink2">{s.n}</span>
                      <Num
                        value={`${s.v}${s.u} → ${g.target}${s.u}`}
                        className="ml-auto text-[26px] font-extrabold leading-none tracking-tightest text-ink"
                      />
                    </div>

                    <Meter value={pct} tone="lime" className="mb-md" />

                    <div className="flex flex-wrap items-center gap-sm">
                      <Highlight
                        tone={status === 'trending away from target' ? 'tan' : 'lime'}
                      >
                        {status}
                      </Highlight>
                      <span className="quiet">by {g.when}</span>
                      <Button
                        size="sm"
                        className="ml-auto"
                        onClick={() => remove(i)}
                      >
                        Remove
                      </Button>
                    </div>

                    <p className="quiet num m-0 mt-sm">
                      at current pace: ~{pace}
                      {s.u} by {g.when}
                    </p>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        ) : (
          <EmptyState>
            No goals yet — pick a stat and set a target to start tracking pace.
          </EmptyState>
        )}
      </div>

      <Card className="w-[340px]">
        <SectionLabel className="mb-sm">Add a goal</SectionLabel>

        <Select
          value={statIdx}
          onChange={(e) => setStatIdx(+e.target.value)}
          aria-label="Stat"
        >
          {GOAL_STATS.map((s, i) => (
            <option key={s.n} value={i}>
              {s.n} · now {s.v}
              {s.u}
            </option>
          ))}
        </Select>

        <div className="mt-sm grid grid-cols-[104px_1fr] gap-sm">
          <Input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="target"
            aria-label="Target"
          />
          <Select
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            aria-label="By when"
            className="min-w-0"
          >
            {GOAL_WHEN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        {when === 'custom' && (
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Custom date"
            className="mt-sm"
          />
        )}

        <Button
          variant="fill"
          className="mt-md w-full"
          disabled={full}
          onClick={add}
        >
          Add goal
        </Button>

        {full && (
          <p className="quiet m-0 mt-sm">
            {MAX_GOALS} goal max — remove one to add another
          </p>
        )}
      </Card>
    </div>
  )
}

/* ============================================================
   Shared view
   ============================================================ */

function SharedView({ share }) {
  const [invites, setInvites] = useState(0)
  const sharedKeys = SHARE_SECTIONS.filter((k) => share[k])

  return (
    <>
      <SecHead label="What friends can see" />
      <Card padded={false} className="mb-2xl p-sm">
        {sharedKeys.length ? (
          sharedKeys.map((k) => (
            <div
              key={k}
              className="flex items-center justify-between gap-md rounded-sm px-md py-[13px] text-[13px] text-ink2"
            >
              <span>{SHARE_LABEL[k]}</span>
              <Highlight tone="mint" size="sm">
                visible
              </Highlight>
            </div>
          ))
        ) : (
          <p className="quiet m-0 px-md py-[13px]">
            nothing shared yet — use <b className="text-ink">Share stats</b> to
            pick what appears here.
          </p>
        )}
      </Card>

      <SecHead label="Friends" />
      <Stagger>
        {FRIENDS.map((f) => (
          <StaggerItem key={f.name}>
            <div className="lift mb-sm flex items-center gap-md rounded-card bg-surface px-md py-md sq">
              <div className="ph h-11 w-11 shrink-0 rounded-pill" />
              <div className="flex-1">
                <div className="text-[14px] font-medium text-ink">{f.name}</div>
                <div className="quiet num">{f.stats}</div>
              </div>
              <Tag variant="quiet">read-only</Tag>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mb-sm flex items-center gap-md rounded-card bg-surface2/60 px-md py-md sq">
        <div className="ph h-11 w-11 shrink-0 rounded-pill" />
        <div className="flex-1">
          <div className="text-[14px] font-semibold text-ink">
            You · Session 14
          </div>
          <div className="quiet">only your shared sections</div>
        </div>
        <Highlight tone="lavender">your snapshot</Highlight>
      </div>

      <div className="mb-sm flex items-center gap-md rounded-card bg-surface px-md py-md sq">
        <div className="flex-1 text-[13px] text-ink2">Invite a friend</div>
        <Button size="sm" onClick={() => setInvites((n) => n + 1)}>
          Invite a friend
        </Button>
      </div>

      {Array.from({ length: invites }, (_, i) => (
        <div
          key={i}
          className="mb-sm flex items-center gap-md rounded-card bg-surface/60 px-md py-md text-ink3 sq"
        >
          <div className="ph h-11 w-11 shrink-0 rounded-pill" />
          <div className="flex-1 text-[13px]">invite {i + 1}</div>
          <Tag variant="quiet">waiting</Tag>
        </div>
      ))}
    </>
  )
}

/* ============================================================ */

/* season context for the hero numeral, derived from the session log */
const SHOT_COUNTS = SESSIONS.map((s) => s.shots)
const SEASON_LOW = Math.min(...SHOT_COUNTS)
const SEASON_HIGH = Math.max(...SHOT_COUNTS)

export default function Scoreboard() {
  const { share, setShare } = useAppState()
  const [tab, setTab] = useState('mine')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [draft, setDraft] = useState(share)

  const sharedCount = SHARE_SECTIONS.filter((k) => share[k]).length

  const openPicker = () => {
    setDraft(share) // prefill from current state
    setPickerOpen(true)
  }

  return (
    <div className="wrap pb-4xl pt-xl">
      <ScreenHeader
        title="Scoreboard"
        right={
          <>
            {sharedCount > 0 && (
              <Highlight tone="mint">
                {sharedCount} of {SHARE_SECTIONS.length} shared
              </Highlight>
            )}
            <Button variant="fill" onClick={openPicker}>
              {sharedCount ? 'Edit what you share' : 'Share stats'}
            </Button>
          </>
        }
      />

      {/* single share picker: check sections, confirm */}
      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="What to share"
      >
        <div className="rounded-card bg-surface p-md sq">
          {SHARE_SECTIONS.map((k) => (
            <Checkbox
              key={k}
              checked={!!draft[k]}
              onChange={(e) => setDraft({ ...draft, [k]: e.target.checked })}
              label={SHARE_LABEL[k]}
            />
          ))}
        </div>

        <div className="mt-lg flex flex-wrap items-center gap-sm">
          <Button
            variant="fill"
            onClick={() => {
              setShare(draft)
              setPickerOpen(false)
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => setPickerOpen(false)}>Cancel</Button>
        </div>
      </Modal>

      <Segmented
        ariaLabel="Scoreboard view"
        value={tab}
        onChange={setTab}
        options={[
          ['mine', 'My scoreboard'],
          ['shared', 'Shared view'],
        ]}
        className="mb-2xl"
      />

      {tab === 'mine' ? (
        <>
          <div className="flex flex-wrap items-start gap-xl">
            <div className="w-[440px] max-w-full shrink-0">
              <SecHead label="Shot zones" shared={share.zones} />
              <ShotZones />
            </div>

            {/* capped: a skill row is a label, a bar and a numeral —
                stretched across a wide display it stops reading as a row */}
            <div className="min-w-[340px] max-w-[680px] flex-1">
              <SecHead label="Skills" shared={share.skills} />
              <Skills />
            </div>

            <div className="w-[232px] shrink-0">
              <SecHead label="Mechanics" />
              <Card>
                {SHOT_MECHANICS.map((m, i) => (
                  <div key={m.label} className="mb-lg last:mb-0">
                    <div className="readout-label">{m.label}</div>
                    <div className="mt-[8px] flex items-baseline gap-[4px]">
                      <Num
                        value={m.value}
                        delay={i * 60}
                        className="text-[34px] font-extrabold leading-none tracking-tightest text-ink"
                      />
                      <span className="text-[13px] font-medium text-ink3">
                        {m.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* ---- session summary hero ---- */}
          <SecHead
            label="Session summary"
            shared={share.summary}
            className="mt-4xl"
          />
          <Card className="max-w-[760px] px-md py-lg md:px-lg">
            <HeroStat
              value={SESSION_SUMMARY.makes}
              suffix={`/ ${SESSION_SUMMARY.attempts}`}
              label={SESSION_SUMMARY.caption}
              context={`season low ${SEASON_LOW} · high ${SEASON_HIGH}`}
            />
          </Card>

          {/* ---- goals ---- */}
          <SecHead label="Goals" shared={share.goals} className="mt-4xl" />
          <Goals />
        </>
      ) : (
        <SharedView share={share} />
      )}
    </div>
  )
}

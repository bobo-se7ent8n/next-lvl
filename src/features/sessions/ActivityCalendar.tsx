import { useState, type CSSProperties } from 'react';
import { Card } from '../../components/primitives/Card';
import { StatSet } from '../../components/primitives/StatRow';
import { Display, Label } from '../../components/primitives/Text';
import { Legend } from '../../components/viz/Legend';
import { Tooltip } from '../../components/viz/Tooltip';
import { anchorOf } from '../../lib/anchor';
import { mix } from '../../lib/color';
import { colorData, colorInk, colorSurface, iconStroke } from '../../tokens';
import {
  CALENDAR_FIRST,
  CALENDAR_ORIGIN,
  MONTH_NAMES,
  WEEKDAY_LABELS,
  isBefore,
  monthMatrix,
  monthStats,
  stepMonth,
  type CalendarDay,
} from '../../data/calendar';
import styles from './ActivityCalendar.module.css';

/** the four-step ramp, unchanged — rest, light, steady, heavy */
const LEVEL_FILL = [
  colorSurface.level2,
  mix(colorData.mint, colorSurface.background, 0.62),
  mix(colorData.mint, colorSurface.background, 0.32),
  colorData.mint,
];

const Chevron = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke.base} strokeLinecap="round" strokeLinejoin="round">
    <path d={back ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

export interface ActivityCalendarProps {
  className?: string;
}

/** the month grid. Paging moves the whole frame; the stats row under
 *  it is scoped to the month on screen and to nothing else. */
export function ActivityCalendar({ className }: ActivityCalendarProps) {
  const [view, setView] = useState<{ year: number; month: number }>({ ...CALENDAR_ORIGIN });
  const [hover, setHover] = useState<{ day: CalendarDay; x: number; y: number } | null>(null);

  const days = monthMatrix(view.year, view.month).flat();
  const stats = monthStats(view.year, view.month);
  const atFirst = !isBefore(CALENDAR_FIRST, view);

  return (
    <Card radius="card" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <div className={styles.title}>
          <Display size="md" as="h2">
            {MONTH_NAMES[view.month]}
          </Display>
          <Label tone="tertiary">{view.year}</Label>
        </div>

        <div className={styles.pager}>
          <button
            type="button"
            className={styles.page}
            disabled={atFirst}
            aria-label="Previous month"
            onClick={() => setView((v) => stepMonth(v.year, v.month, -1))}
          >
            <Chevron back />
          </button>
          <button
            type="button"
            className={styles.page}
            aria-label="Next month"
            onClick={() => setView((v) => stepMonth(v.year, v.month, 1))}
          >
            <Chevron />
          </button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((d) => (
          <Label key={d} tone="tertiary">
            {d.slice(0, 1)}
          </Label>
        ))}
      </div>

      <div className={styles.grid} onPointerLeave={() => setHover(null)}>
        {days.map((day, i) => (
          <div
            key={day.key}
            className={[styles.cell, !day.inMonth && styles.outside].filter(Boolean).join(' ')}
            style={
              {
                '--cell-bg': LEVEL_FILL[day.level],
                '--cell-ink': day.level === 3 ? colorInk.primary : colorInk.secondary,
                /* one stagger step per cell, in the order the grid is
                   read — left to right, top to bottom. An empty day
                   takes its turn like any other: it arrives on the
                   rest step of the ramp, because a day you did not
                   play is a day, not a miss. */
                '--cell-delay': `calc(var(--aera-duration-stagger) * ${i})`,
              } as CSSProperties
            }
            onPointerEnter={(e) => day.inMonth && setHover({ day, ...anchorOf(e.currentTarget) })}
          >
            <Label tone="inherit" className={styles.day}>
              {day.day}
            </Label>
          </div>
        ))}
      </div>

      <div className={styles.foot}>
        <StatSet
          stats={[
            { label: 'sessions', value: stats.sessions },
            { label: 'days on court', value: stats.days },
            { label: 'hours', value: stats.hours },
          ]}
        />
        <Legend
          items={[
            { label: 'rest', color: LEVEL_FILL[0] },
            { label: 'light', color: LEVEL_FILL[1] },
            { label: 'steady', color: LEVEL_FILL[2] },
            { label: 'heavy', color: LEVEL_FILL[3] },
          ]}
        />
        <Label tone="tertiary">this month only · nothing here counts a streak</Label>
      </div>

      {hover ? (
        <Tooltip x={hover.x} y={hover.y} heading={`${MONTH_NAMES[hover.day.month].slice(0, 3)} ${hover.day.day}`}>
          {hover.day.level === 0
            ? 'no session'
            : `${hover.day.count} session${hover.day.count === 1 ? '' : 's'} · ${hover.day.name} · ${hover.day.duration}`}
        </Tooltip>
      ) : null}
    </Card>
  );
}

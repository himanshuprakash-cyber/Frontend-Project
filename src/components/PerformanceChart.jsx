import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const fallbackWeeks = [
  {
    label: 'This Build',
    bars: [
      { h: '40%', bg: 'rgba(99,102,241,0.3)' },
      { h: '65%', bg: 'rgba(99,102,241,0.5)' },
      { h: '80%', bg: 'rgba(99,102,241,0.65)' },
      { h: '95%', bg: '#6366f1' },
      { h: '72%', bg: 'rgba(99,102,241,0.6)' },
      { h: '55%', bg: 'rgba(99,102,241,0.45)' },
      { h: '88%', bg: 'rgba(99,102,241,0.75)' },
    ],
  },
  {
    label: 'First Draft',
    bars: [
      { h: '52%', bg: 'rgba(16,185,129,0.35)' },
      { h: '70%', bg: 'rgba(16,185,129,0.5)' },
      { h: '58%', bg: 'rgba(16,185,129,0.55)' },
      { h: '90%', bg: '#10b981' },
      { h: '82%', bg: 'rgba(16,185,129,0.65)' },
      { h: '68%', bg: 'rgba(16,185,129,0.5)' },
      { h: '78%', bg: 'rgba(16,185,129,0.6)' },
    ],
  },
]

export default function PerformanceChart({ weeks = fallbackWeeks }) {
  const [idx, setIdx] = useState(0)
  const total = weeks.length

  const navBtnClass =
    'flex h-8 w-8 items-center justify-center rounded-md border border-line/70 bg-surface-card text-foreground-muted transition-all hover:border-accent hover:bg-accent-soft/12 hover:text-accent'

  return (
    <>
      <div className="overflow-hidden rounded-lg">
        <div className="slider-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="slider-item">
              <div className="chart-bars">
                {week.bars.map((bar, barIndex) => (
                  <div key={barIndex} className="chart-bar" style={{ height: bar.h, background: bar.bg }} />
                ))}
              </div>
              <p className="mt-2.5 text-center text-xs font-medium text-foreground-muted">{week.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        <button
          type="button"
          onClick={() => setIdx((idx - 1 + total) % total)}
          className={navBtnClass}
          aria-label="Previous period"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setIdx((idx + 1) % total)}
          className={navBtnClass}
          aria-label="Next period"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}

const fallbackStats = [
  { label: 'Active Users', value: '2,847', pct: '74%', color: '#6366f1', delta: '+12% this month' },
  { label: 'Revenue', value: '$48.2k', pct: '62%', color: '#10b981', delta: '+9% week over week' },
  { label: 'Conversion', value: '4.2%', pct: '42%', color: '#f43f5e', delta: '+0.4 points' },
]

export default function StatsCard({ stats = fallbackStats, onSelectStat }) {
  return (
    <div className="space-y-3.5">
      {stats.map((stat, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelectStat?.(stat)}
          className="block w-full rounded-xl px-1 py-0.5 text-left transition-colors hover:bg-accent-soft/10"
          aria-label={`${stat.label} details`}
        >
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-sm text-foreground-muted">{stat.label}</span>
            <strong className="text-sm font-bold" style={{ color: stat.color }}>
              {stat.value}
            </strong>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line/25">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: stat.pct, background: stat.color }}
            />
          </div>
          {stat.delta && <p className="mt-1.5 text-[0.72rem] text-foreground-muted">{stat.delta}</p>}
        </button>
      ))}
    </div>
  )
}

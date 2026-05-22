const fallbackActivities = [
  { text: 'Sidebar navigation now opens real pages', time: '2 hours ago', dot: '#6366f1' },
  { text: 'Theme toggle persists after refresh', time: '5 hours ago', dot: '#10b981' },
  { text: 'Search now jumps to matching views', time: 'Yesterday', dot: '#f59e0b' },
  { text: 'GitHub repo updated with the polished build', time: '2 days ago', dot: '#ec4899' },
]

export default function ActivityFeed({ activities = fallbackActivities, onSelectActivity }) {
  if (!activities.length) {
    return (
      <div className="rounded-xl border border-dashed border-line/70 p-4 text-sm text-foreground-muted">
        No matching activity yet. Try a different search or switch pages.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {activities.map((activity, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelectActivity?.(activity)}
          className="flex items-start gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-accent-soft/10"
          aria-label={activity.text}
        >
          <div className="mt-[7px] h-2 w-2 shrink-0 rounded-full" style={{ background: activity.dot }} />
          <div>
            <p className="text-[0.86rem] font-medium text-foreground">{activity.text}</p>
            <span className="text-xs text-foreground-muted">{activity.time}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

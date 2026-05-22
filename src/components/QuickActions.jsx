import { Download, Plus } from 'lucide-react'

export default function QuickActions({
  eyebrow = 'Quick actions',
  description = 'Spin up a new project or grab a clean export for offline reporting.',
  primaryLabel = 'New Project',
  secondaryLabel = 'Export Data',
  primaryIcon = Plus,
  secondaryIcon = Download,
  onPrimary,
  onSecondary,
}) {
  const PrimaryIcon = primaryIcon
  const SecondaryIcon = secondaryIcon

  return (
    <>
      <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-foreground-muted">{eyebrow}</p>
      <p className="mb-4 text-sm leading-relaxed text-foreground-muted">{description}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onPrimary}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent-glow/25 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          {PrimaryIcon && <PrimaryIcon className="h-4 w-4" />}
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={onSecondary}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-line/70 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-accent hover:bg-accent-soft/10 hover:text-accent"
        >
          {SecondaryIcon && <SecondaryIcon className="h-4 w-4" />}
          {secondaryLabel}
        </button>
      </div>
    </>
  )
}

export default function Sidebar({ activePage, onNavigate, isOpen, onClose, items = [] }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[85] bg-black/50 backdrop-blur-sm transition-opacity duration-300
          md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <nav
        className={`fixed bottom-0 left-0 top-[67px] z-[90] flex w-64 flex-col overflow-y-auto border-r border-line/70 bg-surface-sidebar py-5
        transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="px-5 pb-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-foreground-muted">Project menu</p>
          <p className="mt-1 text-sm font-semibold text-foreground">Build navigation</p>
        </div>

        <ul className="flex-1 px-3 space-y-1">
          {items.map(link => {
            const Icon = link.icon
            const active = activePage === link.id
            return (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  className={`group flex w-full items-start gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all duration-200
                    ${active
                      ? 'bg-accent-soft/12 text-accent ring-1 ring-accent/20'
                      : 'text-foreground-muted hover:bg-accent-soft/10 hover:text-foreground'
                    }`}
                >
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${active ? 'bg-accent text-white' : 'bg-surface-dark text-foreground-muted group-hover:bg-accent-soft/12 group-hover:text-foreground'}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] font-semibold">{link.label}</span>
                    {link.description && <span className="mt-0.5 block text-xs leading-relaxed text-foreground-muted">{link.description}</span>}
                  </span>
                  {link.badge && (
                    <span className={`ml-auto rounded-full px-2 py-1 text-[0.68rem] font-semibold tracking-wide ${active ? 'bg-white/10 text-accent' : 'bg-surface-dark text-foreground-muted'}`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-auto border-t border-line/70 px-3.5 pt-3.5">
          <div className="flex items-center gap-2.5 rounded-xl bg-surface-dark/60 px-3 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[0.65rem] font-bold text-white">
              HK
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-foreground">Himanshu K.</p>
              <p className="text-xs text-foreground-muted">Frontend assignment</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

import { Bell, Moon, Search, Sun, Zap } from 'lucide-react'

export default function Header({
  isDark,
  onToggleTheme,
  onToggleSidebar,
  sidebarOpen,
  onNotifications,
  onProfile,
  onBrandClick,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search projects, activity, or people...',
  notificationCount = 0,
}) {
  return (
    <header className="fixed top-[3px] left-0 right-0 z-[100] flex h-16 items-center justify-between border-b border-line/70 bg-surface-dark/90 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={`md:hidden flex h-9 w-9 flex-col justify-center gap-[5px] rounded-md p-2 transition-colors hover:bg-accent-soft/12 ${sidebarOpen ? 'hamburger-active' : ''}`}
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line bg-foreground" />
          <span className="hamburger-line bg-foreground" />
          <span className="hamburger-line bg-foreground" />
        </button>

        <button
          type="button"
          onClick={onBrandClick}
          className="group flex items-center gap-2.5 text-left"
          aria-label="Go to dashboard"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-accent-glow/30 transition-transform group-hover:scale-105">
            <Zap className="h-[18px] w-[18px] text-white" />
          </div>
          <span className="hidden text-xl font-extrabold tracking-tight sm:inline font-heading">Sciqus</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <form
          className="relative mr-1 hidden items-center md:flex"
          onSubmit={(event) => {
            event.preventDefault()
            onSearchSubmit?.(searchValue)
          }}
        >
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-48 rounded-lg border border-line/70 bg-surface-card py-2 pl-9 pr-10 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-foreground-muted focus:w-60 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[0.7rem] font-semibold text-foreground-muted transition-colors hover:text-foreground"
          >
            Go
          </button>
        </form>

        <button
          type="button"
          onClick={onNotifications}
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-accent-soft/12 hover:text-foreground"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-[7px] top-[7px] h-2 w-2 animate-badge-pulse rounded-full bg-red-500" />
          )}
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-accent-soft/12 hover:text-foreground"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={onProfile}
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-accent-glow/30"
          aria-label="Open profile"
        >
          HK
        </button>
      </div>
    </header>
  )
}

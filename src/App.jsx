import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  Copy,
  Download,
  FolderKanban,
  Layers3,
  LayoutDashboard,
  LineChart,
  Mail,
  Palette,
  Plus,
  RefreshCw,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Carousel from './components/Carousel'
import TeamSlider from './components/TeamSlider'
import StatsCard from './components/StatsCard'
import ActivityFeed from './components/ActivityFeed'
import QuickActions from './components/QuickActions'
import PerformanceChart from './components/PerformanceChart'
import Modal from './components/Modal'

const APP_TITLE = 'Sciqus Studio'
const THEME_KEY = 'sciqus-theme'
const SETTINGS_KEY = 'sciqus-settings'
const SETTINGS_SAVED_KEY = 'sciqus-settings-saved-at'

const DEFAULT_SETTINGS = {
  compactLayout: false,
  autoRefresh: true,
  smartAlerts: true,
}

const createSlide = (gradient, Icon, title, desc) => ({ gradient, Icon, title, desc })
const createMetric = (label, value, pct, color, delta) => ({ label, value, pct, color, delta })
const createMember = (initials, name, role, stat, bg) => ({ initials, name, role, stat, bg })
const createActivity = (text, time, dot) => ({ text, time, dot })
const createWeek = (label, bars) => ({ label, bars: bars.map(([h, bg]) => ({ h, bg })) })
const createProject = (name, owner, status, progress, due) => ({
  id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  name,
  owner,
  status,
  progress,
  due,
})

const BASE_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Overview',
    description: 'What is built and what still needs attention',
    icon: LayoutDashboard,
    badge: 'Live',
  },
  {
    id: 'analytics',
    label: 'Checks',
    description: 'Lint, build, and interaction health',
    icon: BarChart3,
    badge: 'Pass',
  },
  {
    id: 'team',
    label: 'Contributors',
    description: 'Who handled layout, logic, and polish',
    icon: Users,
    badge: '3 roles',
  },
  {
    id: 'projects',
    label: 'Tasks',
    description: 'Open items and the delivery list',
    icon: FolderKanban,
    badge: 'Open',
  },
  {
    id: 'settings',
    label: 'Preferences',
    description: 'Theme, spacing, and saved state',
    icon: Settings,
    badge: 'Local',
  },
]

const INITIAL_PROJECTS = [
  createProject('Sidebar routing', 'Navigation', 'Done', 100, 'May 21'),
  createProject('Theme persistence', 'State', 'Done', 100, 'May 21'),
  createProject('Mobile ratio pass', 'Layout', 'In progress', 82, 'May 22'),
  createProject('README refresh', 'Docs', 'Draft', 64, 'May 23'),
]

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Lint pass completed', detail: 'The dashboard compiles cleanly with no warnings.', time: '10 min ago', unread: true },
  { id: 2, title: 'Theme preference saved', detail: 'Light and dark mode now persist after reload.', time: '1 hour ago', unread: false },
  { id: 3, title: 'Mobile nav verified', detail: 'Sidebar closes cleanly after navigation on small screens.', time: 'Yesterday', unread: true },
  { id: 4, title: 'GitHub push complete', detail: 'Latest changes are already on the public repo.', time: '2 days ago', unread: false },
]

const PAGE_CONFIGS = {
  dashboard: {
    title: 'Overview',
    kicker: 'Frontend assignment overview',
    subtitle: 'A responsive React dashboard that keeps navigation, state, and theme handling in one place.',
    cardTitles: {
      team: 'Build roles',
      stats: 'Live checks',
      activity: 'Recent changes',
      actions: 'Quick Actions',
      performance: 'Momentum',
    },
    heroActions: {
      primary: { label: 'Add Task', icon: Plus, action: 'createProject' },
      secondary: { label: 'Export Build', icon: Download, action: 'exportPageData' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Add a new task or export the current view for review.',
      primaryLabel: 'Add Task',
      secondaryLabel: 'Export Build',
      primaryIcon: Plus,
      secondaryIcon: Download,
      primaryAction: 'createProject',
      secondaryAction: 'exportPageData',
    },
    getChips: ({ projectCount, unreadCount, themeLabel }) => [
      { label: 'Theme', value: themeLabel },
      { label: 'Tasks', value: `${projectCount} open` },
      { label: 'Notes', value: `${unreadCount} unread` },
    ],
    carousel: [
      createSlide('linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)', Rocket, 'Desktop layout', 'The desktop grid now matches the brief instead of feeling pasted in.'),
      createSlide('linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)', TrendingUp, 'Theme persistence', 'Light and dark mode remember the last choice after refresh.'),
      createSlide('linear-gradient(135deg, #f43f5e 0%, #6366f1 100%)', Sparkles, 'Working interactions', 'Buttons now open modals, copy text, and switch pages.'),
    ],
    stats: [
      createMetric('Connected Views', '5', '100%', '#6366f1', 'Header, sidebar, and cards wired'),
      createMetric('Working Actions', '12', '100%', '#10b981', 'Buttons and modals respond'),
      createMetric('Responsive States', '3', '96%', '#0ea5e9', 'Desktop, tablet, and mobile checked'),
    ],
    members: [
      createMember('HK', 'Himanshu K.', 'Frontend developer', 'Built the responsive shell and wired the actions', 'linear-gradient(135deg, #6366f1, #0ea5e9)'),
      createMember('RT', 'Responsive tune', 'Layout pass', 'Matched the desktop and mobile ratios from the brief', 'linear-gradient(135deg, #0ea5e9, #14b8a6)'),
      createMember('QA', 'Quality pass', 'Validation', 'Verified lint, build, and navigation before pushing', 'linear-gradient(135deg, #f43f5e, #ec4899)'),
    ],
    activities: [
      createActivity('Sidebar navigation now opens real pages', '2 hours ago', '#6366f1'),
      createActivity('Theme toggle persists after refresh', '5 hours ago', '#10b981'),
      createActivity('Search now jumps to matching views', 'Yesterday', '#f59e0b'),
      createActivity('GitHub repo updated with the polished build', '2 days ago', '#ec4899'),
    ],
    performance: [
      createWeek('This Build', [
        ['48%', 'rgba(99,102,241,0.32)'],
        ['62%', 'rgba(99,102,241,0.45)'],
        ['74%', 'rgba(99,102,241,0.58)'],
        ['92%', '#6366f1'],
        ['80%', 'rgba(99,102,241,0.66)'],
        ['68%', 'rgba(99,102,241,0.52)'],
        ['90%', 'rgba(99,102,241,0.76)'],
      ]),
      createWeek('First Pass', [
        ['34%', 'rgba(16,185,129,0.28)'],
        ['50%', 'rgba(16,185,129,0.42)'],
        ['60%', 'rgba(16,185,129,0.5)'],
        ['78%', '#10b981'],
        ['66%', 'rgba(16,185,129,0.58)'],
        ['58%', 'rgba(16,185,129,0.46)'],
        ['72%', 'rgba(16,185,129,0.64)'],
      ]),
    ],
  },
  analytics: {
    title: 'Checks',
    kicker: 'Implementation checks',
    subtitle: 'Use this view to confirm the build is still behaving the way it should.',
    cardTitles: {
      team: 'Build checks',
      stats: 'Status',
      activity: 'Build log',
      actions: 'Quick Actions',
      performance: 'Health',
    },
    heroActions: {
      primary: { label: 'Refresh Checks', icon: RefreshCw, action: 'refreshReport' },
      secondary: { label: 'Export Report', icon: Download, action: 'exportPageData' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Refresh the current checks or export a clean report for review.',
      primaryLabel: 'Refresh Checks',
      secondaryLabel: 'Export Report',
      primaryIcon: RefreshCw,
      secondaryIcon: Download,
      primaryAction: 'refreshReport',
      secondaryAction: 'exportPageData',
    },
    getChips: ({ lastSyncedAt }) => [
      { label: 'Synced', value: formatClock(lastSyncedAt) },
      { label: 'Focus', value: '3 live checks' },
      { label: 'Search', value: 'Across pages' },
    ],
    carousel: [
      createSlide('linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)', BarChart3, 'Lint and build', 'The project ships cleanly and runs without broken paths.'),
      createSlide('linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)', LineChart, 'Theme sync', 'Light and dark mode stay in sync with browser storage.'),
      createSlide('linear-gradient(135deg, #10b981 0%, #6366f1 100%)', Sparkles, 'Interaction pass', 'Search, modals, and buttons all do something useful.'),
    ],
    stats: [
      createMetric('Checks Passed', '18', '90%', '#0ea5e9', 'No critical issues'),
      createMetric('Builds', '2', '100%', '#6366f1', 'Vite build passes cleanly'),
      createMetric('States Wired', '12', '96%', '#10b981', 'Search, theme, modal, and sidebar work'),
    ],
    members: [
      createMember('LH', 'Lint health', 'Validation', 'No broken buttons or dead links', 'linear-gradient(135deg, #0ea5e9, #6366f1)'),
      createMember('TH', 'Theme health', 'State', 'Light and dark mode stay in sync', 'linear-gradient(135deg, #6366f1, #0ea5e9)'),
      createMember('RN', 'Routing', 'Navigation', 'Pages switch without a full reload', 'linear-gradient(135deg, #10b981, #0ea5e9)'),
    ],
    activities: [
      createActivity('Lint pass completed with zero errors', '15 minutes ago', '#0ea5e9'),
      createActivity('Production build checked successfully', '3 hours ago', '#6366f1'),
      createActivity('Theme sync confirmed after refresh', 'Yesterday', '#10b981'),
      createActivity('Mobile navigation verified on a small screen', '2 days ago', '#f59e0b'),
    ],
    performance: [
      createWeek('This Build', [
        ['46%', 'rgba(14,165,233,0.3)'],
        ['60%', 'rgba(14,165,233,0.45)'],
        ['74%', 'rgba(14,165,233,0.55)'],
        ['90%', '#0ea5e9'],
        ['82%', 'rgba(14,165,233,0.64)'],
        ['86%', 'rgba(14,165,233,0.72)'],
        ['94%', 'rgba(14,165,233,0.8)'],
      ]),
      createWeek('First Draft', [
        ['32%', 'rgba(16,185,129,0.28)'],
        ['44%', 'rgba(16,185,129,0.38)'],
        ['56%', 'rgba(16,185,129,0.5)'],
        ['72%', '#10b981'],
        ['60%', 'rgba(16,185,129,0.56)'],
        ['66%', 'rgba(16,185,129,0.62)'],
        ['78%', 'rgba(16,185,129,0.72)'],
      ]),
    ],
  },
  team: {
    title: 'Contributors',
    kicker: 'Build roles',
    subtitle: 'A small breakdown of who handled layout, state, and polish on this frontend project.',
    cardTitles: {
      team: 'Build roles',
      stats: 'Contribution',
      activity: 'Build notes',
      actions: 'Quick Actions',
      performance: 'Flow',
    },
    heroActions: {
      primary: { label: 'Copy Repo Link', icon: Copy, action: 'inviteTeammate' },
      secondary: { label: 'Copy Review Notes', icon: Mail, action: 'scheduleStandup' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Copy the repository link or a short review checklist for the next pass.',
      primaryLabel: 'Copy Repo Link',
      secondaryLabel: 'Copy Review Notes',
      primaryIcon: Copy,
      secondaryIcon: Mail,
      primaryAction: 'inviteTeammate',
      secondaryAction: 'scheduleStandup',
    },
    getChips: () => [
      { label: 'Owner', value: 'Himanshu' },
      { label: 'Roles', value: '3' },
      { label: 'Review', value: 'Ready' },
    ],
    carousel: [
      createSlide('linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)', Users, 'Layout', 'The shell was tuned to match the desktop and mobile ratios from the brief.'),
      createSlide('linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', Mail, 'Logic', 'Search, actions, and navigation all point to real state now.'),
      createSlide('linear-gradient(135deg, #f43f5e 0%, #6366f1 100%)', ShieldCheck, 'QA', 'Keyboard checks, theme storage, and button flows were verified.'),
    ],
    stats: [
      createMetric('Roles', '3', '100%', '#6366f1', 'Layout, state, and validation'),
      createMetric('Checks', '12', '94%', '#10b981', 'Lint, build, and navigation'),
      createMetric('Notes', '4', '88%', '#0ea5e9', 'Ready for interview review'),
    ],
    members: [
      createMember('HK', 'Himanshu K.', 'Owner', 'Kept the repo moving and tied the pieces together', 'linear-gradient(135deg, #6366f1, #0ea5e9)'),
      createMember('UI', 'Layout', 'Frontend', 'Matched the desktop and mobile ratios', 'linear-gradient(135deg, #0ea5e9, #14b8a6)'),
      createMember('QA', 'Checks', 'Validation', 'Verified keyboard, theme, and navigation behavior', 'linear-gradient(135deg, #f43f5e, #ec4899)'),
    ],
    activities: [
      createActivity('Responsive shell tightened against the brief', '30 minutes ago', '#6366f1'),
      createActivity('Search now jumps between matching views', '4 hours ago', '#10b981'),
      createActivity('Local state and theme storage were cleaned up', 'Yesterday', '#f59e0b'),
      createActivity('README now reflects the real project story', '2 days ago', '#ec4899'),
    ],
    performance: [
      createWeek('Current Pass', [
        ['52%', 'rgba(99,102,241,0.3)'],
        ['64%', 'rgba(99,102,241,0.42)'],
        ['76%', 'rgba(99,102,241,0.55)'],
        ['88%', '#6366f1'],
        ['80%', 'rgba(99,102,241,0.62)'],
        ['86%', 'rgba(99,102,241,0.7)'],
        ['92%', 'rgba(99,102,241,0.8)'],
      ]),
      createWeek('First Pass', [
        ['36%', 'rgba(16,185,129,0.28)'],
        ['48%', 'rgba(16,185,129,0.38)'],
        ['58%', 'rgba(16,185,129,0.5)'],
        ['72%', '#10b981'],
        ['64%', 'rgba(16,185,129,0.56)'],
        ['70%', 'rgba(16,185,129,0.62)'],
        ['82%', 'rgba(16,185,129,0.72)'],
      ]),
    ],
  },
  projects: {
    title: 'Tasks',
    kicker: 'Open work',
    subtitle: 'This page reads like the real backlog behind the assignment.',
    cardTitles: {
      team: 'Task owner',
      stats: 'Task metrics',
      activity: 'Task log',
      actions: 'Quick Actions',
      performance: 'Delivery pace',
    },
    heroActions: {
      primary: { label: 'Add Task', icon: Plus, action: 'createProject' },
      secondary: { label: 'Share Snapshot', icon: Copy, action: 'shareRoadmap' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Add another item to the backlog or copy a short progress summary.',
      primaryLabel: 'Add Task',
      secondaryLabel: 'Share Snapshot',
      primaryIcon: Plus,
      secondaryIcon: Copy,
      primaryAction: 'createProject',
      secondaryAction: 'shareRoadmap',
    },
    getChips: ({ projectCount, projects }) => [
      { label: 'Open items', value: `${projectCount}` },
      { label: 'Next due', value: projects[0]?.due ?? 'Today' },
      { label: 'Risk', value: 'Low' },
    ],
    carousel: [
      createSlide('linear-gradient(135deg, #f97316 0%, #f43f5e 100%)', FolderKanban, 'Sidebar routing', 'The left menu now opens the right page instead of acting as decoration.'),
      createSlide('linear-gradient(135deg, #6366f1 0%, #f97316 100%)', Layers3, 'Mobile layout', 'The grid stacks into a cleaner mobile flow.'),
      createSlide('linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)', Rocket, 'Export summary', 'A JSON snapshot is available for interview review.'),
    ],
    stats: [
      createMetric('Open Tasks', '4', '80%', '#f97316', 'Backlog items still active'),
      createMetric('Done', '2', '100%', '#6366f1', 'Sidebar, theme, and search'),
      createMetric('In Review', '1', '62%', '#10b981', 'One last pass remains'),
    ],
    members: [
      createMember('HK', 'Himanshu K.', 'Owner', 'Keeps the backlog moving', 'linear-gradient(135deg, #f97316, #f43f5e)'),
      createMember('QA', 'QA pass', 'Review', 'Checks the handoff and response states', 'linear-gradient(135deg, #6366f1, #f97316)'),
      createMember('DOC', 'Notes', 'Docs', 'Turns code changes into readable context', 'linear-gradient(135deg, #10b981, #0ea5e9)'),
    ],
    activities: [
      createActivity('Sidebar navigation is linked to real views', '45 minutes ago', '#f97316'),
      createActivity('Mobile ratios were tightened against the brief', '3 hours ago', '#10b981'),
      createActivity('JSON export now downloads the current page', 'Yesterday', '#6366f1'),
      createActivity('GitHub repo updated after the build pass', '2 days ago', '#ec4899'),
    ],
    performance: [
      createWeek('This Pass', [
        ['42%', 'rgba(249,115,22,0.28)'],
        ['56%', 'rgba(249,115,22,0.4)'],
        ['68%', 'rgba(249,115,22,0.54)'],
        ['88%', '#f97316'],
        ['82%', 'rgba(249,115,22,0.64)'],
        ['84%', 'rgba(249,115,22,0.72)'],
        ['94%', 'rgba(249,115,22,0.82)'],
      ]),
      createWeek('First Draft', [
        ['36%', 'rgba(16,185,129,0.3)'],
        ['48%', 'rgba(16,185,129,0.42)'],
        ['60%', 'rgba(16,185,129,0.52)'],
        ['72%', '#10b981'],
        ['66%', 'rgba(16,185,129,0.6)'],
        ['68%', 'rgba(16,185,129,0.66)'],
        ['82%', 'rgba(16,185,129,0.76)'],
      ]),
    ],
  },
  settings: {
    title: 'Preferences',
    kicker: 'Local preferences',
    subtitle: 'Everything here only changes the frontend behavior, which keeps the demo honest and easy to test.',
    cardTitles: {
      team: 'Build notes',
      stats: 'Workspace Controls',
      activity: 'Change log',
      actions: 'Quick Actions',
      performance: 'State health',
    },
    heroActions: {
      primary: { label: 'Save Preferences', icon: CheckCircle2, action: 'savePreferences' },
      secondary: { label: 'Reset Layout', icon: RefreshCw, action: 'resetLayout' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Save the local settings or reset them back to the default view.',
      primaryLabel: 'Save Preferences',
      secondaryLabel: 'Reset Layout',
      primaryIcon: CheckCircle2,
      secondaryIcon: RefreshCw,
      primaryAction: 'savePreferences',
      secondaryAction: 'resetLayout',
    },
    getChips: ({ workspaceSettings, savedAt, themeLabel }) => [
      { label: 'Theme', value: themeLabel },
      { label: 'Compact', value: workspaceSettings.compactLayout ? 'On' : 'Off' },
      { label: 'Saved', value: savedAt ? formatClock(savedAt) : 'Unsaved' },
    ],
    carousel: [
      createSlide('linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)', Palette, 'Theme memory', 'Light and dark mode stay in sync across the app.'),
      createSlide('linear-gradient(135deg, #10b981 0%, #6366f1 100%)', ShieldCheck, 'Compact spacing', 'The tighter layout is stored locally and can be restored.'),
      createSlide('linear-gradient(135deg, #f97316 0%, #6366f1 100%)', Settings, 'Auto refresh', 'Checks keep ticking in the background when enabled.'),
    ],
    stats: [
      createMetric('Theme Memory', '100%', '100%', '#10b981', 'Saved locally'),
      createMetric('Auto Refresh', '60s', '84%', '#6366f1', 'Analytics updates every minute'),
      createMetric('Local Storage', '2 keys', '90%', '#0ea5e9', 'No backend required'),
    ],
    members: [
      createMember('HK', 'Himanshu K.', 'Owner', 'Controls theme and spacing', 'linear-gradient(135deg, #6366f1, #0ea5e9)'),
      createMember('BR', 'Browser', 'Storage', 'Keeps the settings after refresh', 'linear-gradient(135deg, #10b981, #0ea5e9)'),
      createMember('QA', 'Checks', 'Validation', 'Makes sure toggles still work', 'linear-gradient(135deg, #f97316, #f43f5e)'),
    ],
    activities: [
      createActivity('Theme preference saved locally', 'Just now', '#6366f1'),
      createActivity('Compact layout toggled', '3 hours ago', '#10b981'),
      createActivity('Auto refresh verified', 'Yesterday', '#0ea5e9'),
      createActivity('Settings reset to default', '2 days ago', '#f59e0b'),
    ],
    performance: [
      createWeek('Current Setup', [
        ['48%', 'rgba(99,102,241,0.3)'],
        ['60%', 'rgba(99,102,241,0.42)'],
        ['68%', 'rgba(99,102,241,0.52)'],
        ['82%', '#6366f1'],
        ['76%', 'rgba(99,102,241,0.62)'],
        ['84%', 'rgba(99,102,241,0.7)'],
        ['90%', 'rgba(99,102,241,0.78)'],
      ]),
      createWeek('Default Baseline', [
        ['36%', 'rgba(16,185,129,0.28)'],
        ['46%', 'rgba(16,185,129,0.4)'],
        ['56%', 'rgba(16,185,129,0.52)'],
        ['68%', '#10b981'],
        ['60%', 'rgba(16,185,129,0.58)'],
        ['66%', 'rgba(16,185,129,0.64)'],
        ['78%', 'rgba(16,185,129,0.74)'],
      ]),
    ],
  },
}

function formatClock(dateValue) {
  if (!dateValue) return 'Pending'
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Pending'
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function toLowerText(value) {
  return String(value ?? '').toLowerCase()
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function readStoredJson(key, fallback) {
  if (typeof window === 'undefined') return fallback
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return { ...fallback, ...JSON.parse(raw) }
  } catch {
    return fallback
  }
}

function readStoredTheme() {
  if (typeof window === 'undefined') return true
  const saved = window.localStorage.getItem(THEME_KEY)
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

async function copyText(value) {
  const text = String(value ?? '')

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fallback below.
  }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', 'true')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    area.remove()
    return true
  } catch {
    return false
  }
}

function collectSearchStrings(page, projects = []) {
  return [
    page.title,
    page.kicker,
    page.subtitle,
    page.cardTitles.team,
    page.cardTitles.stats,
    page.cardTitles.activity,
    page.cardTitles.actions,
    page.cardTitles.performance,
    page.quickActions.eyebrow,
    page.quickActions.description,
    page.quickActions.primaryLabel,
    page.quickActions.secondaryLabel,
    ...page.carousel.map(item => `${item.title} ${item.desc}`),
    ...page.stats.map(item => `${item.label} ${item.value} ${item.delta ?? ''}`),
    ...page.members.map(item => `${item.name} ${item.role} ${item.stat}`),
    ...page.activities.map(item => `${item.text} ${item.time}`),
    ...projects.map(item => `${item.name} ${item.owner} ${item.status} ${item.due}`),
  ].map(toLowerText)
}

function countSearchMatches(page, query, projects = []) {
  const needle = query.trim().toLowerCase()
  if (!needle) return 0
  return collectSearchStrings(page, projects).filter(item => item.includes(needle)).length
}

function findMatchingPage(query, projects = []) {
  const needle = query.trim().toLowerCase()
  if (!needle) return null

  let winner = null
  let bestScore = 0

  Object.entries(PAGE_CONFIGS).forEach(([pageId, page]) => {
    const score = collectSearchStrings(page, pageId === 'projects' ? projects : []).filter(item => item.includes(needle)).length
    if (score > bestScore) {
      bestScore = score
      winner = pageId
    }
  })

  return bestScore > 0 ? winner : null
}

function CardHeader({ eyebrow, children, meta }) {
  return (
    <div className="px-5 pt-[18px]">
      {eyebrow && <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-foreground-muted">{eyebrow}</p>}
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-base font-bold text-foreground">{children}</h3>
        {meta && <span className="rounded-full bg-accent-soft/10 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-accent">{meta}</span>}
      </div>
    </div>
  )
}

function HeroActionButton({ action, variant = 'primary', onAction }) {
  if (!action) return null

  const Icon = action.icon
  const isPrimary = variant === 'primary'

  return (
    <button
      type="button"
      onClick={() => onAction(action.action)}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
        isPrimary
          ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-accent-glow/25 hover:-translate-y-0.5 hover:shadow-lg'
          : 'border-2 border-line/70 text-foreground hover:border-accent hover:bg-accent-soft/10 hover:text-accent'
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {action.label}
    </button>
  )
}

function PageHero({ title, kicker, subtitle, chips, primaryAction, secondaryAction, onAction }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-foreground-muted">{kicker}</p>
        <h2 className="mb-1 font-heading text-2xl font-bold md:text-[1.55rem]">{title}</h2>
        <p className="text-sm text-foreground-muted">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        <div className="flex flex-wrap gap-2">
          {chips.map(chip => (
            <div key={`${chip.label}-${chip.value}`} className="rounded-full border border-line/70 bg-surface-card px-3 py-1.5 text-xs font-medium text-foreground-muted">
              <span className="mr-1.5 font-semibold text-foreground">{chip.label}</span>
              {chip.value}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <HeroActionButton action={primaryAction} variant="primary" onAction={onAction} />
          <HeroActionButton action={secondaryAction} variant="secondary" onAction={onAction} />
        </div>
      </div>
    </div>
  )
}

function SettingsPanel({ settings, onToggleSetting }) {
  const options = [
    {
      key: 'compactLayout',
      label: 'Compact layout',
      description: 'Tighter spacing and a denser card rhythm.',
      icon: Palette,
    },
    {
      key: 'autoRefresh',
      label: 'Auto refresh',
      description: 'Keep analytics synced in the background.',
      icon: RefreshCw,
    },
    {
      key: 'smartAlerts',
      label: 'Smart alerts',
      description: 'Only surface the highest-priority notifications.',
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="space-y-3">
      {options.map(option => {
        const Icon = option.icon
        const enabled = Boolean(settings[option.key])

        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={enabled}
            onClick={() => onToggleSetting(option.key)}
            className="flex w-full items-center gap-3 rounded-xl border border-line/70 bg-surface-card px-3 py-3 text-left transition-colors hover:bg-accent-soft/10"
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${enabled ? 'bg-accent text-white' : 'bg-surface-dark text-foreground-muted'}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">{option.label}</span>
              <span className="block text-xs leading-relaxed text-foreground-muted">{option.description}</span>
            </span>
            <span className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${enabled ? 'bg-accent' : 'bg-line/30'}`}>
              <span className={`h-4 w-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </span>
          </button>
        )
      })}
      <p className="pt-1 text-xs leading-relaxed text-foreground-muted">
        Changes apply instantly. Use Save Preferences to commit them to local storage.
      </p>
    </div>
  )
}

function ProjectBoard({ projects, onSelectProject }) {
  if (!projects.length) {
    return (
      <div className="rounded-xl border border-dashed border-line/70 p-4 text-sm text-foreground-muted">
        No projects match your search yet. Try a broader query or create a new project.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {projects.map(project => (
        <button
          key={project.id}
          type="button"
          onClick={() => onSelectProject(project)}
          className="w-full rounded-xl border border-line/70 bg-surface-card px-4 py-3 text-left transition-colors hover:bg-accent-soft/10"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{project.name}</p>
              <p className="text-xs text-foreground-muted">
                {project.owner} - due {project.due}
              </p>
            </div>
            <span className="rounded-full bg-accent-soft/10 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-accent">
              {project.status}
            </span>
          </div>

          <div className="mt-3 h-1.5 rounded-full bg-line/25">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[0.72rem] text-foreground-muted">
            <span>{project.progress}% complete</span>
            <span>Updated recently</span>
          </div>
        </button>
      ))}
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = useState(readStoredTheme)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [workspaceSettings, setWorkspaceSettings] = useState(() => readStoredJson(SETTINGS_KEY, DEFAULT_SETTINGS))
  const [lastSyncedAt, setLastSyncedAt] = useState(() => new Date())
  const [savedAt, setSavedAt] = useState(() => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem(SETTINGS_SAVED_KEY)
    return stored ? new Date(stored) : null
  })
  const toastTimerRef = useRef(null)
  const themeBootstrappedRef = useRef(false)

  const currentPage = PAGE_CONFIGS[activePage] ?? PAGE_CONFIGS.dashboard
  const notificationCount = notifications.filter(item => item.unread).length
  const projectCount = projects.length
  const themeLabel = isDark ? 'Dark' : 'Light'
  const trimmedQuery = searchQuery.trim()
  const searchMatches = useMemo(() => countSearchMatches(currentPage, trimmedQuery, activePage === 'projects' ? projects : []), [activePage, currentPage, projects, trimmedQuery])
  const filteredActivities = useMemo(() => {
    if (!trimmedQuery) return currentPage.activities
    return currentPage.activities.filter(activity => {
      const haystack = `${activity.text} ${activity.time}`.toLowerCase()
      return haystack.includes(trimmedQuery.toLowerCase())
    })
  }, [currentPage.activities, trimmedQuery])
  const filteredProjects = useMemo(() => {
    if (!trimmedQuery) return projects
    const needle = trimmedQuery.toLowerCase()
    return projects.filter(project => `${project.name} ${project.owner} ${project.status} ${project.due}`.toLowerCase().includes(needle))
  }, [projects, trimmedQuery])

  const heroChips = useMemo(() => {
    const state = {
      projectCount,
      unreadCount: notificationCount,
      themeLabel,
      workspaceSettings,
      savedAt,
      lastSyncedAt,
      projects,
    }

    const chips = currentPage.getChips(state)
    if (trimmedQuery) {
      chips.push({ label: 'Search', value: `${searchMatches} matches` })
    }
    return chips
  }, [currentPage, lastSyncedAt, notificationCount, projectCount, projects, savedAt, searchMatches, themeLabel, trimmedQuery, workspaceSettings])

  const sidebarItems = useMemo(() => {
    return BASE_NAV_ITEMS.map(item => {
      if (item.id === 'projects') return { ...item, badge: `${projectCount} open` }
      if (item.id === 'dashboard') return { ...item, badge: notificationCount > 0 ? `${notificationCount} alerts` : 'Live' }
      return item
    })
  }, [notificationCount, projectCount])

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    setToast({ message, type })
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2800)
  }, [])

  const handleToggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  const handleNavigate = useCallback((page) => {
    setActivePage(page)
    showToast(`Opened ${PAGE_CONFIGS[page].title}`, 'info')
    if (window.innerWidth < 768) setSidebarOpen(false)
  }, [showToast])

  const handleSearchSubmit = useCallback((query) => {
    const value = query.trim()
    setSearchQuery(value)

    if (!value) {
      showToast('Type a keyword to search the workspace', 'info')
      return
    }

    const matchPage = findMatchingPage(value, projects)
    if (matchPage) {
      setActivePage(matchPage)
      showToast(`Showing ${PAGE_CONFIGS[matchPage].title} matches for "${value}"`, 'info')
      if (window.innerWidth < 768) setSidebarOpen(false)
      return
    }

    const matches = countSearchMatches(currentPage, value, activePage === 'projects' ? projects : [])
    if (matches > 0) {
      showToast(`Found ${matches} match${matches === 1 ? '' : 'es'} on ${currentPage.title}`, 'success')
    } else {
      showToast(`No matches found for "${value}"`, 'warning')
    }
  }, [activePage, currentPage, projects, showToast])

  const handleCreateProject = useCallback(() => {
    const newProject = createProject(`Task ${projectCount + 1}`, 'Frontend', 'Draft', 8, 'This week')
    setProjects(prev => [newProject, ...prev])
    setActivePage('projects')
    setModal({
      title: 'Task Created',
      text: `${newProject.name} is now in the backlog and ready for the next pass.`,
      buttons: [
        { label: 'Open Tasks', primary: true, action: () => handleNavigate('projects') },
        { label: 'Copy Task ID', primary: false, action: () => { void copyText(newProject.id).then(success => showToast(success ? 'Task ID copied' : 'Copy failed', success ? 'success' : 'warning')) } },
      ],
    })
    showToast(`${newProject.name} added`, 'success')
  }, [handleNavigate, projectCount, showToast])

  const handleExportPageData = useCallback((pageId = activePage) => {
    const page = PAGE_CONFIGS[pageId] ?? currentPage
    const filename = `sciqs-${slugify(page.title)}-report.json`
    const payload = {
      exportedAt: new Date().toISOString(),
      page: {
        id: pageId,
        title: page.title,
        kicker: page.kicker,
        subtitle: page.subtitle,
      },
      projects,
      notifications,
      settings: workspaceSettings,
      data: {
        carousel: page.carousel,
        stats: page.stats,
        members: page.members,
        activities: page.activities,
        performance: page.performance,
      },
    }

    downloadJson(filename, payload)
    showToast(`Export started for ${page.title.toLowerCase()}`, 'info')
  }, [activePage, currentPage, notifications, projects, workspaceSettings, showToast])

  const handleRefreshReport = useCallback(() => {
    setLastSyncedAt(new Date())
    setActivePage('analytics')
    showToast('Checks refreshed', 'success')
  }, [showToast])

  const handleInviteTeammate = useCallback(() => {
    const inviteLink = 'https://github.com/himanshuprakash-cyber/Frontend-Project'
    void copyText(inviteLink).then(success => showToast(success ? 'Repo link copied' : 'Copy failed', success ? 'success' : 'warning'))
    setActivePage('team')
  }, [showToast])

  const handleScheduleStandup = useCallback(() => {
    const agenda = [
      'Review notes',
      '- Check responsive layout',
      '- Confirm theme persistence',
      '- Verify action buttons',
    ].join('\n')
    void copyText(agenda).then(success => showToast(success ? 'Review notes copied' : 'Copy failed', success ? 'success' : 'warning'))
    setActivePage('team')
  }, [showToast])

  const handleShareRoadmap = useCallback(() => {
    const summary = `Build summary: ${projectCount} open tasks, ${notificationCount} unread notes, ${workspaceSettings.compactLayout ? 'compact layout' : 'comfortable spacing'}.`
    void copyText(summary).then(success => showToast(success ? 'Snapshot copied' : 'Copy failed', success ? 'success' : 'warning'))
    setActivePage('projects')
  }, [notificationCount, projectCount, workspaceSettings.compactLayout, showToast])

  const persistSettings = useCallback((nextSettings, message = 'Preferences saved', type = 'success') => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings))
    const savedDate = new Date()
    window.localStorage.setItem(SETTINGS_SAVED_KEY, savedDate.toISOString())
    setSavedAt(savedDate)
    showToast(message, type)
  }, [showToast])

  const handleSavePreferences = useCallback(() => {
    persistSettings(workspaceSettings)
    setActivePage('settings')
  }, [persistSettings, workspaceSettings])

  const handleResetLayout = useCallback(() => {
    setWorkspaceSettings({ ...DEFAULT_SETTINGS })
    persistSettings(DEFAULT_SETTINGS, 'Layout reset to defaults', 'info')
    setActivePage('settings')
  }, [persistSettings])

  const handleToggleSetting = useCallback((key) => {
    setWorkspaceSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const handleSelectProject = useCallback((project) => {
    setModal({
      title: project.name,
      text: `${project.owner} owns this item. It is currently ${project.status.toLowerCase()} and ${project.progress}% complete.`,
      buttons: [
        { label: 'Open Overview', primary: true, action: () => handleNavigate('dashboard') },
        { label: 'Copy Task ID', primary: false, action: () => { void copyText(project.id).then(success => showToast(success ? 'Task ID copied' : 'Copy failed', success ? 'success' : 'warning')) } },
      ],
    })
  }, [handleNavigate, showToast])

  const handleSelectStat = useCallback((stat) => {
    setModal({
      title: stat.label,
      text: `${stat.value} - ${stat.delta || 'No additional change reported.'}`,
      buttons: [
        { label: 'View Checks', primary: true, action: () => handleNavigate('analytics') },
        { label: 'Copy Value', primary: false, action: () => { void copyText(`${stat.label}: ${stat.value}`).then(success => showToast(success ? 'Metric copied' : 'Copy failed', success ? 'success' : 'warning')) } },
      ],
    })
  }, [handleNavigate, showToast])

  const handleSelectActivity = useCallback((activity) => {
    setModal({
      title: activity.text,
      text: `${activity.time} - ${currentPage.title} update captured in the feed.`,
      buttons: [
        { label: 'Open Overview', primary: true, action: () => handleNavigate('dashboard') },
        { label: 'Copy Summary', primary: false, action: () => { void copyText(`${activity.text} (${activity.time})`).then(success => showToast(success ? 'Activity copied' : 'Copy failed', success ? 'success' : 'warning')) } },
      ],
    })
  }, [currentPage.title, handleNavigate, showToast])

  const handleNotifications = useCallback(() => {
    setModal({
      title: 'Build notes',
      text: `${notificationCount} unread note${notificationCount === 1 ? '' : 's'} are waiting for you.`,
      buttons: [
        { label: 'Open Overview', primary: true, action: () => handleNavigate('dashboard') },
        {
          label: 'Mark All Read',
          primary: false,
          action: () => {
            setNotifications(prev => prev.map(item => ({ ...item, unread: false })))
            showToast('Build notes marked as read', 'info')
          },
        },
      ],
    })
  }, [handleNavigate, notificationCount, showToast])

  const handleProfile = useCallback(() => {
    setModal({
      title: 'Profile',
      text: 'Himanshu K. - Frontend developer - @himanshuprakash-cyber',
      buttons: [
        { label: 'View Profile', primary: true, action: () => handleNavigate('team') },
        { label: 'Settings', primary: false, action: () => handleNavigate('settings') },
        { label: 'Sign Out', primary: false, action: () => showToast('Signed out locally', 'info') },
      ],
    })
  }, [handleNavigate, showToast])

  const actionHandlers = useMemo(() => ({
    createProject: handleCreateProject,
    exportPageData: () => handleExportPageData(activePage),
    refreshReport: handleRefreshReport,
    inviteTeammate: handleInviteTeammate,
    scheduleStandup: handleScheduleStandup,
    shareRoadmap: handleShareRoadmap,
    savePreferences: handleSavePreferences,
    resetLayout: handleResetLayout,
  }), [
    activePage,
    handleCreateProject,
    handleExportPageData,
    handleRefreshReport,
    handleInviteTeammate,
    handleScheduleStandup,
    handleShareRoadmap,
    handleSavePreferences,
    handleResetLayout,
  ])

  const runAction = useCallback((actionKey) => {
    const action = actionHandlers[actionKey]
    if (action) action()
  }, [actionHandlers])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
    window.localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')

    if (themeBootstrappedRef.current) {
      showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info')
    } else {
      themeBootstrappedRef.current = true
    }
  }, [isDark, showToast])

  useEffect(() => {
    document.title = `${APP_TITLE} - ${currentPage.title}`
  }, [currentPage.title])

  useEffect(() => {
    if (activePage !== 'analytics' || !workspaceSettings.autoRefresh) return undefined
    const timerId = window.setInterval(() => setLastSyncedAt(new Date()), 60000)
    return () => window.clearInterval(timerId)
  }, [activePage, workspaceSettings.autoRefresh])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [])

  return (
    <>
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
        onNotifications={handleNotifications}
        onProfile={handleProfile}
        onBrandClick={() => handleNavigate('dashboard')}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder={`Search ${currentPage.title.toLowerCase()}, projects, or people...`}
        notificationCount={notificationCount}
      />

      <div className="flex min-h-screen pt-[67px]">
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          items={sidebarItems}
        />

        <main className={`flex-1 ml-0 md:ml-64 overflow-x-hidden overflow-y-auto p-4 ${workspaceSettings.compactLayout ? 'md:p-6' : 'md:p-8'} transition-all duration-300`}>
          <PageHero
            title={currentPage.title}
            kicker={currentPage.kicker}
            subtitle={currentPage.subtitle}
            chips={heroChips}
            primaryAction={currentPage.heroActions.primary}
            secondaryAction={currentPage.heroActions.secondary}
            onAction={runAction}
          />

          <div className={`content-grid ${workspaceSettings.compactLayout ? 'content-grid--compact' : ''}`}>
            <section className="container-1 dashboard-card dashboard-card-hover card-enter overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <Carousel slides={currentPage.carousel} />
            </section>

            <section className="container-2 dashboard-card dashboard-card-hover card-enter overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader meta={activePage === 'settings' ? '3 controls' : `${currentPage.stats.length} KPIs`}>
                {currentPage.cardTitles.stats}
              </CardHeader>
              <div className="px-5 pb-5 pt-3">
                {activePage === 'settings' ? (
                  <SettingsPanel settings={workspaceSettings} onToggleSetting={handleToggleSetting} />
                ) : (
                  <StatsCard stats={currentPage.stats} onSelectStat={handleSelectStat} />
                )}
              </div>
            </section>

            <section className="container-3 dashboard-card dashboard-card-hover card-enter overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader meta={`${currentPage.members.length} people`}>
                {currentPage.cardTitles.team}
              </CardHeader>
              <div className="px-5 pb-5 pt-3">
                <TeamSlider members={currentPage.members} />
              </div>
            </section>

            <section className="container-4 dashboard-card dashboard-card-hover card-enter overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader meta={activePage === 'projects' ? `${filteredProjects.length} projects` : `${filteredActivities.length} items`}>
                {activePage === 'projects' ? 'Project Pipeline' : currentPage.cardTitles.activity}
              </CardHeader>
              <div className="px-5 pb-5 pt-3">
                {activePage === 'projects' ? (
                  <ProjectBoard projects={filteredProjects} onSelectProject={handleSelectProject} />
                ) : (
                  <ActivityFeed activities={filteredActivities} onSelectActivity={handleSelectActivity} />
                )}
              </div>
            </section>

            <section className="container-5 dashboard-card dashboard-card-hover card-enter overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader meta="Ready">
                {currentPage.cardTitles.actions}
              </CardHeader>
              <div className="px-5 pb-5 pt-3">
                <QuickActions
                  eyebrow={currentPage.quickActions.eyebrow}
                  description={currentPage.quickActions.description}
                  primaryLabel={currentPage.quickActions.primaryLabel}
                  secondaryLabel={currentPage.quickActions.secondaryLabel}
                  primaryIcon={currentPage.quickActions.primaryIcon}
                  secondaryIcon={currentPage.quickActions.secondaryIcon}
                  onPrimary={() => runAction(currentPage.quickActions.primaryAction)}
                  onSecondary={() => runAction(currentPage.quickActions.secondaryAction)}
                />
              </div>
            </section>

            <section className="container-6 dashboard-card dashboard-card-hover card-enter overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader meta={`Updated ${formatClock(lastSyncedAt)}`}>
                {currentPage.cardTitles.performance}
              </CardHeader>
              <div className="px-5 pb-5 pt-3">
                <PerformanceChart weeks={currentPage.performance} />
              </div>
            </section>
          </div>
        </main>
      </div>

      {toast && (
        <div
          className={`toast-enter fixed bottom-6 right-6 z-[300] rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-500'
              : toast.type === 'info'
                ? 'bg-accent'
                : toast.type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      {modal && (
        <Modal
          title={modal.title}
          text={modal.text}
          buttons={modal.buttons}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}

export default App

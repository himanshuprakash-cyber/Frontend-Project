import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  Clock3,
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

const THEME_KEY = 'vortex-theme'
const SETTINGS_KEY = 'vortex-settings'
const SETTINGS_SAVED_KEY = 'vortex-settings-saved-at'

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
    label: 'Dashboard',
    description: 'Command center and live overview',
    icon: LayoutDashboard,
    badge: 'Live',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Trends, funnels, and revenue',
    icon: BarChart3,
    badge: 'Reports',
  },
  {
    id: 'team',
    label: 'Team',
    description: 'People, capacity, and delivery',
    icon: Users,
    badge: '3 online',
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Current workstreams and milestones',
    icon: FolderKanban,
    badge: 'Open',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Preferences and workspace controls',
    icon: Settings,
    badge: 'Ready',
  },
]

const INITIAL_PROJECTS = [
  createProject('Q2 Campaign', 'Marketing', 'In progress', 72, 'May 28'),
  createProject('Portal Refresh', 'Product', 'Review', 46, 'Jun 03'),
  createProject('Hiring Sprint', 'People Ops', 'Draft', 18, 'Jun 10'),
]

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Design review approved', detail: 'Sarah signed off on the new hero flow.', time: '10 min ago', unread: true },
  { id: 2, title: 'Payment received', detail: '$2,400 landed in the dashboard account.', time: '1 hour ago', unread: false },
  { id: 3, title: 'Standup moved', detail: "Tomorrow's standup is now at 9:30 AM.", time: 'Yesterday', unread: true },
  { id: 4, title: 'Sprint review completed', detail: 'The last release passed QA and deployment checks.', time: '2 days ago', unread: false },
]

const PAGE_CONFIGS = {
  dashboard: {
    title: 'Dashboard',
    kicker: 'Live workspace overview',
    subtitle: "Welcome back! Here's what's happening today.",
    cardTitles: {
      team: 'Team Highlights',
      stats: 'Quick Stats',
      activity: 'Recent Activity',
      actions: 'Quick Actions',
      performance: 'Performance',
    },
    heroActions: {
      primary: { label: 'Create Project', icon: Rocket, action: 'createProject' },
      secondary: { label: 'Export Snapshot', icon: Download, action: 'exportPageData' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Spin up a new project or grab a clean export for offline reporting.',
      primaryLabel: 'New Project',
      secondaryLabel: 'Export Data',
      primaryIcon: Rocket,
      secondaryIcon: Download,
      primaryAction: 'createProject',
      secondaryAction: 'exportPageData',
    },
    getChips: ({ projectCount, unreadCount, themeLabel }) => [
      { label: 'Theme', value: themeLabel },
      { label: 'Projects', value: `${projectCount} open` },
      { label: 'Alerts', value: `${unreadCount} unread` },
    ],
    carousel: [
      createSlide('linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', Rocket, 'Featured Project', 'Q2 campaign is live - 34% ahead of target.'),
      createSlide('linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', TrendingUp, 'Growth Analytics', 'Monthly active users are up 28% since last quarter.'),
      createSlide('linear-gradient(135deg, #f43f5e 0%, #f97316 100%)', Sparkles, 'New Features', 'Theme control, export tools, and integrations have shipped.'),
    ],
    stats: [
      createMetric('Active Users', '2,847', '74%', '#6366f1', '+12% this month'),
      createMetric('Revenue', '$48.2k', '62%', '#10b981', '+9% week over week'),
      createMetric('Conversion', '4.2%', '42%', '#f43f5e', '+0.4 points'),
    ],
    members: [
      createMember('SK', 'Sarah K.', 'Design Lead', 'Completed 12 projects this quarter', 'linear-gradient(135deg, #6366f1, #7c3aed)'),
      createMember('AM', 'Alex M.', 'Lead Engineer', 'Shipped 8 features, 0 critical bugs', 'linear-gradient(135deg, #0ea5e9, #6366f1)'),
      createMember('JL', 'Jamie L.', 'Marketing', 'Grew social reach by 45%', 'linear-gradient(135deg, #f43f5e, #ec4899)'),
    ],
    activities: [
      createActivity('New deployment pushed to production', '2 hours ago', '#6366f1'),
      createActivity('Payment of $2,400 received', '5 hours ago', '#10b981'),
      createActivity('Jamie joined the marketing team', 'Yesterday', '#f59e0b'),
      createActivity('Sprint review completed', '2 days ago', '#ec4899'),
    ],
    performance: [
      createWeek('This Week', [
        ['40%', 'rgba(99,102,241,0.3)'],
        ['65%', 'rgba(99,102,241,0.5)'],
        ['80%', 'rgba(99,102,241,0.65)'],
        ['95%', '#6366f1'],
        ['72%', 'rgba(99,102,241,0.6)'],
        ['55%', 'rgba(99,102,241,0.45)'],
        ['88%', 'rgba(99,102,241,0.75)'],
      ]),
      createWeek('Last Week', [
        ['52%', 'rgba(16,185,129,0.35)'],
        ['70%', 'rgba(16,185,129,0.5)'],
        ['58%', 'rgba(16,185,129,0.55)'],
        ['90%', '#10b981'],
        ['82%', 'rgba(16,185,129,0.65)'],
        ['68%', 'rgba(16,185,129,0.5)'],
        ['78%', 'rgba(16,185,129,0.6)'],
      ]),
    ],
  },
  analytics: {
    title: 'Analytics',
    kicker: 'Signals that explain the trend line',
    subtitle: 'Track conversion, revenue, and retention without leaving the dashboard.',
    cardTitles: {
      team: 'Growth Signals',
      stats: 'KPI Snapshot',
      activity: 'Experiment Log',
      actions: 'Quick Actions',
      performance: 'Trendline',
    },
    heroActions: {
      primary: { label: 'Refresh Metrics', icon: RefreshCw, action: 'refreshReport' },
      secondary: { label: 'Export Report', icon: Download, action: 'exportPageData' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Refresh your metrics or export a clean analytics report for the team.',
      primaryLabel: 'Refresh Report',
      secondaryLabel: 'Export Report',
      primaryIcon: RefreshCw,
      secondaryIcon: Download,
      primaryAction: 'refreshReport',
      secondaryAction: 'exportPageData',
    },
    getChips: ({ lastSyncedAt }) => [
      { label: 'Synced', value: formatClock(lastSyncedAt) },
      { label: 'Focus', value: '3 active experiments' },
      { label: 'Trend', value: 'Up and to the right' },
    ],
    carousel: [
      createSlide('linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)', BarChart3, 'Conversion Lift', 'Landing page tweaks raised sign-ups by 18%.'),
      createSlide('linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)', LineChart, 'Revenue Funnel', 'Mid-funnel retention is improving week over week.'),
      createSlide('linear-gradient(135deg, #10b981 0%, #6366f1 100%)', Sparkles, 'Retention Pulse', 'The cohort curve is flattening in a good way.'),
    ],
    stats: [
      createMetric('Sessions', '18.4k', '81%', '#0ea5e9', '+16% month over month'),
      createMetric('CTR', '6.8%', '68%', '#6366f1', '+1.1 points'),
      createMetric('Bounce Rate', '24%', '24%', '#10b981', '-4% from last week'),
    ],
    members: [
      createMember('PA', 'Priya A.', 'Growth Analyst', 'Built 4 dashboards for leadership', 'linear-gradient(135deg, #0ea5e9, #6366f1)'),
      createMember('NM', 'Noah M.', 'Data Engineer', 'Automated 6 reporting pipelines', 'linear-gradient(135deg, #6366f1, #0ea5e9)'),
      createMember('MR', 'Mina R.', 'Product Analyst', 'Launched 2 experiments this sprint', 'linear-gradient(135deg, #10b981, #0ea5e9)'),
    ],
    activities: [
      createActivity('Weekly report refreshed', '15 minutes ago', '#0ea5e9'),
      createActivity('Segment definition updated', '3 hours ago', '#6366f1'),
      createActivity('New experiment launched', 'Yesterday', '#10b981'),
      createActivity('Executive dashboard shared', '2 days ago', '#f59e0b'),
    ],
    performance: [
      createWeek('This Month', [
        ['42%', 'rgba(14,165,233,0.3)'],
        ['58%', 'rgba(14,165,233,0.45)'],
        ['72%', 'rgba(14,165,233,0.55)'],
        ['88%', '#0ea5e9'],
        ['76%', 'rgba(14,165,233,0.6)'],
        ['84%', 'rgba(14,165,233,0.68)'],
        ['92%', 'rgba(14,165,233,0.78)'],
      ]),
      createWeek('Last Month', [
        ['36%', 'rgba(16,185,129,0.28)'],
        ['48%', 'rgba(16,185,129,0.38)'],
        ['58%', 'rgba(16,185,129,0.5)'],
        ['76%', '#10b981'],
        ['64%', 'rgba(16,185,129,0.56)'],
        ['70%', 'rgba(16,185,129,0.62)'],
        ['82%', 'rgba(16,185,129,0.72)'],
      ]),
    ],
  },
  team: {
    title: 'Team',
    kicker: 'People, capacity, and delivery rhythm',
    subtitle: 'Keep the right people on the right work without losing momentum.',
    cardTitles: {
      team: 'Team Spotlight',
      stats: 'Capacity',
      activity: 'Team Activity',
      actions: 'Quick Actions',
      performance: 'Momentum',
    },
    heroActions: {
      primary: { label: 'Invite Teammate', icon: Mail, action: 'inviteTeammate' },
      secondary: { label: 'Schedule Standup', icon: Clock3, action: 'scheduleStandup' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Invite someone new or drop a clean standup agenda into the team chat.',
      primaryLabel: 'Invite Teammate',
      secondaryLabel: 'Schedule Standup',
      primaryIcon: Mail,
      secondaryIcon: Clock3,
      primaryAction: 'inviteTeammate',
      secondaryAction: 'scheduleStandup',
    },
    getChips: () => [
      { label: 'Online', value: '3 live' },
      { label: 'Reviews', value: '12 done' },
      { label: 'Standup', value: '9:30 AM' },
    ],
    carousel: [
      createSlide('linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)', Users, 'Capacity Check', 'Three teammates are online and ready for review.'),
      createSlide('linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', Mail, "Today's Meeting Flow", 'The meeting flow is clean and on schedule.'),
      createSlide('linear-gradient(135deg, #f43f5e 0%, #6366f1 100%)', ShieldCheck, 'Hiring Pipeline', 'Two candidates are moving through final interviews.'),
    ],
    stats: [
      createMetric('Headcount', '12', '100%', '#6366f1', '2 contractors onboarded'),
      createMetric('Availability', '81%', '81%', '#10b981', '+7% this week'),
      createMetric('On-time Reviews', '96%', '96%', '#0ea5e9', '+2 points'),
    ],
    members: [
      createMember('SK', 'Sarah K.', 'Design Lead', 'Mentors 2 teammates this sprint', 'linear-gradient(135deg, #6366f1, #0ea5e9)'),
      createMember('AM', 'Alex M.', 'Lead Engineer', 'Reviewed 9 pull requests', 'linear-gradient(135deg, #0ea5e9, #14b8a6)'),
      createMember('JL', 'Jamie L.', 'Marketing', 'Owns launch copy and updates', 'linear-gradient(135deg, #f43f5e, #ec4899)'),
    ],
    activities: [
      createActivity('Onboarding completed for the newest hire', '30 minutes ago', '#6366f1'),
      createActivity('Code review merged into main branch', '4 hours ago', '#10b981'),
      createActivity('Standup moved to 9:30 AM', 'Yesterday', '#f59e0b'),
      createActivity('Feedback shared on campaign assets', '2 days ago', '#ec4899'),
    ],
    performance: [
      createWeek('This Sprint', [
        ['48%', 'rgba(99,102,241,0.3)'],
        ['56%', 'rgba(99,102,241,0.42)'],
        ['68%', 'rgba(99,102,241,0.55)'],
        ['82%', '#6366f1'],
        ['74%', 'rgba(99,102,241,0.62)'],
        ['84%', 'rgba(99,102,241,0.7)'],
        ['90%', 'rgba(99,102,241,0.8)'],
      ]),
      createWeek('Last Sprint', [
        ['40%', 'rgba(16,185,129,0.28)'],
        ['52%', 'rgba(16,185,129,0.38)'],
        ['60%', 'rgba(16,185,129,0.5)'],
        ['74%', '#10b981'],
        ['66%', 'rgba(16,185,129,0.56)'],
        ['72%', 'rgba(16,185,129,0.62)'],
        ['84%', 'rgba(16,185,129,0.72)'],
      ]),
    ],
  },
  projects: {
    title: 'Projects',
    kicker: 'Delivery cockpit',
    subtitle: 'See what is active, what is blocked, and what needs a nudge.',
    cardTitles: {
      team: 'Project Focus',
      stats: 'Portfolio Metrics',
      activity: 'Project Activity',
      actions: 'Quick Actions',
      performance: 'Delivery Pace',
    },
    heroActions: {
      primary: { label: 'New Project', icon: Plus, action: 'createProject' },
      secondary: { label: 'Share Roadmap', icon: Copy, action: 'shareRoadmap' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Create a new initiative or share a lightweight roadmap summary with the team.',
      primaryLabel: 'New Project',
      secondaryLabel: 'Share Roadmap',
      primaryIcon: Plus,
      secondaryIcon: Copy,
      primaryAction: 'createProject',
      secondaryAction: 'shareRoadmap',
    },
    getChips: ({ projectCount, projects }) => [
      { label: 'Projects', value: `${projectCount} open` },
      { label: 'Next due', value: projects[0]?.due ?? 'Today' },
      { label: 'Risk', value: 'Low' },
    ],
    carousel: [
      createSlide('linear-gradient(135deg, #f97316 0%, #f43f5e 100%)', FolderKanban, 'Roadmap', 'Three launch streams are ready for the next review.'),
      createSlide('linear-gradient(135deg, #6366f1 0%, #f97316 100%)', Layers3, 'Launch Train', 'The release train is locked and QA is moving fast.'),
      createSlide('linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)', Rocket, 'Milestone Readiness', 'Everything is lined up for the next milestone.'),
    ],
    stats: [
      createMetric('Active Projects', '9', '90%', '#f97316', '+2 started this month'),
      createMetric('Milestones', '27', '68%', '#6366f1', '5 due this week'),
      createMetric('Risk Index', 'Low', '28%', '#10b981', 'All systems green'),
    ],
    members: [
      createMember('PL', 'Pat L.', 'Project Lead', 'Keeps the roadmap moving', 'linear-gradient(135deg, #f97316, #f43f5e)'),
      createMember('DM', 'Dana M.', 'Delivery Manager', 'Unblocks the highest risk items', 'linear-gradient(135deg, #6366f1, #f97316)'),
      createMember('QA', 'Quinn A.', 'QA Owner', 'Checks release readiness daily', 'linear-gradient(135deg, #10b981, #0ea5e9)'),
    ],
    activities: [
      createActivity('Backlog moved into the next sprint', '45 minutes ago', '#f97316'),
      createActivity('Release candidate passed QA', '3 hours ago', '#10b981'),
      createActivity('Content approvals completed', 'Yesterday', '#6366f1'),
      createActivity('Customer feedback added to the roadmap', '2 days ago', '#ec4899'),
    ],
    performance: [
      createWeek('This Month', [
        ['38%', 'rgba(249,115,22,0.28)'],
        ['52%', 'rgba(249,115,22,0.4)'],
        ['64%', 'rgba(249,115,22,0.54)'],
        ['86%', '#f97316'],
        ['78%', 'rgba(249,115,22,0.64)'],
        ['82%', 'rgba(249,115,22,0.72)'],
        ['91%', 'rgba(249,115,22,0.82)'],
      ]),
      createWeek('Last Month', [
        ['44%', 'rgba(16,185,129,0.3)'],
        ['54%', 'rgba(16,185,129,0.42)'],
        ['62%', 'rgba(16,185,129,0.52)'],
        ['74%', '#10b981'],
        ['68%', 'rgba(16,185,129,0.6)'],
        ['70%', 'rgba(16,185,129,0.66)'],
        ['84%', 'rgba(16,185,129,0.76)'],
      ]),
    ],
  },
  settings: {
    title: 'Settings',
    kicker: 'Workspace controls',
    subtitle: 'Tune the experience without breaking the flow.',
    cardTitles: {
      team: 'Workspace Highlights',
      stats: 'Workspace Controls',
      activity: 'Change Log',
      actions: 'Quick Actions',
      performance: 'Health Check',
    },
    heroActions: {
      primary: { label: 'Save Preferences', icon: CheckCircle2, action: 'savePreferences' },
      secondary: { label: 'Reset Layout', icon: RefreshCw, action: 'resetLayout' },
    },
    quickActions: {
      eyebrow: 'Quick actions',
      description: 'Lock in your preferences or reset the layout back to a clean default.',
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
      createSlide('linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)', Palette, 'Theme Sync', 'Light and dark mode stay in sync across the app.'),
      createSlide('linear-gradient(135deg, #10b981 0%, #6366f1 100%)', ShieldCheck, 'Notification Rules', 'Only the high-priority items make it through.'),
      createSlide('linear-gradient(135deg, #f97316 0%, #6366f1 100%)', Settings, 'Access Control', 'Workspace controls stay simple and easy to trust.'),
    ],
    stats: [
      createMetric('Security', 'A+', '100%', '#10b981', 'Permissions reviewed'),
      createMetric('Automation', '8 flows', '82%', '#6366f1', 'Background sync ready'),
      createMetric('Backup', '99.9%', '99%', '#0ea5e9', 'Last check 5 min ago'),
    ],
    members: [
      createMember('HK', 'Himanshu K.', 'Admin', 'Owns workspace preferences', 'linear-gradient(135deg, #6366f1, #0ea5e9)'),
      createMember('OP', 'Operations', 'System', 'Keeps the delivery flow clean', 'linear-gradient(135deg, #10b981, #0ea5e9)'),
      createMember('FN', 'Finance', 'Review', 'Handles export approvals', 'linear-gradient(135deg, #f97316, #f43f5e)'),
    ],
    activities: [
      createActivity('Theme preference saved locally', 'Just now', '#6366f1'),
      createActivity('Notification digest updated', '3 hours ago', '#10b981'),
      createActivity('Access review completed', 'Yesterday', '#0ea5e9'),
      createActivity('Backup verification succeeded', '2 days ago', '#f59e0b'),
    ],
    performance: [
      createWeek('Current Setup', [
        ['46%', 'rgba(99,102,241,0.3)'],
        ['58%', 'rgba(99,102,241,0.42)'],
        ['66%', 'rgba(99,102,241,0.52)'],
        ['78%', '#6366f1'],
        ['74%', 'rgba(99,102,241,0.62)'],
        ['82%', 'rgba(99,102,241,0.7)'],
        ['88%', 'rgba(99,102,241,0.78)'],
      ]),
      createWeek('Default Baseline', [
        ['38%', 'rgba(16,185,129,0.28)'],
        ['48%', 'rgba(16,185,129,0.4)'],
        ['58%', 'rgba(16,185,129,0.52)'],
        ['70%', '#10b981'],
        ['62%', 'rgba(16,185,129,0.58)'],
        ['68%', 'rgba(16,185,129,0.64)'],
        ['80%', 'rgba(16,185,129,0.74)'],
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
    const newProject = createProject(`Launch Initiative ${projectCount + 1}`, 'Product', 'Draft', 8, 'This week')
    setProjects(prev => [newProject, ...prev])
    setActivePage('projects')
    setModal({
      title: 'Project Created',
      text: `${newProject.name} is now in your projects queue and ready for collaboration.`,
      buttons: [
        { label: 'Open Projects', primary: true, action: () => handleNavigate('projects') },
        { label: 'Copy ID', primary: false, action: () => { void copyText(newProject.id).then(success => showToast(success ? 'Project ID copied' : 'Copy failed', success ? 'success' : 'warning')) } },
      ],
    })
    showToast(`${newProject.name} created`, 'success')
  }, [handleNavigate, projectCount, showToast])

  const handleExportPageData = useCallback((pageId = activePage) => {
    const page = PAGE_CONFIGS[pageId] ?? currentPage
    const filename = `vortex-${slugify(page.title)}-report.json`
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
    showToast('Analytics refreshed', 'success')
  }, [showToast])

  const handleInviteTeammate = useCallback(() => {
    const inviteLink = 'https://vortex.studio/invite'
    void copyText(inviteLink).then(success => showToast(success ? 'Invite link copied' : 'Copy failed', success ? 'success' : 'warning'))
    setActivePage('team')
  }, [showToast])

  const handleScheduleStandup = useCallback(() => {
    const agenda = [
      'Standup agenda',
      '- Blockers',
      '- Priorities',
      '- Handoff review',
    ].join('\n')
    void copyText(agenda).then(success => showToast(success ? 'Standup agenda copied' : 'Copy failed', success ? 'success' : 'warning'))
    setActivePage('team')
  }, [showToast])

  const handleShareRoadmap = useCallback(() => {
    const summary = `Roadmap summary: ${projectCount} active projects, ${notificationCount} unread alerts, ${workspaceSettings.compactLayout ? 'compact layout' : 'comfortable layout'}.`
    void copyText(summary).then(success => showToast(success ? 'Roadmap summary copied' : 'Copy failed', success ? 'success' : 'warning'))
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
      text: `${project.owner} owns this workstream. It is currently ${project.status.toLowerCase()} and ${project.progress}% complete.`,
      buttons: [
        { label: 'Open Overview', primary: true, action: () => handleNavigate('dashboard') },
        { label: 'Copy ID', primary: false, action: () => { void copyText(project.id).then(success => showToast(success ? 'Project ID copied' : 'Copy failed', success ? 'success' : 'warning')) } },
      ],
    })
  }, [handleNavigate, showToast])

  const handleSelectStat = useCallback((stat) => {
    setModal({
      title: stat.label,
      text: `${stat.value} - ${stat.delta || 'No additional change reported.'}`,
      buttons: [
        { label: 'View Analytics', primary: true, action: () => handleNavigate('analytics') },
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
      title: 'Notifications',
      text: `${notificationCount} unread notification${notificationCount === 1 ? '' : 's'} are waiting for you.`,
      buttons: [
        { label: 'View All', primary: true, action: () => handleNavigate('dashboard') },
        {
          label: 'Mark All Read',
          primary: false,
          action: () => {
            setNotifications(prev => prev.map(item => ({ ...item, unread: false })))
            showToast('Notifications marked as read', 'info')
          },
        },
      ],
    })
  }, [handleNavigate, notificationCount, showToast])

  const handleProfile = useCallback(() => {
    setModal({
      title: 'Profile',
      text: 'Himanshu K. - Admin - himanshu@vortex.studio',
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
    document.title = `Vortex - ${currentPage.title}`
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

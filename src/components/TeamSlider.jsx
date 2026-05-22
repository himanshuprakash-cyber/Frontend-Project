import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const fallbackMembers = [
  {
    initials: 'HK',
    name: 'Himanshu K.',
    role: 'Frontend developer',
    stat: 'Built the responsive shell and wired the actions',
    bg: 'linear-gradient(135deg, #6366f1, #7c3aed)',
  },
  {
    initials: 'UI',
    name: 'Layout',
    role: 'Frontend',
    stat: 'Matched the desktop and mobile ratios',
    bg: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
  },
  {
    initials: 'QA',
    name: 'Checks',
    role: 'Validation',
    stat: 'Verified keyboard, theme, and navigation behavior',
    bg: 'linear-gradient(135deg, #f43f5e, #ec4899)',
  },
]

export default function TeamSlider({ members = fallbackMembers }) {
  const [current, setCurrent] = useState(0)

  function slide(direction) {
    setCurrent(prev => {
      if (direction === 'prev') return (prev - 1 + members.length) % members.length
      return (prev + 1) % members.length
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg">
        <div className="slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {members.map((member, index) => (
            <div key={index} className="slider-item">
              <div className="rounded-lg p-4 text-white" style={{ background: member.bg }}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  {member.initials}
                </div>
                <div className="mb-2">
                  <strong className="block text-[0.94rem]">{member.name}</strong>
                  <span className="text-xs opacity-70">{member.role}</span>
                </div>
                <p className="text-[0.78rem] leading-snug opacity-70">{member.stat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        <button
          type="button"
          onClick={() => slide('prev')}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line/70 bg-surface-card text-foreground-muted transition-all hover:border-accent hover:bg-accent-soft/12 hover:text-accent"
          aria-label="Previous team member"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => slide('next')}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line/70 bg-surface-card text-foreground-muted transition-all hover:border-accent hover:bg-accent-soft/12 hover:text-accent"
          aria-label="Next team member"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}

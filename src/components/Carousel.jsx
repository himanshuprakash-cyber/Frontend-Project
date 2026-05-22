import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Rocket, Sparkles, TrendingUp } from 'lucide-react'

const fallbackSlides = [
  {
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    Icon: Rocket,
    title: 'Featured Project',
    desc: 'Q2 campaign is live - 34% ahead of target.',
  },
  {
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    Icon: TrendingUp,
    title: 'Growth Analytics',
    desc: 'Monthly active users are up 28% since last quarter.',
  },
  {
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)',
    Icon: Sparkles,
    title: 'New Features',
    desc: 'Theme control, export tools, and integrations have shipped.',
  },
]

export default function Carousel({ slides = fallbackSlides }) {
  const [idx, setIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const count = slides.length

  function go(n) {
    setIdx(((n % count) + count) % count)
  }

  useEffect(() => {
    if (isPaused || count <= 1) return undefined
    const timerId = window.setInterval(() => {
      setIdx(current => (current + 1) % count)
    }, 4500)
    return () => window.clearInterval(timerId)
  }, [count, isPaused])

  return (
    <div
      className="relative h-full min-h-[280px] overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carousel-track h-full" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {slides.map((slide, i) => (
          <div key={i} className="carousel-slide" style={{ background: slide.gradient }}>
            <div className="relative z-10 text-center text-white">
              <slide.Icon className="mx-auto mb-3.5 h-12 w-12 opacity-80" />
              <h3 className="mb-2 font-heading text-2xl font-bold md:text-[1.45rem]">{slide.title}</h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed opacity-80 md:text-[0.92rem]">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(idx - 1)}
        className="absolute left-3.5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white transition-colors hover:bg-black/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(idx + 1)}
        className="absolute right-3.5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white transition-colors hover:bg-black/55"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            className={`h-2.5 w-2.5 rounded-full border-none transition-all duration-300 ${
              i === idx ? 'scale-[1.2] bg-white' : 'bg-white/35'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

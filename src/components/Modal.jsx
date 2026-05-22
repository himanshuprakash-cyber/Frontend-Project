import { useEffect } from 'react'

export default function Modal({ title, text, buttons, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-pop w-full max-w-md rounded-2xl border border-line/70 bg-surface-card p-6 shadow-2xl">
        <h3 className="mb-1.5 font-heading text-lg font-bold text-foreground">{title}</h3>
        <p className="mb-5 text-sm leading-relaxed text-foreground-muted">{text}</p>
        <div className="flex flex-wrap justify-end gap-2.5">
          {buttons.map((btn, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { if (btn.action) btn.action(); onClose() }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                btn.primary
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-accent-glow/25 hover:shadow-lg'
                  : 'border-2 border-line/70 text-foreground transition-colors hover:border-accent hover:text-accent'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

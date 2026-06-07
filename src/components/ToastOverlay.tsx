import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useEffect } from 'react'
import { useDashboardStore } from '../store/useDashboardStore'

const variantStyles = {
  success: {
    card: 'border-emerald-200 bg-white/95',
    icon: 'bg-emerald-100 text-emerald-700',
  },
  error: {
    card: 'border-rose-200 bg-white/95',
    icon: 'bg-rose-100 text-rose-700',
  },
  info: {
    card: 'border-sky-200 bg-white/95',
    icon: 'bg-sky-100 text-sky-700',
  },
} as const

function ToastIcon({ variant }: { variant: 'success' | 'error' | 'info' }) {
  if (variant === 'success') {
    return <CheckCircle2 className="h-4 w-4" />
  }

  if (variant === 'error') {
    return <TriangleAlert className="h-4 w-4" />
  }

  return <Info className="h-4 w-4" />
}

export function ToastOverlay() {
  const toasts = useDashboardStore((state) => state.toasts)
  const dismissToast = useDashboardStore((state) => state.dismissToast)

  useEffect(() => {
    if (toasts.length === 0) {
      return undefined
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        dismissToast(toast.id)
      }, 4200),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [dismissToast, toasts])

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[min(92vw,24rem)] flex-col gap-3">
      {toasts.map((toast) => {
        const styles = variantStyles[toast.variant]

        return (
          <article
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border p-4 shadow-2xl shadow-slate-900/10 backdrop-blur ${styles.card}`}
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-xl p-2 ${styles.icon}`}>
                <ToastIcon variant={toast.variant} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                <p className="mt-1 text-sm text-slate-600">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
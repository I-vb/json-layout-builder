import { Bell, LogIn, LogOut, UserCircle2 } from 'lucide-react'
import { useDashboardStore } from '../store/useDashboardStore'

export function TopNav() {
  const isAuthenticated = useDashboardStore((state) => state.isAuthenticated)
  const role = useDashboardStore((state) => state.role)
  const notifications = useDashboardStore((state) => state.notifications)
  const signIn = useDashboardStore((state) => state.signIn)
  const signOut = useDashboardStore((state) => state.signOut)

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-4 py-4 lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            ApexConsulting Console
          </p>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            SaaSLaunch Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-slate-900">
              {notifications}
            </span>
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <UserCircle2 className="h-4 w-4" />
            <span>{isAuthenticated ? role : 'Guest'}</span>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn('Admin')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

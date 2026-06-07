import { LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../lib/appRoutes'
import { useDashboardStore } from '../store/useDashboardStore'

export function LoginModal() {
  const navigate = useNavigate()
  const signIn = useDashboardStore((state) => state.signIn)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/90 p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Secure Sign In
            </p>
            <h2 className="text-2xl font-bold text-slate-900">SaaSLaunch Access</h2>
          </div>
        </div>

        <p className="mb-6 text-sm text-slate-600">
          Sign in to manage JSON-driven content safely. Only Admin users can edit,
          map registry pages into navigation, and publish live SaaSLaunch changes.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              signIn('Admin')
              navigate(ROUTE_PATHS.admin)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <ShieldCheck className="h-4 w-4" />
            Sign in as Admin
          </button>
          <button
            type="button"
            onClick={() => {
              signIn('Client')
              navigate(ROUTE_PATHS.home)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <UserRound className="h-4 w-4" />
            Sign in as Client
          </button>
        </div>
      </div>
    </div>
  )
}

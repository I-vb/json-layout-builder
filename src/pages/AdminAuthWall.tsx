import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../lib/appRoutes'

export function AdminAuthWall() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-[1000px] items-center justify-center px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto inline-flex rounded-2xl bg-blue-100 p-3 text-blue-700">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold text-slate-900">Admin Access Required</h2>
        <p className="mt-3 text-sm text-slate-600">
          This workspace is restricted to Admin users for secure publishing workflows.
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTE_PATHS.home)}
          className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Public Site
        </button>
      </section>
    </div>
  )
}

import { PencilLine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../lib/appRoutes'
import { useDashboardStore } from '../store/useDashboardStore'

export function StagingDraftsHub() {
  const navigate = useNavigate()
  const draftsPool = useDashboardStore((state) => state.draftsPool)
  const setActiveDraft = useDashboardStore((state) => state.setActiveDraft)

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Staging & Drafts Hub
          </p>
          <h3 className="font-display text-xl font-bold text-white">Build Queue</h3>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-800/60 text-xs uppercase tracking-[0.14em] text-slate-400">
            <tr>
              <th className="px-3 py-3">Page Title</th>
              <th className="px-3 py-3">Last Modified</th>
              <th className="px-3 py-3">Author</th>
              <th className="px-3 py-3">Build Status</th>
              <th className="px-3 py-3">Components</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {draftsPool.map((draft) => (
              <tr key={draft.page_id} className="border-t border-slate-800 bg-slate-900/50">
                <td className="px-3 py-3 font-semibold text-white">{draft.title}</td>
                <td className="px-3 py-3">{draft.last_updated}</td>
                <td className="px-3 py-3">{draft.author}</td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      draft.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {draft.status}
                  </span>
                </td>
                <td className="px-3 py-3">{draft.sections.length}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDraft(draft.page_id)
                      navigate(ROUTE_PATHS.admin)
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-800"
                  >
                    <PencilLine className="h-3.5 w-3.5" />
                    Edit Layout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

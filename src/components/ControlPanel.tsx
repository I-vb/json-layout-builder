import { CheckCheck, FileDiff, Rocket, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDashboardStore } from '../store/useDashboardStore'

export function ControlPanel() {
  const [showReview, setShowReview] = useState(false)
  const [savedDraftOk, setSavedDraftOk] = useState(false)
  const [publishedOk, setPublishedOk] = useState(false)

  const role = useDashboardStore((state) => state.role)
  const activeDraftId = useDashboardStore((state) => state.activeDraftId)
  const draftsPool = useDashboardStore((state) => state.draftsPool)
  const isDirty = useDashboardStore((state) => state.isDirty)
  const lastSavedAt = useDashboardStore((state) => state.lastSavedAt)
  const draftJSON = useDashboardStore((state) => state.draftJSON)
  const auditLog = useDashboardStore((state) => state.auditLog)
  const setMetadata = useDashboardStore((state) => state.setMetadata)
  const saveDraft = useDashboardStore((state) => state.saveDraft)
  const reviewChanges = useDashboardStore((state) => state.reviewChanges)
  const publishLive = useDashboardStore((state) => state.publishLive)

  const reviewItems = useMemo(() => reviewChanges(), [isDirty, reviewChanges])
  const isAdmin = role === 'Admin'
  const activeDraft = draftsPool.find((draft) => draft.page_id === activeDraftId)

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Column 3 · Workflow Operations
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-slate-900">
          {activeDraft?.title ?? 'No Draft Selected'}
        </h3>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
          <span
            className={`h-2 w-2 rounded-full ${
              isDirty ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
          <span className={isDirty ? 'text-amber-700' : 'text-emerald-700'}>
            Status: {isDirty ? 'Staging Draft' : 'Live Sync'}
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-600">Last saved: {lastSavedAt}</p>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              const result = saveDraft()
              setSavedDraftOk(result.ok)
              if (result.ok) {
                setPublishedOk(false)
              }
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              savedDraftOk
                ? 'bg-emerald-500 text-emerald-950'
                : 'border border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
            disabled={!isAdmin}
          >
            <Save className="h-4 w-4" />
            {savedDraftOk ? 'Saved Successfully ✔' : 'Save Draft to Staging Hub'}
          </button>

          <button
            type="button"
            onClick={() => setShowReview((value) => !value)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FileDiff className="h-4 w-4" />
            Review System Diffs
          </button>

          <button
            type="button"
            onClick={() => {
              const result = publishLive()
              setPublishedOk(result.ok)
              if (result.ok) {
                setSavedDraftOk(false)
              }
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              publishedOk
                ? 'bg-emerald-500 text-emerald-950'
                : 'bg-blue-700 text-white hover:bg-blue-600'
            }`}
            disabled={!isAdmin}
          >
            <Rocket className="h-4 w-4" />
            {publishedOk ? 'Saved Successfully ✔' : 'Approve & Publish Live'}
          </button>
        </div>

        {showReview && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Diff Summary
            </p>
            <ul className="space-y-1 text-sm text-slate-700">
              {reviewItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCheck className="mt-0.5 h-4 w-4 text-slate-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Page Metadata Settings
        </p>
        <p className="mt-2 text-xs text-slate-500">
          URL assignment is handled in the Navigation Tree Manager to keep page routing and content mapping synchronized.
        </p>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Assigned Route: <span className="font-semibold text-slate-900">{draftJSON?.page ?? activeDraft?.route ?? '/'}</span>
          </div>

          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            SEO Title
            <input
              value={draftJSON?.title ?? ''}
              onChange={(event) => setMetadata('title', event.target.value)}
              disabled={!isAdmin}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-700 outline-none ring-blue-300 focus:ring ${
                !draftJSON?.title ? 'border-rose-400' : 'border-slate-300'
              }`}
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            SEO Keywords
            <input
              value={draftJSON?.keywords?.join(', ') ?? ''}
              onChange={(event) => setMetadata('keywords', event.target.value)}
              disabled={!isAdmin}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none ring-blue-300 focus:ring"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Meta Description
            <textarea
              value={draftJSON?.meta_description ?? ''}
              onChange={(event) => setMetadata('meta_description', event.target.value)}
              disabled={!isAdmin}
              className={`mt-1 h-24 w-full resize-none rounded-lg border px-3 py-2 text-sm text-slate-700 outline-none ring-blue-300 focus:ring ${
                !draftJSON?.meta_description ? 'border-rose-400' : 'border-slate-300'
              }`}
            />
          </label>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Changes since Published
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {auditLog.slice(0, 5).map((entry) => (
            <li key={entry} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              {entry}
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}

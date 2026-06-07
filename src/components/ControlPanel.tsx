import { CheckCheck, CopyPlus, FileDiff, Rocket, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDashboardStore } from '../store/useDashboardStore'

export function ControlPanel() {
  const [feedback, setFeedback] = useState('')
  const [showReview, setShowReview] = useState(false)

  const role = useDashboardStore((state) => state.role)
  const activeDraftId = useDashboardStore((state) => state.activeDraftId)
  const draftsPool = useDashboardStore((state) => state.draftsPool)
  const isDirty = useDashboardStore((state) => state.isDirty)
  const lastSavedAt = useDashboardStore((state) => state.lastSavedAt)
  const draftJSON = useDashboardStore((state) => state.draftJSON)
  const auditLog = useDashboardStore((state) => state.auditLog)
  const setMetadata = useDashboardStore((state) => state.setMetadata)
  const saveDraft = useDashboardStore((state) => state.saveDraft)
  const saveAsNewDraft = useDashboardStore((state) => state.saveAsNewDraft)
  const reviewChanges = useDashboardStore((state) => state.reviewChanges)
  const publishLive = useDashboardStore((state) => state.publishLive)

  const reviewItems = useMemo(() => reviewChanges(), [isDirty, reviewChanges])
  const isAdmin = role === 'Admin'
  const activeDraft = draftsPool.find((draft) => draft.page_id === activeDraftId)

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Page Status & Publishing
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
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                const result = saveDraft()
                setFeedback(result.message)
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isAdmin}
            >
              <Save className="h-4 w-4" />
              Validate & Save
            </button>

            <button
              type="button"
              onClick={() => {
                const result = saveAsNewDraft()
                setFeedback(result.message)
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isAdmin}
            >
              <CopyPlus className="h-4 w-4" />
              Save As New Copy
            </button>
          </div>

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
              setFeedback(result.message)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isAdmin}
          >
            <Rocket className="h-4 w-4" />
            Approve & Publish Live
          </button>
        </div>

        {feedback && (
          <p className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
            {feedback}
          </p>
        )}

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
        <div className="mt-3 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            URL Slug
            <input
              value={draftJSON?.page ?? ''}
              onChange={(event) => setMetadata('page', event.target.value)}
              disabled={!isAdmin}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none ring-blue-300 focus:ring"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            SEO Title
            <input
              value={draftJSON?.title ?? ''}
              onChange={(event) => setMetadata('title', event.target.value)}
              disabled={!isAdmin}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none ring-blue-300 focus:ring"
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
              className="mt-1 h-24 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none ring-blue-300 focus:ring"
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

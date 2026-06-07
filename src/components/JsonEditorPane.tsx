import { AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react'
import { useDashboardStore } from '../store/useDashboardStore'

export function JsonEditorPane() {
  const draftText = useDashboardStore((state) => state.draftText)
  const jsonError = useDashboardStore((state) => state.jsonError)
  const role = useDashboardStore((state) => state.role)
  const activeDraftId = useDashboardStore((state) => state.activeDraftId)
  const draftsPool = useDashboardStore((state) => state.draftsPool)
  const setDraftText = useDashboardStore((state) => state.setDraftText)
  const resetToPublished = useDashboardStore((state) => state.resetToPublished)

  const lineCount = draftText.split('\n').length
  const isAdmin = role === 'Admin'
  const activeDraft = draftsPool.find((draft) => draft.page_id === activeDraftId)

  return (
    <section className="panel flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Column 1 · JSON Layout Editor
          </p>
          <h2 className="font-display text-xl font-bold text-slate-100">
            {activeDraft?.title ?? 'Select Draft from Staging Hub'}
          </h2>
        </div>
        <button
          type="button"
          onClick={resetToPublished}
          disabled={!isAdmin}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Published
        </button>
      </div>

      <div className="flex min-h-[560px] flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-inner shadow-black/30">
        <pre className="w-12 overflow-hidden border-r border-slate-800 px-2 py-3 text-right text-xs leading-6 text-slate-500">
          {Array.from({ length: lineCount }, (_, index) => index + 1).join('\n')}
        </pre>
        <textarea
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          disabled={!isAdmin}
          spellCheck={false}
          className="code-editor h-full flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-slate-100 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
        />
      </div>

      <div
        className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
          jsonError
            ? 'border-red-500/40 bg-red-500/10 text-red-200'
            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
        }`}
      >
        {jsonError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
        {jsonError
          ? `JSON Syntax: Error - ${jsonError}`
          : 'JSON Syntax: Valid (Green Glow)'}
      </div>
    </section>
  )
}

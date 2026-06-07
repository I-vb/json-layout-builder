import { NavigationMenuManager } from '../components/NavigationMenuManager'
import { ControlPanel } from '../components/ControlPanel'
import { JsonEditorPane } from '../components/JsonEditorPane'
import { PreviewPane } from '../components/PreviewPane'
import { StagingDraftsHub } from '../components/StagingDraftsHub'

export function AdminDashboardPage() {
  return (
    <main className="min-h-[calc(100vh-6rem)] px-4 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto w-full max-w-[1800px] space-y-4">
        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(135deg,_rgba(34,211,238,0.16),_rgba(15,23,42,0.9))] p-6 shadow-xl shadow-slate-950/25">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
              SaaSLaunch Workspace
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold text-white">
              Secure JSON Layout Builder
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-200">
              A synchronized admin layer for registry-managed pages, recursive navigation trees, and production-safe publishing workflows.
            </p>
          </article>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-4 text-sm text-slate-200">
              Column 1: Monaco-style JSON authoring with validation and rollback.
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-4 text-sm text-slate-200">
              Column 2: Error-bound staging canvas across device breakpoints.
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-4 text-sm text-slate-200">
              Column 3: Draft saving, diff review, and live publish controls.
            </div>
          </div>
        </section>

        <StagingDraftsHub />
        <NavigationMenuManager />

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/55 p-4 shadow-xl shadow-slate-950/25">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Secure JSON Layout Builder
          </p>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <JsonEditorPane />
            </div>
            <div className="xl:col-span-6">
              <PreviewPane />
            </div>
            <div className="xl:col-span-3">
              <ControlPanel />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

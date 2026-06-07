import { NavigationMenuManager } from '../components/NavigationMenuManager'
import { ControlPanel } from '../components/ControlPanel'
import { JsonEditorPane } from '../components/JsonEditorPane'
import { PreviewPane } from '../components/PreviewPane'
import { StagingDraftsHub } from '../components/StagingDraftsHub'

export function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_15%,_#0e253e,_transparent_38%),radial-gradient(circle_at_85%_0%,_#123870,_transparent_45%),linear-gradient(180deg,_#09101b,_#0b1420)] px-4 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto w-full max-w-[1800px] space-y-4">
        <StagingDraftsHub />
        <NavigationMenuManager />

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
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

      <div className="mx-auto mt-4 grid w-full max-w-[1800px] grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-slate-300">
            Access: Admin-only workspace with XSS sanitation and schema guardrails.
          </div>
        </div>
      </div>
    </main>
  )
}

import { useDashboardStore } from '../store/useDashboardStore'
import { PreviewErrorBoundary } from '../components/PreviewErrorBoundary'
import { WebsiteSections } from '../components/WebsiteSections'

export function HomePage() {
  const publishedJSON = useDashboardStore((state) => state.publishedJSON)
  const pagesRegistry = useDashboardStore((state) => state.pagesRegistry)

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-10 lg:px-6">
      <section className="mb-8 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Public Website</p>
          <h2 className="mt-3 font-display text-5xl font-bold text-slate-950">Enterprise-grade B2B presence, driven by the SaaSLaunch registry.</h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Securely rendered from published JSON, protected by strict section whitelisting, and synchronized with the admin builder in real time.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Registry Snapshot</p>
          <p className="mt-4 text-4xl font-bold text-slate-950">{pagesRegistry.length}</p>
          <p className="mt-2 text-sm text-slate-600">Mapped pages available for live routing and admin navigation binding.</p>
        </div>
      </section>

      <PreviewErrorBoundary>
        <WebsiteSections data={publishedJSON} />
      </PreviewErrorBoundary>
    </div>
  )
}

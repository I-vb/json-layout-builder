import { useDashboardStore } from '../store/useDashboardStore'
import { PreviewErrorBoundary } from '../components/PreviewErrorBoundary'
import { WebsiteSections } from '../components/WebsiteSections'

export function HomePage() {
  const publishedJSON = useDashboardStore((state) => state.publishedJSON)

  return (
    <div className="mx-auto w-full max-w-[1300px] px-4 py-10 lg:px-6">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Public Website</p>
        <h2 className="mt-3 font-display text-4xl font-bold text-slate-900">ApexConsulting Homepage</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Securely rendered from published JSON and protected by strict section whitelisting.
        </p>
      </section>

      <PreviewErrorBoundary>
        <WebsiteSections data={publishedJSON} />
      </PreviewErrorBoundary>
    </div>
  )
}

import { ArrowUpRight } from 'lucide-react'

const CASE_STUDIES = [
  {
    client: 'Nimbus ERP',
    summary: 'Unified six fragmented product sites into one conversion engine.',
    metrics: ['+140% Conversion', '0.4s Load Time', '-38% CAC'],
  },
  {
    client: 'Helix Finance',
    summary: 'Delivered secure onboarding stack with policy-driven deployments.',
    metrics: ['+92% Activation', '99.99% Uptime', 'SOC2 Passed'],
  },
  {
    client: 'Vertex Systems',
    summary: 'Replaced manual release process with JSON-driven content pipeline.',
    metrics: ['4x Release Speed', '0 Production CSS Breaks', '+61 NPS'],
  },
]

export function CaseStudiesPage() {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-4 py-10 lg:px-6">
      <h2 className="font-display text-4xl font-bold text-slate-900">Case Studies</h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Enterprise execution stories where architecture decisions directly improved growth.
      </p>

      <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CASE_STUDIES.map((study) => (
          <article key={study.client} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">{study.client}</h3>
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-3 text-sm text-slate-600">{study.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {study.metrics.map((metric) => (
                <span
                  key={metric}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                >
                  {metric}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

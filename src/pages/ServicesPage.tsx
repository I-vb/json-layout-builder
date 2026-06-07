import { CheckCircle2, Cpu, DatabaseZap, Shield } from 'lucide-react'

const TIERS = [
  {
    name: 'Launch',
    price: '$2.5k',
    items: ['Landing + CMS architecture', 'Monitoring baseline', '1 deployment pipeline'],
  },
  {
    name: 'Scale',
    price: '$8k',
    featured: true,
    items: ['Multi-env infrastructure', 'Security posture automation', 'Analytics + lead orchestration'],
  },
  {
    name: 'Enterprise',
    price: '$18k',
    items: ['Global failover architecture', 'SRE + cost optimization ops', 'Dedicated security governance'],
  },
]

const CAPABILITIES = [
  {
    title: 'Platform Engineering',
    description: 'Reference architectures for rapid SaaS delivery.',
    icon: Cpu,
  },
  {
    title: 'Security Operations',
    description: 'Zero-trust controls and threat-response playbooks.',
    icon: Shield,
  },
  {
    title: 'Data Activation',
    description: 'Warehouse-to-growth systems with measurable outcomes.',
    icon: DatabaseZap,
  },
]

export function ServicesPage() {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-4 py-10 lg:px-6">
      <h2 className="font-display text-4xl font-bold text-slate-900">Services</h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Flexible delivery plans for B2B teams that need speed, reliability, and governance.
      </p>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <article
            key={tier.name}
            className={`rounded-3xl border p-6 shadow-md ${
              tier.featured
                ? 'border-blue-500 bg-blue-50/70'
                : 'border-slate-200 bg-white/85'
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{tier.name}</p>
            <h3 className="mt-2 font-display text-3xl font-bold text-slate-900">{tier.price}</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {tier.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {CAPABILITIES.map((capability) => (
          <article key={capability.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-lg bg-slate-100 p-2 text-slate-700">
              <capability.icon className="h-4 w-4" />
            </div>
            <h4 className="font-display text-xl font-semibold text-slate-900">{capability.title}</h4>
            <p className="mt-2 text-sm text-slate-600">{capability.description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

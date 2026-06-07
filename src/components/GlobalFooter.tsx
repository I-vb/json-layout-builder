import { BadgeCheck, Globe, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'

export function GlobalFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid w-full max-w-[1300px] grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <section>
          <h3 className="font-display text-lg font-bold text-white">SaaSLaunch</h3>
          <p className="mt-3 text-sm text-slate-400">
            Enterprise-safe website operations for modern digital agencies.
          </p>
        </section>

        <section>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Navigation
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Home</li>
            <li>Services</li>
            <li>Case Studies</li>
            <li>Client Portal</li>
          </ul>
        </section>

        <section>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Newsletter
          </h4>
          <p className="mt-3 text-sm text-slate-400">Monthly platform and security updates.</p>
          <div className="mt-3 flex items-center gap-2">
            <input
              placeholder="Work email"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
            />
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
            >
              Join
            </button>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Trust Center
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              ISO 27001 Certified
            </li>
            <li className="inline-flex items-center gap-2">
              <LockKeyhole className="h-4 w-4 text-emerald-400" />
              SOC 2 Type II Ready
            </li>
            <li className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-emerald-400" />
              GDPR Compliant
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-3 text-slate-400">
            <Globe className="h-4 w-4" />
            <Mail className="h-4 w-4" />
          </div>
        </section>
      </div>
    </footer>
  )
}

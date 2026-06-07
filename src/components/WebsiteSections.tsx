import { ChartNoAxesColumn, Cloud, Shield, Star } from 'lucide-react'
import { assertWhitelistedSectionTypes, sanitizeText } from '../lib/security'
import type {
  PageSection,
  FeatureGridSection,
  HeroSection,
  TestimonialSection,
  WebsiteJSON,
} from '../types/schema'

function normalizeSection(section: PageSection): PageSection {
  if (section.type === 'Hero') {
    return {
      type: 'Hero',
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      primaryCTA: section.primaryCTA,
      secondaryCTA: section.secondaryCTA,
    }
  }

  if (section.type === 'FeatureGrid') {
    return {
      type: 'FeatureGrid',
      id: section.id,
      features: section.features.map((feature) => ({
        title: feature.title,
        desc: feature.desc,
      })),
    }
  }

  return {
    type: 'Testimonials',
    id: section.id,
    text: section.text,
    rating: section.rating,
  }
}

function featureIcon(title: string) {
  const text = title.toLowerCase()
  if (text.includes('cloud')) {
    return Cloud
  }

  if (text.includes('cyber')) {
    return Shield
  }

  return ChartNoAxesColumn
}

function HeroBlock({ section }: { section: HeroSection }) {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-8 py-12 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
        ApexConsulting
      </p>
      <h2 className="mt-4 font-display text-4xl font-bold leading-tight">
        {sanitizeText(section.title)}
      </h2>
      <p className="mt-4 max-w-2xl text-sm text-slate-200">{sanitizeText(section.subtitle)}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white"
        >
          {sanitizeText(section.primaryCTA)}
        </button>
        <button
          type="button"
          className="rounded-xl border border-white/30 px-5 py-2 text-sm font-semibold text-white"
        >
          {sanitizeText(section.secondaryCTA)}
        </button>
      </div>
    </section>
  )
}

function FeatureGridBlock({ section }: { section: FeatureGridSection }) {
  return (
    <section>
      <h3 className="mb-4 font-display text-2xl font-bold text-slate-900">Core Services</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {section.features.map((feature) => {
          const Icon = featureIcon(feature.title)
          return (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 inline-flex rounded-lg bg-blue-100 p-2 text-blue-700">
                <Icon className="h-4 w-4" />
              </div>
              <h4 className="font-display text-lg font-semibold text-slate-900">
                {sanitizeText(feature.title)}
              </h4>
              <p className="mt-2 text-sm text-slate-600">{sanitizeText(feature.desc)}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function TestimonialsBlock({ section }: { section: TestimonialSection }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <blockquote className="text-lg font-medium text-slate-700">
        {sanitizeText(section.text)}
      </blockquote>
      <div className="mt-4 flex items-center gap-1 text-amber-500">
        {Array.from({ length: section.rating }, (_, index) => (
          <Star key={`rating-${index + 1}`} className="h-4 w-4 fill-current" />
        ))}
      </div>
    </section>
  )
}

export function WebsiteSections({ data, showSubHeader = true }: { data: WebsiteJSON; showSubHeader?: boolean }) {
  assertWhitelistedSectionTypes(data.sections)
  const safeSections = data.sections.map(normalizeSection)

  return (
    <div className="space-y-8">
      {showSubHeader && (
        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3">
          <p className="font-display text-lg font-bold text-slate-900">ApexConsulting</p>
          <nav className="hidden items-center gap-4 text-sm text-slate-600 sm:flex">
            <a href="#" className="hover:text-slate-900">
              Services
            </a>
            <a href="#" className="hover:text-slate-900">
              Case Studies
            </a>
            <a href="#" className="hover:text-slate-900">
              Pricing
            </a>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
            >
              Get Started
            </button>
          </nav>
        </header>
      )}

      {safeSections.map((section) => {
        if (section.type === 'Hero') {
          return <HeroBlock key={section.id} section={section} />
        }

        if (section.type === 'FeatureGrid') {
          return <FeatureGridBlock key={section.id} section={section} />
        }

        if (section.type === 'Testimonials') {
          return <TestimonialsBlock key={section.id} section={section} />
        }

        return null
      })}
    </div>
  )
}

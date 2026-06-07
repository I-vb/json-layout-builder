export const SECTION_WHITELIST = [
  'Hero',
  'FeatureGrid',
  'Testimonials',
  'LayoutGrid',
  'CardGrid',
  'Accordion',
  'Slider',
  'CTA',
] as const

export type SectionType = (typeof SECTION_WHITELIST)[number]

export interface HeroSection {
  type: 'Hero'
  id: string
  title: string
  subtitle: string
  primaryCTA: string
  secondaryCTA: string
}

export interface FeatureItem {
  title: string
  desc: string
}

export interface FeatureGridSection {
  type: 'FeatureGrid'
  id: string
  features: FeatureItem[]
}

export interface TestimonialSection {
  type: 'Testimonials'
  id: string
  text: string
  rating: number
}

export interface LayoutGridItem {
  title: string
  body: string
  eyebrow?: string
}

export interface LayoutGridSection {
  type: 'LayoutGrid'
  id: string
  title: string
  subtitle: string
  columns: 2 | 3 | 4
  items: LayoutGridItem[]
}

export interface CardGridItem {
  title: string
  desc: string
  meta?: string
}

export interface CardGridSection {
  type: 'CardGrid'
  id: string
  title: string
  subtitle: string
  cards: CardGridItem[]
}

export interface AccordionItem {
  title: string
  content: string
  defaultOpen?: boolean
}

export interface AccordionSection {
  type: 'Accordion'
  id: string
  title: string
  subtitle: string
  items: AccordionItem[]
}

export interface SliderItem {
  title: string
  caption: string
  metric?: string
}

export interface SliderSection {
  type: 'Slider'
  id: string
  title: string
  subtitle: string
  slides: SliderItem[]
}

export interface CTASection {
  type: 'CTA'
  id: string
  title: string
  subtitle: string
  primaryCTA: string
  secondaryCTA: string
}

export type PageSection =
  | HeroSection
  | FeatureGridSection
  | TestimonialSection
  | LayoutGridSection
  | CardGridSection
  | AccordionSection
  | SliderSection
  | CTASection

export interface WebsiteJSON {
  page: string
  title: string
  meta_description: string
  keywords?: string[]
  sections: PageSection[]
}

export interface PageRegistryEntry {
  id: string
  title: string
  slug: string
  sections: PageSection[]
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

export type UserRole = 'Admin' | 'Client' | 'Guest'
export type DeviceMode = 'mobile' | 'tablet' | 'desktop'
export type AppRoute = 'home' | 'services' | 'case-studies' | 'admin'

export interface MenuNode {
  id: string
  label: string
  route: string
  required_role?: UserRole
  page_id?: string
  children?: MenuNode[]
}

export interface ToastMessage {
  id: string
  title: string
  message: string
  variant: 'success' | 'error' | 'info'
}

export type DraftStatus = 'Pending Review' | 'Approved'

export interface DraftLayout {
  page_id: string
  title: string
  author: string
  last_updated: string
  status: DraftStatus
  route: string
  meta_description: string
  keywords: string[]
  sections: PageSection[]
}

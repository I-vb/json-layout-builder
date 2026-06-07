export const SECTION_WHITELIST = ['Hero', 'FeatureGrid', 'Testimonials'] as const

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

export type PageSection = HeroSection | FeatureGridSection | TestimonialSection

export interface WebsiteJSON {
  page: string
  title: string
  meta_description: string
  keywords?: string[]
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

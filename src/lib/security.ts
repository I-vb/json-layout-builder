import DOMPurify from 'dompurify'
import { SECTION_WHITELIST, type PageSection } from '../types/schema'

export function sanitizeText(value: string): string {
  const cleaned = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    FORBID_TAGS: ['script', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
  })

  return cleaned.replace(/javascript:/gi, '')
}

export function sanitizeRichText(value: string): string {
  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    ALLOW_UNKNOWN_PROTOCOLS: false,
  })
}

export function assertWhitelistedSectionTypes(sections: PageSection[]): void {
  for (const section of sections) {
    if (!SECTION_WHITELIST.includes(section.type)) {
      throw new Error(`Blocked section type: ${section.type}`)
    }
  }
}

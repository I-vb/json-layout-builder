import {
  SECTION_WHITELIST,
  type FeatureGridSection,
  type HeroSection,
  type TestimonialSection,
  type ValidationResult,
  type WebsiteJSON,
} from '../types/schema'

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null
}

function isNonEmptyString(input: unknown): input is string {
  return typeof input === 'string' && input.trim().length > 0
}

function validateHero(section: unknown): section is HeroSection {
  if (!isRecord(section)) {
    return false
  }

  return (
    section.type === 'Hero' &&
    isNonEmptyString(section.id) &&
    isNonEmptyString(section.title) &&
    isNonEmptyString(section.subtitle) &&
    isNonEmptyString(section.primaryCTA) &&
    isNonEmptyString(section.secondaryCTA)
  )
}

function validateFeatureGrid(section: unknown): section is FeatureGridSection {
  if (!isRecord(section)) {
    return false
  }

  if (
    section.type !== 'FeatureGrid' ||
    !isNonEmptyString(section.id) ||
    !Array.isArray(section.features)
  ) {
    return false
  }

  return section.features.every((feature) => {
    if (!isRecord(feature)) {
      return false
    }

    return isNonEmptyString(feature.title) && isNonEmptyString(feature.desc)
  })
}

function validateTestimonials(
  section: unknown,
): section is TestimonialSection {
  if (!isRecord(section)) {
    return false
  }

  return (
    section.type === 'Testimonials' &&
    isNonEmptyString(section.id) &&
    isNonEmptyString(section.text) &&
    typeof section.rating === 'number' &&
    Number.isFinite(section.rating) &&
    section.rating >= 1 &&
    section.rating <= 5
  )
}

export function validateWebsiteJSON(input: unknown): ValidationResult {
  if (!isRecord(input)) {
    return { valid: false, error: 'Root value must be an object.' }
  }

  if (!isNonEmptyString(input.page)) {
    return { valid: false, error: 'Missing required field: page.' }
  }

  if (!isNonEmptyString(input.title)) {
    return { valid: false, error: 'Missing required field: title.' }
  }

  if (!isNonEmptyString(input.meta_description)) {
    return { valid: false, error: 'Missing required field: meta_description.' }
  }

  if (input.keywords !== undefined) {
    if (!Array.isArray(input.keywords)) {
      return { valid: false, error: 'Field keywords must be a string array.' }
    }

    const invalidKeyword = input.keywords.some((item) => !isNonEmptyString(item))
    if (invalidKeyword) {
      return {
        valid: false,
        error: 'Field keywords must contain non-empty strings only.',
      }
    }
  }

  if (!Array.isArray(input.sections)) {
    return { valid: false, error: 'Missing required array: sections.' }
  }

  for (let index = 0; index < input.sections.length; index += 1) {
    const section = input.sections[index]
    if (!isRecord(section)) {
      return { valid: false, error: `Section ${index + 1} must be an object.` }
    }

    if (!isNonEmptyString(section.type)) {
      return { valid: false, error: `Section ${index + 1} is missing type.` }
    }

    const sectionType = section.type

    if (!SECTION_WHITELIST.includes(sectionType as (typeof SECTION_WHITELIST)[number])) {
      return {
        valid: false,
        error: `Section ${index + 1} uses unsupported type: ${sectionType}.`,
      }
    }

    if (sectionType === 'Hero' && !validateHero(section)) {
      return { valid: false, error: 'Hero section is missing required content.' }
    }

    if (sectionType === 'FeatureGrid' && !validateFeatureGrid(section)) {
      return { valid: false, error: 'FeatureGrid section has invalid feature data.' }
    }

    if (sectionType === 'Testimonials' && !validateTestimonials(section)) {
      return {
        valid: false,
        error: 'Testimonials section must include text and rating (1-5).',
      }
    }
  }

  return { valid: true }
}

export function parseDraftJSON(raw: string): {
  data: WebsiteJSON | null
  error: string | null
} {
  try {
    const parsed = JSON.parse(raw) as unknown
    const validation = validateWebsiteJSON(parsed)

    if (!validation.valid) {
      return { data: null, error: validation.error ?? 'Invalid JSON schema.' }
    }

    return { data: parsed as WebsiteJSON, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parse error.'
    return { data: null, error: message }
  }
}

import {
  SECTION_WHITELIST,
  type AccordionSection,
  type CTASection,
  type CardGridSection,
  type FeatureGridSection,
  type HeroSection,
  type LayoutGridSection,
  type TestimonialSection,
  type SliderSection,
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

function validateLayoutGrid(section: unknown): section is LayoutGridSection {
  if (!isRecord(section)) {
    return false
  }

  if (
    section.type !== 'LayoutGrid' ||
    !isNonEmptyString(section.id) ||
    !isNonEmptyString(section.title) ||
    !isNonEmptyString(section.subtitle) ||
    typeof section.columns !== 'number' ||
    ![2, 3, 4].includes(section.columns) ||
    !Array.isArray(section.items)
  ) {
    return false
  }

  return section.items.every((item) => {
    if (!isRecord(item)) {
      return false
    }

    return isNonEmptyString(item.title) && isNonEmptyString(item.body)
  })
}

function validateCardGrid(section: unknown): section is CardGridSection {
  if (!isRecord(section)) {
    return false
  }

  if (
    section.type !== 'CardGrid' ||
    !isNonEmptyString(section.id) ||
    !isNonEmptyString(section.title) ||
    !isNonEmptyString(section.subtitle) ||
    !Array.isArray(section.cards)
  ) {
    return false
  }

  return section.cards.every((card) => {
    if (!isRecord(card)) {
      return false
    }

    return isNonEmptyString(card.title) && isNonEmptyString(card.desc)
  })
}

function validateAccordion(section: unknown): section is AccordionSection {
  if (!isRecord(section)) {
    return false
  }

  if (
    section.type !== 'Accordion' ||
    !isNonEmptyString(section.id) ||
    !isNonEmptyString(section.title) ||
    !isNonEmptyString(section.subtitle) ||
    !Array.isArray(section.items)
  ) {
    return false
  }

  return section.items.every((item) => {
    if (!isRecord(item)) {
      return false
    }

    return isNonEmptyString(item.title) && isNonEmptyString(item.content)
  })
}

function validateSlider(section: unknown): section is SliderSection {
  if (!isRecord(section)) {
    return false
  }

  if (
    section.type !== 'Slider' ||
    !isNonEmptyString(section.id) ||
    !isNonEmptyString(section.title) ||
    !isNonEmptyString(section.subtitle) ||
    !Array.isArray(section.slides)
  ) {
    return false
  }

  return section.slides.every((slide) => {
    if (!isRecord(slide)) {
      return false
    }

    return isNonEmptyString(slide.title) && isNonEmptyString(slide.caption)
  })
}

function validateCTA(section: unknown): section is CTASection {
  if (!isRecord(section)) {
    return false
  }

  return (
    section.type === 'CTA' &&
    isNonEmptyString(section.id) &&
    isNonEmptyString(section.title) &&
    isNonEmptyString(section.subtitle) &&
    isNonEmptyString(section.primaryCTA) &&
    isNonEmptyString(section.secondaryCTA)
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

    if (sectionType === 'LayoutGrid' && !validateLayoutGrid(section)) {
      return { valid: false, error: 'LayoutGrid section has invalid layout items.' }
    }

    if (sectionType === 'CardGrid' && !validateCardGrid(section)) {
      return { valid: false, error: 'CardGrid section has invalid card data.' }
    }

    if (sectionType === 'Accordion' && !validateAccordion(section)) {
      return { valid: false, error: 'Accordion section has invalid item content.' }
    }

    if (sectionType === 'Slider' && !validateSlider(section)) {
      return { valid: false, error: 'Slider section has invalid slide content.' }
    }

    if (sectionType === 'CTA' && !validateCTA(section)) {
      return { valid: false, error: 'CTA section is missing required copy.' }
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

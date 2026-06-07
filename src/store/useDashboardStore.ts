import { create } from 'zustand'
import { parseDraftJSON } from '../lib/validation'
import type {
  AppRoute,
  DeviceMode,
  DraftLayout,
  MenuNode,
  PageRegistryEntry,
  PageSection,
  ToastMessage,
  UserRole,
  WebsiteJSON,
} from '../types/schema'

const STORAGE_KEYS = {
  menus: 'saaslaunch_menus',
  pagesRegistry: 'saaslaunch_pages_registry',
  drafts: 'saaslaunch_drafts',
  draftsLegacy: 'saaslaunch_drafts_pool',
  publishedPages: 'saaslaunch_published_pages',
  activeDraftId: 'saaslaunch_active_draft_id',
  draftText: 'saaslaunch_editor_draft_text',
  lastSaved: 'saaslaunch_last_saved',
  lastPublished: 'saaslaunch_last_published',
  auditLog: 'saaslaunch_audit_log',
} as const

const seedHomeSections: PageSection[] = [
  {
    type: 'Hero',
    id: 'hero_01',
    title: 'Modern IT Solutions for Global Business',
    subtitle:
      'Empowering organizations with reliable software and scalable digital infrastructure.',
    primaryCTA: 'Get Started',
    secondaryCTA: 'Watch Demo',
  },
  {
    type: 'FeatureGrid',
    id: 'features_01',
    features: [
      {
        title: 'Cloud Platforms',
        desc: 'Architect resilient cloud foundations with multi-region delivery and governance.',
      },
      {
        title: 'Cyber Defense',
        desc: 'Operate with zero-trust controls, continuous monitoring, and incident readiness.',
      },
      {
        title: 'Data Intelligence',
        desc: 'Convert raw operational telemetry into revenue-driving product decisions.',
      },
    ],
  },
  {
    type: 'Testimonials',
    id: 'testimonials_01',
    text:
      'SaaSLaunch gives our delivery and marketing teams one synchronized system for publishing high-confidence changes.',
    rating: 5,
  },
]

const seedPagesRegistry: PageRegistryEntry[] = [
  {
    id: 'home-live-id',
    title: 'Apex Consulting - Main Homepage',
    slug: '/',
    sections: seedHomeSections,
  },
  {
    id: 'services-live-id',
    title: 'Apex Consulting - Services Overview',
    slug: '/services',
    sections: [
      {
        type: 'Hero',
        id: 'services_hero_01',
        title: 'Managed Technology Services for Scaling Teams',
        subtitle:
          'Cloud delivery, security strategy, and application modernization under one operating model.',
        primaryCTA: 'Plan Engagement',
        secondaryCTA: 'See Capabilities',
      },
      {
        type: 'FeatureGrid',
        id: 'services_features_01',
        features: [
          {
            title: 'Cloud Platforms',
            desc: 'Landing zones, observability, and release automation tailored to regulated growth.',
          },
          {
            title: 'Cyber Defense',
            desc: 'Security engineering programs spanning IAM, compliance evidence, and threat response.',
          },
          {
            title: 'Product Delivery',
            desc: 'Application teams aligned with measurable outcomes, not disconnected ticket queues.',
          },
        ],
      },
    ],
  },
]

const seedHomePage: WebsiteJSON = {
  page: '/',
  title: 'Apex Consulting - Main Homepage',
  meta_description:
    'Empowering organizations with reliable software and scalable digital infrastructure.',
  keywords: ['IT Consulting', 'Cloud Platforms', 'Cyber Defense', 'Data Intelligence'],
  sections: seedHomeSections,
}

const seedMenus: MenuNode[] = [
  { id: 'm1', label: 'Home', route: '/', required_role: 'Guest' },
  {
    id: 'm2',
    label: 'Services',
    route: '/services',
    required_role: 'Guest',
    children: [
      { id: 'c1', label: 'Cloud Platforms', route: '/services/cloud', required_role: 'Guest' },
      { id: 'c2', label: 'Cyber Defense', route: '/services/cyber', required_role: 'Guest' },
    ],
  },
  {
    id: 'm3',
    label: 'Admin Controls',
    route: '/admin/dashboard',
    required_role: 'Admin',
  },
]

const seedDrafts: DraftLayout[] = [
  {
    page_id: 'home-v2-draft',
    title: 'Apex Consulting - Q3 Promo Layout',
    author: 'Marketing Team',
    last_updated: 'Just Now',
    status: 'Pending Review',
    route: '/promo/enterprise',
    meta_description:
      'Quarterly promotion variant for enterprise IT modernization campaigns.',
    keywords: ['Q3 Campaign', 'Enterprise IT', 'Digital Infrastructure'],
    sections: [
      {
        type: 'Hero',
        id: 'hero_01',
        title: 'Modern IT Solutions for Global Business',
        subtitle:
          'Empowering organizations with reliable software and scalable digital infrastructure.',
        primaryCTA: 'Launch App',
        secondaryCTA: 'Contact Support',
      },
    ],
  },
]

const seedPublishedPages: Record<string, WebsiteJSON> = {
  '/': seedHomePage,
  '/services': {
    page: '/services',
    title: 'Apex Consulting - Services Overview',
    meta_description:
      'Cloud delivery, security strategy, and product modernization for ambitious B2B teams.',
    keywords: ['Cloud Platforms', 'Cyber Defense', 'Product Delivery'],
    sections: seedPagesRegistry[1].sections,
  },
}

function nowLabel(): string {
  return new Date().toLocaleString()
}

function nowTime(): string {
  return new Date().toLocaleTimeString()
}

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(key)
}

function writeStorage(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, value)
}

function pretty(data: WebsiteJSON): string {
  return JSON.stringify(data, null, 2)
}

function normalizeSlug(value: string): string {
  if (!value.trim()) {
    return '/'
  }

  return value.startsWith('/') ? value : `/${value}`
}

function addAuditEntry(existing: string[], message: string): string[] {
  return [`${nowTime()} - ${message}`, ...existing].slice(0, 12)
}

function roleRank(role: UserRole): number {
  if (role === 'Admin') {
    return 3
  }

  if (role === 'Client') {
    return 2
  }

  return 1
}

export function canAccessRole(userRole: UserRole, requiredRole?: UserRole): boolean {
  const required = requiredRole ?? 'Guest'
  return roleRank(userRole) >= roleRank(required)
}

function draftToWebsiteJSON(draft: DraftLayout): WebsiteJSON {
  return {
    page: normalizeSlug(draft.route),
    title: draft.title,
    meta_description: draft.meta_description,
    keywords: draft.keywords,
    sections: draft.sections,
  }
}

function websiteToDraft(
  website: WebsiteJSON,
  previous: DraftLayout,
  status: DraftLayout['status'],
): DraftLayout {
  return {
    ...previous,
    title: website.title,
    route: normalizeSlug(website.page),
    meta_description: website.meta_description,
    keywords: website.keywords ?? [],
    sections: website.sections,
    status,
    last_updated: nowLabel(),
  }
}

function draftToRegistryEntry(draft: DraftLayout): PageRegistryEntry {
  return {
    id: draft.page_id,
    title: draft.title,
    slug: normalizeSlug(draft.route),
    sections: draft.sections,
  }
}

function websiteToRegistryEntry(website: WebsiteJSON, id: string): PageRegistryEntry {
  return {
    id,
    title: website.title,
    slug: normalizeSlug(website.page),
    sections: website.sections,
  }
}

function upsertRegistryEntry(
  entries: PageRegistryEntry[],
  entry: PageRegistryEntry,
): PageRegistryEntry[] {
  const index = entries.findIndex(
    (item) => item.id === entry.id || item.slug === entry.slug,
  )

  if (index === -1) {
    return [entry, ...entries]
  }

  return entries.map((item, itemIndex) => (itemIndex === index ? entry : item))
}

function createDraftFromWebsite(website: WebsiteJSON): DraftLayout {
  const uniqueId = `draft-${Date.now()}`
  return {
    page_id: uniqueId,
    title: website.title || 'Untitled Draft',
    author: 'Admin Team',
    last_updated: nowLabel(),
    status: 'Pending Review',
    route: normalizeSlug(website.page),
    meta_description: website.meta_description,
    keywords: website.keywords ?? [],
    sections: website.sections,
  }
}

function emitMenuSync(navigationMenus: MenuNode[]): void {
  writeStorage(STORAGE_KEYS.menus, JSON.stringify(navigationMenus))

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('navMenuUpdated'))
  }
}

function createToast(
  title: string,
  message: string,
  variant: ToastMessage['variant'],
): ToastMessage {
  return {
    id: `toast-${Date.now()}`,
    title,
    message,
    variant,
  }
}

function nextNotificationCount(draftsPool: DraftLayout[], jsonError: string | null, toasts: ToastMessage[]): number {
  const pendingDrafts = draftsPool.filter((draft) => draft.status === 'Pending Review').length
  return pendingDrafts + (jsonError ? 1 : 0) + toasts.length
}

function appendToParentNode(
  nodes: MenuNode[],
  parentId: string,
  newItem: MenuNode,
): { nodes: MenuNode[]; inserted: boolean } {
  const selectedParentId = parentId.toString()
  let inserted = false

  const nextNodes = nodes.map((node) => {
    if (node.id.toString() === selectedParentId) {
      inserted = true
      return {
        ...node,
        children: node.children ? [...node.children, newItem] : [newItem],
      }
    }

    if (!node.children?.length) {
      return node
    }

    const nestedResult = appendToParentNode(node.children, selectedParentId, newItem)
    if (!nestedResult.inserted) {
      return node
    }

    inserted = true
    return {
      ...node,
      children: nestedResult.nodes,
    }
  })

  return { nodes: nextNodes, inserted }
}

function findMenuNodeLabel(nodes: MenuNode[], targetId: string): string | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node.label
    }

    if (node.children?.length) {
      const childLabel = findMenuNodeLabel(node.children, targetId)
      if (childLabel) {
        return childLabel
      }
    }
  }

  return null
}

interface SaveResult {
  ok: boolean
  message: string
}

interface DashboardState {
  currentRoute: AppRoute
  navigationMenus: MenuNode[]
  pagesRegistry: PageRegistryEntry[]
  draftsPool: DraftLayout[]
  activeDraftId: string | null
  baselineDraftJSON: WebsiteJSON | null
  publishedPages: Record<string, WebsiteJSON>
  publishedJSON: WebsiteJSON
  draftJSON: WebsiteJSON | null
  draftText: string
  jsonError: string | null
  isDirty: boolean
  lastSavedAt: string
  lastPublishedAt: string
  auditLog: string[]
  isAuthenticated: boolean
  role: UserRole
  activeDevice: DeviceMode
  notifications: number
  toasts: ToastMessage[]
  initialize: () => void
  setRoute: (route: AppRoute) => void
  setActiveDraft: (pageId: string) => void
  setDraftText: (value: string) => void
  setMetadata: (
    field: 'title' | 'meta_description' | 'keywords',
    value: string,
  ) => void
  resetToPublished: () => void
  saveDraft: () => SaveResult
  saveAsNewDraft: () => SaveResult
  reviewChanges: () => string[]
  publishLive: () => SaveResult
  signIn: (role: UserRole) => void
  signOut: () => void
  setDevice: (mode: DeviceMode) => void
  dismissToast: (toastId: string) => void
  addMenuNode: (input: {
    label: string
    route: string
    required_role?: UserRole
    parentId?: string
    page_id?: string
  }) => SaveResult
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  currentRoute: 'home',
  navigationMenus: seedMenus,
  pagesRegistry: seedPagesRegistry,
  draftsPool: seedDrafts,
  activeDraftId: seedDrafts[0].page_id,
  baselineDraftJSON: draftToWebsiteJSON(seedDrafts[0]),
  publishedPages: seedPublishedPages,
  publishedJSON: seedPublishedPages['/'],
  draftJSON: draftToWebsiteJSON(seedDrafts[0]),
  draftText: pretty(draftToWebsiteJSON(seedDrafts[0])),
  jsonError: null,
  isDirty: false,
  lastSavedAt: 'Not saved yet',
  lastPublishedAt: 'Not published in this session',
  auditLog: ['CMS seeded with default navigation and initial drafts pool.'],
  isAuthenticated: false,
  role: 'Guest',
  activeDevice: 'desktop',
  notifications: 1,
  toasts: [],

  initialize: () => {
    const savedMenus = readStorage(STORAGE_KEYS.menus)
    const savedPagesRegistry = readStorage(STORAGE_KEYS.pagesRegistry)
    const savedDrafts =
      readStorage(STORAGE_KEYS.drafts) ?? readStorage(STORAGE_KEYS.draftsLegacy)
    const savedPublishedPages = readStorage(STORAGE_KEYS.publishedPages)
    const savedActiveDraftId = readStorage(STORAGE_KEYS.activeDraftId)
    const savedDraftText = readStorage(STORAGE_KEYS.draftText)
    const savedLastSaved = readStorage(STORAGE_KEYS.lastSaved)
    const savedLastPublished = readStorage(STORAGE_KEYS.lastPublished)
    const savedAudit = readStorage(STORAGE_KEYS.auditLog)

    const navigationMenus = savedMenus
      ? (JSON.parse(savedMenus) as MenuNode[])
      : seedMenus
    const pagesRegistry = savedPagesRegistry
      ? (JSON.parse(savedPagesRegistry) as PageRegistryEntry[])
      : seedPagesRegistry
    const draftsPool = savedDrafts ? (JSON.parse(savedDrafts) as DraftLayout[]) : seedDrafts
    const publishedPages = savedPublishedPages
      ? (JSON.parse(savedPublishedPages) as Record<string, WebsiteJSON>)
      : seedPublishedPages

    const selectedDraftId =
      savedActiveDraftId && draftsPool.some((draft) => draft.page_id === savedActiveDraftId)
        ? savedActiveDraftId
        : draftsPool[0]?.page_id ?? null

    const selectedDraft = draftsPool.find((draft) => draft.page_id === selectedDraftId) ?? null
    const baselineDraftJSON = selectedDraft ? draftToWebsiteJSON(selectedDraft) : null

    const draftText = savedDraftText ?? (baselineDraftJSON ? pretty(baselineDraftJSON) : '')
    const draftParse = draftText ? parseDraftJSON(draftText) : { data: null, error: null }
    const draftJSON = draftParse.data ?? baselineDraftJSON
    const jsonError = draftParse.error
    const isDirty =
      !jsonError && draftJSON && baselineDraftJSON
        ? JSON.stringify(draftJSON) !== JSON.stringify(baselineDraftJSON)
        : Boolean(jsonError)

    let auditLog = ['System initialized.']
    if (savedAudit) {
      try {
        const parsedAudit = JSON.parse(savedAudit) as unknown
        if (Array.isArray(parsedAudit)) {
          auditLog = parsedAudit.filter((item): item is string => typeof item === 'string')
        }
      } catch {
        auditLog = ['Audit history reset due to invalid storage payload.']
      }
    }

    set(() => ({
      navigationMenus,
      pagesRegistry,
      draftsPool: [...draftsPool],
      activeDraftId: selectedDraftId,
      baselineDraftJSON,
      publishedPages,
      publishedJSON: publishedPages['/'] ?? seedHomePage,
      draftJSON,
      draftText,
      jsonError,
      isDirty,
      lastSavedAt: savedLastSaved ?? 'Not saved yet',
      lastPublishedAt: savedLastPublished ?? 'Not published in this session',
      auditLog,
      notifications: nextNotificationCount(draftsPool, jsonError, []),
    }))
  },

  setRoute: (route) => {
    set({ currentRoute: route })
  },

  setActiveDraft: (pageId) => {
    const state = get()
    const target = state.draftsPool.find((draft) => draft.page_id === pageId)
    if (!target) {
      return
    }

    const targetJSON = draftToWebsiteJSON(target)
    writeStorage(STORAGE_KEYS.activeDraftId, target.page_id)
    writeStorage(STORAGE_KEYS.draftText, pretty(targetJSON))

    set({
      activeDraftId: target.page_id,
      baselineDraftJSON: targetJSON,
      draftJSON: targetJSON,
      draftText: pretty(targetJSON),
      jsonError: null,
      isDirty: false,
      notifications: nextNotificationCount(state.draftsPool, null, state.toasts),
    })
  },

  setDraftText: (value) => {
    const state = get()
    const parsed = parseDraftJSON(value)
    const nextDraft = parsed.data ?? state.draftJSON

    writeStorage(STORAGE_KEYS.draftText, value)

    const isDirty =
      !parsed.error && nextDraft && state.baselineDraftJSON
        ? JSON.stringify(nextDraft) !== JSON.stringify(state.baselineDraftJSON)
        : Boolean(parsed.error)

    set({
      draftText: value,
      draftJSON: nextDraft,
      jsonError: parsed.error,
      isDirty,
      notifications: nextNotificationCount(state.draftsPool, parsed.error, state.toasts),
    })
  },

  setMetadata: (field, value) => {
    const state = get()
    if (state.role !== 'Admin' || !state.draftJSON) {
      return
    }

    const nextDraft =
      field === 'keywords'
        ? {
            ...state.draftJSON,
            keywords: value
              .split(',')
              .map((keyword) => keyword.trim())
              .filter(Boolean),
          }
        : {
            ...state.draftJSON,
            [field]: value,
          }

    const nextText = pretty(nextDraft)
    const isDirty =
      state.baselineDraftJSON !== null
        ? JSON.stringify(nextDraft) !== JSON.stringify(state.baselineDraftJSON)
        : true

    writeStorage(STORAGE_KEYS.draftText, nextText)

    set({
      draftJSON: nextDraft,
      draftText: nextText,
      jsonError: null,
      isDirty,
      notifications: nextNotificationCount(state.draftsPool, null, state.toasts),
    })
  },

  resetToPublished: () => {
    const state = get()
    const activeDraft = state.draftsPool.find((draft) => draft.page_id === state.activeDraftId)
    if (!activeDraft) {
      return
    }

    const publishedCandidate = state.publishedPages[activeDraft.route]
    const fallback = state.baselineDraftJSON
    const nextDraft = publishedCandidate ?? fallback

    if (!nextDraft) {
      return
    }

    const nextAudit = addAuditEntry(state.auditLog, `Draft reset for ${activeDraft.title}`)
    const nextToast = createToast(
      'Draft Restored',
      `Reset ${activeDraft.title} to the published baseline.`,
      'info',
    )

    writeStorage(STORAGE_KEYS.draftText, pretty(nextDraft))
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))

    set({
      draftJSON: nextDraft,
      draftText: pretty(nextDraft),
      jsonError: null,
      isDirty: false,
      auditLog: nextAudit,
      toasts: [nextToast, ...state.toasts].slice(0, 4),
      notifications: nextNotificationCount(state.draftsPool, null, [nextToast, ...state.toasts].slice(0, 4)),
    })
  },

  saveDraft: () => {
    const state = get()

    if (state.role !== 'Admin') {
      const nextToast = createToast('Permission Denied', 'Only Admin users can save to the drafts hub.', 'error')
      set({
        toasts: [nextToast, ...state.toasts].slice(0, 4),
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, [nextToast, ...state.toasts].slice(0, 4)),
      })
      return { ok: false, message: 'Only Admin users can save to the drafts hub.' }
    }

    if (state.jsonError || !state.draftJSON || !state.activeDraftId) {
      const nextToast = createToast(
        'Invalid Draft',
        state.jsonError ?? 'JSON schema validation failed.',
        'error',
      )
      set({
        toasts: [nextToast, ...state.toasts].slice(0, 4),
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, [nextToast, ...state.toasts].slice(0, 4)),
      })
      return {
        ok: false,
        message: `Draft is invalid: ${state.jsonError ?? 'JSON schema validation failed.'}`,
      }
    }

    const updated = createDraftFromWebsite(state.draftJSON)
    const draftsPool = [{ ...updated }, ...state.draftsPool]

    const pagesRegistry = upsertRegistryEntry(state.pagesRegistry, draftToRegistryEntry(updated))
    const nextToast = createToast(
      'Draft Saved',
      `${updated.title} stored in the staging hub as version ${updated.page_id}.`,
      'success',
    )

    const nextAudit = addAuditEntry(
      state.auditLog,
      `Saved ${updated.title} to Staging & Drafts Hub as ${updated.page_id}`,
    )

    writeStorage(STORAGE_KEYS.drafts, JSON.stringify(draftsPool))
    writeStorage(STORAGE_KEYS.pagesRegistry, JSON.stringify(pagesRegistry))
    writeStorage(STORAGE_KEYS.lastSaved, updated.last_updated)
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))

    set(() => ({
      pagesRegistry,
      draftsPool: [...draftsPool],
      activeDraftId: updated.page_id,
      baselineDraftJSON: draftToWebsiteJSON(updated),
      draftJSON: draftToWebsiteJSON(updated),
      draftText: pretty(draftToWebsiteJSON(updated)),
      isDirty: false,
      lastSavedAt: updated.last_updated,
      auditLog: nextAudit,
      toasts: [nextToast, ...state.toasts].slice(0, 4),
      notifications: nextNotificationCount(draftsPool, null, [nextToast, ...state.toasts].slice(0, 4)),
    }))

    return { ok: true, message: 'Draft stored in Staging & Drafts Hub as a new version.' }
  },

  saveAsNewDraft: () => {
    const state = get()

    if (state.role !== 'Admin') {
      const nextToast = createToast('Permission Denied', 'Only Admin users can create a new draft copy.', 'error')
      set({
        toasts: [nextToast, ...state.toasts].slice(0, 4),
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, [nextToast, ...state.toasts].slice(0, 4)),
      })
      return { ok: false, message: 'Only Admin users can create a new draft copy.' }
    }

    if (state.jsonError || !state.draftJSON) {
      const nextToast = createToast(
        'Invalid Draft',
        state.jsonError ?? 'JSON schema validation failed.',
        'error',
      )
      set({
        toasts: [nextToast, ...state.toasts].slice(0, 4),
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, [nextToast, ...state.toasts].slice(0, 4)),
      })
      return {
        ok: false,
        message: `Draft is invalid: ${state.jsonError ?? 'JSON schema validation failed.'}`,
      }
    }

    const newDraft = createDraftFromWebsite(state.draftJSON)
    const pagesRegistry = upsertRegistryEntry(state.pagesRegistry, draftToRegistryEntry(newDraft))
    const nextToast = createToast(
      'Draft Cloned',
      `${newDraft.title} was added as a new staged version.`,
      'success',
    )
    const nextAudit = addAuditEntry(
      state.auditLog,
      `Saved new draft copy ${newDraft.title} (${newDraft.page_id})`,
    )

    writeStorage(
      STORAGE_KEYS.drafts,
      JSON.stringify([newDraft, ...state.draftsPool]),
    )
    writeStorage(STORAGE_KEYS.pagesRegistry, JSON.stringify(pagesRegistry))
    writeStorage(STORAGE_KEYS.activeDraftId, newDraft.page_id)
    writeStorage(STORAGE_KEYS.draftText, pretty(draftToWebsiteJSON(newDraft)))
    writeStorage(STORAGE_KEYS.lastSaved, newDraft.last_updated)
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))

    set((prev) => ({
      pagesRegistry,
      draftsPool: [newDraft, ...prev.draftsPool],
      activeDraftId: newDraft.page_id,
      baselineDraftJSON: draftToWebsiteJSON(newDraft),
      draftJSON: draftToWebsiteJSON(newDraft),
      draftText: pretty(draftToWebsiteJSON(newDraft)),
      isDirty: false,
      lastSavedAt: newDraft.last_updated,
      auditLog: nextAudit,
      toasts: [nextToast, ...prev.toasts].slice(0, 4),
      notifications: nextNotificationCount([newDraft, ...prev.draftsPool], null, [nextToast, ...prev.toasts].slice(0, 4)),
    }))

    return { ok: true, message: 'New draft copy created and added to Staging & Drafts Hub.' }
  },

  reviewChanges: () => {
    const state = get()
    if (!state.draftJSON || !state.baselineDraftJSON) {
      return ['No active draft selected.']
    }

    const diffs: string[] = []

    if (state.baselineDraftJSON.title !== state.draftJSON.title) {
      diffs.push('Page title changed.')
    }

    if (state.baselineDraftJSON.meta_description !== state.draftJSON.meta_description) {
      diffs.push('Meta description changed.')
    }

    if (state.baselineDraftJSON.page !== state.draftJSON.page) {
      diffs.push('Page slug changed.')
    }

    if (state.baselineDraftJSON.sections.length !== state.draftJSON.sections.length) {
      diffs.push('Section count changed.')
    }

    const sharedCount = Math.min(
      state.baselineDraftJSON.sections.length,
      state.draftJSON.sections.length,
    )

    for (let index = 0; index < sharedCount; index += 1) {
      if (
        JSON.stringify(state.baselineDraftJSON.sections[index]) !==
        JSON.stringify(state.draftJSON.sections[index])
      ) {
        diffs.push(`Section ${index + 1} content changed.`)
      }
    }

    if (diffs.length === 0) {
      diffs.push('No differences detected between editor and staging baseline.')
    }

    return diffs
  },

  publishLive: () => {
    const state = get()

    if (state.role !== 'Admin') {
      const nextToast = createToast('Permission Denied', 'Only Admin users can approve and publish live.', 'error')
      set({
        toasts: [nextToast, ...state.toasts].slice(0, 4),
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, [nextToast, ...state.toasts].slice(0, 4)),
      })
      return { ok: false, message: 'Only Admin users can approve and publish live.' }
    }

    if (state.jsonError || !state.draftJSON || !state.activeDraftId) {
      const nextToast = createToast(
        'Publish Blocked',
        state.jsonError ?? 'Validation failed.',
        'error',
      )
      set({
        toasts: [nextToast, ...state.toasts].slice(0, 4),
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, [nextToast, ...state.toasts].slice(0, 4)),
      })
      return {
        ok: false,
        message: `Cannot publish invalid draft: ${state.jsonError ?? 'Validation failed.'}`,
      }
    }

    const target = state.draftsPool.find((draft) => draft.page_id === state.activeDraftId)
    if (!target) {
      return { ok: false, message: 'No draft selected in staging hub.' }
    }

    const updatedDraft = websiteToDraft(state.draftJSON, target, 'Approved')
    const draftsPool = state.draftsPool.map((draft) =>
      draft.page_id === updatedDraft.page_id ? updatedDraft : draft,
    )

    const publishedPages = {
      ...state.publishedPages,
      [updatedDraft.route]: state.draftJSON,
    }
    const pagesRegistry = upsertRegistryEntry(
      state.pagesRegistry,
      websiteToRegistryEntry(state.draftJSON, updatedDraft.page_id),
    )

    const publishedAt = nowLabel()
    const nextAudit = addAuditEntry(state.auditLog, `Published ${updatedDraft.title} live`)
    const nextToast = createToast(
      'Published Live',
      `${updatedDraft.title} is now active at ${updatedDraft.route}.`,
      'success',
    )

    writeStorage(STORAGE_KEYS.drafts, JSON.stringify(draftsPool))
    writeStorage(STORAGE_KEYS.pagesRegistry, JSON.stringify(pagesRegistry))
    writeStorage(STORAGE_KEYS.publishedPages, JSON.stringify(publishedPages))
    writeStorage(STORAGE_KEYS.lastSaved, publishedAt)
    writeStorage(STORAGE_KEYS.lastPublished, publishedAt)
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))

    set({
      pagesRegistry,
      draftsPool,
      baselineDraftJSON: state.draftJSON,
      isDirty: false,
      publishedPages,
      publishedJSON: publishedPages['/'] ?? state.publishedJSON,
      lastSavedAt: publishedAt,
      lastPublishedAt: publishedAt,
      auditLog: nextAudit,
      toasts: [nextToast, ...state.toasts].slice(0, 4),
      notifications: nextNotificationCount(draftsPool, null, [nextToast, ...state.toasts].slice(0, 4)),
    })

    return { ok: true, message: 'Draft approved and merged into live routing.' }
  },

  signIn: (role) => {
    set((state) => {
      const nextToasts =
        role === 'Guest'
          ? state.toasts
          : [createToast('Workspace Access Granted', `Signed in as ${role}.`, 'success'), ...state.toasts].slice(0, 4)

      return {
        isAuthenticated: role !== 'Guest',
        role,
        toasts: nextToasts,
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, nextToasts),
      }
    })
  },

  signOut: () => {
    set((state) => {
      const nextToasts = [createToast('Session Closed', 'Admin session ended and the public site is active.', 'info'), ...state.toasts].slice(0, 4)

      return {
        isAuthenticated: false,
        role: 'Guest',
        currentRoute: 'home',
        activeDevice: 'desktop',
        toasts: nextToasts,
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, nextToasts),
      }
    })
  },

  setDevice: (mode) => {
    set({ activeDevice: mode })
  },

  dismissToast: (toastId) => {
    set((state) => {
      const toasts = state.toasts.filter((toast) => toast.id !== toastId)
      return {
        toasts,
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, toasts),
      }
    })
  },

  addMenuNode: ({ label, route, required_role, parentId, page_id }) => {
    const state = get()
    if (state.role !== 'Admin') {
      const nextToast = createToast('Permission Denied', 'Only Admin users can change navigation.', 'error')
      set({
        toasts: [nextToast, ...state.toasts].slice(0, 4),
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, [nextToast, ...state.toasts].slice(0, 4)),
      })
      return { ok: false, message: 'Only Admin users can change navigation.' }
    }

    if (!label.trim() || !route.trim()) {
      const nextToast = createToast('Missing Fields', 'Node label and page source are required.', 'error')
      set({
        toasts: [nextToast, ...state.toasts].slice(0, 4),
        notifications: nextNotificationCount(state.draftsPool, state.jsonError, [nextToast, ...state.toasts].slice(0, 4)),
      })
      return { ok: false, message: 'Node label and page source are required.' }
    }

    const sanitizedRoute = normalizeSlug(route)
    const node: MenuNode = {
      id: `m-${Date.now()}`,
      label,
      route: sanitizedRoute,
      required_role,
      page_id,
    }

    const normalizedParentId = parentId?.toString()

    const navigationMenus = (() => {
      if (!normalizedParentId) {
        return [...state.navigationMenus, node]
      }

      const result = appendToParentNode(state.navigationMenus, normalizedParentId, node)
      return result.inserted ? result.nodes : [...state.navigationMenus]
    })()

    const draftsPool = page_id
      ? state.draftsPool.map((draft) =>
          draft.page_id === page_id
            ? {
                ...draft,
                route: sanitizedRoute,
                last_updated: nowLabel(),
              }
            : draft,
        )
      : state.draftsPool

    const pagesRegistry = page_id
      ? state.pagesRegistry.map((entry) =>
          entry.id === page_id
            ? {
                ...entry,
                slug: sanitizedRoute,
              }
            : entry,
        )
      : state.pagesRegistry

    const nextAudit = addAuditEntry(
      state.auditLog,
      `Added navigation node ${label} (${sanitizedRoute})`,
    )
    const parentLabel = parentId
      ? findMenuNodeLabel(state.navigationMenus, parentId) ?? 'Top Level'
      : 'Top Level'
    const nextToast = createToast(
      'Navigation Updated',
      `Node '${label}' successfully appended to Parent '${parentLabel}'.`,
      'success',
    )

    writeStorage(STORAGE_KEYS.drafts, JSON.stringify(draftsPool))
    writeStorage(STORAGE_KEYS.pagesRegistry, JSON.stringify(pagesRegistry))
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))
    emitMenuSync(navigationMenus)

    set(() => ({
      navigationMenus: [...navigationMenus],
      pagesRegistry: [...pagesRegistry],
      draftsPool: [...draftsPool],
      auditLog: nextAudit,
      toasts: [nextToast, ...state.toasts].slice(0, 4),
      notifications: nextNotificationCount(draftsPool, state.jsonError, [nextToast, ...state.toasts].slice(0, 4)),
    }))

    return { ok: true, message: `Node '${label}' successfully appended to Parent '${parentLabel}'.` }
  },
}))

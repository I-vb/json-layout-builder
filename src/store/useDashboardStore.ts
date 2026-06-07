import { create } from 'zustand'
import { parseDraftJSON } from '../lib/validation'
import type {
  AppRoute,
  DeviceMode,
  DraftLayout,
  MenuNode,
  UserRole,
  WebsiteJSON,
} from '../types/schema'

const STORAGE_KEYS = {
  menus: 'saaslaunch_menus',
  drafts: 'saaslaunch_drafts',
  draftsLegacy: 'saaslaunch_drafts_pool',
  publishedPages: 'saaslaunch_published_pages',
  activeDraftId: 'saaslaunch_active_draft_id',
  draftText: 'saaslaunch_editor_draft_text',
  lastSaved: 'saaslaunch_last_saved',
  lastPublished: 'saaslaunch_last_published',
  auditLog: 'saaslaunch_audit_log',
} as const

const seedHomePage: WebsiteJSON = {
  page: 'home',
  title: 'Apex Consulting - Modern IT Solutions',
  meta_description:
    'Empowering your organization with reliable software and scalable digital infrastructure.',
  keywords: ['IT Consulting', 'Cloud Migration', 'Cybersecurity', 'Data Analytics'],
  sections: [
    {
      type: 'Hero',
      id: 'hero1',
      title: 'Modern IT Solutions for Global Business',
      subtitle:
        'Empowering your organization with reliable software and scalable digital infrastructure.',
      primaryCTA: 'Get Started',
      secondaryCTA: 'Watch Demo',
    },
    {
      type: 'FeatureGrid',
      id: 'features1',
      features: [
        {
          title: 'Cloud Migration',
          desc: 'Secure, fast, and completely seamless cloud scaling pipelines.',
        },
        {
          title: 'Cybersecurity',
          desc: 'Zero-trust network perimeters monitoring vulnerabilities 24/7.',
        },
        {
          title: 'Data Analytics',
          desc: 'Turn cold infrastructural data into automated growth pipelines.',
        },
      ],
    },
    {
      type: 'Testimonials',
      id: 'testimonials1',
      text: 'This JSON infrastructure completely revolutionized how our marketing team handles production changes.',
      rating: 5,
    },
  ],
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
    route: '/pages/home-v2-draft',
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
    page: draft.route.replace(/^\//, '') || 'page',
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
    route: website.page.startsWith('/') ? website.page : `/${website.page}`,
    meta_description: website.meta_description,
    keywords: website.keywords ?? [],
    sections: website.sections,
    status,
    last_updated: nowLabel(),
  }
}

function createDraftFromWebsite(website: WebsiteJSON): DraftLayout {
  const uniqueId = `draft-${Date.now()}`
  return {
    page_id: uniqueId,
    title: website.title || 'Untitled Draft',
    author: 'Admin Team',
    last_updated: nowLabel(),
    status: 'Pending Review',
    route: website.page.startsWith('/') ? website.page : `/${website.page}`,
    meta_description: website.meta_description,
    keywords: website.keywords ?? [],
    sections: website.sections,
  }
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

interface SaveResult {
  ok: boolean
  message: string
}

interface DashboardState {
  currentRoute: AppRoute
  navigationMenus: MenuNode[]
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
  initialize: () => void
  setRoute: (route: AppRoute) => void
  setActiveDraft: (pageId: string) => void
  setDraftText: (value: string) => void
  setMetadata: (
    field: 'page' | 'title' | 'meta_description' | 'keywords',
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
  addMenuNode: (input: {
    label: string
    route: string
    required_role?: UserRole
    parentId?: string
    page_id?: string
  }) => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  currentRoute: 'home',
  navigationMenus: seedMenus,
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
  notifications: 2,

  initialize: () => {
    const savedMenus = readStorage(STORAGE_KEYS.menus)
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
      notifications: isDirty ? 4 : 2,
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
      notifications: parsed.error ? 6 : isDirty ? 4 : 2,
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
      notifications: isDirty ? 4 : 2,
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

    writeStorage(STORAGE_KEYS.draftText, pretty(nextDraft))
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))

    set({
      draftJSON: nextDraft,
      draftText: pretty(nextDraft),
      jsonError: null,
      isDirty: false,
      auditLog: nextAudit,
      notifications: 2,
    })
  },

  saveDraft: () => {
    const state = get()

    if (state.role !== 'Admin') {
      return { ok: false, message: 'Only Admin users can save to the drafts hub.' }
    }

    if (state.jsonError || !state.draftJSON || !state.activeDraftId) {
      return {
        ok: false,
        message: `Draft is invalid: ${state.jsonError ?? 'JSON schema validation failed.'}`,
      }
    }

    const target = state.draftsPool.find((draft) => draft.page_id === state.activeDraftId)
    const matchedByRoute = state.draftsPool.find(
      (draft) => draft.route === (state.draftJSON?.page.startsWith('/') ? state.draftJSON.page : `/${state.draftJSON?.page}`),
    )

    const targetForUpdate = target ?? matchedByRoute
    const updated = targetForUpdate
      ? websiteToDraft(state.draftJSON, targetForUpdate, 'Pending Review')
      : createDraftFromWebsite(state.draftJSON)

    const hasExisting = state.draftsPool.some((draft) => draft.page_id === updated.page_id)
    const draftsPool = hasExisting
      ? state.draftsPool.map((draft) =>
          draft.page_id === updated.page_id ? { ...updated } : draft,
        )
      : [{ ...updated }, ...state.draftsPool]

    const nextAudit = addAuditEntry(
      state.auditLog,
      `Saved ${updated.title} to Staging & Drafts Hub`,
    )

    writeStorage(STORAGE_KEYS.drafts, JSON.stringify(draftsPool))
    writeStorage(STORAGE_KEYS.lastSaved, updated.last_updated)
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))

    set(() => ({
      draftsPool: [...draftsPool],
      activeDraftId: updated.page_id,
      baselineDraftJSON: draftToWebsiteJSON(updated),
      draftJSON: draftToWebsiteJSON(updated),
      draftText: pretty(draftToWebsiteJSON(updated)),
      isDirty: false,
      lastSavedAt: updated.last_updated,
      auditLog: nextAudit,
      notifications: 2,
    }))

    return { ok: true, message: 'Draft stored in Staging & Drafts Hub.' }
  },

  saveAsNewDraft: () => {
    const state = get()

    if (state.role !== 'Admin') {
      return { ok: false, message: 'Only Admin users can create a new draft copy.' }
    }

    if (state.jsonError || !state.draftJSON) {
      return {
        ok: false,
        message: `Draft is invalid: ${state.jsonError ?? 'JSON schema validation failed.'}`,
      }
    }

    const newDraft = createDraftFromWebsite(state.draftJSON)
    const nextAudit = addAuditEntry(
      state.auditLog,
      `Saved new draft copy ${newDraft.title} (${newDraft.page_id})`,
    )

    writeStorage(
      STORAGE_KEYS.drafts,
      JSON.stringify([newDraft, ...state.draftsPool]),
    )
    writeStorage(STORAGE_KEYS.activeDraftId, newDraft.page_id)
    writeStorage(STORAGE_KEYS.draftText, pretty(draftToWebsiteJSON(newDraft)))
    writeStorage(STORAGE_KEYS.lastSaved, newDraft.last_updated)
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))

    set((prev) => ({
      draftsPool: [newDraft, ...prev.draftsPool],
      activeDraftId: newDraft.page_id,
      baselineDraftJSON: draftToWebsiteJSON(newDraft),
      draftJSON: draftToWebsiteJSON(newDraft),
      draftText: pretty(draftToWebsiteJSON(newDraft)),
      isDirty: false,
      lastSavedAt: newDraft.last_updated,
      auditLog: nextAudit,
      notifications: 2,
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
      return { ok: false, message: 'Only Admin users can approve and publish live.' }
    }

    if (state.jsonError || !state.draftJSON || !state.activeDraftId) {
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

    const publishedAt = nowLabel()
    const nextAudit = addAuditEntry(state.auditLog, `Published ${updatedDraft.title} live`)

    writeStorage(STORAGE_KEYS.drafts, JSON.stringify(draftsPool))
    writeStorage(STORAGE_KEYS.publishedPages, JSON.stringify(publishedPages))
    writeStorage(STORAGE_KEYS.lastSaved, publishedAt)
    writeStorage(STORAGE_KEYS.lastPublished, publishedAt)
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))

    set({
      draftsPool,
      baselineDraftJSON: state.draftJSON,
      isDirty: false,
      publishedPages,
      publishedJSON: publishedPages['/'] ?? state.publishedJSON,
      lastSavedAt: publishedAt,
      lastPublishedAt: publishedAt,
      auditLog: nextAudit,
      notifications: 1,
    })

    return { ok: true, message: 'Draft approved and merged into live routing.' }
  },

  signIn: (role) => {
    set({ isAuthenticated: role !== 'Guest', role })
  },

  signOut: () => {
    set({ isAuthenticated: false, role: 'Guest', currentRoute: 'home' })
  },

  setDevice: (mode) => {
    set({ activeDevice: mode })
  },

  addMenuNode: ({ label, route, required_role, parentId, page_id }) => {
    const state = get()
    if (state.role !== 'Admin') {
      return
    }

    const sanitizedRoute = route.startsWith('/') ? route : `/${route}`
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

    const nextAudit = addAuditEntry(
      state.auditLog,
      `Added navigation node ${label} (${sanitizedRoute})`,
    )

    writeStorage(STORAGE_KEYS.menus, JSON.stringify(navigationMenus))
    writeStorage(STORAGE_KEYS.drafts, JSON.stringify(draftsPool))
    writeStorage(STORAGE_KEYS.auditLog, JSON.stringify(nextAudit))

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.menus, JSON.stringify(navigationMenus))
      window.dispatchEvent(new Event('navMenuUpdated'))
    }

    set(() => ({
      navigationMenus: [...navigationMenus],
      draftsPool: [...draftsPool],
      auditLog: nextAudit,
      notifications: 3,
    }))
  },
}))

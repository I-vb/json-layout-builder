import { useState } from 'react'
import type { MenuNode, UserRole } from '../types/schema'
import { useDashboardStore } from '../store/useDashboardStore'

const roleOptions: Array<UserRole | ''> = ['', 'Guest', 'Client', 'Admin']

function flattenNodes(nodes: MenuNode[]): MenuNode[] {
  const results: MenuNode[] = []

  const walk = (entries: MenuNode[]) => {
    entries.forEach((node) => {
      results.push(node)
      if (node.children?.length) {
        walk(node.children)
      }
    })
  }

  walk(nodes)
  return results
}

export function NavigationMenuManager() {
  const navigationMenus = useDashboardStore((state) => state.navigationMenus)
  const draftsPool = useDashboardStore((state) => state.draftsPool)
  const addMenuNode = useDashboardStore((state) => state.addMenuNode)

  const [label, setLabel] = useState('')
  const [route, setRoute] = useState('')
  const [requiredRole, setRequiredRole] = useState<UserRole | ''>('Guest')
  const [parentId, setParentId] = useState('')
  const [targetPageId, setTargetPageId] = useState('')

  const allNodes = flattenNodes(navigationMenus)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Navigation Tree Menu Manager
      </p>
      <h3 className="mt-1 font-display text-xl font-bold text-slate-900">Dynamic Menu Engine</h3>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Link Label
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Route Path
          <input
            value={route}
            onChange={(event) => setRoute(event.target.value)}
            placeholder="/pages/home-v2-draft"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Required Role
          <select
            value={requiredRole}
            onChange={(event) => setRequiredRole(event.target.value as UserRole | '')}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            {roleOptions.map((role) => (
              <option key={role || 'none'} value={role}>
                {role || 'No Restriction'}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Parent Menu Node
          <select
            value={parentId}
            onChange={(event) => setParentId(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            <option value="">Top-level parent</option>
            {allNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:col-span-2">
          Target Built Page
          <select
            value={targetPageId}
            onChange={(event) => {
              const selectedPage = event.target.value
              setTargetPageId(selectedPage)
              if (selectedPage && !route) {
                setRoute(`/pages/${selectedPage}`)
              }
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            <option value="">No page binding</option>
            {draftsPool.map((draft) => (
              <option key={draft.page_id} value={draft.page_id}>
                {draft.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={() => {
          if (!label.trim() || !route.trim()) {
            return
          }

          addMenuNode({
            label: label.trim(),
            route: route.trim(),
            required_role: requiredRole || undefined,
            parentId: parentId || undefined,
            page_id: targetPageId || undefined,
          })

          window.dispatchEvent(new Event('navMenuUpdated'))

          setLabel('')
          setRoute('')
          setRequiredRole('Guest')
          setParentId('')
          setTargetPageId('')
        }}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        Add Navigation Node
      </button>
    </section>
  )
}

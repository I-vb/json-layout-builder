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
  const pagesRegistry = useDashboardStore((state) => state.pagesRegistry)
  const addMenuNode = useDashboardStore((state) => state.addMenuNode)

  const [label, setLabel] = useState('')
  const [requiredRole, setRequiredRole] = useState<UserRole | ''>('Guest')
  const [parentId, setParentId] = useState('')
  const [targetPageId, setTargetPageId] = useState('')
  const [errors, setErrors] = useState<{ label?: boolean; page?: boolean }>({})
  const [savedLabel, setSavedLabel] = useState('')

  const allNodes = flattenNodes(navigationMenus)
  const selectedPage = pagesRegistry.find((page) => page.id === targetPageId)

  function renderTree(nodes: MenuNode[], depth = 0) {
    return (
      <ul className="space-y-2">
        {nodes.map((node) => (
          <li key={node.id}>
            <div
              className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2"
              style={{ marginLeft: `${depth * 0.75}rem` }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{node.label}</p>
                  <p className="text-xs text-slate-500">{node.route}</p>
                </div>
                <span className="rounded-full bg-slate-950 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  {node.required_role ?? 'Guest'}
                </span>
              </div>
            </div>
            {node.children?.length ? renderTree(node.children, depth + 1) : null}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-950/20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
          Navigation Tree Manager
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold text-white">Create New Navigation Node</h3>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            Link Label
            <input
              value={label}
              onChange={(event) => {
                setLabel(event.target.value)
                setErrors((current) => ({ ...current, label: false }))
              }}
              className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-white outline-none ${
                errors.label
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-slate-700 bg-slate-900/80'
              }`}
            />
          </label>

          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            Source Selector
            <select
              value={targetPageId}
              onChange={(event) => {
                setTargetPageId(event.target.value)
                setErrors((current) => ({ ...current, page: false }))
                if (!label.trim()) {
                  const page = pagesRegistry.find((entry) => entry.id === event.target.value)
                  if (page) {
                    setLabel(page.title)
                  }
                }
              }}
              className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-white outline-none ${
                errors.page
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-slate-700 bg-slate-900/80'
              }`}
            >
              <option className="text-slate-950" value="">
                Select registry page
              </option>
              {pagesRegistry.map((page) => (
                <option key={page.id} className="text-slate-950" value={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            Required Role
            <select
              value={requiredRole}
              onChange={(event) => setRequiredRole(event.target.value as UserRole | '')}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white"
            >
              {roleOptions.map((role) => (
                <option key={role || 'none'} className="text-slate-950" value={role}>
                  {role || 'No Restriction'}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            Parent Menu Node
            <select
              value={parentId}
              onChange={(event) => setParentId(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white"
            >
              <option className="text-slate-950" value="">
                Top-level parent
              </option>
              {allNodes.map((node) => (
                <option key={node.id} className="text-slate-950" value={node.id}>
                  {node.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Bound Source</p>
          <p className="mt-2 font-semibold text-white">{selectedPage?.title ?? 'No page selected'}</p>
          <p className="mt-1 text-slate-400">{selectedPage?.slug ?? 'Choose a registry page to map its slug and id automatically.'}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            const nextErrors = {
              label: !label.trim(),
              page: !selectedPage,
            }

            setErrors(nextErrors)
            if (nextErrors.label || nextErrors.page || !selectedPage) {
              setSavedLabel('')
              return
            }

            const result = addMenuNode({
              label: label.trim(),
              route: selectedPage.slug,
              required_role: requiredRole || undefined,
              parentId: parentId || undefined,
              page_id: selectedPage.id,
            })

            if (!result.ok) {
              setSavedLabel('')
              return
            }

            setSavedLabel(label.trim())
            setLabel('')
            setRequiredRole('Guest')
            setParentId('')
            setTargetPageId('')
            setErrors({})
          }}
          className={`mt-4 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            savedLabel
              ? 'bg-emerald-500 text-emerald-950'
              : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
          }`}
        >
          {savedLabel ? `Saved Successfully ✔ ${savedLabel}` : 'Add Navigation Node'}
        </button>
      </article>

      <article className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Recursive Navigation Tree
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold text-slate-950">Live Menu Structure</h3>
        <div className="mt-4 max-h-[24rem] overflow-auto pr-2">
          {renderTree(navigationMenus)}
        </div>
      </article>
    </section>
  )
}

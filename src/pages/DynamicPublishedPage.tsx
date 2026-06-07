import { Navigate, useLocation } from 'react-router-dom'
import { PreviewErrorBoundary } from '../components/PreviewErrorBoundary'
import { WebsiteSections } from '../components/WebsiteSections'
import { canAccessRole, useDashboardStore } from '../store/useDashboardStore'
import type { MenuNode } from '../types/schema'

function findRouteNode(nodes: MenuNode[], route: string): MenuNode | null {
  for (const node of nodes) {
    if (node.route === route) {
      return node
    }

    if (node.children?.length) {
      const match = findRouteNode(node.children, route)
      if (match) {
        return match
      }
    }
  }

  return null
}

export function DynamicPublishedPage() {
  const location = useLocation()
  const publishedPages = useDashboardStore((state) => state.publishedPages)
  const navigationMenus = useDashboardStore((state) => state.navigationMenus)
  const role = useDashboardStore((state) => state.role)

  const page = publishedPages[location.pathname]
  if (!page) {
    return <Navigate to="/" replace />
  }

  const node = findRouteNode(navigationMenus, location.pathname)
  if (node && !canAccessRole(role, node.required_role)) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[980px] items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-rose-900">Access Blocked</h2>
          <p className="mt-2 text-sm text-rose-700">
            This route requires elevated permissions and is not available for your role.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1300px] px-4 py-10 lg:px-6">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Published Page</p>
        <h2 className="mt-3 font-display text-4xl font-bold text-slate-900">{page.title}</h2>
        <p className="mt-3 max-w-2xl text-slate-600">{page.meta_description}</p>
      </section>

      <PreviewErrorBoundary>
        <WebsiteSections data={page} />
      </PreviewErrorBoundary>
    </div>
  )
}

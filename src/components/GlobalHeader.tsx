import { Bell, ChevronDown, LogOut, Menu, UserCircle2, X } from 'lucide-react'
import { AdminProfileDropdown } from './AdminProfileDropdown'
import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../lib/appRoutes'
import { canAccessRole, useDashboardStore } from '../store/useDashboardStore'
import type { MenuNode } from '../types/schema'

const MENU_STORAGE_KEY = 'saaslaunch_menus'

function readMenusFromStorage(fallback: MenuNode[]): MenuNode[] {
  if (typeof window === 'undefined') {
    return fallback
  }

  const rawMenus = window.localStorage.getItem(MENU_STORAGE_KEY)
  if (!rawMenus) {
    return fallback
  }

  try {
    return JSON.parse(rawMenus) as MenuNode[]
  } catch {
    return fallback
  }
}

function renderChildNodes(nodes: MenuNode[], onNavigate: (route: string) => void, depth = 0): ReactElement {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <li key={node.id}>
          <button
            type="button"
            onClick={() => onNavigate(node.route)}
            className="block rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
          >
            {node.label}
          </button>
          {node.children?.length ? renderChildNodes(node.children, onNavigate, depth + 1) : null}
        </li>
      ))}
    </ul>
  )
}

function filterMenusByRole(nodes: MenuNode[], role: 'Guest' | 'Client' | 'Admin'): MenuNode[] {
  return nodes
    .filter((node) => canAccessRole(role, node.required_role))
    .map((node) => ({
      ...node,
      children: node.children ? filterMenusByRole(node.children, role) : undefined,
    }))
}

export function GlobalHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)
  const navigationRef = useRef<HTMLElement | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const navigationMenus = useDashboardStore((state) => state.navigationMenus)
  const isAuthenticated = useDashboardStore((state) => state.isAuthenticated)
  const role = useDashboardStore((state) => state.role)
  const notifications = useDashboardStore((state) => state.notifications)
  const signOut = useDashboardStore((state) => state.signOut)
  const [syncedMenus, setSyncedMenus] = useState<MenuNode[]>(navigationMenus)

  useEffect(() => {
    setSyncedMenus(navigationMenus)
  }, [navigationMenus])

  useEffect(() => {
    const syncMenus = () => {
      setSyncedMenus(readMenusFromStorage(navigationMenus))
    }

    window.addEventListener('navMenuUpdated', syncMenus)
    return () => {
      window.removeEventListener('navMenuUpdated', syncMenus)
    }
  }, [navigationMenus])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!navigationRef.current) {
        return
      }

      const target = event.target
      if (target instanceof Node && !navigationRef.current.contains(target)) {
        setActiveDropdownId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleMenuNodeClick = (node: MenuNode, isMobile = false) => {
    if (node.children?.length) {
      setActiveDropdownId((current) => (current === node.id ? null : node.id))
      return
    }

    setActiveDropdownId(null)
    if (isMobile) {
      setMobileMenuOpen(false)
    }
    navigate(node.route)
  }

  const handleChildRoute = (route: string, isMobile = false) => {
    setActiveDropdownId(null)
    if (isMobile) {
      setMobileMenuOpen(false)
    }
    navigate(route)
  }

  const visibleMenus = useMemo(() => filterMenusByRole(syncedMenus, role), [syncedMenus, role])
  const isAdmin = role === 'Admin'

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 lg:px-6">
        <button type="button" onClick={() => navigate(ROUTE_PATHS.home)} className="text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Agency OS</p>
          <h1 className="font-display text-2xl font-bold text-slate-900">SaaSLaunch</h1>
        </button>

        <nav ref={navigationRef} className="relative hidden items-center gap-2 md:flex">
          {visibleMenus.map((node) => {
            const isActive = location.pathname === node.route
            const isDropdownOpen = activeDropdownId === node.id

            if (node.children?.length) {
              return (
                <div key={node.id} className="relative">
                  <button
                    type="button"
                    onClick={() => handleMenuNodeClick(node)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {node.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {isDropdownOpen ? (
                    <div className="absolute left-0 top-10 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      {renderChildNodes(node.children, (route) => handleChildRoute(route))}
                    </div>
                  ) : null}
                </div>
              )
            }

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => handleMenuNodeClick(node)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {node.label}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen((open) => !open)
            setActiveDropdownId(null)
          }}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-slate-900">
              {notifications}
            </span>
          </button>

          {isAdmin ? (
            <AdminProfileDropdown
              onSignOut={() => {
                signOut()
              }}
            />
          ) : isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              >
                <UserCircle2 className="h-4 w-4" />
                {role}
                <ChevronDown className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate(ROUTE_PATHS.home)
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Public Site
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      signOut()
                      navigate(ROUTE_PATHS.home)
                    }}
                    className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.admin)}
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Client Portal
            </button>
          )}
        </div>
      </div>

      {mobileMenuOpen ? (
        <nav className="border-t border-slate-200 bg-white p-3 md:hidden">
          <ul className="space-y-2">
            {visibleMenus.map((node) => {
              const isDropdownOpen = activeDropdownId === node.id
              const isActive = location.pathname === node.route

              return (
                <li key={node.id}>
                  <button
                    type="button"
                    onClick={() => handleMenuNodeClick(node, true)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{node.label}</span>
                    {node.children?.length ? <ChevronDown className="h-4 w-4" /> : null}
                  </button>

                  {node.children?.length && isDropdownOpen ? (
                    <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2">
                      {renderChildNodes(node.children, (route) => handleChildRoute(route, true))}
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}

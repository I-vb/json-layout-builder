import { Home, LogOut, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../lib/appRoutes'

interface AdminProfileDropdownProps {
  onSignOut: () => void
}

const ADMIN_DISPLAY_NAME = 'Admin User'
const ADMIN_EMAIL = 'admin@saaslaunch.io'
const ADMIN_INITIALS = 'SA'

export function AdminProfileDropdown({ onSignOut }: AdminProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target
      if (containerRef.current && target instanceof Node && !containerRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleNavigateHome() {
    setIsOpen(false)
    navigate(ROUTE_PATHS.home)
  }

  function handleWorkspaceSettings() {
    setIsOpen(false)
    navigate(ROUTE_PATHS.admin)
  }

  function handleSignOut() {
    setIsOpen(false)
    onSignOut()
    navigate(ROUTE_PATHS.home)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Admin profile menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white ring-2 ring-slate-900 ring-offset-2 transition hover:bg-slate-700 focus:outline-none"
      >
        {ADMIN_INITIALS}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* ── Segment 1: Identity Meta Header ── */}
          <div className="flex items-start gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {ADMIN_INITIALS}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{ADMIN_DISPLAY_NAME}</p>
              <p className="truncate text-xs text-slate-500">{ADMIN_EMAIL}</p>
              <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 ring-1 ring-inset ring-violet-200">
                Super Admin
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* ── Segment 2: Inter-workspace Routing Controls ── */}
          <div className="p-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleNavigateHome}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <Home className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Back to Home View</span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleWorkspaceSettings}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <Settings className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Workspace Settings</span>
            </button>
          </div>

          <div className="border-t border-slate-100" />

          {/* ── Segment 3: Destructive Session Actions ── */}
          <div className="p-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Log Out Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

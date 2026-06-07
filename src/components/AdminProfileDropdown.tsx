import { Home, LogOut, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../lib/appRoutes'
import { useDashboardStore } from '../store/useDashboardStore'

const ADMIN_DISPLAY_NAME = 'Admin User'
const ADMIN_EMAIL = 'admin@saaslaunch.io'
const ADMIN_INITIALS = 'SA'

export function AdminProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const signOut = useDashboardStore((state) => state.signOut)

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
    signOut()
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
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_#67e8f9,_#0f172a_58%)] text-xs font-bold text-white ring-2 ring-white/60 ring-offset-2 ring-offset-transparent transition hover:scale-[1.02] focus:outline-none"
      >
        {ADMIN_INITIALS}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/95 shadow-2xl backdrop-blur"
        >
          <div className="flex items-start gap-3 bg-[linear-gradient(135deg,_rgba(14,116,144,0.12),_rgba(15,23,42,0.02))] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_#67e8f9,_#0f172a_58%)] text-sm font-bold text-white">
              {ADMIN_INITIALS}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-950">{ADMIN_DISPLAY_NAME}</p>
              <p className="truncate text-xs text-slate-500">{ADMIN_EMAIL}</p>
              <span className="mt-2 inline-flex items-center rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-cyan-100 ring-1 ring-inset ring-cyan-300/20">
                [ Role: Super Admin ]
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100" />

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

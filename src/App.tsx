import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { GlobalFooter } from './components/GlobalFooter'
import { GlobalHeader } from './components/GlobalHeader'
import { LoginModal } from './components/LoginModal'
import { ToastOverlay } from './components/ToastOverlay'
import { pathToRoute } from './lib/appRoutes'
import { AdminAuthWall } from './pages/AdminAuthWall'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { CaseStudiesPage } from './pages/CaseStudiesPage'
import { DynamicPublishedPage } from './pages/DynamicPublishedPage'
import { HomePage } from './pages/HomePage'
import { ServicesPage } from './pages/ServicesPage'
import { useDashboardStore } from './store/useDashboardStore'

function App() {
  const location = useLocation()

  const initialize = useDashboardStore((state) => state.initialize)
  const setRoute = useDashboardStore((state) => state.setRoute)
  const role = useDashboardStore((state) => state.role)

  useEffect(() => {
    initialize()
  }, [initialize])

  const currentRoute = pathToRoute(location.pathname)

  useEffect(() => {
    setRoute(currentRoute)
  }, [currentRoute, setRoute])

  const isAdminWorkspace = currentRoute === 'admin' && role === 'Admin'
  const showLoginModal = currentRoute === 'admin' && role === 'Guest'

  return (
    <div
      className={`min-h-screen ${
        isAdminWorkspace
          ? 'bg-[radial-gradient(circle_at_15%_15%,_#0e253e,_transparent_38%),radial-gradient(circle_at_85%_0%,_#123870,_transparent_45%),linear-gradient(180deg,_#09101b,_#0b1420)]'
          : 'bg-[radial-gradient(circle_at_top_left,_#d7e6ff,_transparent_40%),radial-gradient(circle_at_80%_20%,_#d1f0ff,_transparent_40%),linear-gradient(180deg,_#f8fbff,_#ecf3ff)]'
      }`}
    >
      <GlobalHeader />
      {isAdminWorkspace ? (
        <AdminDashboardPage />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/*" element={<ServicesPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/admin" element={<AdminAuthWall />} />
            <Route path="/admin/dashboard" element={<AdminAuthWall />} />
            <Route path="*" element={<DynamicPublishedPage />} />
          </Routes>
          <GlobalFooter />
        </>
      )}
      <ToastOverlay />
      {showLoginModal && <LoginModal />}
    </div>
  )
}

export default App

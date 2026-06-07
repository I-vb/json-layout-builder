import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { GlobalFooter } from './components/GlobalFooter'
import { GlobalHeader } from './components/GlobalHeader'
import { LoginModal } from './components/LoginModal'
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

  if (isAdminWorkspace) {
    return <AdminDashboardPage />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#d7e6ff,_transparent_40%),radial-gradient(circle_at_80%_20%,_#d1f0ff,_transparent_40%),linear-gradient(180deg,_#f8fbff,_#ecf3ff)]">
      <GlobalHeader />
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
      {showLoginModal && <LoginModal />}
    </div>
  )
}

export default App

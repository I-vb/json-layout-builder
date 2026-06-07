import type { AppRoute } from '../types/schema'

export const ROUTE_PATHS: Record<AppRoute, string> = {
  home: '/',
  services: '/services',
  'case-studies': '/case-studies',
  admin: '/admin/dashboard',
}

export function pathToRoute(pathname: string): AppRoute {
  if (pathname === '/services') {
    return 'services'
  }

  if (pathname === '/case-studies') {
    return 'case-studies'
  }

  if (pathname === '/admin/dashboard' || pathname === '/admin') {
    return 'admin'
  }

  return 'home'
}

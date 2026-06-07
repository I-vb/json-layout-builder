import {
  Laptop,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { useDashboardStore } from '../store/useDashboardStore'
import type { DeviceMode } from '../types/schema'
import { PreviewErrorBoundary } from './PreviewErrorBoundary'
import { WebsiteSections } from './WebsiteSections'

const deviceClasses: Record<DeviceMode, string> = {
  mobile: 'w-[390px]',
  tablet: 'w-[760px]',
  desktop: 'w-full',
}

export function PreviewPane() {
  const draftJSON = useDashboardStore((state) => state.draftJSON)
  const jsonError = useDashboardStore((state) => state.jsonError)
  const activeDevice = useDashboardStore((state) => state.activeDevice)
  const setDevice = useDashboardStore((state) => state.setDevice)

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/75 p-4 shadow-xl shadow-blue-100/40 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Draft Staging Preview
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`device-btn ${activeDevice === 'mobile' ? 'device-btn-active' : ''}`}
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`device-btn ${activeDevice === 'tablet' ? 'device-btn-active' : ''}`}
          >
            <Tablet className="h-4 w-4" />
            Tablet
          </button>
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`device-btn ${activeDevice === 'desktop' ? 'device-btn-active' : ''}`}
          >
            <Laptop className="h-4 w-4" />
            Desktop
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          className={`min-h-[640px] rounded-2xl border border-slate-200 bg-white p-6 shadow-inner transition-all duration-300 ${deviceClasses[activeDevice]}`}
        >
          {jsonError && (
            <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Preview uses the last valid draft while JSON errors are present.
            </p>
          )}
          <PreviewErrorBoundary>
            {draftJSON ? (
              <WebsiteSections data={draftJSON} />
            ) : (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                No valid draft available for preview.
              </p>
            )}
          </PreviewErrorBoundary>
        </div>
      </div>
    </section>
  )
}

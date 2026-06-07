import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class PreviewErrorBoundary extends Component<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Preview rendering boundary captured an error', error, errorInfo)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-semibold">Preview blocked for security reasons.</p>
          <p className="mt-2">{this.state.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}

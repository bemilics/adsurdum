import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Last line of defence for render-time crashes.
 *
 * Without it React unmounts the whole tree and the user gets a blank screen on
 * every tab. Errors stay on the device: this only logs to the local console,
 * which keeps the "this app collects nothing" claim true.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Adsurdum crashed during render:', error, info.componentStack)
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children

    return (
      <div
        role="alert"
        className="flex min-h-dvh flex-col items-center justify-center bg-void px-6 text-center text-paper"
      >
        <p className="text-lg font-semibold">Something broke. Spectacularly.</p>
        <p className="mt-1 text-sm text-fog">A reload usually fixes it.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-acid px-5 py-2.5 text-sm font-semibold text-void"
        >
          Reload
        </button>
      </div>
    )
  }
}

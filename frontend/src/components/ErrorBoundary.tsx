import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { bn } from '@/lib/utils'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error)
    console.error('Error info:', errorInfo)
    this.setState({ errorInfo })
  }

  private handleReload = () => {
    // Reset error state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    // Reload the page
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 shadow-lg">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              {bn('কিছু ভুল হয়েছে')}
            </h1>

            {/* Description */}
            <p className="text-center text-muted-foreground mb-6">
              {bn('দুঃখিত, একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পেজটি পুনরায় লোড করুন।')}
            </p>

            {/* Error Details */}
            {this.state.error && (
              <div className="bg-muted p-4 rounded-md mb-6 border border-border/50">
                <p className="text-xs font-mono text-muted-foreground break-words">
                  {this.state.error.message}
                </p>
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mt-3 pt-3 border-t border-border/30">
                    <summary className="text-xs cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                      {bn('বিস্তারিত')}
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-40 text-muted-foreground bg-background p-2 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={this.handleReload}
                className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors active:scale-95 transform"
              >
                {bn('পেজ রিলোড করুন')}
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined, errorInfo: undefined })
                  window.history.back()
                }}
                className="w-full bg-secondary text-secondary-foreground px-4 py-2.5 rounded-md font-medium hover:bg-secondary/90 transition-colors"
              >
                {bn('পূর্ববর্তী পৃষ্ঠায় যান')}
              </button>
            </div>

            {/* Footer */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              {bn('সমস্যা অব্যাহত থাকলে, দয়া করে সাপোর্টের সাথে যোগাযোগ করুন।')}
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

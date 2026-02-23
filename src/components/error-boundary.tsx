/**
 * Generic React error boundary.
 * Catches render errors in children and displays a fallback UI
 * instead of crashing the entire app.
 *
 * Supports two modes:
 *   - Custom fallback via the `fallback` prop
 *   - Default card with error message + retry button
 *
 * The `onReset` callback (if provided) is called when the user clicks "Try again",
 * allowing parent components to clear stale state before re-render.
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  /** Custom fallback UI. If omitted, a default error card is shown. */
  readonly fallback?: ReactNode;
  /** Called when user clicks "Try again". Use to clear state that caused the error. */
  readonly onReset?: () => void;
  /** Optional label for the section that errored (e.g. "Dashboard", "Transfer form"). */
  readonly label?: string;
}

interface ErrorBoundaryState {
  readonly error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  private handleReset = (): void => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      const label = this.props.label ?? "This section";

      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              {label} encountered an error
            </h3>
            <p className="max-w-sm text-xs text-muted-foreground">
              {this.state.error.message}
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <RefreshCw className="h-3 w-3" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

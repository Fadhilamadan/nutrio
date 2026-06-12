import { Component, type ComponentType, type ErrorInfo, type PropsWithChildren } from "react";

import { ErrorCard } from "@/components/ui/error-card";

type ErrorBoundaryProps = PropsWithChildren<{
  fallback?: ComponentType<{ error: Error; reset: () => void }>;
}>;

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} reset={this.handleReset} />;
      }
      return (
        <ErrorCard
          title="Unexpected error"
          message={this.state.error.message || "Something went wrong while loading this section."}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

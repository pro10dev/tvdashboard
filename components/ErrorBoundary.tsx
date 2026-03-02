"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  componentDidMount() {
    if (this.state.hasError) {
      this.scheduleRetry();
    }
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (this.state.hasError && !prevState.hasError) {
      this.scheduleRetry();
    }
  }

  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  private scheduleRetry() {
    this.retryTimer = setTimeout(() => {
      this.setState({ hasError: false });
    }, 30_000);
  }

  componentWillUnmount() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
          <p className="text-2xl font-semibold">
            Dashboard temporarily unavailable
          </p>
          <p className="mt-4 text-lg text-muted">Retrying automatically...</p>
        </div>
      );
    }

    return this.props.children;
  }
}

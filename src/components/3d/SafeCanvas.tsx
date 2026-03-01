import { Component, ReactNode } from 'react';
import { Canvas, CanvasProps } from '@react-three/fiber';

interface SafeCanvasState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  SafeCanvasState
> {
  state: SafeCanvasState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('WebGL Canvas error caught:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

interface SafeCanvasProps extends CanvasProps {
  fallback?: ReactNode;
}

export default function SafeCanvas({ fallback, children, ...props }: SafeCanvasProps) {
  return (
    <CanvasErrorBoundary fallback={fallback}>
      <Canvas {...props}>{children}</Canvas>
    </CanvasErrorBoundary>
  );
}

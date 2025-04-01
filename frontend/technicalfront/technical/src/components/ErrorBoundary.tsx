import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Ici vous pourriez envoyer l'erreur à un service de monitoring
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI personnalisé ou par défaut
      return this.props.fallback || (
        <div className="p-8 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Quelque chose s'est mal passé</h2>
          <p className="text-red-600 mb-4">
            Une erreur est survenue lors du chargement de cette section.
          </p>
          <details className="bg-white p-4 rounded-md">
            <summary className="font-medium cursor-pointer mb-2">Détails de l'erreur</summary>
            <p className="text-sm font-mono whitespace-pre-wrap p-2 bg-gray-100 rounded">
              {this.state.error?.toString()}
            </p>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

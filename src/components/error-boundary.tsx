import React, { Component, type ReactNode } from 'react';

import { Button } from '@/components/ui/button-legacy';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Actualizar el estado para que la próxima renderización muestre la UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Puedes registrar el error en un servicio de logging aquí
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary capturó un error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Aquí podrías enviar el error a un servicio de logging
    // Ejemplo: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Si hay un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de fallback por defecto
      return (
        <div className="flex justify-center items-center px-4 min-h-screen bg-gray-50">
          <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold text-gray-900">
                Algo salió mal
              </h1>
              <p className="mb-6 text-gray-600">
                Lo sentimos, ocurrió un error inesperado. Por favor, intenta
                recargar la página.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-4 mb-6 text-left bg-red-50 rounded-md">
                  <p className="mb-2 text-sm font-semibold text-red-800">
                    Error (solo en desarrollo):
                  </p>
                  <p className="text-xs text-red-700">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 cursor-pointer">
                        Stack trace
                      </summary>
                      <pre className="overflow-auto mt-2 text-xs text-red-600">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  className="w-full">
                  Intentar de nuevo
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full">
                  Recargar página
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

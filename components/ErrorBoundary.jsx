import React from 'react';
import ErrorHandler from './ErrorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('React Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      hasError: true
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error ? 
        `Rendering Error: ${this.state.error.message}` : 
        'An unexpected error occurred while rendering';

      return (
        <div className="flex-grow bg-slate-50 relative">
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <div className="text-4xl mb-4">🚨</div>
              <div className="text-lg font-medium mb-2">Application Error</div>
              <div className="text-sm text-slate-400 mb-4">Something went wrong while rendering</div>
              <button 
                onClick={this.handleReset}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
          
          <ErrorHandler
            error={errorMessage}
            onClose={this.handleReset}
            onRetry={this.handleReset}
            diagram={this.props.diagram || ''}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
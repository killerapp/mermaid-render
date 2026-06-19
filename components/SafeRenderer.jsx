import React, { useState, useEffect } from 'react';

const SafeRenderer = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  // Reset error state when children change
  useEffect(() => {
    if (hasError && errorCount < 3) {
      const timer = setTimeout(() => {
        setHasError(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasError, errorCount]);

  // Global error handler
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error caught:', event.error);
      setHasError(true);
      setErrorCount(prev => prev + 1);
      event.preventDefault();
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setErrorCount(prev => prev + 1);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex-grow bg-slate-50 relative">
        <div className="flex items-center justify-center h-full text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <div className="text-lg font-medium mb-2">Safely Handled Error</div>
            <div className="text-sm text-slate-400 mb-4">
              {errorCount >= 3 ? 'Multiple errors detected. Please refresh the page.' : 'Recovering...'}
            </div>
            {errorCount < 3 && (
              <button 
                onClick={() => {
                  setHasError(false);
                  setErrorCount(0);
                }}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  try {
    return children;
  } catch (renderError) {
    console.error('Render error caught by SafeRenderer:', renderError);
    setHasError(true);
    setErrorCount(prev => prev + 1);
    return null;
  }
};

export default SafeRenderer;
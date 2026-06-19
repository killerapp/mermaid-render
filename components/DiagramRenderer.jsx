import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Button } from "@/components/ui/button";
import ErrorHandler from "./ErrorHandler";

const DiagramRenderer = ({ diagram, theme, fontSize, fontFamily, lineColor, error, setError, isLeftPanelCollapsed, setIsLeftPanelCollapsed }) => {
  const mermaidRef = useRef(null);
  const [renderKey, setRenderKey] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timer;

    const safeSetError = (errorMsg) => {
      if (isMounted) {
        try {
          setError(errorMsg);
        } catch (e) {
          console.error('Failed to set error state:', e);
        }
      }
    };

    const safeSetShowErrorModal = (show) => {
      if (isMounted) {
        try {
          setShowErrorModal(show);
        } catch (e) {
          console.error('Failed to set error modal state:', e);
        }
      }
    };

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: typeof theme === 'string' ? theme : 'base',
        themeVariables: typeof theme === 'object' ? theme : {
          fontSize: `${fontSize}px`,
          fontFamily: fontFamily,
          lineColor: lineColor,
        },
      });

      if (typeof theme === 'object') {
        mermaid.setTheme(theme);
      }
    } catch (initError) {
      console.error('Mermaid initialization failed:', initError);
      return;
    }

    const renderDiagram = async () => {
      if (!isMounted || !mermaidRef.current) return;

      // Validate diagram input
      if (!diagram || typeof diagram !== 'string') {
        console.warn('Invalid diagram input:', diagram);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full text-slate-400">
              <div class="text-center">
                <div class="text-4xl mb-4">❌</div>
                <div class="text-lg font-medium mb-2">Invalid Input</div>
                <div class="text-sm">Please provide valid diagram code</div>
              </div>
            </div>
          `;
        }
        return;
      }

      try {
        // Clear any previous errors safely
        safeSetError(null);
        safeSetShowErrorModal(false);
        
        // Clean the diagram input
        const cleanDiagram = diagram.trim();
        if (!cleanDiagram) {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full text-slate-400">
                <div class="text-center">
                  <div class="text-4xl mb-4">📝</div>
                  <div class="text-lg font-medium mb-2">Start Creating</div>
                  <div class="text-sm">Enter your diagram code in the editor</div>
                </div>
              </div>
            `;
          }
          return;
        }
        
        // Use Promise.race to timeout long-running renders
        const renderPromise = mermaid.render(`mermaid-${renderKey}`, cleanDiagram);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Render timeout')), 10000)
        );
        
        const { svg } = await Promise.race([renderPromise, timeoutPromise]);
        
        // Safely set the SVG content
        if (isMounted && mermaidRef.current && svg) {
          mermaidRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        
        if (!isMounted) return;
        
        // Prevent the error from propagating to React
        try {
          const errorMessage = `Error rendering diagram: ${err.message || 'Unknown error'}`;
          safeSetError(errorMessage);
          safeSetShowErrorModal(true);
          
          // Show a friendly fallback instead of raw code
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full text-slate-500">
                <div class="text-center">
                  <div class="text-4xl mb-4">⚠️</div>
                  <div class="text-lg font-medium mb-2">Diagram Error</div>
                  <div class="text-sm text-slate-400">Click the error button for details</div>
                </div>
              </div>
            `;
          }
        } catch (secondaryErr) {
          console.error('Error handling failed:', secondaryErr);
          // Final fallback - safe DOM update only
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full text-red-500">
                <div class="text-center">
                  <div class="text-4xl mb-4">💥</div>
                  <div class="text-lg font-medium mb-2">Critical Error</div>
                  <div class="text-sm">Please refresh the page</div>
                </div>
              </div>
            `;
          }
        }
      }
    };

    // Delay rendering to ensure DOM is ready
    timer = setTimeout(() => {
      if (isMounted) {
        renderDiagram();
      }
    }, 100);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [diagram, theme, fontSize, fontFamily, lineColor, renderKey]);

  // Force re-render on window resize
  useEffect(() => {
    const handleResize = () => setRenderKey(prev => prev + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex-grow bg-slate-50 relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md hover:shadow-lg border-slate-300"
          onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
        >
          {isLeftPanelCollapsed ? '→' : '←'}
        </Button>
        {error && (
          <Button
            variant="destructive"
            size="sm"
            className="shadow-md"
            onClick={() => setShowErrorModal(true)}
          >
            View Error
          </Button>
        )}
      </div>
      
      <div 
        id="mermaid-diagram" 
        ref={mermaidRef} 
        className="w-full h-full flex items-center justify-center p-8 overflow-auto"
        style={{ minHeight: '100%' }}
      ></div>

      <ErrorHandler
        error={showErrorModal ? error : null}
        onClose={() => {
          setShowErrorModal(false);
          setError(null);
        }}
        onRetry={() => {
          setShowErrorModal(false);
          setError(null);
          setRenderKey(prev => prev + 1); // Force re-render
        }}
        diagram={diagram}
      />
    </div>
  );
};

export default DiagramRenderer;

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Button } from "@/components/ui/button";

const DiagramRenderer = ({ diagram, theme, fontSize, fontFamily, lineColor, error, setError, isLeftPanelCollapsed, setIsLeftPanelCollapsed }) => {
  const mermaidRef = useRef(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
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

    const renderDiagram = async () => {
      if (!mermaidRef.current) return;

      try {
        const { svg } = await mermaid.render(`mermaid-${renderKey}`, diagram);
        mermaidRef.current.innerHTML = svg;
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(`Error rendering diagram: ${err.message}`);
        mermaidRef.current.innerHTML = `<pre>${diagram}</pre>`;
      }
    };

    // Delay rendering to ensure DOM is ready
    const timer = setTimeout(() => {
      renderDiagram();
    }, 0);

    return () => clearTimeout(timer);
  }, [diagram, theme, fontSize, fontFamily, lineColor, renderKey]);

  // Force re-render on window resize
  useEffect(() => {
    const handleResize = () => setRenderKey(prev => prev + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex-grow bg-white relative">
      <div className="absolute top-0 left-0 bottom-0 w-8 bg-gray-100 flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full" // Keep rounded-full for the specific circular style desired here
          onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
        >
          {isLeftPanelCollapsed ? '→' : '←'}
        </Button>
      </div>
      {error && <div className="text-red-500 p-4 ml-8">{error}</div>}
      <div id="mermaid-diagram" ref={mermaidRef} className="w-full h-full flex items-center justify-center border rounded shadow-inner ml-8"></div>
    </div>
  );
};

export default DiagramRenderer;

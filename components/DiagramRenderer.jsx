import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

const DiagramRenderer = ({ diagram, theme, fontSize, fontFamily, lineColor, error, setError, isLeftPanelCollapsed, setIsLeftPanelCollapsed }) => {
  const mermaidRef = useRef(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      themeVariables: {
        fontSize: `${fontSize}px`,
        fontFamily: fontFamily,
        lineColor: lineColor,
      },
    });

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
      <button
        className="absolute top-2 left-2 z-10 p-2 bg-gray-200 rounded-full"
        onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
      >
        {isLeftPanelCollapsed ? '→' : '←'}
      </button>
      {error && <div className="text-red-500 p-4">{error}</div>}
      <div ref={mermaidRef} className="w-full h-full flex items-center justify-center border rounded shadow-inner"></div>
    </div>
  );
};

export default DiagramRenderer;
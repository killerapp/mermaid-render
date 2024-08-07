import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidRenderer = () => {
  const [diagram, setDiagram] = useState('graph TD\nA[Client] --> B[Load Balancer]\nB --> C[Server1]\nB --> D[Server2]');
  const [theme, setTheme] = useState('default');
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('arial');
  const [lineColor, setLineColor] = useState('#000000');
  const [error, setError] = useState(null);

  const mermaidRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      if (typeof window.mermaid === 'undefined' || !isMounted) return;

      try {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: theme,
          themeVariables: {
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            lineColor: lineColor,
          },
        });

        const { svg } = await window.mermaid.render('mermaid-diagram', diagram);
        if (mermaidRef.current && isMounted) {
          mermaidRef.current.innerHTML = svg;
        }
        setError(null);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        setError('Error rendering diagram. Please check your syntax.');
      }
    };

    const loadMermaid = async () => {
      if (typeof window.mermaid === 'undefined') {
        try {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.1/mermaid.min.js';
          script.async = true;
          script.onload = renderDiagram;
          document.body.appendChild(script);
        } catch (error) {
          console.error('Error loading Mermaid:', error);
          setError('Error loading Mermaid library. Please try again later.');
        }
      } else {
        renderDiagram();
      }
    };

    loadMermaid();

    return () => {
      isMounted = false;
    };
  }, [diagram, theme, fontSize, fontFamily, lineColor]);

  const handleDownload = () => {
    try {
      const svgElement = mermaidRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mermaid-diagram.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading diagram:', error);
      setError('Error downloading diagram. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Mermaid Diagram Renderer</h1>
      </header>

      <main className="flex-grow flex">
        <div className="w-1/2 p-4 bg-gray-100 overflow-y-auto">
          <textarea
            value={diagram}
            onChange={(e) => setDiagram(e.target.value)}
            className="w-full h-64 p-2 border rounded mb-4 text-sm"
            placeholder="Enter your Mermaid diagram code here..."
          />
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="default">Default</option>
                <option value="forest">Forest</option>
                <option value="dark">Dark</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Size (px)</label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min="8"
                max="30"
                className="w-full p-1 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="arial">Arial</option>
                <option value="helvetica">Helvetica</option>
                <option value="courier">Courier</option>
                <option value="verdana">Verdana</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Line Color</label>
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-full"
              />
            </div>
            <button
              onClick={handleDownload}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download as SVG
            </button>
          </div>
        </div>
        <div className="w-1/2 p-4 bg-white">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div ref={mermaidRef} className="w-full h-full flex items-center justify-center border rounded shadow-inner"></div>
          )}
        </div>
      </main>

      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2024 Mermaid Diagram Renderer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MermaidRenderer;
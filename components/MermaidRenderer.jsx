import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidRenderer = () => {
  const [diagram, setDiagram] = useState('graph TD\nA[Client] --> B[Load Balancer]\nB --> C[Server1]\nB --> D[Server2]');
  const [theme, setTheme] = useState('default');
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('arial');
  const [lineColor, setLineColor] = useState('#000000');
  const [error, setError] = useState(null);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(25); // 25% of the screen width

  const mermaidRef = useRef(null);
  const resizeRef = useRef(null);

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
          setupPanZoom();
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

  const setupPanZoom = () => {
    const svg = mermaidRef.current.querySelector('svg');
    let isPanning = false;
    let startX, startY, viewBox;

    svg.addEventListener('mousedown', startPan);
    svg.addEventListener('mousemove', pan);
    svg.addEventListener('mouseup', endPan);
    svg.addEventListener('mouseleave', endPan);

    function startPan(evt) {
      isPanning = true;
      startX = evt.clientX;
      startY = evt.clientY;
      viewBox = svg.viewBox.baseVal;
    }

    function pan(evt) {
      if (!isPanning) return;
      const dx = (evt.clientX - startX) / svg.clientWidth * viewBox.width;
      const dy = (evt.clientY - startY) / svg.clientHeight * viewBox.height;
      viewBox.x -= dx;
      viewBox.y -= dy;
      startX = evt.clientX;
      startY = evt.clientY;
    }

    function endPan() {
      isPanning = false;
    }

    svg.style.cursor = 'grab';
  };

  const handleDownload = (format) => {
    try {
      const svgElement = mermaidRef.current.querySelector('svg');
      if (format === 'svg') {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        downloadBlob(blob, 'mermaid-diagram.svg');
      } else if (format === 'png') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            downloadBlob(blob, 'mermaid-diagram.png');
          });
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svgElement));
      }
    } catch (error) {
      console.error('Error downloading diagram:', error);
      setError('Error downloading diagram. Please try again.');
    }
  };

  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResize = (e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setLeftPanelWidth(Math.max(10, Math.min(newWidth, 50)));
  };

  const fonts = [
    { name: 'Arial', value: 'arial' },
    { name: 'Helvetica', value: 'helvetica' },
    { name: 'Courier', value: 'courier' },
    { name: 'Verdana', value: 'verdana' },
    { name: 'Times New Roman', value: 'times' },
    { name: 'Georgia', value: 'georgia' },
    { name: 'Palatino', value: 'palatino' },
    { name: 'Garamond', value: 'garamond' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Mermaid Diagram Renderer</h1>
      </header>

      <main className="flex-grow flex">
        <div
          className={`bg-gray-100 overflow-y-auto transition-all duration-300 ease-in-out ${
            isLeftPanelCollapsed ? 'w-0' : ''
          }`}
          style={{ width: isLeftPanelCollapsed ? '0' : `${leftPanelWidth}%` }}
        >
          <div className="p-4">
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
                  {fonts.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
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
                onClick={() => handleDownload('svg')}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
              >
                Download as SVG
              </button>
              <button
                onClick={() => handleDownload('png')}
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download as PNG
              </button>
            </div>
          </div>
        </div>
        <div
          className="w-1 bg-gray-300 cursor-col-resize"
          onMouseDown={() => {
            const handleMouseMove = (e) => handleResize(e);
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
          ref={resizeRef}
        ></div>
        <div className="flex-grow bg-white relative">
          <button
            className="absolute top-2 left-2 z-10 p-2 bg-gray-200 rounded-full"
            onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
          >
            {isLeftPanelCollapsed ? '→' : '←'}
          </button>
          {error ? (
            <div className="text-red-500 p-4">{error}</div>
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
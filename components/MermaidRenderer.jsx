import React, { useState } from 'react';
import DiagramRenderer from './DiagramRenderer';
import DiagramControls from './DiagramControls';

const MermaidRenderer = () => {
    const [diagram, setDiagram] = useState(`graph TD
        A[Client] --> B[Load Balancer]
        B --> C[Server1]
        B --> D[Server2]`);
  const [theme, setTheme] = useState('default');
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('arial');
  const [lineColor, setLineColor] = useState('#000000');
  const [error, setError] = useState(null);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(25);

  const handleDownload = async (format) => {
    try {
      const svgElement = document.querySelector('#mermaid-diagram svg');
      if (!svgElement) {
        throw new Error('SVG element not found. Please ensure the diagram is rendered correctly.');
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

      if (format === 'svg') {
        downloadBlob(svgBlob, 'mermaid-diagram.svg');
      } else if (format === 'png') {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          // Instead of using toBlob, we'll use toDataURL
          const pngData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngData;
          link.download = 'mermaid-diagram.png';
          link.click();
        };
        img.onerror = () => {
          throw new Error('Failed to load SVG as image');
        };
        img.src = URL.createObjectURL(svgBlob);
      }
    } catch (error) {
      console.error('Error downloading diagram:', error);
      setError(`Error downloading diagram: ${error.message}`);
    }
  };

  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResize = (e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setLeftPanelWidth(Math.max(10, Math.min(newWidth, 50)));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">🧠💡 ConceptCraft: Mermaid Diagram Visualizer</h1>
      </header>

      <main className="flex-grow flex">
        <DiagramControls
          diagram={diagram}
          setDiagram={setDiagram}
          theme={theme}
          setTheme={setTheme}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          lineColor={lineColor}
          setLineColor={setLineColor}
          handleDownload={handleDownload}
          isLeftPanelCollapsed={isLeftPanelCollapsed}
          leftPanelWidth={leftPanelWidth}
        />
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
        ></div>
        <DiagramRenderer
          diagram={diagram}
          theme={theme}
          fontSize={fontSize}
          fontFamily={fontFamily}
          lineColor={lineColor}
          error={error}
          setError={setError}
          isLeftPanelCollapsed={isLeftPanelCollapsed}
          setIsLeftPanelCollapsed={setIsLeftPanelCollapsed}
        />
      </main>

      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2024 Agentic Insights, LLC. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MermaidRenderer;

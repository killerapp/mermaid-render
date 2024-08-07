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

  const handleDownload = (format) => {
    try {
      const svgElement = document.querySelector('#mermaid-diagram svg');
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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Mermaid Diagram Renderer</h1>
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
        <p>&copy; 2024 Mermaid Diagram Renderer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MermaidRenderer;
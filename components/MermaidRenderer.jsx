import React, { useState } from 'react';
import DiagramRenderer from './DiagramRenderer';
import DiagramControls from './DiagramControls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faDiagram } from '@fortawesome/free-solid-svg-icons';

const MermaidRenderer = () => {
    const [diagram, setDiagram] = useState(`graph TD
        A[Client] --> B[Load Balancer]
        B --> C[Server1]
        B --> D[Server2]`);
  const [theme, setTheme] = useState('default');
  const [customTheme, setCustomTheme] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('arial');
  const [lineColor, setLineColor] = useState('#000000');
  const [error, setError] = useState(null);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(25);

  const handleDownload = () => {
    try {
      const svgElement = document.querySelector('#mermaid-diagram svg');
      if (!svgElement) {
        throw new Error('SVG element not found. Please ensure the diagram is rendered correctly.');
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mermaid-diagram.svg';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading diagram:', error);
      setError(`Error downloading diagram: ${error.message}`);
    }
  };

  const handleResize = (e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setLeftPanelWidth(Math.max(10, Math.min(newWidth, 50)));
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-2">
        <h1 className="text-xl font-bold">📊 Mermaid Visualizer</h1>
      </header>

      <main className="flex flex-grow overflow-hidden">
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

      <footer className="bg-gray-200 p-2 text-center text-xs flex items-center justify-center space-x-4">
        <span className="flex items-center">
          <FontAwesomeIcon icon={faDiagram} className="mr-1" />
          Mermaid Visualizer
        </span>
        <span>|</span>
        <a
          href="https://github.com/mermaid-js/mermaid"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          <FontAwesomeIcon icon={faGithub} className="mr-1" />
          Mermaid on GitHub
        </a>
        <span>|</span>
        <a
          href="https://github.com/killerapp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          <FontAwesomeIcon icon={faGithub} className="mr-1" />
          Developer's GitHub
        </a>
      </footer>
    </div>
  );
};

export default MermaidRenderer;

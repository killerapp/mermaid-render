import React, { useState } from 'react';
import DiagramRenderer from './DiagramRenderer';
import DiagramControls from './DiagramControls';
import ErrorBoundary from './ErrorBoundary';
import SafeRenderer from './SafeRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { templates } from '../lib/templates';

const MermaidRenderer = () => {
  const [diagram, setDiagram] = useState(templates[0].code);
  const [theme, setTheme] = useState('default');
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('arial');
  const [lineColor, setLineColor] = useState('#000000');
  const [error, setError] = useState(null);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(35);

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
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">Mermaid Visualizer</h1>
          <p className="text-slate-300 text-sm mt-1">Professional diagram creation and visualization</p>
        </div>
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
          className="w-1 bg-slate-300 hover:bg-slate-400 cursor-col-resize transition-colors"
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
        <SafeRenderer>
          <ErrorBoundary diagram={diagram}>
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
          </ErrorBoundary>
        </SafeRenderer>
      </main>

      <footer className="bg-white border-t border-slate-200 px-6 py-3 text-xs flex items-center justify-between text-slate-600">
        <div className="flex items-center space-x-4">
          <span className="flex items-center font-medium">
            <FontAwesomeIcon icon={faChartBar} className="mr-2 text-slate-700" />
            Mermaid Visualizer
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/mermaid-js/mermaid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900 transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faGithub} className="mr-1" />
            Mermaid on GitHub
          </a>
          <a
            href="https://github.com/killerapp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900 transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faGithub} className="mr-1" />
            Developer's GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default MermaidRenderer;

import React, { useState } from 'react';
import { mermaidVersion } from '../utils/mermaidVersion';

const DiagramControls = ({
  diagram,
  setDiagram,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  lineColor,
  setLineColor,
  handleDownload,
  isLeftPanelCollapsed,
  leftPanelWidth,
}) => {
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [jsonTheme, setJsonTheme] = useState('');
  const diagramsWithoutFontSize = ['sequence', 'state', 'er', 'journey'];

  const diagramTypes = [
    { name: 'Flowchart', description: 'Diagrams to describe processes and workflows' },
    { name: 'Sequence', description: 'Diagrams to show interactions between objects' },
    { name: 'Gantt', description: 'Charts for project scheduling and timeline visualization' },
    { name: 'Class', description: 'Diagrams to illustrate the structure of classes in OOP' },
    { name: 'State', description: 'Diagrams to describe state machines and transitions' },
    { name: 'ER', description: 'Entity Relationship Diagrams for database design' },
    { name: 'User Journey', description: 'Maps to visualize user interactions with a system' },
    { name: 'Pie', description: 'Simple pie charts for data visualization' },
    { name: 'Requirement', description: 'Diagrams to document system requirements' },
    { name: 'Gitgraph', description: 'Diagrams to visualize Git branching and merging' },
  ];

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

  const handleEditorFocus = () => {
    setIsEditorExpanded(true);
  };

  const handleEditorBlur = () => {
    setIsEditorExpanded(false);
  };

  const handleJsonThemeChange = (e) => {
    setJsonTheme(e.target.value);
    try {
      const parsedTheme = JSON.parse(e.target.value);
      setTheme(parsedTheme);
    } catch (error) {
      console.error('Invalid JSON theme:', error);
    }
  };

  return (
    <div
      className={`bg-gray-100 overflow-y-auto transition-all duration-300 ease-in-out ${
        isLeftPanelCollapsed ? 'w-0' : ''
      } ${isEditorExpanded ? 'z-10' : ''}`}
      style={{
        width: isLeftPanelCollapsed ? '0' : isEditorExpanded ? '66.67%' : `${leftPanelWidth}%`,
        position: isEditorExpanded ? 'absolute' : 'relative',
        height: isEditorExpanded ? '100%' : 'auto',
      }}
    >
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Diagram Controls</h2>
        <div className="relative">
          <textarea
            value={diagram}
            onChange={(e) => setDiagram(e.target.value)}
            onFocus={handleEditorFocus}
            className={`w-full p-2 border rounded mb-4 text-sm transition-all duration-300 ease-in-out ${
              isEditorExpanded ? 'h-[calc(100vh-200px)]' : 'h-64'
            }`}
            placeholder="Enter your Mermaid diagram code here..."
          />
          {isEditorExpanded && (
            <button
              onClick={handleEditorBlur}
              className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded"
            >
              Done
            </button>
          )}
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select
              value={typeof theme === 'string' ? theme : 'custom'}
              onChange={(e) => e.target.value !== 'custom' && setTheme(e.target.value)}
              className="w-full p-1 border rounded text-sm"
            >
              <option value="default">Default</option>
              <option value="forest">Forest</option>
              <option value="dark">Dark</option>
              <option value="neutral">Neutral</option>
              <option value="custom">Custom (JSON)</option>
            </select>
          </div>
          {(typeof theme !== 'string' || theme === 'custom') && (
            <div>
              <label className="block text-sm font-medium mb-1">Custom Theme (JSON)</label>
              <textarea
                value={jsonTheme}
                onChange={handleJsonThemeChange}
                className="w-full p-2 border rounded mb-2 text-sm h-32 font-mono bg-gray-50"
                placeholder="Enter custom theme JSON here..."
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="flex-grow">
              <label className={`block text-sm font-medium mb-1 ${diagramsWithoutFontSize.some(type => diagram.trim().toLowerCase().startsWith(type)) ? 'text-gray-400' : ''}`}>
                Font Size (px)
                <span
                  className="ml-1 cursor-help"
                  title="Sometimes the font size doesn't work as expected. This is due to limitations in Mermaid's rendering engine. If you encounter issues, try adjusting other settings or refreshing the diagram."
                >
                  ❓
                </span>
              </label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min="8"
                max="30"
                className={`w-full p-1 border rounded text-sm ${diagramsWithoutFontSize.some(type => diagram.trim().toLowerCase().startsWith(type)) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                disabled={diagramsWithoutFontSize.some(type => diagram.trim().toLowerCase().startsWith(type))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Line Color</label>
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-8 h-8"
              />
            </div>
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
          <div className="mb-2 pt-4 border-t border-gray-300">
            <label className="block text-sm font-medium mb-2">Download</label>
            <div>
              <button
                onClick={() => handleDownload('svg')}
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download as SVG
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 p-4 bg-blue-100 rounded shadow-inner">
        <h3 className="text-md font-semibold mb-2">Supported Diagram Types</h3>
        <div className="max-h-40 overflow-y-auto">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {diagramTypes.map((type, index) => (
              <li key={index}>
                <span className="font-medium">{type.name}:</span> {type.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiagramControls;

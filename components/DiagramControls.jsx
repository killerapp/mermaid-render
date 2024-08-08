import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';

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
  const [mermaidVersion, setMermaidVersion] = useState('');
  const diagramsWithoutFontSize = ['sequence', 'state', 'er', 'journey'];

  useEffect(() => {
    setMermaidVersion(mermaid.version());
  }, []);

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
      <div className="p-4">
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
                className="w-full p-2 border rounded mb-2 text-sm h-32"
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
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Download</label>
            <div>
              <button
                onClick={() => handleDownload('svg')}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download as SVG
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-gray-200 rounded">
        <h3 className="text-lg font-semibold mb-2">Supported Diagram Types</h3>
        <ul className="list-disc pl-5 space-y-1">
          {diagramTypes.map((type, index) => (
            <li key={index}>
              <span className="font-medium">{type.name}:</span> {type.description}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <span className="font-medium">Mermaid Version:</span> {mermaidVersion}
        </p>
      </div>
    </div>
  );
};

export default DiagramControls;

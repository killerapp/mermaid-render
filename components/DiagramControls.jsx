import React, { useState } from 'react';

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
  const diagramsWithoutFontSize = ['sequence', 'state', 'er', 'journey'];

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
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Download</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload('svg')}
                className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                SVG
              </button>
              <button
                onClick={() => handleDownload('png')}
                className="flex-1 p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramControls;

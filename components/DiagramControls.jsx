import React from 'react';

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
  );
};

export default DiagramControls;
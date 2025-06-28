import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CodeEditor from "@/components/ui/code-editor";
import { templates } from '../lib/templates';

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
  const [copyButtonText, setCopyButtonText] = useState('Copy Code');
  const diagramsWithoutFontSize = ['sequence', 'state', 'er', 'journey', 'c4'];

  const diagramTypes = [
    { name: 'Flowchart', description: 'Describe processes and workflows' },
    { name: 'Sequence', description: 'Show interactions between objects' },
    { name: 'Gantt', description: 'Project scheduling and timelines' },
    { name: 'Class', description: 'Illustrate class structures in OOP' },
    { name: 'State', description: 'Describe state machines and transitions' },
    { name: 'ER', description: 'Entity Relationship Diagrams for databases' },
    { name: 'User Journey', description: 'Visualize user interactions with a system' },
    { name: 'Pie', description: 'Simple pie charts for data visualization' },
    { name: 'Requirement', description: 'Document system requirements' },
    { name: 'Gitgraph', description: 'Visualize Git branching and merging' },
    { name: 'C4', description: 'C4 model for software architecture' },
    { name: 'Mindmap', description: 'Visualize ideas and concepts' },
    { name: 'Timeline', description: 'Visualize events over time' },
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(diagram);
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy Code'), 2000);
  };

  return (
    <div
      className={`bg-white border-r border-slate-200 overflow-y-auto transition-all duration-300 ease-in-out ${
        isLeftPanelCollapsed ? 'w-0' : ''
      } ${isEditorExpanded ? 'z-10 shadow-2xl' : ''}`}
      style={{
        width: isLeftPanelCollapsed ? '0' : isEditorExpanded ? '66.67%' : `${leftPanelWidth}%`,
        position: isEditorExpanded ? 'absolute' : 'relative',
        height: isEditorExpanded ? '100%' : 'auto',
      }}
    >
      <div className="p-6 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Diagram Editor</h2>
          <p className="text-sm text-slate-600 mt-1">Create and customize your diagrams</p>
        </div>
        <div className="relative">
          <CodeEditor
            value={diagram}
            onChange={setDiagram}
            onFocus={handleEditorFocus}
            onBlur={handleEditorBlur}
            isExpanded={isEditorExpanded}
            onToggleExpand={() => setIsEditorExpanded(!isEditorExpanded)}
            language="mermaid"
            placeholder="Enter your Mermaid diagram code here..."
            className="w-full"
          />
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="template-select" className="block text-sm font-medium text-slate-700 mb-2">Architecture Templates</Label>
            <Select onValueChange={(value) => setDiagram(value)} id="template-select">
              <SelectTrigger className="w-full h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template, index) => (
                  <SelectItem key={index} value={template.code}>
                    {template.name} ({template.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="theme-select" className="block text-sm font-medium text-slate-700 mb-2">Theme</Label>
            <Select value={theme} onValueChange={setTheme} id="theme-select">
              <SelectTrigger className="w-full h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="font-size-input" className={`block text-sm font-medium text-slate-700 mb-2 ${diagramsWithoutFontSize.some(type => diagram.trim().toLowerCase().startsWith(type)) ? 'text-slate-400' : ''}`}>
                Font Size
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 cursor-help text-slate-400">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Font size may not work for all diagram types due to Mermaid limitations</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="font-size-input"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min="8"
                max="30"
                className={`h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500 ${diagramsWithoutFontSize.some(type => diagram.trim().toLowerCase().startsWith(type)) ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                disabled={diagramsWithoutFontSize.some(type => diagram.trim().toLowerCase().startsWith(type))}
              />
            </div>
            <div>
              <Label htmlFor="line-color-input" className="block text-sm font-medium text-slate-700 mb-2">Line Color</Label>
              <Input
                id="line-color-input"
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-full h-10 border-slate-300 focus:border-slate-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="font-family-select" className="block text-sm font-medium text-slate-700 mb-2">Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily} id="font-family-select">
              <SelectTrigger className="w-full h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-4 border-t border-slate-200 flex space-x-2">
            <Button
              onClick={() => handleDownload('svg')}
              className="w-full h-10 bg-slate-900 hover:bg-slate-700 text-white font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download SVG
            </Button>
            <Button
              onClick={handleCopyCode}
              className="w-full h-10 bg-slate-900 hover:bg-slate-700 text-white font-medium"
            >
              {copyButtonText}
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-6 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Supported Diagram Types</h3>
        <div className="max-h-40 overflow-y-auto">
          <ul className="space-y-2 text-xs">
            {diagramTypes.map((type, index) => (
              <li key={index} className="flex flex-col">
                <span className="font-medium text-slate-800">{type.name}</span>
                <span className="text-slate-600">{type.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiagramControls;

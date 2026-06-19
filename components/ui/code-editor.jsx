import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const CodeEditor = ({
  value,
  onChange,
  onFocus,
  onBlur,
  isExpanded,
  onToggleExpand,
  className,
  placeholder = "Enter your code here...",
  language = "text",
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      bracketPairColorization: { enabled: true },
      renderLineHighlight: 'line',
      selectOnLineNumbers: true,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
    });

    // Register Mermaid language
    if (window.monaco) {
      window.monaco.languages.register({ id: 'mermaid' });
      
      window.monaco.languages.setMonarchTokensProvider('mermaid', {
        tokenizer: {
          root: [
            [/graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|gitgraph|requirement/, 'keyword'],
            [/TD|TB|BT|RL|LR/, 'keyword'],
            [/-->|---/, 'operator'],
            [/\[.*?\]/, 'string'],
            [/\(.*?\)/, 'string'],
            [/\{.*?\}/, 'string'],
            [/%%.*$/, 'comment'],
            [/[A-Za-z_][A-Za-z0-9_]*/, 'identifier'],
            [/\d+/, 'number'],
          ]
        }
      });

      window.monaco.languages.setLanguageConfiguration('mermaid', {
        comments: {
          lineComment: '%%'
        },
        brackets: [
          ['[', ']'],
          ['(', ')'],
          ['{', '}']
        ]
      });
    }

    // Add custom theme
    window.monaco?.editor.defineTheme('mermaid-theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: '5a67d8', fontStyle: 'bold' },
        { token: 'string', foreground: '22543d' },
        { token: 'number', foreground: 'd53f8c' },
        { token: 'operator', foreground: 'e53e3e', fontStyle: 'bold' },
        { token: 'identifier', foreground: '2d3748' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#2d3748',
        'editor.lineHighlightBackground': '#f7fafc',
        'editor.selectionBackground': '#bee3f8',
        'editorLineNumber.foreground': '#a0aec0',
        'editorLineNumber.activeForeground': '#4a5568',
        'editor.inactiveSelectionBackground': '#e2e8f0',
        'editorBracketMatch.background': '#fef5e7',
        'editorBracketMatch.border': '#ed8936',
      },
    });

    window.monaco?.editor.setTheme('mermaid-theme');
  };

  const handleCopy = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const editorHeight = isExpanded ? 'calc(100vh - 200px)' : '400px';

  return (
    <div className={cn("relative", className)} {...props}>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium text-slate-700">Code Editor</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div 
        className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
        style={{ height: editorHeight }}
      >
        <Editor
          height="100%"
          language={language}
          value={value || ''}
          onChange={(val) => onChange && onChange(val || '')}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
            </div>
          }
          options={{
            wordWrap: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineHeight: 20,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: false,
            trimAutoWhitespace: true,
          }}
        />
      </div>
      
      {value === '' && (
        <div className="absolute top-12 left-4 text-slate-400 text-sm pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
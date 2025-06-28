import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Copy, Check } from "lucide-react";
import { useState } from 'react';

const ErrorHandler = ({ error, onClose, onRetry, diagram }) => {
  const [copied, setCopied] = useState(false);

  if (!error) return null;

  const handleCopyError = async () => {
    try {
      const errorDetails = `Error: ${error}\n\nDiagram Code:\n${diagram}`;
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error details');
    }
  };

  const getErrorTitle = (errorMessage) => {
    if (errorMessage.includes('Lexical error')) return 'Syntax Error';
    if (errorMessage.includes('Parse error')) return 'Parse Error';
    if (errorMessage.includes('Unexpected token')) return 'Invalid Syntax';
    return 'Diagram Error';
  };

  const getErrorSuggestion = (errorMessage) => {
    if (errorMessage.includes('Lexical error')) {
      return 'Check your diagram syntax. Make sure keywords like "graph", "flowchart", "sequenceDiagram" are spelled correctly.';
    }
    if (errorMessage.includes('Parse error')) {
      return 'There\'s an issue with your diagram structure. Verify that arrows and connections are properly formatted.';
    }
    return 'Review your diagram code for any syntax errors or typos.';
  };

  const cleanErrorMessage = (error) => {
    // Extract just the relevant part of the error message
    if (error.includes('Error rendering diagram:')) {
      return error.replace('Error rendering diagram: ', '');
    }
    return error;
  };

  return (
    <AlertDialog open={!!error} onOpenChange={() => onClose()}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                {getErrorTitle(error)}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left mt-1">
                {getErrorSuggestion(error)}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="my-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-red-800 mb-2">Error Details</h4>
                <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
                  {cleanErrorMessage(error)}
                </pre>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyError}
                className="ml-2 h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 Quick Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Start with diagram type: <code className="bg-blue-100 px-1 rounded">graph TD</code>, <code className="bg-blue-100 px-1 rounded">flowchart LR</code>, etc.</li>
            <li>• Use proper arrow syntax: <code className="bg-blue-100 px-1 rounded">--&gt;</code> or <code className="bg-blue-100 px-1 rounded">---</code></li>
            <li>• Enclose labels in brackets: <code className="bg-blue-100 px-1 rounded">A[Label]</code></li>
            <li>• Check for typos in keywords and node names</li>
          </ul>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Close
          </AlertDialogCancel>
          {onRetry && (
            <AlertDialogAction onClick={onRetry}>
              Try Again
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ErrorHandler;
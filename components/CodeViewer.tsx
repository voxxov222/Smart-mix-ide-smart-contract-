import React from 'react';
import { FileNode } from '../types';

interface CodeViewerProps {
  file: FileNode | null;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ file }) => {
  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-[#121212]">
        <div className="w-16 h-16 mb-4 rounded-full bg-remix-card flex items-center justify-center animate-pulse">
          <svg className="w-8 h-8 text-remix-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <p>Select a file to view code</p>
      </div>
    );
  }

  // Simple syntax highlighting simulator for display purposes
  // In a real app, use prismjs or monaco-editor
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <div key={i} className="table-row">
        <span className="table-cell text-right pr-4 text-gray-600 select-none w-8 text-xs align-top pt-[2px]">
          {i + 1}
        </span>
        <span className="table-cell whitespace-pre-wrap font-mono text-sm text-gray-300 align-top">
          {line || '\n'}
        </span>
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col bg-[#121212]">
      <div className="h-10 border-b border-remix-border flex items-center px-4 bg-[#181818]">
        <span className="text-sm text-gray-400 font-mono">{file.name}</span>
        <span className="ml-2 text-xs text-gray-600 border border-gray-700 rounded px-1.5 py-0.5">
          {file.language}
        </span>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <div className="table w-full">
          {renderContent(file.content || '')}
        </div>
      </div>
    </div>
  );
};
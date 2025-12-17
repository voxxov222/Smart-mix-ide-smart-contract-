import React, { useState } from 'react';
import { GitBranch, Search, Settings, Command, Menu } from 'lucide-react';
import { FileExplorer } from './components/FileExplorer';
import { CodeViewer } from './components/CodeViewer';
import { AIChatPanel } from './components/AIChatPanel';
import { MOCK_FILE_SYSTEM } from './constants';
import { FileNode } from './types';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [chatVisible, setChatVisible] = useState(true);

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file);
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-gray-300 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-12 border-b border-remix-border bg-[#181818] flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-100 font-semibold">
            <div className="w-6 h-6 bg-gradient-to-tr from-blue-500 to-remix-accent rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">OZ</span>
            </div>
            <span>OpenZeppelin Studio</span>
          </div>
          
          <div className="h-5 w-[1px] bg-gray-700 mx-2"></div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#222] px-3 py-1.5 rounded-md border border-gray-800">
            <GitBranch size={12} />
            <span>master</span>
            <span className="mx-1">•</span>
            <span>voxxov222 / openzeppelin-contracts</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={16} className="text-gray-500 absolute left-2.5 top-1.5" />
            <input 
              type="text" 
              placeholder="Search files (Cmd+P)" 
              className="bg-[#121212] border border-gray-700 rounded-md py-1 pl-8 pr-4 text-xs w-64 focus:outline-none focus:border-remix-primary text-gray-300"
            />
          </div>
          <button className="p-2 hover:bg-[#252525] rounded-md text-gray-400 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (File Explorer) */}
        {sidebarVisible && (
          <div className="w-64 flex-shrink-0 flex flex-col">
            <FileExplorer 
              nodes={MOCK_FILE_SYSTEM} 
              onFileSelect={handleFileSelect} 
              selectedFileId={selectedFile?.id || null} 
            />
          </div>
        )}

        {/* Center (Code Viewer) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#121212] relative">
          <CodeViewer file={selectedFile} />
          
          {/* Status Bar */}
          <div className="h-6 bg-[#181818] border-t border-remix-border flex items-center justify-between px-3 text-[10px] text-gray-500 select-none">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarVisible(!sidebarVisible)} className="hover:text-white">
                <Menu size={12} />
              </button>
              {selectedFile && (
                <>
                  <span>{selectedFile.language}</span>
                  <span>UTF-8</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setChatVisible(!chatVisible)} 
                className={`flex items-center gap-1.5 hover:text-white transition-colors ${chatVisible ? 'text-remix-primary' : ''}`}
              >
                <Command size={10} />
                <span>AI Assistant {chatVisible ? 'Active' : 'Hidden'}</span>
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar (AI Chat) */}
        {chatVisible && (
          <div className="flex-shrink-0">
            <AIChatPanel currentFile={selectedFile} />
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileJson, File, ChevronRight, ChevronDown } from 'lucide-react';
import { FileNode } from '../types';

interface FileExplorerProps {
  nodes: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFileId: string | null;
}

const FileIcon = ({ name, className }: { name: string; className?: string }) => {
  if (name.endsWith('.tsx') || name.endsWith('.ts') || name.endsWith('.js')) return <FileCode className={className} />;
  if (name.endsWith('.json')) return <FileJson className={className} />;
  return <File className={className} />;
};

const FileTreeItem: React.FC<{
  node: FileNode;
  onSelect: (file: FileNode) => void;
  selectedId: string | null;
  depth: number;
}> = ({ node, onSelect, selectedId, depth }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onSelect(node);
    }
  };

  const isSelected = node.id === selectedId;

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer select-none transition-colors duration-150 ${
          isSelected ? 'bg-remix-primary/20 text-blue-300' : 'hover:bg-remix-card text-gray-400 hover:text-white'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleToggle}
      >
        <span className="mr-1.5 opacity-70">
          {node.type === 'folder' ? (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
             <span className="w-[14px] inline-block" /> 
          )}
        </span>
        
        <span className="mr-2">
          {node.type === 'folder' ? (
             isOpen ? <FolderOpen size={16} className="text-yellow-500" /> : <Folder size={16} className="text-yellow-500" />
          ) : (
            <FileIcon name={node.name} className="text-blue-400 w-4 h-4" />
          )}
        </span>
        
        <span className="text-sm truncate">{node.name}</span>
      </div>

      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              onSelect={onSelect}
              selectedId={selectedId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ nodes, onFileSelect, selectedFileId }) => {
  return (
    <div className="h-full bg-[#151515] border-r border-remix-border overflow-y-auto font-mono text-sm">
      <div className="p-3 uppercase text-xs font-bold text-gray-500 tracking-wider mb-2">Explorer</div>
      {nodes.map((node) => (
        <FileTreeItem
          key={node.id}
          node={node}
          onSelect={onFileSelect}
          selectedId={selectedFileId}
          depth={0}
        />
      ))}
    </div>
  );
};
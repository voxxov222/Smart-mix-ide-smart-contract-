export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}

export enum AnalysisMode {
  QUICK = 'QUICK',
  DEEP = 'DEEP'
}

export interface AnalysisResult {
  summary: string;
  suggestions: string[];
  securityRisk: 'Low' | 'Medium' | 'High';
}
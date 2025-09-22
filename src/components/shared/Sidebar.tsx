'use client';

import { 
  Edit3, 
  Type, 
  Image as ImageIcon, 
  MessageSquare, 
  Scissors, 
  Copy,
  Layers,
  Bot
} from 'lucide-react';

interface PDFDocument {
  file: File;
  url: string;
  name: string;
  fileId?: string;
  metadata?: any;
}

interface SidebarProps {
  currentPDF: PDFDocument | null;
  activeTool: string | null;
  onToolSelect: (toolName: string) => void;
}

export default function Sidebar({ currentPDF, activeTool, onToolSelect }: SidebarProps) {
  const tools = [
    { icon: Edit3, label: 'Edit Text', id: 'edit-text' },
    { icon: Type, label: 'Add Text', id: 'add-text' },
    { icon: ImageIcon, label: 'Add Image', id: 'add-image' },
    { icon: MessageSquare, label: 'Annotations', id: 'annotations' },
    { icon: Scissors, label: 'Split PDF', id: 'split-pdf' },
    { icon: Copy, label: 'Merge PDF', id: 'merge-pdf' },
    { icon: Layers, label: 'Pages', id: 'pages' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Tools Section */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Tools</h2>
        <div className="space-y-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTool === tool.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tool.icon className="w-4 h-4" />
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Copilot Section */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200 hover:from-purple-100 hover:to-blue-100 transition-all">
          <Bot className="w-4 h-4" />
          <span>AI Copilot</span>
        </button>
      </div>

      {/* Pages Preview */}
      {currentPDF && (
        <div className="flex-1 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Pages</h3>
          
          {/* File Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>File:</strong> {currentPDF.name}</div>
              {currentPDF.metadata && (
                <>
                  <div><strong>Size:</strong> {(currentPDF.metadata.size / 1024 / 1024).toFixed(2)} MB</div>
                  <div><strong>ID:</strong> {currentPDF.fileId}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            {/* TODO: Load real page thumbnails from backend */}
            <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-500">
              Page thumbnails will appear here
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

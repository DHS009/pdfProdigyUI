'use client';

import { 
  FileText, 
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
}

interface SidebarProps {
  currentPDF: PDFDocument | null;
}

export default function Sidebar({ currentPDF }: SidebarProps) {
  const tools = [
    { icon: Edit3, label: 'Edit Text', active: false },
    { icon: Type, label: 'Add Text', active: false },
    { icon: ImageIcon, label: 'Add Image', active: false },
    { icon: MessageSquare, label: 'Annotations', active: false },
    { icon: Scissors, label: 'Split PDF', active: false },
    { icon: Copy, label: 'Merge PDF', active: false },
    { icon: Layers, label: 'Pages', active: true },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Tools Section */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Tools</h2>
        <div className="space-y-1">
          {tools.map((tool, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                tool.active 
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
          <div className="space-y-2">
            {/* Page thumbnails will be rendered here */}
            <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-500">
              Page thumbnails will appear here
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

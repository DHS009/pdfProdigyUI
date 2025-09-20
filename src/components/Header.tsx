'use client';

import { Menu, FileText, Download, Share2 } from 'lucide-react';

interface PDFDocument {
  file: File;
  url: string;
  name: string;
}

interface HeaderProps {
  currentPDF: PDFDocument | null;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ currentPDF, sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">PDF Prodigy</h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {currentPDF && (
          <>
            <span className="text-sm text-gray-600 max-w-xs truncate">
              {currentPDF.name}
            </span>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

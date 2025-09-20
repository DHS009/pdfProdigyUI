'use client';

import { useState } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import PDFViewer from './PDFViewer';
import FileUpload from './FileUpload';
import Footer from './Footer';

interface PDFDocument {
  file: File;
  url: string;
  name: string;
}

export default function PDFEditor() {
  const [currentPDF, setCurrentPDF] = useState<PDFDocument | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCurrentPDF({
      file,
      url,
      name: file.name
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <Navigation />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar currentPDF={currentPDF} />
        )}
        
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-hidden relative">
          {/* Sidebar Toggle Button - Only show when sidebar is closed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 left-4 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {currentPDF ? (
            <PDFViewer pdfUrl={currentPDF.url} />
          ) : (
            <FileUpload onFileUpload={handleFileUpload} />
          )}
        </main>
        
        {/* Sidebar Close Button - Only show when sidebar is open */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 left-72 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

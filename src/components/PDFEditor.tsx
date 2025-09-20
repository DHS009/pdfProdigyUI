'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import PDFViewer from './PDFViewer';
import FileUpload from './FileUpload';

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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <Header 
        currentPDF={currentPDF}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar currentPDF={currentPDF} />
        )}
        
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-hidden">
          {currentPDF ? (
            <PDFViewer pdfUrl={currentPDF.url} />
          ) : (
            <FileUpload onFileUpload={handleFileUpload} />
          )}
        </main>
      </div>
    </div>
  );
}

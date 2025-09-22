'use client';

import { useState, useEffect } from 'react';
import Navigation from './shared/Navigation';
import Sidebar from './shared/Sidebar';
import PDFViewer from './shared/PDFViewer';
import FileUpload from './shared/FileUpload';
import Footer from './shared/Footer';
import { apiService, FileInfo } from '../services/api';

interface PDFDocument {
  file: File;
  url: string;
  name: string;
  fileId?: string;
  metadata?: FileInfo;
}

interface EditorState {
  activeTool: string | null;
  isUploading: boolean;
  isProcessing: boolean;
  error: string | null;
  backendConnected: boolean;
}

export default function PDFEditor() {
  const [currentPDF, setCurrentPDF] = useState<PDFDocument | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editorState, setEditorState] = useState<EditorState>({
    activeTool: null,
    isUploading: false,
    isProcessing: false,
    error: null,
    backendConnected: false,
  });

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        console.log('Checking backend connection...');
        await apiService.healthCheck();
        setEditorState(prev => ({ ...prev, backendConnected: true }));
        console.log('Backend connection successful');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setEditorState(prev => ({ 
          ...prev, 
          backendConnected: false,
          error: 'Cannot connect to backend server'
        }));
      }
    };

    checkBackendConnection();
  }, []);

  const handleFileUpload = async (file: File) => {
    // Clear any existing error
    setEditorState(prev => ({ ...prev, error: null, isUploading: true }));

    try {
      // Validate file before uploading
      const validation = await apiService.validateFile(file.name);
      if (!validation.is_valid) {
        throw new Error(validation.message);
      }

      // Upload to backend first (simulating S3 upload)
      const uploadResponse = await apiService.uploadFile(file);
      
      if (uploadResponse.success && uploadResponse.files.length > 0) {
        const fileInfo = uploadResponse.files[0];
        
        console.log('File uploaded successfully:', fileInfo);
        console.log('Backend URL:', fileInfo.file_url);
        
        // Fetch the file from backend and create a blob URL for PDF.js
        // This simulates downloading from S3 for local processing
        try {
          const response = await fetch(fileInfo.file_url);
          if (!response.ok) {
            throw new Error('Failed to fetch PDF from backend');
          }
          
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          
          setCurrentPDF({
            file,
            url: blobUrl, // Use blob URL for PDF.js compatibility
            name: file.name,
            fileId: fileInfo.file_id,
            metadata: fileInfo
          });
          
          console.log('PDF ready for viewing with blob URL');
        } catch (fetchError) {
          console.error('Error fetching PDF from backend:', fetchError);
          // Fallback to original blob URL if backend fetch fails
          const fallbackUrl = URL.createObjectURL(file);
          setCurrentPDF({
            file,
            url: fallbackUrl,
            name: file.name,
            fileId: fileInfo.file_id,
            metadata: fileInfo
          });
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setEditorState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Upload failed'
      }));
    } finally {
      setEditorState(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleToolSelect = (toolName: string) => {
    setEditorState(prev => ({
      ...prev,
      activeTool: prev.activeTool === toolName ? null : toolName
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <Navigation />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar 
            currentPDF={currentPDF} 
            activeTool={editorState.activeTool}
            onToolSelect={handleToolSelect}
          />
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
            <PDFViewer 
              pdfUrl={currentPDF.url} 
              activeTool={editorState.activeTool}
              fileId={currentPDF.fileId}
            />
          ) : (
            <FileUpload 
              onFileUpload={handleFileUpload} 
              isUploading={editorState.isUploading}
              error={editorState.error}
              backendConnected={editorState.backendConnected}
            />
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

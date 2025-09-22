'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
  error?: string | null;
  backendConnected?: boolean;
}

export default function FileUpload({ onFileUpload, isUploading = false, error, backendConnected = false }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === 'application/pdf') {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && files[0].type === 'application/pdf') {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        {/* Backend Status Indicator */}
        <div className="mb-4 flex items-center justify-center">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
            backendConnected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              backendConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>{backendConnected ? 'Server Connected' : 'Server Disconnected'}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Error</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isUploading ? 'Uploading your PDF...' : 'Upload your PDF'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isUploading 
                ? 'Please wait while we process your file'
                : 'Drag and drop your PDF file here, or click to browse'
              }
            </p>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <span className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              isUploading 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } text-white`}>
              <FileText className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Choose PDF File'}</span>
            </span>
          </label>

          <div className="mt-6 text-xs text-gray-500">
            <p>Supported format: PDF</p>
            <p>Maximum file size: 50MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

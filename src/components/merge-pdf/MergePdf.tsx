'use client';

import { useState, useCallback } from 'react';
import { Upload, Plus, X, Download, ArrowUp, ArrowDown } from 'lucide-react';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  url: string;
  pages: number;
}

export default function MergePdf() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: PDFFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf') {
        const newFile: PDFFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          url: URL.createObjectURL(file),
          pages: 0 // We'll calculate this later
        };
        newFiles.push(newFile);
      }
    }
    
    setPdfFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(file => file.id !== id));
  };

  const moveFile = (id: string, direction: 'up' | 'down') => {
    setPdfFiles(prev => {
      const index = prev.findIndex(file => file.id === id);
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === prev.length - 1)) {
        return prev;
      }
      
      const newArray = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newArray[index], newArray[targetIndex]] = [newArray[targetIndex], newArray[index]];
      return newArray;
    });
  };

  const mergePdfs = async () => {
    if (pdfFiles.length < 2) return;
    
    setIsProcessing(true);
    try {
      // This is where you'd implement the actual PDF merging logic
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate creating a merged PDF URL
      setMergedPdfUrl('merged-pdf-url');
    } catch (error) {
      console.error('Error merging PDFs:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Merge PDF Files</h1>
        <p className="text-lg text-gray-600">
          Combine multiple PDF files into one document. Drag and drop files or click to select.
        </p>
      </div>

      {/* File Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors mb-6"
      >
        <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload PDF Files
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop your PDF files here, or click to browse
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
          id="pdf-upload"
        />
        <label
          htmlFor="pdf-upload"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5 mr-2" />
          Select PDF Files
        </label>
      </div>

      {/* Uploaded Files List */}
      {pdfFiles.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Files to Merge ({pdfFiles.length})
            </h3>
            <p className="text-sm text-gray-600">
              Drag to reorder files. The order here will be the order in the merged PDF.
            </p>
          </div>
          
          <div className="space-y-2 p-4">
            {pdfFiles.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveFile(file.id, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFile(file.id, 'down')}
                    disabled={index === pdfFiles.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-red-100 text-red-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Merge Button */}
      {pdfFiles.length >= 2 && (
        <div className="text-center mb-6">
          <button
            onClick={mergePdfs}
            disabled={isProcessing}
            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Merging PDFs...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Merge {pdfFiles.length} PDFs
              </>
            )}
          </button>
        </div>
      )}

      {/* Result */}
      {mergedPdfUrl && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            PDFs Merged Successfully!
          </h3>
          <p className="text-green-700 mb-4">
            Your files have been combined into a single PDF document.
          </p>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto">
            <Download className="w-5 h-5" />
            Download Merged PDF
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Merge PDFs:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Upload multiple PDF files using the upload area above</li>
          <li>Arrange the files in the order you want them to appear in the final PDF</li>
          <li>Click "Merge PDFs" to combine all files into one document</li>
          <li>Download your merged PDF file</li>
        </ol>
      </div>
    </div>
  );
}

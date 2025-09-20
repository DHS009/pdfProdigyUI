'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, FileText, Split } from 'lucide-react';

interface SplitOption {
  type: 'pages' | 'range' | 'size';
  label: string;
  description: string;
}

export default function SplitPdf() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [splitOption, setSplitOption] = useState<SplitOption['type']>('pages');
  const [pageRanges, setPageRanges] = useState('1,3,5-8');
  const [pageSize, setPageSize] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const splitOptions: SplitOption[] = [
    {
      type: 'pages',
      label: 'Extract Specific Pages',
      description: 'Choose individual pages or page ranges to extract'
    },
    {
      type: 'range',
      label: 'Split by Page Range',
      description: 'Divide the PDF into sections by page ranges'
    },
    {
      type: 'size',
      label: 'Split by File Size',
      description: 'Break the PDF into smaller files of equal size'
    }
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const splitPdf = async () => {
    if (!pdfFile) return;
    
    setIsProcessing(true);
    try {
      // This is where you'd implement the actual PDF splitting logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate the splitting process
      console.log(`Splitting PDF with option: ${splitOption}`);
    } catch (error) {
      console.error('Error splitting PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Split PDF Files</h1>
        <p className="text-lg text-gray-600">
          Extract pages or split your PDF into multiple smaller documents.
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
          Upload PDF File
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop your PDF file here, or click to browse
        </p>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className="hidden"
          id="pdf-upload"
        />
        <label
          htmlFor="pdf-upload"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <FileText className="w-5 h-5 mr-2" />
          Select PDF File
        </label>
      </div>

      {/* Uploaded File Info */}
      {pdfFile && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">{pdfFile.name}</div>
              <div className="text-sm text-gray-500">
                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split Options */}
      {pdfFile && (
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Split Options</h3>
            <p className="text-sm text-gray-600">Choose how you want to split your PDF</p>
          </div>
          
          <div className="p-4 space-y-4">
            {splitOptions.map((option) => (
              <label key={option.type} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="splitOption"
                  value={option.type}
                  checked={splitOption === option.type}
                  onChange={(e) => setSplitOption(e.target.value as SplitOption['type'])}
                  className="mt-1 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Split Configuration */}
      {pdfFile && (
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
          </div>
          
          <div className="p-4">
            {splitOption === 'pages' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Numbers (e.g., 1,3,5-8,10)
                </label>
                <input
                  type="text"
                  value={pageRanges}
                  onChange={(e) => setPageRanges(e.target.value)}
                  placeholder="1,3,5-8,10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use commas to separate pages and hyphens for ranges
                </p>
              </div>
            )}
            
            {splitOption === 'size' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages per file
                </label>
                <input
                  type="number"
                  min="1"
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value) || 1)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Split Button */}
      {pdfFile && (
        <div className="text-center mb-6">
          <button
            onClick={splitPdf}
            disabled={isProcessing}
            className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Splitting PDF...
              </>
            ) : (
              <>
                <Split className="w-5 h-5" />
                Split PDF
              </>
            )}
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">How to Split PDFs:</h3>
        <ol className="list-decimal list-inside space-y-2 text-purple-800">
          <li>Upload the PDF file you want to split</li>
          <li>Choose your preferred splitting method</li>
          <li>Configure the split settings (pages, ranges, or size)</li>
          <li>Click "Split PDF" to create separate files</li>
          <li>Download your split PDF files</li>
        </ol>
      </div>
    </div>
  );
}

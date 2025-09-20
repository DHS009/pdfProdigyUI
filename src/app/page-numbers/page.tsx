'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Hash, Type, Palette, Settings, Eye, Zap, RefreshCw, CheckCircle, FileText, AlignLeft, AlignCenter, AlignRight, Move } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFFile {
  file: File;
  name: string;
  size: number;
  totalPages: number;
}

interface PageNumberSettings {
  format: 'numeric' | 'roman_lower' | 'roman_upper' | 'alpha_lower' | 'alpha_upper';
  position: 'top_left' | 'top_center' | 'top_right' | 'bottom_left' | 'bottom_center' | 'bottom_right';
  startNumber: number;
  prefix: string;
  suffix: string;
  fontSize: number;
  fontFamily: 'Arial' | 'Times' | 'Helvetica' | 'Courier';
  fontColor: string;
  marginX: number;
  marginY: number;
  skipFirstPage: boolean;
  skipLastPage: boolean;
  pageRange: {
    enabled: boolean;
    start: number;
    end: number;
  };
}

interface PageNumberResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  numberedSize: number;
  pagesNumbered: number;
  totalPages: number;
  format: string;
  position: string;
  processingTime: number;
  downloadUrl: string;
}

type NumberingStyle = 'simple' | 'academic' | 'business' | 'legal' | 'custom';

export default function PageNumbersPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [pageNumberSettings, setPageNumberSettings] = useState<PageNumberSettings>({
    format: 'numeric',
    position: 'bottom_center',
    startNumber: 1,
    prefix: '',
    suffix: '',
    fontSize: 12,
    fontFamily: 'Arial',
    fontColor: '#000000',
    marginX: 20,
    marginY: 20,
    skipFirstPage: false,
    skipLastPage: false,
    pageRange: {
      enabled: false,
      start: 1,
      end: 1
    }
  });
  const [numberingStyle, setNumberingStyle] = useState<NumberingStyle>('simple');
  const [isProcessing, setIsProcessing] = useState(false);
  const [numberingResults, setNumberingResults] = useState<PageNumberResult[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const numberingStyles = [
    {
      id: 'simple' as const,
      name: 'Simple Numbers',
      description: 'Basic page numbering for general documents',
      settings: {
        format: 'numeric' as const,
        position: 'bottom_center' as const,
        prefix: '',
        suffix: '',
        fontSize: 12,
        skipFirstPage: false
      },
      example: '1, 2, 3, 4...'
    },
    {
      id: 'academic' as const,
      name: 'Academic Style',
      description: 'Professional formatting for academic papers',
      settings: {
        format: 'numeric' as const,
        position: 'top_right' as const,
        prefix: '',
        suffix: '',
        fontSize: 11,
        skipFirstPage: true
      },
      example: '2, 3, 4, 5... (starts from page 2)'
    },
    {
      id: 'business' as const,
      name: 'Business Format',
      description: 'Corporate document numbering',
      settings: {
        format: 'numeric' as const,
        position: 'bottom_right' as const,
        prefix: 'Page ',
        suffix: '',
        fontSize: 10,
        skipFirstPage: false
      },
      example: 'Page 1, Page 2, Page 3...'
    },
    {
      id: 'legal' as const,
      name: 'Legal Documents',
      description: 'Formal numbering for legal papers',
      settings: {
        format: 'numeric' as const,
        position: 'bottom_center' as const,
        prefix: '- ',
        suffix: ' -',
        fontSize: 11,
        skipFirstPage: true
      },
      example: '- 2 -, - 3 -, - 4 -...'
    },
    {
      id: 'custom' as const,
      name: 'Custom Style',
      description: 'Configure your own numbering format',
      settings: {
        format: 'numeric' as const,
        position: 'bottom_center' as const,
        prefix: '',
        suffix: '',
        fontSize: 12,
        skipFirstPage: false
      },
      example: 'Your custom format'
    }
  ];

  const formatOptions = [
    { value: 'numeric', label: 'Numbers (1, 2, 3)', example: '1, 2, 3, 4, 5' },
    { value: 'roman_lower', label: 'Roman Lowercase (i, ii, iii)', example: 'i, ii, iii, iv, v' },
    { value: 'roman_upper', label: 'Roman Uppercase (I, II, III)', example: 'I, II, III, IV, V' },
    { value: 'alpha_lower', label: 'Letters Lowercase (a, b, c)', example: 'a, b, c, d, e' },
    { value: 'alpha_upper', label: 'Letters Uppercase (A, B, C)', example: 'A, B, C, D, E' }
  ];

  const positionOptions = [
    { value: 'top_left', label: 'Top Left', icon: AlignLeft, position: 'top-left' },
    { value: 'top_center', label: 'Top Center', icon: AlignCenter, position: 'top-center' },
    { value: 'top_right', label: 'Top Right', icon: AlignRight, position: 'top-right' },
    { value: 'bottom_left', label: 'Bottom Left', icon: AlignLeft, position: 'bottom-left' },
    { value: 'bottom_center', label: 'Bottom Center', icon: AlignCenter, position: 'bottom-center' },
    { value: 'bottom_right', label: 'Bottom Right', icon: AlignRight, position: 'bottom-right' }
  ];

  const applyNumberingStyle = (styleId: NumberingStyle) => {
    const style = numberingStyles.find(s => s.id === styleId);
    if (style && styleId !== 'custom') {
      setPageNumberSettings(prev => ({
        ...prev,
        ...style.settings
      }));
    }
    setNumberingStyle(styleId);
  };

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: PDFFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Simulate PDF page count
        const totalPages = Math.floor(Math.random() * 50) + 5; // 5-54 pages
        
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          totalPages
        });
      }
    });
    
    if (newFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newFiles]);
      
      // Update page range end to match the first file's page count
      if (newFiles.length > 0) {
        setPageNumberSettings(prev => ({
          ...prev,
          pageRange: {
            ...prev.pageRange,
            end: newFiles[0].totalPages
          }
        }));
      }
      
      setNumberingResults([]);
    } else {
      alert('Please upload valid PDF files.');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeFile = (fileName: string) => {
    setPdfFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const getPreviewText = () => {
    const { format, prefix, suffix, startNumber } = pageNumberSettings;
    
    const formatNumber = (num: number) => {
      switch (format) {
        case 'numeric':
          return num.toString();
        case 'roman_lower':
          return toRoman(num).toLowerCase();
        case 'roman_upper':
          return toRoman(num);
        case 'alpha_lower':
          return toAlpha(num).toLowerCase();
        case 'alpha_upper':
          return toAlpha(num);
        default:
          return num.toString();
      }
    };
    
    const firstPageNum = pageNumberSettings.skipFirstPage ? startNumber + 1 : startNumber;
    return `${prefix}${formatNumber(firstPageNum)}${suffix}`;
  };

  const toRoman = (num: number): string => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i];
        num -= values[i];
      }
    }
    return result;
  };

  const toAlpha = (num: number): string => {
    let result = '';
    while (num > 0) {
      num--;
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26);
    }
    return result;
  };

  const addPageNumbers = async () => {
    if (pdfFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate page numbering process
      await new Promise(resolve => setTimeout(resolve, 2000 + (pdfFiles.length * 1500)));
      
      const results: PageNumberResult[] = pdfFiles.map((file) => {
        const processingTime = Math.floor(Math.random() * 5) + 2;
        
        // Calculate pages to be numbered
        let pagesNumbered = file.totalPages;
        
        if (pageNumberSettings.skipFirstPage) pagesNumbered--;
        if (pageNumberSettings.skipLastPage) pagesNumbered--;
        
        if (pageNumberSettings.pageRange.enabled) {
          const rangeStart = Math.max(1, pageNumberSettings.pageRange.start);
          const rangeEnd = Math.min(file.totalPages, pageNumberSettings.pageRange.end);
          pagesNumbered = Math.max(0, rangeEnd - rangeStart + 1);
          
          if (pageNumberSettings.skipFirstPage && rangeStart === 1) pagesNumbered--;
          if (pageNumberSettings.skipLastPage && rangeEnd === file.totalPages) pagesNumbered--;
        }
        
        const positionLabel = positionOptions.find(p => p.value === pageNumberSettings.position)?.label || 'Bottom Center';
        const formatLabel = formatOptions.find(f => f.value === pageNumberSettings.format)?.label || 'Numbers';
        
        return {
          success: true,
          fileName: file.name.replace('.pdf', '_numbered.pdf'),
          originalSize: file.size,
          numberedSize: file.size * (1.02 + Math.random() * 0.03), // Slightly larger
          pagesNumbered,
          totalPages: file.totalPages,
          format: formatLabel,
          position: positionLabel,
          processingTime,
          downloadUrl: `numbered-${file.name}`
        };
      });
      
      setNumberingResults(results);
    } catch (error) {
      console.error('Error adding page numbers:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const selectedStyle = numberingStyles.find(s => s.id === numberingStyle);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <Hash className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Add Page Numbers to PDF</h1>
            <p className="text-lg text-gray-600">
              Add custom page numbers to your PDF documents. Choose from various formats, positions, and styling options to match your document requirements.
            </p>
          </div>

          {/* Numbering Style Selection */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Numbering Style</h3>
              <p className="text-sm text-gray-600">Choose a pre-configured style or customize your own</p>
            </div>
            
            <div className="p-6 space-y-4">
              {numberingStyles.map((style) => (
                <label
                  key={style.id}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all block ${
                    numberingStyle === style.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="numberingStyle"
                    value={style.id}
                    checked={numberingStyle === style.id}
                    onChange={(e) => applyNumberingStyle(e.target.value as NumberingStyle)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Hash className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{style.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{style.description}</p>
                        <div className="text-xs text-purple-600 font-mono bg-purple-100 px-2 py-1 rounded">
                          Example: {style.example}
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Page Number Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Number Settings</h3>
              <p className="text-sm text-gray-600">Configure the format and appearance of page numbers</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Number Format</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formatOptions.map((format) => (
                    <label
                      key={format.value}
                      className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                        pageNumberSettings.format === format.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={pageNumberSettings.format === format.value}
                        onChange={(e) => {
                          setPageNumberSettings(prev => ({
                            ...prev,
                            format: e.target.value as PageNumberSettings['format']
                          }));
                          setNumberingStyle('custom');
                        }}
                        className="sr-only"
                      />
                      <div className="font-medium text-gray-900 mb-1">{format.label}</div>
                      <div className="text-xs text-gray-500 font-mono">{format.example}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Position Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Position</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {positionOptions.map((position) => (
                    <label
                      key={position.value}
                      className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                        pageNumberSettings.position === position.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="position"
                        value={position.value}
                        checked={pageNumberSettings.position === position.value}
                        onChange={(e) => {
                          setPageNumberSettings(prev => ({
                            ...prev,
                            position: e.target.value as PageNumberSettings['position']
                          }));
                          setNumberingStyle('custom');
                        }}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-2">
                        <position.icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{position.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Text Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prefix Text</label>
                  <input
                    type="text"
                    value={pageNumberSettings.prefix}
                    onChange={(e) => {
                      setPageNumberSettings(prev => ({...prev, prefix: e.target.value}));
                      setNumberingStyle('custom');
                    }}
                    placeholder="e.g., Page "
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suffix Text</label>
                  <input
                    type="text"
                    value={pageNumberSettings.suffix}
                    onChange={(e) => {
                      setPageNumberSettings(prev => ({...prev, suffix: e.target.value}));
                      setNumberingStyle('custom');
                    }}
                    placeholder="e.g.,  of X"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Number Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Number</label>
                  <input
                    type="number"
                    min="1"
                    value={pageNumberSettings.startNumber}
                    onChange={(e) => {
                      setPageNumberSettings(prev => ({...prev, startNumber: parseInt(e.target.value) || 1}));
                      setNumberingStyle('custom');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <select
                    value={pageNumberSettings.fontSize}
                    onChange={(e) => {
                      setPageNumberSettings(prev => ({...prev, fontSize: parseInt(e.target.value)}));
                      setNumberingStyle('custom');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="8">8pt</option>
                    <option value="9">9pt</option>
                    <option value="10">10pt</option>
                    <option value="11">11pt</option>
                    <option value="12">12pt</option>
                    <option value="14">14pt</option>
                    <option value="16">16pt</option>
                    <option value="18">18pt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    value={pageNumberSettings.fontFamily}
                    onChange={(e) => {
                      setPageNumberSettings(prev => ({...prev, fontFamily: e.target.value as PageNumberSettings['fontFamily']}));
                      setNumberingStyle('custom');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times">Times New Roman</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Advanced Options</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={pageNumberSettings.skipFirstPage}
                      onChange={(e) => {
                        setPageNumberSettings(prev => ({...prev, skipFirstPage: e.target.checked}));
                        setNumberingStyle('custom');
                      }}
                      className="rounded text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Skip first page (title page)</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={pageNumberSettings.skipLastPage}
                      onChange={(e) => {
                        setPageNumberSettings(prev => ({...prev, skipLastPage: e.target.checked}));
                        setNumberingStyle('custom');
                      }}
                      className="rounded text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Skip last page</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={pageNumberSettings.pageRange.enabled}
                      onChange={(e) => {
                        setPageNumberSettings(prev => ({
                          ...prev,
                          pageRange: {...prev.pageRange, enabled: e.target.checked}
                        }));
                        setNumberingStyle('custom');
                      }}
                      className="rounded text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Specific page range</span>
                  </label>
                  {pageNumberSettings.pageRange.enabled && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">From page</label>
                        <input
                          type="number"
                          min="1"
                          value={pageNumberSettings.pageRange.start}
                          onChange={(e) => setPageNumberSettings(prev => ({
                            ...prev,
                            pageRange: {...prev.pageRange, start: parseInt(e.target.value) || 1}
                          }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">To page</label>
                        <input
                          type="number"
                          min="1"
                          value={pageNumberSettings.pageRange.end}
                          onChange={(e) => setPageNumberSettings(prev => ({
                            ...prev,
                            pageRange: {...prev.pageRange, end: parseInt(e.target.value) || 1}
                          }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border border-purple-200">
            <div className="flex items-start space-x-3">
              <Eye className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Page Number Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Format:</span>
                    <div className="font-medium text-purple-600">{formatOptions.find(f => f.value === pageNumberSettings.format)?.label}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Position:</span>
                    <div className="font-medium text-blue-600">{positionOptions.find(p => p.value === pageNumberSettings.position)?.label}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Style:</span>
                    <div className="font-medium text-green-600">{selectedStyle?.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Sample:</span>
                    <div className="font-medium text-orange-600 font-mono bg-white px-2 py-1 rounded border">
                      {getPreviewText()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF Files</h3>
              <p className="text-sm text-gray-600">Upload PDF files to add page numbers</p>
            </div>
            
            <div className="p-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <Upload className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload PDF Files for Page Numbering
                </h4>
                <p className="text-gray-600 mb-4">
                  Drag and drop your PDF files here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Select PDF Files
                </label>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          {pdfFiles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  PDF Files ({pdfFiles.length})
                </h3>
                <p className="text-sm text-gray-600">Files ready for page numbering</p>
              </div>
              
              <div className="p-6 space-y-3">
                {pdfFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-600">
                          {file.totalPages} pages • {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Numbers Button */}
          <div className="text-center mb-6">
            <button
              onClick={addPageNumbers}
              disabled={isProcessing || pdfFiles.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Adding Page Numbers...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Add Page Numbers
                </>
              )}
            </button>
          </div>

          {/* Numbering Results */}
          {numberingResults.length > 0 && (
            <div className="space-y-4 mb-6">
              {numberingResults.map((result, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">
                          Page Numbers Added Successfully!
                        </h3>
                        <p className="text-sm text-gray-600">{result.fileName}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Total Pages</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {result.totalPages}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Pages Numbered</div>
                      <div className="text-lg font-semibold text-green-600">
                        {result.pagesNumbered}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Format</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {result.format}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Position</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {result.position}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Processing</div>
                      <div className="text-lg font-semibold text-orange-600">
                        {result.processingTime}s
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-gray-900 mb-2">Numbering Details:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">Format: {result.format}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">Position: {result.position}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">Font: {pageNumberSettings.fontFamily} {pageNumberSettings.fontSize}pt</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Numbering Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple number formats (1,2,3 | i,ii,iii | A,B,C)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>6 position options (top/bottom, left/center/right)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Custom prefix and suffix text</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Skip first/last page options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Specific page range numbering</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Styling Options</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Type className="w-4 h-4 text-green-500" />
                  <span>Multiple font families and sizes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-green-500" />
                  <span>Custom text color options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Move className="w-4 h-4 text-green-500" />
                  <span>Adjustable margins and positioning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span>Pre-configured style templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span>Real-time preview of changes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How Page Numbering Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Configure</h4>
                <p className="text-sm text-gray-600">Choose format, position, and styling options</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Upload</h4>
                <p className="text-sm text-gray-600">Add your PDF files for numbering</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Process</h4>
                <p className="text-sm text-gray-600">Apply page numbers with your settings</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your numbered PDF files</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

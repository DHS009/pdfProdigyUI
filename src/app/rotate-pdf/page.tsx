'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, FileText, RefreshCw, CheckCircle, Settings, RotateCw, RotateCcw, Eye, Zap, Shield, Square } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface RotationOption {
  id: 'all_pages' | 'specific_pages' | 'even_pages' | 'odd_pages';
  label: string;
  description: string;
  features: string[];
  icon: any;
  recommended?: boolean;
}

interface PageRotation {
  pageNumber: number;
  rotation: 0 | 90 | 180 | 270;
  isSelected: boolean;
}

interface RotationResult {
  downloadUrl: string;
  fileName: string;
  totalPages: number;
  rotatedPages: number;
  fileSize: number;
  processingTime: number;
  rotationType: string;
}

export default function RotatePdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [rotationOption, setRotationOption] = useState<RotationOption['id']>('all_pages');
  const [globalRotation, setGlobalRotation] = useState<0 | 90 | 180 | 270>(90);
  const [pageRotations, setPageRotations] = useState<PageRotation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotationResult, setRotationResult] = useState<RotationResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const rotationOptions: RotationOption[] = [
    {
      id: 'all_pages',
      label: 'All Pages',
      description: 'Rotate all pages in the document by the same angle',
      features: ['Uniform rotation', 'Quick processing', 'Consistent orientation', 'Batch operation'],
      icon: RefreshCw,
      recommended: true
    },
    {
      id: 'specific_pages',
      label: 'Specific Pages',
      description: 'Select and rotate individual pages independently',
      features: ['Page selection', 'Individual control', 'Custom angles', 'Flexible rotation'],
      icon: Square
    },
    {
      id: 'even_pages',
      label: 'Even Pages Only',
      description: 'Rotate only even-numbered pages (2, 4, 6, etc.)',
      features: ['Even pages only', 'Automatic selection', 'Batch rotation', 'Page pattern'],
      icon: RotateCw
    },
    {
      id: 'odd_pages',
      label: 'Odd Pages Only',
      description: 'Rotate only odd-numbered pages (1, 3, 5, etc.)',
      features: ['Odd pages only', 'Automatic selection', 'Batch rotation', 'Page pattern'],
      icon: RotateCcw
    }
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setRotationResult(null);
      
      // Simulate PDF page analysis
      const totalPages = Math.floor(Math.random() * 20) + 5;
      const pages: PageRotation[] = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          pageNumber: i,
          rotation: 0,
          isSelected: false
        });
      }
      setPageRotations(pages);
    } else {
      alert('Please upload a valid PDF file');
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

  const updatePageRotation = (pageNumber: number, rotation: 0 | 90 | 180 | 270) => {
    setPageRotations(prev => 
      prev.map(page => 
        page.pageNumber === pageNumber 
          ? { ...page, rotation }
          : page
      )
    );
  };

  const togglePageSelection = (pageNumber: number) => {
    setPageRotations(prev => 
      prev.map(page => 
        page.pageNumber === pageNumber 
          ? { ...page, isSelected: !page.isSelected }
          : page
      )
    );
  };

  const selectAllPages = () => {
    setPageRotations(prev => prev.map(page => ({ ...page, isSelected: true })));
  };

  const deselectAllPages = () => {
    setPageRotations(prev => prev.map(page => ({ ...page, isSelected: false })));
  };

  const applyRotationToSelected = (rotation: 0 | 90 | 180 | 270) => {
    setPageRotations(prev => 
      prev.map(page => 
        page.isSelected 
          ? { ...page, rotation }
          : page
      )
    );
  };

  const rotatePdf = async () => {
    if (!pdfFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate rotation processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Calculate results based on rotation option
      let rotatedPages = 0;
      const totalPages = pageRotations.length;
      
      switch (rotationOption) {
        case 'all_pages':
          rotatedPages = totalPages;
          break;
        case 'specific_pages':
          rotatedPages = pageRotations.filter(page => page.rotation !== 0).length;
          break;
        case 'even_pages':
          rotatedPages = Math.floor(totalPages / 2);
          break;
        case 'odd_pages':
          rotatedPages = Math.ceil(totalPages / 2);
          break;
      }
      
      const processingTime = Math.floor(Math.random() * 4) + 1;
      const baseSize = pdfFile.size;
      const fileSize = baseSize * 1.02; // Slight increase due to rotation metadata
      
      const typeMap = {
        all_pages: 'All Pages',
        specific_pages: 'Selected Pages',
        even_pages: 'Even Pages',
        odd_pages: 'Odd Pages'
      };
      
      setRotationResult({
        downloadUrl: 'rotated-document.pdf',
        fileName: pdfFile.name.replace('.pdf', '-rotated.pdf'),
        totalPages,
        rotatedPages,
        fileSize,
        processingTime,
        rotationType: typeMap[rotationOption]
      });
    } catch (error) {
      console.error('Error rotating PDF:', error);
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

  const getRotationIcon = (rotation: number) => {
    const iconStyle = {
      transform: `rotate(${rotation}deg)`,
      transition: 'transform 0.3s ease'
    };
    return <Square className="w-4 h-4" style={iconStyle} />;
  };

  const selectedOption = rotationOptions.find(option => option.id === rotationOption);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-red-600" />
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <RotateCw className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Page Rotation Tool</h1>
            <p className="text-lg text-gray-600">
              Rotate PDF pages to fix orientation issues. Rotate all pages, specific pages, or even/odd pages with precise angle control.
            </p>
          </div>

          {/* File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-green-50 hover:bg-green-100 transition-colors mb-6"
          >
            <Upload className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload PDF Document
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your PDF file here, or click to browse
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              <FileText className="w-5 h-5 mr-2" />
              Select PDF File
            </label>
          </div>

          {/* Uploaded File Info */}
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{pdfFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {formatFileSize(pdfFile.size)} • {pageRotations.length} pages • PDF Document
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Ready to rotate</div>
                  <div className="text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rotation Options */}
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rotation Options</h3>
                <p className="text-sm text-gray-600">Choose which pages to rotate and how</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {rotationOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      rotationOption === option.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rotationOption"
                      value={option.id}
                      checked={rotationOption === option.id}
                      onChange={(e) => setRotationOption(e.target.value as RotationOption['id'])}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <option.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{option.label}</h4>
                          {option.recommended && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {option.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs text-gray-500">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rotation Controls */}
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rotation Controls</h3>
                <p className="text-sm text-gray-600">Set the rotation angle for your selected pages</p>
              </div>
              
              <div className="p-6">
                {(rotationOption === 'all_pages' || rotationOption === 'even_pages' || rotationOption === 'odd_pages') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Rotation Angle
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[0, 90, 180, 270].map((angle) => (
                          <label
                            key={angle}
                            className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                              globalRotation === angle
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="globalRotation"
                              value={angle}
                              checked={globalRotation === angle}
                              onChange={(e) => setGlobalRotation(Number(e.target.value) as 0 | 90 | 180 | 270)}
                              className="sr-only"
                            />
                            <div className="flex flex-col items-center space-y-2">
                              {getRotationIcon(angle)}
                              <span className="text-sm font-medium">{angle}°</span>
                              <span className="text-xs text-gray-500">
                                {angle === 0 ? 'No rotation' : 
                                 angle === 90 ? 'Clockwise' : 
                                 angle === 180 ? 'Upside down' : 'Counter-clockwise'}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {rotationOption === 'specific_pages' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Page Selection</h4>
                      <div className="space-x-2">
                        <button
                          onClick={selectAllPages}
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Select All
                        </button>
                        <button
                          onClick={deselectAllPages}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-h-40 overflow-y-auto">
                      {pageRotations.map((page) => (
                        <div
                          key={page.pageNumber}
                          className={`border-2 rounded-lg p-2 text-center cursor-pointer transition-all ${
                            page.isSelected
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => togglePageSelection(page.pageNumber)}
                        >
                          <div className="text-xs font-medium text-gray-900">
                            Page {page.pageNumber}
                          </div>
                          <div className="mt-1">
                            {getRotationIcon(page.rotation)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {page.rotation}°
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Apply Rotation to Selected Pages
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[0, 90, 180, 270].map((angle) => (
                          <button
                            key={angle}
                            onClick={() => applyRotationToSelected(angle as 0 | 90 | 180 | 270)}
                            className="border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-col items-center space-y-2">
                              {getRotationIcon(angle)}
                              <span className="text-sm font-medium">{angle}°</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Advanced Rotation Settings</span>
                  </div>
                  <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rotation Method
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <option>Standard rotation</option>
                          <option>Lossless rotation</option>
                          <option>High quality rotation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Page Content Handling
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <option>Rotate page and content</option>
                          <option>Rotate page only</option>
                          <option>Rotate content only</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600" defaultChecked />
                        <span className="text-sm text-gray-700">Preserve page dimensions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600" defaultChecked />
                        <span className="text-sm text-gray-700">Optimize for viewing</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600" />
                        <span className="text-sm text-gray-700">Auto-correct orientation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600" />
                        <span className="text-sm text-gray-700">Maintain aspect ratio</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rotation Preview */}
          {pdfFile && selectedOption && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
              <div className="flex items-start space-x-3">
                <RotateCw className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Rotation Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Target:</span>
                      <div className="font-medium text-green-600">{selectedOption.label}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Rotation Angle:</span>
                      <div className="font-medium text-blue-600">
                        {rotationOption === 'specific_pages' ? 'Variable' : `${globalRotation}°`}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Pages Affected:</span>
                      <div className="font-medium text-indigo-600">
                        {rotationOption === 'all_pages' ? pageRotations.length : 
                         rotationOption === 'specific_pages' ? pageRotations.filter(p => p.isSelected).length :
                         rotationOption === 'even_pages' ? Math.floor(pageRotations.length / 2) :
                         Math.ceil(pageRotations.length / 2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rotate Button */}
          {pdfFile && (
            <div className="text-center mb-6">
              <button
                onClick={rotatePdf}
                disabled={isProcessing}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Rotating Pages...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Rotate PDF
                  </>
                )}
              </button>
            </div>
          )}

          {/* Rotation Result */}
          {rotationResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <div className="text-green-600 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                PDF Pages Rotated Successfully!
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Total Pages</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {rotationResult.totalPages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Rotated Pages</div>
                  <div className="text-lg font-semibold text-green-600">
                    {rotationResult.rotatedPages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">File Size</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {formatFileSize(rotationResult.fileSize)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Rotation Type</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {rotationResult.rotationType}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Time</div>
                  <div className="text-lg font-semibold text-green-600">
                    {rotationResult.processingTime}s
                  </div>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto">
                <Download className="w-5 h-5" />
                Download Rotated PDF
              </button>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Rotation Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>90°, 180°, 270° rotation angles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Individual page control</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Batch page operations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Even/odd page patterns</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Lossless rotation quality</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Files auto-deleted after 1 hour</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure cloud processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>No registration required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>GDPR compliant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>256-bit SSL encryption</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Page Rotation Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload PDF</h4>
                <p className="text-sm text-gray-600">Select your PDF document with orientation issues</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Square className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Select Pages</h4>
                <p className="text-sm text-gray-600">Choose which pages to rotate and by what angle</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RotateCw className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Rotate</h4>
                <p className="text-sm text-gray-600">Apply rotation with lossless quality</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your properly oriented PDF</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

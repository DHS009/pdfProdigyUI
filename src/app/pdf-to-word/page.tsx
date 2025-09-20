'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, FileText, RefreshCw, CheckCircle, AlertCircle, Eye, Settings, Sparkles } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface ConversionMode {
  id: 'accurate' | 'editable' | 'layout';
  label: string;
  description: string;
  features: string[];
  icon: string;
  recommended?: boolean;
}

interface ConversionResult {
  downloadUrl: string;
  fileName: string;
  pages: number;
  conversionTime: number;
  accuracy: number;
}

export default function PdfToWordPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [conversionMode, setConversionMode] = useState<ConversionMode['id']>('accurate');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preview, setPreview] = useState(false);

  const conversionModes: ConversionMode[] = [
    {
      id: 'accurate',
      label: 'Accurate Text',
      description: 'Best for text-heavy documents with precise content extraction',
      features: ['Perfect text accuracy', 'Maintains formatting', 'OCR for scanned PDFs', 'Fast processing'],
      icon: '🎯',
      recommended: true
    },
    {
      id: 'editable',
      label: 'Editable Format',
      description: 'Optimized for easy editing and content modification',
      features: ['Fully editable text', 'Structured paragraphs', 'Preserved styles', 'Table conversion'],
      icon: '✏️'
    },
    {
      id: 'layout',
      label: 'Layout Preserved',
      description: 'Maintains original layout and visual structure',
      features: ['Original layout', 'Image positioning', 'Font preservation', 'Complex formatting'],
      icon: '📐'
    }
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setConversionResult(null);
      setPreview(false);
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

  const convertToWord = async () => {
    if (!pdfFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Simulate conversion results
      const pages = Math.floor(Math.random() * 20) + 1;
      const conversionTime = Math.floor(Math.random() * 10) + 2;
      const accuracy = Math.floor(Math.random() * 10) + 90;
      
      setConversionResult({
        downloadUrl: 'converted-word-document.docx',
        fileName: pdfFile.name.replace('.pdf', '.docx'),
        pages,
        conversionTime,
        accuracy
      });
    } catch (error) {
      console.error('Error converting PDF:', error);
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

  const selectedMode = conversionModes.find(mode => mode.id === conversionMode);

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
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">W</span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to Word Converter</h1>
            <p className="text-lg text-gray-600">
              Convert PDF files to editable Word documents (DOCX) with perfect accuracy and formatting preservation.
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
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{pdfFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {formatFileSize(pdfFile.size)} • PDF Document
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreview(!preview)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <div className="text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conversion Modes */}
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Mode</h3>
                <p className="text-sm text-gray-600">Choose the conversion method that best fits your needs</p>
              </div>
              
              <div className="p-6 space-y-4">
                {conversionModes.map((mode) => (
                  <label
                    key={mode.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all block ${
                      conversionMode === mode.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="conversionMode"
                      value={mode.id}
                      checked={conversionMode === mode.id}
                      onChange={(e) => setConversionMode(e.target.value as ConversionMode['id'])}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{mode.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{mode.label}</h4>
                          {mode.recommended && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {mode.features.map((feature, index) => (
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
                    <span className="font-medium text-gray-900">Advanced Options</span>
                  </div>
                  <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OCR Language (for scanned PDFs)
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Auto-detect</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-sm text-gray-700">Convert images</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-sm text-gray-700">Preserve tables</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Include headers/footers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Merge text boxes</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conversion Info Panel */}
          {pdfFile && selectedMode && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conversion Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mode:</span>
                      <div className="font-medium text-blue-600">{selectedMode.label}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output Format:</span>
                      <div className="font-medium text-green-600">Microsoft Word (DOCX)</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Quality:</span>
                      <div className="font-medium text-purple-600">Excellent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          {pdfFile && (
            <div className="text-center mb-6">
              <button
                onClick={convertToWord}
                disabled={isProcessing}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Converting to Word...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Convert to Word
                  </>
                )}
              </button>
            </div>
          )}

          {/* Conversion Result */}
          {conversionResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <div className="text-green-600 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                PDF Converted Successfully!
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Pages Converted</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {conversionResult.pages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Conversion Time</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {conversionResult.conversionTime}s
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Accuracy</div>
                  <div className="text-lg font-semibold text-green-600">
                    {conversionResult.accuracy}%
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Word Document
                </button>
                <button className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview Document
                </button>
              </div>
            </div>
          )}

          {/* Features & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Key Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Perfect text extraction accuracy</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Preserves original formatting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>OCR for scanned documents</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Table and image conversion</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Batch processing support</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Files deleted after 1 hour</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>SSL encrypted transfers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No registration required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>GDPR compliant processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Private cloud processing</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF to Word Conversion Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload PDF</h4>
                <p className="text-sm text-gray-600">Choose your PDF file from device or drag & drop</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Select Mode</h4>
                <p className="text-sm text-gray-600">Choose conversion method and advanced options</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Convert</h4>
                <p className="text-sm text-gray-600">Our AI processes and converts your document</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your editable Word document instantly</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

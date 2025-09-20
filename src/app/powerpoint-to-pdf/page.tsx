'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Presentation, RefreshCw, CheckCircle, Settings, FileText, Eye, Zap, Shield, Layout, Printer } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface ConversionMode {
  id: 'standard' | 'handouts' | 'notes' | 'slides_only';
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
  slides: number;
  fileSize: number;
  conversionTime: number;
  quality: string;
}

export default function PowerPointToPdfPage() {
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [conversionMode, setConversionMode] = useState<ConversionMode['id']>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const conversionModes: ConversionMode[] = [
    {
      id: 'standard',
      label: 'Standard PDF',
      description: 'Convert slides to high-quality PDF pages',
      features: ['One slide per page', 'Full quality', 'Preserve animations', 'Best for viewing'],
      icon: '📄',
      recommended: true
    },
    {
      id: 'handouts',
      label: 'Handouts Format',
      description: 'Multiple slides per page for printing',
      features: ['Multiple slides per page', 'Space for notes', 'Print-optimized', 'Compact layout'],
      icon: '📋'
    },
    {
      id: 'notes',
      label: 'With Speaker Notes',
      description: 'Include speaker notes below each slide',
      features: ['Slides with notes', 'Presenter view', 'Full content', 'Teaching format'],
      icon: '📝'
    },
    {
      id: 'slides_only',
      label: 'Slides Only',
      description: 'Clean slides without animations or transitions',
      features: ['Static slides', 'Smaller file size', 'Clean layout', 'Universal compatibility'],
      icon: '🖼️'
    }
  ];

  const acceptedFormats = [
    '.ppt', '.pptx', '.pps', '.ppsx', '.odp'
  ];

  const handleFileUpload = useCallback((file: File) => {
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const acceptedExtensions = ['ppt', 'pptx', 'pps', 'ppsx', 'odp'];
    
    if (acceptedExtensions.includes(fileExtension || '')) {
      setPptFile(file);
      setConversionResult(null);
    } else {
      alert('Please upload a valid PowerPoint file (.ppt, .pptx, .pps, .ppsx, .odp)');
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

  const convertToPdf = async () => {
    if (!pptFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate conversion results
      const slides = Math.floor(Math.random() * 30) + 5;
      const conversionTime = Math.floor(Math.random() * 6) + 2;
      const baseSize = pptFile.size;
      
      // Adjust file size and pages based on conversion mode
      const sizeMultipliers = {
        standard: 1.2,
        handouts: 0.6,
        notes: 1.8,
        slides_only: 0.8
      };
      
      const pageMultipliers = {
        standard: 1,
        handouts: 0.25, // 4 slides per page
        notes: 1,
        slides_only: 1
      };
      
      const fileSize = baseSize * sizeMultipliers[conversionMode];
      const pages = Math.ceil(slides * pageMultipliers[conversionMode]);
      
      const qualityMap = {
        standard: 'High',
        handouts: 'Optimized',
        notes: 'Detailed',
        slides_only: 'Clean'
      };
      
      setConversionResult({
        downloadUrl: 'converted-presentation.pdf',
        fileName: pptFile.name.replace(/\.(ppt|pptx|pps|ppsx|odp)$/i, '.pdf'),
        pages,
        slides,
        fileSize,
        conversionTime,
        quality: qualityMap[conversionMode]
      });
    } catch (error) {
      console.error('Error converting PowerPoint to PDF:', error);
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    const iconMap: { [key: string]: string } = {
      'ppt': '📊',
      'pptx': '📈',
      'pps': '🎞️',
      'ppsx': '🎬',
      'odp': '📋'
    };
    return iconMap[extension || 'pptx'] || '📊';
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
                <Presentation className="w-8 h-8 text-orange-600" />
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">PowerPoint to PDF Converter</h1>
            <p className="text-lg text-gray-600">
              Convert PowerPoint presentations to PDF format with multiple layout options. Perfect for sharing, printing, and archiving.
            </p>
          </div>

          {/* Supported Formats */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-6">
              <span className="text-sm font-medium text-orange-800">Supported formats:</span>
              {acceptedFormats.map((format, index) => (
                <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                  {format.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors mb-6"
          >
            <Upload className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload PowerPoint Presentation
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your presentation file here, or click to browse
            </p>
            <input
              type="file"
              accept=".ppt,.pptx,.pps,.ppsx,.odp"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="ppt-upload"
            />
            <label
              htmlFor="ppt-upload"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
            >
              <Presentation className="w-5 h-5 mr-2" />
              Select Presentation File
            </label>
          </div>

          {/* Uploaded File Info */}
          {pptFile && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                    {getFileIcon(pptFile.name)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{pptFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {formatFileSize(pptFile.size)} • {pptFile.name.split('.').pop()?.toUpperCase()} Presentation
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Ready to convert</div>
                  <div className="text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conversion Modes */}
          {pptFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Layout Options</h3>
                <p className="text-sm text-gray-600">Choose how you want your presentation converted to PDF</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {conversionModes.map((mode) => (
                  <label
                    key={mode.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      conversionMode === mode.id
                        ? 'border-orange-500 bg-orange-50'
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
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{mode.icon}</div>
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
                        <div className="grid grid-cols-2 gap-1">
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
          {pptFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Advanced PDF Options</span>
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
                          PDF Quality
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option>High quality (recommended)</option>
                          <option>Maximum quality</option>
                          <option>Web optimized</option>
                          <option>Print optimized</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slides per Page (Handouts)
                        </label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          disabled={conversionMode !== 'handouts'}
                        >
                          <option>2 slides per page</option>
                          <option>3 slides per page</option>
                          <option>4 slides per page</option>
                          <option>6 slides per page</option>
                          <option>9 slides per page</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slide Range
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g., 1-10, 15, 20-25" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Page Orientation
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option>Auto (from slides)</option>
                          <option>Portrait</option>
                          <option>Landscape</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-orange-600" defaultChecked />
                        <span className="text-sm text-gray-700">Include hidden slides</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-orange-600" />
                        <span className="text-sm text-gray-700">Flatten animations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-orange-600" defaultChecked />
                        <span className="text-sm text-gray-700">Preserve hyperlinks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-orange-600" />
                        <span className="text-sm text-gray-700">Password protect PDF</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conversion Preview */}
          {pptFile && selectedMode && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6 border border-orange-200">
              <div className="flex items-start space-x-3">
                <Layout className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conversion Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Layout:</span>
                      <div className="font-medium text-orange-600">{selectedMode.label}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output Format:</span>
                      <div className="font-medium text-red-600">PDF Document</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Pages:</span>
                      <div className="font-medium text-blue-600">
                        {conversionMode === 'handouts' ? 'Multiple slides/page' : 
                         conversionMode === 'notes' ? 'Slides + Notes' : 'One slide/page'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          {pptFile && (
            <div className="text-center mb-6">
              <button
                onClick={convertToPdf}
                disabled={isProcessing}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Converting to PDF...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Convert to PDF
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
                PowerPoint Converted to PDF Successfully!
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Pages</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {conversionResult.pages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Slides</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {conversionResult.slides}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">File Size</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {formatFileSize(conversionResult.fileSize)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Quality</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {conversionResult.quality}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Time</div>
                  <div className="text-lg font-semibold text-green-600">
                    {conversionResult.conversionTime}s
                  </div>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Perfect for Sharing</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Universal PDF compatibility</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple layout options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Preserve slide formatting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Include speaker notes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Print-ready handouts</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PowerPoint to PDF Conversion Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload Presentation</h4>
                <p className="text-sm text-gray-600">Choose your PowerPoint file (.ppt, .pptx, .pps, .ppsx, .odp)</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Layout className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Choose Layout</h4>
                <p className="text-sm text-gray-600">Select PDF layout and advanced options</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Convert</h4>
                <p className="text-sm text-gray-600">Process slides with chosen settings</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your professional PDF document</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

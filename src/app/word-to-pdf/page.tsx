'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, FileText, RefreshCw, CheckCircle, Settings, Sparkles, Shield, Zap } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface ConversionSettings {
  id: 'standard' | 'high_quality' | 'web_optimized' | 'print_ready';
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
  fileSize: number;
  conversionTime: number;
  quality: string;
}

export default function WordToPdfPage() {
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [conversionSetting, setConversionSetting] = useState<ConversionSettings['id']>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const conversionSettings: ConversionSettings[] = [
    {
      id: 'standard',
      label: 'Standard Quality',
      description: 'Perfect balance of quality and file size for general use',
      features: ['Fast conversion', 'Moderate file size', 'Good quality', 'Universal compatibility'],
      icon: '⚡',
      recommended: true
    },
    {
      id: 'high_quality',
      label: 'High Quality',
      description: 'Maximum quality preservation for professional documents',
      features: ['Highest quality', 'Preserves formatting', 'Large file size', 'Professional grade'],
      icon: '💎'
    },
    {
      id: 'web_optimized',
      label: 'Web Optimized',
      description: 'Optimized for web viewing and sharing',
      features: ['Small file size', 'Fast loading', 'Web compatible', 'Optimized images'],
      icon: '🌐'
    },
    {
      id: 'print_ready',
      label: 'Print Ready',
      description: 'Optimized for high-quality printing',
      features: ['Print optimized', 'High resolution', 'Color accuracy', 'Professional printing'],
      icon: '🖨️'
    }
  ];

  const acceptedFormats = [
    '.doc', '.docx', '.rtf', '.odt', '.txt'
  ];

  const handleFileUpload = useCallback((file: File) => {
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const acceptedExtensions = ['doc', 'docx', 'rtf', 'odt', 'txt'];
    
    if (acceptedExtensions.includes(fileExtension || '')) {
      setWordFile(file);
      setConversionResult(null);
    } else {
      alert('Please upload a valid Word document (.doc, .docx, .rtf, .odt, .txt)');
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
    if (!wordFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Simulate conversion results
      const pages = Math.floor(Math.random() * 15) + 1;
      const conversionTime = Math.floor(Math.random() * 8) + 2;
      const baseSize = wordFile.size;
      
      // Adjust file size based on conversion setting
      const sizeMultipliers = {
        standard: 0.8,
        high_quality: 1.2,
        web_optimized: 0.5,
        print_ready: 1.5
      };
      
      const fileSize = baseSize * sizeMultipliers[conversionSetting];
      
      const qualityMap = {
        standard: 'Good',
        high_quality: 'Excellent',
        web_optimized: 'Optimized',
        print_ready: 'Premium'
      };
      
      setConversionResult({
        downloadUrl: 'converted-pdf-document.pdf',
        fileName: wordFile.name.replace(/\.(doc|docx|rtf|odt|txt)$/i, '.pdf'),
        pages,
        fileSize,
        conversionTime,
        quality: qualityMap[conversionSetting]
      });
    } catch (error) {
      console.error('Error converting Word to PDF:', error);
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
      'doc': '📄',
      'docx': '📘',
      'rtf': '📝',
      'odt': '📋',
      'txt': '📜'
    };
    return iconMap[extension || 'doc'] || '📄';
  };

  const selectedSetting = conversionSettings.find(setting => setting.id === conversionSetting);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">W</span>
                </div>
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Word to PDF Converter</h1>
            <p className="text-lg text-gray-600">
              Convert Word documents to PDF format instantly. Supports DOC, DOCX, RTF, ODT, and TXT files with professional quality.
            </p>
          </div>

          {/* Supported Formats */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-6">
              <span className="text-sm font-medium text-blue-800">Supported formats:</span>
              {acceptedFormats.map((format, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {format.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors mb-6"
          >
            <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Word Document
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your Word file here, or click to browse
            </p>
            <input
              type="file"
              accept=".doc,.docx,.rtf,.odt,.txt"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="word-upload"
            />
            <label
              htmlFor="word-upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <FileText className="w-5 h-5 mr-2" />
              Select Word File
            </label>
          </div>

          {/* Uploaded File Info */}
          {wordFile && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    {getFileIcon(wordFile.name)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{wordFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {formatFileSize(wordFile.size)} • {wordFile.name.split('.').pop()?.toUpperCase()} Document
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

          {/* Conversion Settings */}
          {wordFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Quality</h3>
                <p className="text-sm text-gray-600">Choose the quality setting that best fits your needs</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {conversionSettings.map((setting) => (
                  <label
                    key={setting.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      conversionSetting === setting.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="conversionSetting"
                      value={setting.id}
                      checked={conversionSetting === setting.id}
                      onChange={(e) => setConversionSetting(e.target.value as ConversionSettings['id'])}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{setting.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{setting.label}</h4>
                          {setting.recommended && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {setting.features.map((feature, index) => (
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
          {wordFile && (
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
                          Page Orientation
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Auto (from document)</option>
                          <option>Portrait</option>
                          <option>Landscape</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Page Size
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Auto (from document)</option>
                          <option>A4</option>
                          <option>Letter</option>
                          <option>Legal</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-sm text-gray-700">Preserve hyperlinks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-sm text-gray-700">Include bookmarks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Password protect PDF</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Add watermark</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conversion Info Panel */}
          {wordFile && selectedSetting && (
            <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conversion Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Quality Level:</span>
                      <div className="font-medium text-blue-600">{selectedSetting.label}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output Format:</span>
                      <div className="font-medium text-red-600">PDF Document</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Processing:</span>
                      <div className="font-medium text-green-600">Fast & Secure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          {wordFile && (
            <div className="text-center mb-6">
              <button
                onClick={convertToPdf}
                disabled={isProcessing}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                Word Document Converted Successfully!
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Pages</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {conversionResult.pages}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Why Choose Our Converter</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Perfect formatting preservation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple quality options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Supports all Word formats</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Lightning fast conversion</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional PDF output</span>
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
                  <span>256-bit SSL encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>No registration required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>GDPR compliant processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Private cloud servers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How Word to PDF Conversion Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload Word</h4>
                <p className="text-sm text-gray-600">Choose your Word document (.doc, .docx, .rtf, .odt, .txt)</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Choose Quality</h4>
                <p className="text-sm text-gray-600">Select quality settings and advanced options</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Convert</h4>
                <p className="text-sm text-gray-600">Our engine converts with perfect formatting</p>
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

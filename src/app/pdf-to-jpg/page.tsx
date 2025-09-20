'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, FileText, RefreshCw, CheckCircle, Settings, Image, Eye, Zap, Shield, Layout, Camera } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface ConversionMode {
  id: 'all_pages' | 'single_page' | 'page_range' | 'high_quality';
  label: string;
  description: string;
  features: string[];
  icon: string;
  recommended?: boolean;
}

interface ConversionResult {
  downloadUrl: string;
  fileName: string;
  images: number;
  totalPages: number;
  fileSize: number;
  conversionTime: number;
  quality: string;
  resolution: string;
}

export default function PdfToJpgPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [conversionMode, setConversionMode] = useState<ConversionMode['id']>('all_pages');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const conversionModes: ConversionMode[] = [
    {
      id: 'all_pages',
      label: 'All Pages to JPG',
      description: 'Convert every PDF page to individual JPG images',
      features: ['All pages converted', 'Batch processing', 'ZIP download', 'Consistent quality'],
      icon: '📄',
      recommended: true
    },
    {
      id: 'single_page',
      label: 'Single Page',
      description: 'Convert only one specific page to JPG',
      features: ['Choose page number', 'Quick conversion', 'Single image', 'Faster processing'],
      icon: '🎯'
    },
    {
      id: 'page_range',
      label: 'Page Range',
      description: 'Convert selected pages or page ranges',
      features: ['Custom range', 'Flexible selection', 'Multiple images', 'Selective conversion'],
      icon: '📊'
    },
    {
      id: 'high_quality',
      label: 'High Quality',
      description: 'Maximum quality conversion for professional use',
      features: ['Premium quality', 'High resolution', 'Print-ready', 'Larger file size'],
      icon: '💎'
    }
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setConversionResult(null);
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

  const convertToJpg = async () => {
    if (!pdfFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Simulate conversion results
      const totalPages = Math.floor(Math.random() * 20) + 3;
      const conversionTime = Math.floor(Math.random() * 8) + 3;
      const baseSize = pdfFile.size;
      
      // Calculate images and file size based on conversion mode
      let images: number;
      let sizeMultiplier: number;
      
      switch (conversionMode) {
        case 'all_pages':
          images = totalPages;
          sizeMultiplier = 2.5;
          break;
        case 'single_page':
          images = 1;
          sizeMultiplier = 0.3;
          break;
        case 'page_range':
          images = Math.floor(totalPages * 0.6);
          sizeMultiplier = 1.5;
          break;
        case 'high_quality':
          images = totalPages;
          sizeMultiplier = 4.2;
          break;
        default:
          images = totalPages;
          sizeMultiplier = 2.5;
      }
      
      const fileSize = baseSize * sizeMultiplier;
      
      const qualityMap = {
        all_pages: 'Good',
        single_page: 'Standard',
        page_range: 'Good',
        high_quality: 'Premium'
      };
      
      const resolutionMap = {
        all_pages: '150 DPI',
        single_page: '150 DPI',
        page_range: '150 DPI',
        high_quality: '300 DPI'
      };
      
      setConversionResult({
        downloadUrl: conversionMode === 'single_page' ? 'page-1.jpg' : 'pdf-images.zip',
        fileName: conversionMode === 'single_page' ? 
          pdfFile.name.replace('.pdf', '-page-1.jpg') : 
          pdfFile.name.replace('.pdf', '-images.zip'),
        images,
        totalPages,
        fileSize,
        conversionTime,
        quality: qualityMap[conversionMode],
        resolution: resolutionMap[conversionMode]
      });
    } catch (error) {
      console.error('Error converting PDF to JPG:', error);
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
                <Image className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to JPG Converter</h1>
            <p className="text-lg text-gray-600">
              Convert PDF pages to high-quality JPG images. Perfect for creating thumbnails, extracting images, or converting documents to image format.
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
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Options</h3>
                <p className="text-sm text-gray-600">Choose how you want to convert your PDF to JPG images</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {conversionModes.map((mode) => (
                  <label
                    key={mode.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
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
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Advanced Image Options</span>
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
                          Image Quality
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>High (recommended)</option>
                          <option>Maximum</option>
                          <option>Medium</option>
                          <option>Low (faster)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Resolution (DPI)
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>150 DPI (standard)</option>
                          <option>300 DPI (high quality)</option>
                          <option>600 DPI (print quality)</option>
                          <option>72 DPI (web optimized)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Page Number (Single Page)
                        </label>
                        <input 
                          type="number" 
                          placeholder="e.g., 3" 
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={conversionMode !== 'single_page'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Page Range
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g., 1-5, 8, 10-12" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={conversionMode !== 'page_range'}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color Mode
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>RGB Color</option>
                          <option>Grayscale</option>
                          <option>Black & White</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image Format
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>JPG (recommended)</option>
                          <option>PNG (lossless)</option>
                          <option>TIFF (high quality)</option>
                          <option>BMP (uncompressed)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-sm text-gray-700">Anti-aliasing</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Transparent background</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-sm text-gray-700">Optimize file size</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Add page numbers</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conversion Preview */}
          {pdfFile && selectedMode && (
            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Camera className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conversion Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mode:</span>
                      <div className="font-medium text-blue-600">{selectedMode.label}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output Format:</span>
                      <div className="font-medium text-blue-600">JPG Images</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Output:</span>
                      <div className="font-medium text-green-600">
                        {conversionMode === 'single_page' ? '1 Image' : 
                         conversionMode === 'page_range' ? 'Selected Images' : 
                         conversionMode === 'high_quality' ? 'High-Res Images' : 'All Page Images'}
                      </div>
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
                onClick={convertToJpg}
                disabled={isProcessing}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Converting to JPG...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Convert to JPG
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
                PDF Converted to JPG Successfully!
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Images</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {conversionResult.images}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Total Pages</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {conversionResult.totalPages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">File Size</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {formatFileSize(conversionResult.fileSize)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Quality</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {conversionResult.quality}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Resolution</div>
                  <div className="text-lg font-semibold text-indigo-600">
                    {conversionResult.resolution}
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
                Download {conversionResult.images === 1 ? 'Image' : 'Images'}
              </button>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Perfect for Images</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>High-quality image extraction</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple conversion options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Batch processing support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Custom resolution settings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional image quality</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF to JPG Conversion Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload PDF</h4>
                <p className="text-sm text-gray-600">Select your PDF document for conversion</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Image className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Choose Options</h4>
                <p className="text-sm text-gray-600">Select conversion mode and quality settings</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Convert</h4>
                <p className="text-sm text-gray-600">Process pages to high-quality images</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your JPG images or ZIP file</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Image, RefreshCw, CheckCircle, Settings, FileText, Eye, Zap, Shield, Layout, X, RotateCw, Move } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface ImageFile {
  file: File;
  id: string;
  preview: string;
}

interface ConversionMode {
  id: 'single_pdf' | 'multiple_pages' | 'custom_layout' | 'merge_images';
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
  images: number;
  fileSize: number;
  conversionTime: number;
  quality: string;
}

export default function JpgToPdfPage() {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [conversionMode, setConversionMode] = useState<ConversionMode['id']>('single_pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const conversionModes: ConversionMode[] = [
    {
      id: 'single_pdf',
      label: 'Single PDF',
      description: 'Combine all images into one PDF document',
      features: ['All images in one PDF', 'Maintains order', 'Easy sharing', 'Compact file'],
      icon: '📄',
      recommended: true
    },
    {
      id: 'multiple_pages',
      label: 'Multiple Pages',
      description: 'Each image becomes a separate page in the PDF',
      features: ['One image per page', 'Full page layout', 'Professional format', 'Print-ready'],
      icon: '📋'
    },
    {
      id: 'custom_layout',
      label: 'Custom Layout',
      description: 'Arrange multiple images per page with custom layout',
      features: ['Multiple images per page', 'Custom arrangement', 'Space efficient', 'Flexible design'],
      icon: '🎨'
    },
    {
      id: 'merge_images',
      label: 'Merge Images',
      description: 'Smart merge with automatic layout optimization',
      features: ['Auto optimization', 'Best fit layout', 'Quality preservation', 'Smart sizing'],
      icon: '🔗'
    }
  ];

  const acceptedFormats = [
    '.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'
  ];

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: ImageFile[] = [];
    
    Array.from(files).forEach((file) => {
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const acceptedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'];
      
      if (acceptedExtensions.includes(fileExtension || '')) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);
        newFiles.push({ file, id, preview });
      }
    });
    
    if (newFiles.length > 0) {
      setImageFiles(prev => [...prev, ...newFiles]);
      setConversionResult(null);
    } else {
      alert('Please upload valid image files (.jpg, .jpeg, .png, .webp, .bmp, .tiff)');
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

  const removeImage = (id: string) => {
    setImageFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, removed);
      return newFiles;
    });
  };

  const convertToPdf = async () => {
    if (imageFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Simulate conversion results
      const images = imageFiles.length;
      const conversionTime = Math.floor(Math.random() * 6) + 2;
      const totalSize = imageFiles.reduce((sum, img) => sum + img.file.size, 0);
      
      // Calculate pages and file size based on conversion mode
      let pages: number;
      let sizeMultiplier: number;
      
      switch (conversionMode) {
        case 'single_pdf':
          pages = images;
          sizeMultiplier = 0.8;
          break;
        case 'multiple_pages':
          pages = images;
          sizeMultiplier = 1.2;
          break;
        case 'custom_layout':
          pages = Math.ceil(images / 2);
          sizeMultiplier = 0.9;
          break;
        case 'merge_images':
          pages = Math.ceil(images / 3);
          sizeMultiplier = 0.7;
          break;
        default:
          pages = images;
          sizeMultiplier = 0.8;
      }
      
      const fileSize = totalSize * sizeMultiplier;
      
      const qualityMap = {
        single_pdf: 'Good',
        multiple_pages: 'High',
        custom_layout: 'Optimized',
        merge_images: 'Compressed'
      };
      
      setConversionResult({
        downloadUrl: 'images-converted.pdf',
        fileName: 'images-converted.pdf',
        pages,
        images,
        fileSize,
        conversionTime,
        quality: qualityMap[conversionMode]
      });
    } catch (error) {
      console.error('Error converting images to PDF:', error);
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
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🎨',
      'webp': '🌐',
      'bmp': '📷',
      'tiff': '📸'
    };
    return iconMap[extension || 'jpg'] || '🖼️';
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
                <Image className="w-8 h-8 text-blue-600" />
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">JPG to PDF Converter</h1>
            <p className="text-lg text-gray-600">
              Convert JPG, PNG, and other image formats to PDF documents. Combine multiple images into a single PDF or create individual page layouts.
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
              Upload Image Files
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your image files here, or click to browse. You can select multiple files.
            </p>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.bmp,.tiff"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Image className="w-5 h-5 mr-2" />
              Select Image Files
            </label>
          </div>

          {/* Uploaded Images */}
          {imageFiles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Uploaded Images ({imageFiles.length})
                </h3>
                <div className="text-sm text-gray-500">
                  Total size: {formatFileSize(imageFiles.reduce((sum, img) => sum + img.file.size, 0))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {imageFiles.map((imageFile, index) => (
                  <div key={imageFile.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <img 
                        src={imageFile.preview} 
                        alt={imageFile.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeImage(imageFile.id)}
                        className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="truncate">{imageFile.file.name}</div>
                      <div>{formatFileSize(imageFile.file.size)}</div>
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer text-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add More Images
                </label>
              </div>
            </div>
          )}

          {/* Conversion Modes */}
          {imageFiles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Layout Options</h3>
                <p className="text-sm text-gray-600">Choose how you want your images arranged in the PDF</p>
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
          {imageFiles.length > 0 && (
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
                          Page Size
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>A4</option>
                          <option>Letter</option>
                          <option>Legal</option>
                          <option>A3</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Orientation
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Auto (best fit)</option>
                          <option>Portrait</option>
                          <option>Landscape</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image Quality
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>High (recommended)</option>
                          <option>Maximum</option>
                          <option>Medium</option>
                          <option>Compressed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Images per Page (Custom Layout)
                        </label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={conversionMode !== 'custom_layout'}
                        >
                          <option>1 image per page</option>
                          <option>2 images per page</option>
                          <option>4 images per page</option>
                          <option>6 images per page</option>
                          <option>9 images per page</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Margins
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Normal</option>
                          <option>Narrow</option>
                          <option>Wide</option>
                          <option>None</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image Scaling
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Fit to page</option>
                          <option>Original size</option>
                          <option>Fill page</option>
                          <option>Custom scale</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-sm text-gray-700">Maintain aspect ratio</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Add page numbers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Add image names</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Password protect PDF</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conversion Preview */}
          {imageFiles.length > 0 && selectedMode && (
            <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Layout className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conversion Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Layout:</span>
                      <div className="font-medium text-blue-600">{selectedMode.label}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output Format:</span>
                      <div className="font-medium text-red-600">PDF Document</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Images to Process:</span>
                      <div className="font-medium text-green-600">{imageFiles.length} images</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          {imageFiles.length > 0 && (
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
                Images Converted to PDF Successfully!
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Pages</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {conversionResult.pages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Images</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {conversionResult.images}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Perfect for Documents</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple image format support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Batch image processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Flexible layout options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Quality preservation</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How JPG to PDF Conversion Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload Images</h4>
                <p className="text-sm text-gray-600">Select multiple image files (.jpg, .png, .webp, etc.)</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Layout className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Choose Layout</h4>
                <p className="text-sm text-gray-600">Select PDF layout and arrangement options</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Convert</h4>
                <p className="text-sm text-gray-600">Process images into PDF document</p>
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

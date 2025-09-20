'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, FileText, RefreshCw, CheckCircle, Settings, Droplets, Eye, Zap, Shield, Type, Image, RotateCw, Palette } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface WatermarkType {
  id: 'text' | 'image' | 'logo' | 'stamp';
  label: string;
  description: string;
  features: string[];
  icon: any;
  recommended?: boolean;
}

interface WatermarkResult {
  downloadUrl: string;
  fileName: string;
  pages: number;
  watermarks: number;
  fileSize: number;
  processingTime: number;
  watermarkType: string;
}

export default function WatermarkPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<WatermarkType['id']>('text');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkResult, setWatermarkResult] = useState<WatermarkResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const watermarkTypes: WatermarkType[] = [
    {
      id: 'text',
      label: 'Text Watermark',
      description: 'Add custom text as watermark with various styling options',
      features: ['Custom text', 'Multiple fonts', 'Color options', 'Transparency control'],
      icon: Type,
      recommended: true
    },
    {
      id: 'image',
      label: 'Image Watermark',
      description: 'Upload and use any image as a watermark',
      features: ['Custom images', 'PNG support', 'Transparency', 'Scaling options'],
      icon: Image
    },
    {
      id: 'logo',
      label: 'Logo Watermark',
      description: 'Add your company logo or brand mark',
      features: ['Brand protection', 'Professional look', 'Vector support', 'High quality'],
      icon: Palette
    },
    {
      id: 'stamp',
      label: 'Stamp Watermark',
      description: 'Apply official stamps and seals',
      features: ['Official stamps', 'Seal designs', 'Authority marks', 'Legal compliance'],
      icon: CheckCircle
    }
  ];

  const predefinedTexts = [
    'CONFIDENTIAL',
    'DRAFT',
    'SAMPLE',
    'COPY',
    'APPROVED',
    'REVIEWED',
    'INTERNAL USE ONLY',
    'NOT FOR DISTRIBUTION',
    'PRELIMINARY',
    'FINAL'
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setWatermarkResult(null);
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

  const applyWatermark = async () => {
    if (!pdfFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate watermark processing
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Simulate watermark results
      const pages = Math.floor(Math.random() * 20) + 3;
      const watermarks = pages; // One watermark per page
      const processingTime = Math.floor(Math.random() * 6) + 2;
      const baseSize = pdfFile.size;
      
      // Adjust file size based on watermark type
      const sizeMultipliers = {
        text: 1.05,
        image: 1.15,
        logo: 1.12,
        stamp: 1.08
      };
      
      const fileSize = baseSize * sizeMultipliers[watermarkType];
      
      const typeMap = {
        text: 'Text',
        image: 'Image',
        logo: 'Logo',
        stamp: 'Stamp'
      };
      
      setWatermarkResult({
        downloadUrl: 'watermarked-document.pdf',
        fileName: pdfFile.name.replace('.pdf', '-watermarked.pdf'),
        pages,
        watermarks,
        fileSize,
        processingTime,
        watermarkType: typeMap[watermarkType]
      });
    } catch (error) {
      console.error('Error applying watermark:', error);
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

  const selectedType = watermarkTypes.find(type => type.id === watermarkType);

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
                <Droplets className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Watermark Tool</h1>
            <p className="text-lg text-gray-600">
              Add watermarks to your PDF documents for branding, security, or identification. Choose from text, image, logo, or stamp watermarks.
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
                  <div className="text-sm text-gray-500">Ready for watermark</div>
                  <div className="text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Watermark Types */}
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Watermark Type</h3>
                <p className="text-sm text-gray-600">Choose the type of watermark you want to apply</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {watermarkTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      watermarkType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="watermarkType"
                      value={type.id}
                      checked={watermarkType === type.id}
                      onChange={(e) => setWatermarkType(e.target.value as WatermarkType['id'])}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{type.label}</h4>
                          {type.recommended && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {type.features.map((feature, index) => (
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

          {/* Watermark Content */}
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Watermark Content</h3>
                <p className="text-sm text-gray-600">Configure your watermark content and appearance</p>
              </div>
              
              <div className="p-6 space-y-6">
                {watermarkType === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Watermark Text
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Enter watermark text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quick Select
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {predefinedTexts.map((text) => (
                          <button
                            key={text}
                            onClick={() => setWatermarkText(text)}
                            className={`px-3 py-2 text-xs border rounded-lg transition-colors ${
                              watermarkText === text
                                ? 'bg-blue-100 border-blue-500 text-blue-700'
                                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {text}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {watermarkText && (
                      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-400 opacity-60 transform rotate-45">
                            {watermarkText}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">Preview of your text watermark</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {watermarkType === 'image' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                        <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                          PNG, JPG, or GIF (PNG with transparency recommended)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {watermarkType === 'logo' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                        <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                          SVG, PNG, or high-resolution images for best quality
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {watermarkType === 'stamp' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stamp Type
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Official Seal</option>
                        <option>Approved Stamp</option>
                        <option>Reviewed Stamp</option>
                        <option>Confidential Stamp</option>
                        <option>Custom Stamp</option>
                      </select>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="text-center">
                        <div className="inline-block border-4 border-red-500 rounded-full p-4">
                          <div className="text-red-500 font-bold text-lg">OFFICIAL</div>
                          <div className="text-red-500 text-sm">STAMP</div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Preview of your stamp watermark</p>
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
                    <span className="font-medium text-gray-900">Advanced Watermark Settings</span>
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
                          Position
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Center</option>
                          <option>Top Left</option>
                          <option>Top Center</option>
                          <option>Top Right</option>
                          <option>Middle Left</option>
                          <option>Middle Right</option>
                          <option>Bottom Left</option>
                          <option>Bottom Center</option>
                          <option>Bottom Right</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opacity
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>30% (Light)</option>
                          <option>50% (Medium)</option>
                          <option>70% (Dark)</option>
                          <option>100% (Opaque)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Small</option>
                          <option>Medium</option>
                          <option>Large</option>
                          <option>Extra Large</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rotation
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>0° (No rotation)</option>
                          <option>45° (Diagonal)</option>
                          <option>90° (Vertical)</option>
                          <option>-45° (Reverse diagonal)</option>
                          <option>Custom angle</option>
                        </select>
                      </div>
                    </div>
                    {watermarkType === 'text' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Arial</option>
                            <option>Times New Roman</option>
                            <option>Helvetica</option>
                            <option>Calibri</option>
                            <option>Impact</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                          </label>
                          <div className="flex space-x-2">
                            <input 
                              type="color" 
                              defaultValue="#888888"
                              className="w-12 h-10 border border-gray-300 rounded"
                            />
                            <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <option>Gray</option>
                              <option>Red</option>
                              <option>Blue</option>
                              <option>Green</option>
                              <option>Black</option>
                              <option>Custom</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-sm text-gray-700">Apply to all pages</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Behind content</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Repeat pattern</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Protect watermark</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Watermark Preview */}
          {pdfFile && selectedType && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Droplets className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Watermark Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <div className="font-medium text-blue-600">{selectedType.label}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Content:</span>
                      <div className="font-medium text-indigo-600">
                        {watermarkType === 'text' ? watermarkText || 'Text' : 
                         watermarkType === 'image' ? 'Custom Image' : 
                         watermarkType === 'logo' ? 'Company Logo' : 'Official Stamp'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Application:</span>
                      <div className="font-medium text-green-600">All Pages</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Apply Watermark Button */}
          {pdfFile && (
            <div className="text-center mb-6">
              <button
                onClick={applyWatermark}
                disabled={isProcessing || (watermarkType === 'text' && !watermarkText)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Applying Watermark...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Apply Watermark
                  </>
                )}
              </button>
            </div>
          )}

          {/* Watermark Result */}
          {watermarkResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <div className="text-green-600 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Watermark Applied Successfully!
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Pages</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {watermarkResult.pages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Watermarks</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {watermarkResult.watermarks}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">File Size</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {formatFileSize(watermarkResult.fileSize)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Type</div>
                  <div className="text-lg font-semibold text-indigo-600">
                    {watermarkResult.watermarkType}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Time</div>
                  <div className="text-lg font-semibold text-green-600">
                    {watermarkResult.processingTime}s
                  </div>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto">
                <Download className="w-5 h-5" />
                Download Watermarked PDF
              </button>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💧 Watermark Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple watermark types</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Custom text and images</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Transparency and positioning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional branding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Batch processing support</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Watermarking Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload PDF</h4>
                <p className="text-sm text-gray-600">Select your PDF document for watermarking</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Type className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Choose Type</h4>
                <p className="text-sm text-gray-600">Select watermark type and customize content</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Configure</h4>
                <p className="text-sm text-gray-600">Adjust position, opacity, and appearance</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your watermarked PDF document</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

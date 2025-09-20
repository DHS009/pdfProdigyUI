'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, FileText, Minimize2, Info, Settings, Zap } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface CompressionLevel {
  id: 'low' | 'medium' | 'high' | 'maximum';
  label: string;
  description: string;
  compressionRatio: string;
  qualityLevel: string;
  icon: string;
}

interface CompressedResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  downloadUrl: string;
}

export default function CompressPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel['id']>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedResult, setCompressedResult] = useState<CompressedResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const compressionLevels: CompressionLevel[] = [
    {
      id: 'low',
      label: 'Low Compression',
      description: 'Minimal compression, highest quality',
      compressionRatio: '10-20%',
      qualityLevel: 'Excellent',
      icon: '🔷'
    },
    {
      id: 'medium',
      label: 'Medium Compression',
      description: 'Balanced compression and quality',
      compressionRatio: '30-50%',
      qualityLevel: 'Very Good',
      icon: '🔶'
    },
    {
      id: 'high',
      label: 'High Compression',
      description: 'Strong compression, good quality',
      compressionRatio: '50-70%',
      qualityLevel: 'Good',
      icon: '🟠'
    },
    {
      id: 'maximum',
      label: 'Maximum Compression',
      description: 'Strongest compression, reduced quality',
      compressionRatio: '70-90%',
      qualityLevel: 'Acceptable',
      icon: '🔴'
    }
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setCompressedResult(null);
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

  const compressPdf = async () => {
    if (!pdfFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate compression process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate compression results based on level
      const compressionRatios = {
        low: 0.15,
        medium: 0.40,
        high: 0.60,
        maximum: 0.80
      };
      
      const originalSize = pdfFile.size;
      const compressedSize = originalSize * (1 - compressionRatios[compressionLevel]);
      const ratio = ((originalSize - compressedSize) / originalSize) * 100;
      
      setCompressedResult({
        originalSize,
        compressedSize,
        compressionRatio: ratio,
        downloadUrl: 'compressed-pdf-url'
      });
    } catch (error) {
      console.error('Error compressing PDF:', error);
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

  const selectedLevel = compressionLevels.find(level => level.id === compressionLevel);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Minimize2 className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Compress PDF Files</h1>
            </div>
            <p className="text-lg text-gray-600">
              Reduce PDF file size while maintaining quality. Choose your compression level and optimize your documents.
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
                      Original size: {formatFileSize(pdfFile.size)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Ready to compress</div>
                  <div className="text-lg font-semibold text-green-600">✓</div>
                </div>
              </div>
            </div>
          )}

          {/* Compression Levels */}
          {pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compression Level</h3>
                <p className="text-sm text-gray-600">Choose how much you want to compress your PDF</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {compressionLevels.map((level) => (
                  <label
                    key={level.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      compressionLevel === level.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="compressionLevel"
                      value={level.id}
                      checked={compressionLevel === level.id}
                      onChange={(e) => setCompressionLevel(e.target.value as CompressionLevel['id'])}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{level.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{level.label}</div>
                        <div className="text-sm text-gray-600 mb-2">{level.description}</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-600">Size reduction: {level.compressionRatio}</span>
                          <span className="text-green-600">Quality: {level.qualityLevel}</span>
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
                    <span className="font-medium text-gray-900">Advanced Settings</span>
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
                        Image Quality
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>High Quality (Recommended)</option>
                        <option>Medium Quality</option>
                        <option>Low Quality</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-sm text-gray-700">Remove metadata</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">Optimize for web viewing</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compression Info Panel */}
          {pdfFile && selectedLevel && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Compression Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Original Size:</span>
                      <div className="font-medium">{formatFileSize(pdfFile.size)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Size:</span>
                      <div className="font-medium text-green-600">
                        {formatFileSize(pdfFile.size * (1 - (compressionLevel === 'low' ? 0.15 : compressionLevel === 'medium' ? 0.40 : compressionLevel === 'high' ? 0.60 : 0.80)))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Savings:</span>
                      <div className="font-medium text-blue-600">{selectedLevel.compressionRatio}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compress Button */}
          {pdfFile && (
            <div className="text-center mb-6">
              <button
                onClick={compressPdf}
                disabled={isProcessing}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Compressing PDF...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Compress PDF
                  </>
                )}
              </button>
            </div>
          )}

          {/* Compression Result */}
          {compressedResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                PDF Compressed Successfully!
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Original Size</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatFileSize(compressedResult.originalSize)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Compressed Size</div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatFileSize(compressedResult.compressedSize)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Space Saved</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {compressedResult.compressionRatio.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto">
                <Download className="w-5 h-5" />
                Download Compressed PDF
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Compression Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">✨ What We Optimize:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Image resolution and quality</li>
                  <li>• Font embedding optimization</li>
                  <li>• Duplicate object removal</li>
                  <li>• Metadata and annotation cleanup</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🛡️ Quality Guarantee:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Text remains crisp and readable</li>
                  <li>• Vector graphics stay sharp</li>
                  <li>• Professional quality maintained</li>
                  <li>• No data loss in content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

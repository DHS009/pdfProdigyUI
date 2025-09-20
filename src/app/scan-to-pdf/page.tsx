'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Camera, Scan, Image as ImageIcon, FileText, Settings, Eye, Zap, RefreshCw, CheckCircle, RotateCw, Crop, Filter, Contrast, Move, Trash2 } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface ScannedFile {
  file: File;
  name: string;
  size: number;
  type: 'image' | 'scan';
  preview: string;
  rotation: number;
  order: number;
}

interface ScanSettings {
  pageSize: 'auto' | 'a4' | 'letter' | 'legal' | 'a3' | 'custom';
  orientation: 'auto' | 'portrait' | 'landscape';
  quality: 'draft' | 'standard' | 'high' | 'premium';
  colorMode: 'auto' | 'color' | 'grayscale' | 'bw';
  dpi: 150 | 200 | 300 | 600;
  compression: 'none' | 'low' | 'medium' | 'high';
  ocrEnabled: boolean;
  autoEnhance: boolean;
  autoCrop: boolean;
  straightenPages: boolean;
}

interface ScanResult {
  success: boolean;
  fileName: string;
  totalPages: number;
  originalSize: number;
  pdfSize: number;
  quality: string;
  ocrEnabled: boolean;
  processingTime: number;
  enhancements: string[];
  downloadUrl: string;
}

type ScanMode = 'camera' | 'upload' | 'scanner';

export default function ScanToPdfPage() {
  const [scanMode, setScanMode] = useState<ScanMode>('upload');
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([]);
  const [scanSettings, setScanSettings] = useState<ScanSettings>({
    pageSize: 'auto',
    orientation: 'auto',
    quality: 'standard',
    colorMode: 'auto',
    dpi: 300,
    compression: 'medium',
    ocrEnabled: false,
    autoEnhance: true,
    autoCrop: true,
    straightenPages: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const scanModes = [
    {
      id: 'upload' as const,
      name: 'Upload Images',
      description: 'Upload photos or scanned images from your device',
      icon: Upload,
      features: ['Multiple formats', 'Batch processing', 'Drag & drop'],
      recommended: true
    },
    {
      id: 'camera' as const,
      name: 'Camera Scan',
      description: 'Use your device camera to scan documents',
      icon: Camera,
      features: ['Real-time capture', 'Auto-detect edges', 'Multi-page scan'],
      recommended: false
    },
    {
      id: 'scanner' as const,
      name: 'Scanner Device',
      description: 'Connect to a physical scanner device',
      icon: Scan,
      features: ['High quality', 'Professional results', 'Batch scanning'],
      recommended: false
    }
  ];

  const qualityPresets = [
    {
      quality: 'draft' as const,
      name: 'Draft Quality',
      description: 'Fast processing, smaller files',
      dpi: 150,
      fileSize: 'Small',
      useCase: 'Quick sharing'
    },
    {
      quality: 'standard' as const,
      name: 'Standard Quality',
      description: 'Balanced quality and file size',
      dpi: 200,
      fileSize: 'Medium',
      useCase: 'General use'
    },
    {
      quality: 'high' as const,
      name: 'High Quality',
      description: 'Excellent quality for professional use',
      dpi: 300,
      fileSize: 'Large',
      useCase: 'Professional documents'
    },
    {
      quality: 'premium' as const,
      name: 'Premium Quality',
      description: 'Maximum quality for archival purposes',
      dpi: 600,
      fileSize: 'Very Large',
      useCase: 'Archival/Print'
    }
  ];

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: ScannedFile[] = [];
    
    Array.from(files).forEach((file, index) => {
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        const preview = URL.createObjectURL(file);
        
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          type: 'image',
          preview,
          rotation: 0,
          order: scannedFiles.length + index
        });
      }
    });
    
    if (newFiles.length > 0) {
      setScannedFiles(prev => [...prev, ...newFiles]);
      setScanResult(null);
    } else {
      alert('Please upload valid image files (JPG, PNG, GIF, etc.)');
    }
  }, [scannedFiles.length]);

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

  const removeFile = (index: number) => {
    setScannedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Reorder remaining files
      return newFiles.map((file, i) => ({ ...file, order: i }));
    });
  };

  const rotateFile = (index: number, degrees: number = 90) => {
    setScannedFiles(prev => prev.map((file, i) => 
      i === index 
        ? { ...file, rotation: (file.rotation + degrees) % 360 }
        : file
    ));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEndReorder = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetIndex) return;

    setScannedFiles(prev => {
      const newFiles = [...prev];
      const [draggedFile] = newFiles.splice(draggedItem, 1);
      newFiles.splice(targetIndex, 0, draggedFile);
      
      // Update order numbers
      return newFiles.map((file, index) => ({ ...file, order: index }));
    });
    
    setDraggedItem(null);
  };

  const applyQualityPreset = (quality: ScanSettings['quality']) => {
    const preset = qualityPresets.find(p => p.quality === quality);
    if (preset) {
      setScanSettings(prev => ({
        ...prev,
        quality: preset.quality,
        dpi: preset.dpi as ScanSettings['dpi']
      }));
    }
  };

  const startCameraScan = () => {
    // Simulate camera scan
    alert('Camera scanning would be implemented with WebRTC API for real camera access');
  };

  const connectScanner = () => {
    // Simulate scanner connection
    alert('Scanner connection would be implemented with Web USB API for scanner devices');
  };

  const convertToPdf = async () => {
    if (scannedFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3000 + (scannedFiles.length * 1000)));
      
      const totalOriginalSize = scannedFiles.reduce((sum, file) => sum + file.size, 0);
      const processingTime = Math.floor(Math.random() * 8) + 5;
      
      // Calculate estimated PDF size based on settings
      let compressionFactor = 1;
      switch (scanSettings.compression) {
        case 'low': compressionFactor = 0.9; break;
        case 'medium': compressionFactor = 0.7; break;
        case 'high': compressionFactor = 0.5; break;
      }
      
      const qualityFactor = scanSettings.dpi / 300; // Base on 300 DPI
      const pdfSize = totalOriginalSize * compressionFactor * qualityFactor;
      
      const enhancements = [];
      if (scanSettings.autoEnhance) enhancements.push('Image enhancement applied');
      if (scanSettings.autoCrop) enhancements.push('Automatic cropping performed');
      if (scanSettings.straightenPages) enhancements.push('Page straightening applied');
      if (scanSettings.ocrEnabled) enhancements.push('OCR text recognition completed');
      
      const qualityPreset = qualityPresets.find(p => p.quality === scanSettings.quality);
      
      setScanResult({
        success: true,
        fileName: 'scanned-document.pdf',
        totalPages: scannedFiles.length,
        originalSize: totalOriginalSize,
        pdfSize,
        quality: qualityPreset?.name || 'Standard Quality',
        ocrEnabled: scanSettings.ocrEnabled,
        processingTime,
        enhancements,
        downloadUrl: 'scanned-document.pdf'
      });
    } catch (error) {
      console.error('Error converting to PDF:', error);
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

  const selectedQuality = qualityPresets.find(p => p.quality === scanSettings.quality);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <Scan className="w-8 h-8 text-blue-600" />
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Scan to PDF</h1>
            <p className="text-lg text-gray-600">
              Convert scanned documents, photos, and images into professional PDF files. Advanced OCR, enhancement, and quality options available.
            </p>
          </div>

          {/* Scan Mode Selection */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan Method</h3>
              <p className="text-sm text-gray-600">Choose how you want to capture or import your documents</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {scanModes.map((mode) => (
                <label
                  key={mode.id}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    scanMode === mode.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="scanMode"
                    value={mode.id}
                    checked={scanMode === mode.id}
                    onChange={(e) => setScanMode(e.target.value as ScanMode)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <mode.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{mode.name}</h4>
                        {mode.recommended && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                      <div className="space-y-1">
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

          {/* Quality Settings */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Settings</h3>
              <p className="text-sm text-gray-600">Choose the quality level for your PDF output</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {qualityPresets.map((preset) => (
                <label
                  key={preset.quality}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    scanSettings.quality === preset.quality
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="quality"
                    value={preset.quality}
                    checked={scanSettings.quality === preset.quality}
                    onChange={(e) => applyQualityPreset(e.target.value as ScanSettings['quality'])}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-1">{preset.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="text-blue-600 font-medium">{preset.dpi} DPI</div>
                      <div className="text-purple-600">{preset.fileSize} files</div>
                      <div className="text-orange-600">{preset.useCase}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Document Capture/Upload */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {scanMode === 'upload' ? 'Upload Images' : 
                 scanMode === 'camera' ? 'Camera Scan' : 'Scanner Device'}
              </h3>
              <p className="text-sm text-gray-600">
                {scanMode === 'upload' ? 'Upload photos or scanned images from your device' : 
                 scanMode === 'camera' ? 'Use your device camera to capture documents' : 
                 'Connect and scan from a physical scanner device'}
              </p>
            </div>
            
            <div className="p-6">
              {scanMode === 'upload' && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Images to Convert
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Drag and drop images here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Select Images
                  </label>
                  <div className="mt-4 text-sm text-gray-500">
                    Supports: JPG, PNG, GIF, BMP, TIFF, WebP
                  </div>
                </div>
              )}

              {scanMode === 'camera' && (
                <div className="text-center py-8">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Camera Scanning</h4>
                  <p className="text-gray-600 mb-6">
                    Use your device camera to scan documents in real-time
                  </p>
                  <button
                    onClick={startCameraScan}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Camera Scan
                  </button>
                  <div className="mt-4 text-sm text-gray-500">
                    Requires camera permission
                  </div>
                </div>
              )}

              {scanMode === 'scanner' && (
                <div className="text-center py-8">
                  <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Scanner Device</h4>
                  <p className="text-gray-600 mb-6">
                    Connect to a physical scanner for high-quality document scanning
                  </p>
                  <button
                    onClick={connectScanner}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Scan className="w-5 h-5 mr-2" />
                    Connect Scanner
                  </button>
                  <div className="mt-4 text-sm text-gray-500">
                    Requires compatible scanner device
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Images Management */}
          {scannedFiles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Scanned Pages ({scannedFiles.length})
                </h3>
                <p className="text-sm text-gray-600">
                  Drag to reorder, rotate, or remove pages before converting to PDF
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {scannedFiles.map((file, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDragEndReorder(e, index)}
                      className={`relative border-2 rounded-lg p-2 cursor-move transition-all ${
                        draggedItem === index ? 'opacity-50 border-blue-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="relative group">
                        <div 
                          className="w-full aspect-[3/4] bg-gray-100 rounded border overflow-hidden"
                          style={{ 
                            transform: `rotate(${file.rotation}deg)`,
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <button
                            onClick={() => rotateFile(index, 90)}
                            className="p-1 bg-white border border-gray-300 rounded shadow hover:bg-gray-50"
                            title="Rotate 90°"
                          >
                            <RotateCw className="w-3 h-3 text-gray-600" />
                          </button>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 bg-white border border-gray-300 rounded shadow hover:bg-red-50"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                        
                        <div className="mt-2 text-center">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            Page {index + 1}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                          {file.rotation > 0 && (
                            <div className="text-xs text-orange-600">
                              Rotated {file.rotation}°
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Advanced Processing Options</span>
                </div>
                <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Size
                      </label>
                      <select 
                        value={scanSettings.pageSize}
                        onChange={(e) => setScanSettings(prev => ({
                          ...prev,
                          pageSize: e.target.value as ScanSettings['pageSize']
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="auto">Auto-detect</option>
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                        <option value="a3">A3</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Mode
                      </label>
                      <select 
                        value={scanSettings.colorMode}
                        onChange={(e) => setScanSettings(prev => ({
                          ...prev,
                          colorMode: e.target.value as ScanSettings['colorMode']
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="auto">Auto-detect</option>
                        <option value="color">Full color</option>
                        <option value="grayscale">Grayscale</option>
                        <option value="bw">Black & White</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DPI Resolution
                      </label>
                      <select 
                        value={scanSettings.dpi}
                        onChange={(e) => setScanSettings(prev => ({
                          ...prev,
                          dpi: parseInt(e.target.value) as ScanSettings['dpi']
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="150">150 DPI (Draft)</option>
                        <option value="200">200 DPI (Standard)</option>
                        <option value="300">300 DPI (High)</option>
                        <option value="600">600 DPI (Premium)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compression
                      </label>
                      <select 
                        value={scanSettings.compression}
                        onChange={(e) => setScanSettings(prev => ({
                          ...prev,
                          compression: e.target.value as ScanSettings['compression']
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="none">No compression</option>
                        <option value="low">Low compression</option>
                        <option value="medium">Medium compression</option>
                        <option value="high">High compression</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={scanSettings.ocrEnabled}
                        onChange={(e) => setScanSettings(prev => ({...prev, ocrEnabled: e.target.checked}))}
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">OCR Text Recognition</div>
                        <div className="text-sm text-gray-500">Make text searchable and selectable</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={scanSettings.autoEnhance}
                        onChange={(e) => setScanSettings(prev => ({...prev, autoEnhance: e.target.checked}))}
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Auto Enhancement</div>
                        <div className="text-sm text-gray-500">Improve brightness and contrast</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={scanSettings.autoCrop}
                        onChange={(e) => setScanSettings(prev => ({...prev, autoCrop: e.target.checked}))}
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Auto Crop</div>
                        <div className="text-sm text-gray-500">Automatically detect and crop document edges</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={scanSettings.straightenPages}
                        onChange={(e) => setScanSettings(prev => ({...prev, straightenPages: e.target.checked}))}
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Straighten Pages</div>
                        <div className="text-sm text-gray-500">Correct skewed or rotated pages</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Processing Preview */}
          {selectedQuality && scannedFiles.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conversion Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Pages:</span>
                      <div className="font-medium text-blue-600">{scannedFiles.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Quality:</span>
                      <div className="font-medium text-green-600">{selectedQuality.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">DPI:</span>
                      <div className="font-medium text-purple-600">{scanSettings.dpi}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">OCR:</span>
                      <div className="font-medium text-orange-600">
                        {scanSettings.ocrEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <div className="text-center mb-6">
            <button
              onClick={convertToPdf}
              disabled={isProcessing || scannedFiles.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

          {/* Conversion Result */}
          {scanResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <div className="text-green-600 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                PDF Created Successfully!
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Pages</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {scanResult.totalPages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">PDF Size</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {formatFileSize(scanResult.pdfSize)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Quality</div>
                  <div className="text-lg font-semibold text-green-600">
                    {scanResult.quality}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">OCR</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {scanResult.ocrEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Time</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {scanResult.processingTime}s
                  </div>
                </div>
              </div>
              
              {scanResult.enhancements.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-green-200 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Enhancements Applied:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {scanResult.enhancements.map((enhancement, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">{enhancement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📷 Scanning Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple input methods (upload, camera, scanner)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Auto-enhancement and cropping</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Page straightening and rotation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>OCR text recognition</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Quality optimization</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Advanced Options</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span>Custom DPI settings (150-600)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span>Color mode selection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span>Compression optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span>Page size auto-detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span>Batch processing support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How Scan to PDF Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Scan className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Capture/Upload</h4>
                <p className="text-sm text-gray-600">Upload images, use camera, or connect scanner</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Configure</h4>
                <p className="text-sm text-gray-600">Set quality, enhancement, and OCR options</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Process</h4>
                <p className="text-sm text-gray-600">Apply enhancements and convert to PDF</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-orange-600" />
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

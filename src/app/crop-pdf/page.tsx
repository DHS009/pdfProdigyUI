'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Eye, FileText, Settings, Zap, RefreshCw, CheckCircle, AlertTriangle, Crop, Square, MousePointer, Grid3X3, Move, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFFile {
  file: File;
  name: string;
  size: number;
  totalPages: number;
  dimensions: {
    width: number;
    height: number;
  };
  pageFormat: string;
}

interface CropSettings {
  cropMode: 'uniform' | 'individual' | 'smart' | 'preset';
  cropMethod: 'manual' | 'auto_margins' | 'content_based' | 'remove_whitespace';
  presetFormat: 'letter' | 'a4' | 'legal' | 'tabloid' | 'custom';
  customDimensions: {
    width: number;
    height: number;
    unit: 'px' | 'in' | 'cm' | 'mm';
  };
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    unit: 'px' | 'in' | 'cm' | 'mm';
  };
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  preserveAspectRatio: boolean;
  removeBlankSpace: boolean;
  applyToAllPages: boolean;
  selectedPages: number[];
}

interface CropResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  croppedSize: number;
  originalDimensions: {
    width: number;
    height: number;
  };
  croppedDimensions: {
    width: number;
    height: number;
  };
  pagesProcessed: number;
  cropReduction: number;
  processingTime: number;
  downloadUrl: string;
  previewPages: PreviewPage[];
}

interface PreviewPage {
  pageNumber: number;
  originalSize: string;
  croppedSize: string;
  reductionPercentage: number;
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function CropPdfPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    cropMode: 'uniform',
    cropMethod: 'manual',
    presetFormat: 'a4',
    customDimensions: {
      width: 210,
      height: 297,
      unit: 'mm'
    },
    margins: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
      unit: 'mm'
    },
    cropArea: {
      x: 50,
      y: 50,
      width: 400,
      height: 600
    },
    preserveAspectRatio: true,
    removeBlankSpace: false,
    applyToAllPages: true,
    selectedPages: []
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropResults, setCropResults] = useState<CropResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'select' | 'crop'>('select');
  const [previewMode, setPreviewMode] = useState<'before' | 'after' | 'split'>('split');

  const cropModes = [
    {
      mode: 'uniform' as const,
      name: 'Uniform Crop',
      description: 'Apply same crop settings to all pages',
      icon: Square,
      features: ['Consistent layout', 'Batch processing', 'Time efficient']
    },
    {
      mode: 'individual' as const,
      name: 'Individual Pages',
      description: 'Customize crop for each page separately',
      icon: MousePointer,
      features: ['Page-specific control', 'Precise adjustments', 'Maximum flexibility']
    },
    {
      mode: 'smart' as const,
      name: 'Smart Crop',
      description: 'Automatically detect content boundaries',
      icon: Eye,
      features: ['Content detection', 'Auto boundaries', 'Intelligent cropping']
    },
    {
      mode: 'preset' as const,
      name: 'Preset Formats',
      description: 'Crop to standard paper sizes',
      icon: Grid3X3,
      features: ['Standard formats', 'Print ready', 'Professional layouts']
    }
  ];

  const cropMethods = [
    {
      method: 'manual' as const,
      name: 'Manual Selection',
      description: 'Manually define crop area',
      icon: MousePointer
    },
    {
      method: 'auto_margins' as const,
      name: 'Auto Margins',
      description: 'Remove margins automatically',
      icon: Minimize2
    },
    {
      method: 'content_based' as const,
      name: 'Content Based',
      description: 'Crop based on content detection',
      icon: Eye
    },
    {
      method: 'remove_whitespace' as const,
      name: 'Remove Whitespace',
      description: 'Eliminate empty white areas',
      icon: Crop
    }
  ];

  const presetFormats = [
    { format: 'letter', name: 'Letter', size: '8.5" × 11"', dimensions: { width: 216, height: 279 } },
    { format: 'a4', name: 'A4', size: '210 × 297 mm', dimensions: { width: 210, height: 297 } },
    { format: 'legal', name: 'Legal', size: '8.5" × 14"', dimensions: { width: 216, height: 356 } },
    { format: 'tabloid', name: 'Tabloid', size: '11" × 17"', dimensions: { width: 279, height: 432 } },
    { format: 'custom', name: 'Custom', size: 'User defined', dimensions: { width: 0, height: 0 } }
  ];

  const units = [
    { unit: 'px', name: 'Pixels' },
    { unit: 'in', name: 'Inches' },
    { unit: 'cm', name: 'Centimeters' },
    { unit: 'mm', name: 'Millimeters' }
  ];

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: PDFFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Simulate PDF analysis
        const totalPages = Math.floor(Math.random() * 20) + 5;
        const width = Math.floor(Math.random() * 200) + 600; // 600-800px
        const height = Math.floor(Math.random() * 300) + 800; // 800-1100px
        const formats = ['Letter', 'A4', 'Legal', 'Custom'];
        const pageFormat = formats[Math.floor(Math.random() * formats.length)];
        
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          totalPages,
          dimensions: { width, height },
          pageFormat
        });
      }
    });
    
    if (newFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newFiles]);
      setCropResults([]);
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

  const updateCropArea = (property: keyof CropSettings['cropArea'], value: number) => {
    setCropSettings(prev => ({
      ...prev,
      cropArea: {
        ...prev.cropArea,
        [property]: value
      }
    }));
  };

  const updateMargins = (property: keyof CropSettings['margins'], value: number | string) => {
    setCropSettings(prev => ({
      ...prev,
      margins: {
        ...prev.margins,
        [property]: value
      }
    }));
  };

  const resetCropArea = () => {
    setCropSettings(prev => ({
      ...prev,
      cropArea: {
        x: 50,
        y: 50,
        width: 400,
        height: 600
      }
    }));
  };

  const applyPresetFormat = (format: string) => {
    const preset = presetFormats.find(p => p.format === format);
    if (preset && preset.dimensions.width > 0) {
      setCropSettings(prev => ({
        ...prev,
        presetFormat: format as CropSettings['presetFormat'],
        customDimensions: {
          ...prev.customDimensions,
          width: preset.dimensions.width,
          height: preset.dimensions.height
        }
      }));
    }
  };

  const processCrop = async () => {
    if (pdfFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate crop processing
      await new Promise(resolve => setTimeout(resolve, 4000 + (pdfFiles.length * 2000)));
      
      const results: CropResult[] = pdfFiles.map((file) => {
        const processingTime = Math.floor(Math.random() * 20) + 10;
        const cropReduction = Math.floor(Math.random() * 40) + 20; // 20-60% reduction
        const croppedWidth = Math.floor(file.dimensions.width * (1 - cropReduction / 100));
        const croppedHeight = Math.floor(file.dimensions.height * (1 - cropReduction / 100));
        
        // Generate preview pages
        const previewPages: PreviewPage[] = Array.from({ length: Math.min(3, file.totalPages) }, (_, i) => ({
          pageNumber: i + 1,
          originalSize: `${file.dimensions.width} × ${file.dimensions.height}`,
          croppedSize: `${croppedWidth} × ${croppedHeight}`,
          reductionPercentage: cropReduction,
          cropArea: {
            x: cropSettings.cropArea.x,
            y: cropSettings.cropArea.y,
            width: cropSettings.cropArea.width,
            height: cropSettings.cropArea.height
          }
        }));
        
        return {
          success: Math.random() > 0.02, // 98% success rate
          fileName: file.name.replace('.pdf', '_cropped.pdf'),
          originalSize: file.size,
          croppedSize: file.size * (1 - cropReduction / 200), // Smaller file after cropping
          originalDimensions: file.dimensions,
          croppedDimensions: {
            width: croppedWidth,
            height: croppedHeight
          },
          pagesProcessed: file.totalPages,
          cropReduction,
          processingTime,
          downloadUrl: `cropped-${file.name}`,
          previewPages
        };
      });
      
      setCropResults(results);
    } catch (error) {
      console.error('Error processing crop:', error);
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

  const selectedMode = cropModes.find(mode => mode.mode === cropSettings.cropMode);
  const selectedMethod = cropMethods.find(method => method.method === cropSettings.cropMethod);
  const selectedPreset = presetFormats.find(format => format.format === cropSettings.presetFormat);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <Crop className="w-6 h-6 text-gray-400" />
                <Square className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Crop PDF - Resize & Trim Documents</h1>
            <p className="text-lg text-gray-600">
              Crop, resize, and trim PDF pages with precision. Remove margins, adjust dimensions, and optimize your documents for any format.
            </p>
          </div>

          {/* Crop Mode Selection */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Crop Mode</h3>
              <p className="text-sm text-gray-600">Choose how you want to crop your PDF pages</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cropModes.map((mode) => (
                  <label
                    key={mode.mode}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      cropSettings.cropMode === mode.mode
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cropMode"
                      value={mode.mode}
                      checked={cropSettings.cropMode === mode.mode}
                      onChange={(e) => setCropSettings(prev => ({
                        ...prev,
                        cropMode: e.target.value as CropSettings['cropMode']
                      }))}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <mode.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{mode.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                      <div className="space-y-1">
                        {mode.features.map((feature, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Crop Method & Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Crop Method */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Crop Method</h3>
                <p className="text-sm text-gray-600">Select how to determine the crop area</p>
              </div>
              
              <div className="p-6 space-y-3">
                {cropMethods.map((method) => (
                  <label
                    key={method.method}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all block ${
                      cropSettings.cropMethod === method.method
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cropMethod"
                      value={method.method}
                      checked={cropSettings.cropMethod === method.method}
                      onChange={(e) => setCropSettings(prev => ({
                        ...prev,
                        cropMethod: e.target.value as CropSettings['cropMethod']
                      }))}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <method.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{method.name}</h4>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Preset Formats */}
            {cropSettings.cropMode === 'preset' && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Preset Formats</h3>
                  <p className="text-sm text-gray-600">Choose a standard paper size</p>
                </div>
                
                <div className="p-6 space-y-3">
                  {presetFormats.map((format) => (
                    <label
                      key={format.format}
                      className={`cursor-pointer border-2 rounded-lg p-3 transition-all block ${
                        cropSettings.presetFormat === format.format
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="presetFormat"
                        value={format.format}
                        checked={cropSettings.presetFormat === format.format}
                        onChange={(e) => {
                          setCropSettings(prev => ({
                            ...prev,
                            presetFormat: e.target.value as CropSettings['presetFormat']
                          }));
                          applyPresetFormat(e.target.value);
                        }}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">{format.name}</h4>
                          <p className="text-sm text-gray-600">{format.size}</p>
                        </div>
                        {format.format !== 'custom' && (
                          <div className="text-sm text-purple-600 font-medium">
                            {format.dimensions.width} × {format.dimensions.height} mm
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Crop Controls */}
            {cropSettings.cropMethod === 'manual' && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Manual Crop Area</h3>
                      <p className="text-sm text-gray-600">Define the crop area coordinates</p>
                    </div>
                    <button
                      onClick={resetCropArea}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 inline mr-1" />
                      Reset
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">X Position</label>
                      <input
                        type="number"
                        value={cropSettings.cropArea.x}
                        onChange={(e) => updateCropArea('x', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="X coordinate"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Y Position</label>
                      <input
                        type="number"
                        value={cropSettings.cropArea.y}
                        onChange={(e) => updateCropArea('y', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Y coordinate"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Width</label>
                      <input
                        type="number"
                        value={cropSettings.cropArea.width}
                        onChange={(e) => updateCropArea('width', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Height</label>
                      <input
                        type="number"
                        value={cropSettings.cropArea.height}
                        onChange={(e) => updateCropArea('height', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Height"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Crop Preview</h4>
                    <div className="bg-white border-2 border-gray-300 rounded relative h-32 overflow-hidden">
                      <div 
                        className="absolute bg-blue-200 border-2 border-blue-500 opacity-75"
                        style={{
                          left: `${(cropSettings.cropArea.x / 600) * 100}%`,
                          top: `${(cropSettings.cropArea.y / 800) * 100}%`,
                          width: `${(cropSettings.cropArea.width / 600) * 100}%`,
                          height: `${(cropSettings.cropArea.height / 800) * 100}%`
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-800">Crop Area</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Margin Settings */}
            {(cropSettings.cropMethod === 'auto_margins' || cropSettings.cropMethod === 'remove_whitespace') && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Margin Settings</h3>
                  <p className="text-sm text-gray-600">Configure margin removal settings</p>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Top Margin</label>
                      <input
                        type="number"
                        value={cropSettings.margins.top}
                        onChange={(e) => updateMargins('top', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Bottom Margin</label>
                      <input
                        type="number"
                        value={cropSettings.margins.bottom}
                        onChange={(e) => updateMargins('bottom', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Left Margin</label>
                      <input
                        type="number"
                        value={cropSettings.margins.left}
                        onChange={(e) => updateMargins('left', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Right Margin</label>
                      <input
                        type="number"
                        value={cropSettings.margins.right}
                        onChange={(e) => updateMargins('right', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Unit</label>
                    <select
                      value={cropSettings.margins.unit}
                      onChange={(e) => updateMargins('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {units.map((unit) => (
                        <option key={unit.unit} value={unit.unit}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Options */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Advanced Crop Options</span>
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
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={cropSettings.preserveAspectRatio}
                        onChange={(e) => setCropSettings(prev => ({
                          ...prev,
                          preserveAspectRatio: e.target.checked
                        }))}
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Preserve Aspect Ratio</div>
                        <div className="text-sm text-gray-500">Maintain original proportions</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={cropSettings.removeBlankSpace}
                        onChange={(e) => setCropSettings(prev => ({
                          ...prev,
                          removeBlankSpace: e.target.checked
                        }))}
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Remove Blank Space</div>
                        <div className="text-sm text-gray-500">Eliminate empty areas automatically</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={cropSettings.applyToAllPages}
                        onChange={(e) => setCropSettings(prev => ({
                          ...prev,
                          applyToAllPages: e.target.checked
                        }))}
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Apply to All Pages</div>
                        <div className="text-sm text-gray-500">Use same settings for all pages</div>
                      </div>
                    </label>
                  </div>

                  {cropSettings.presetFormat === 'custom' && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Custom Dimensions</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Width</label>
                          <input
                            type="number"
                            value={cropSettings.customDimensions.width}
                            onChange={(e) => setCropSettings(prev => ({
                              ...prev,
                              customDimensions: {
                                ...prev.customDimensions,
                                width: parseInt(e.target.value) || 0
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Height</label>
                          <input
                            type="number"
                            value={cropSettings.customDimensions.height}
                            onChange={(e) => setCropSettings(prev => ({
                              ...prev,
                              customDimensions: {
                                ...prev.customDimensions,
                                height: parseInt(e.target.value) || 0
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Unit</label>
                          <select
                            value={cropSettings.customDimensions.unit}
                            onChange={(e) => setCropSettings(prev => ({
                              ...prev,
                              customDimensions: {
                                ...prev.customDimensions,
                                unit: e.target.value as CropSettings['customDimensions']['unit']
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            {units.map((unit) => (
                              <option key={unit.unit} value={unit.unit}>
                                {unit.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF Files to Crop</h3>
              <p className="text-sm text-gray-600">Upload PDF documents to resize and crop</p>
            </div>
            
            <div className="p-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50 hover:bg-green-100 transition-colors"
              >
                <Upload className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload PDF Files for Cropping
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
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
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
                <p className="text-sm text-gray-600">Files ready for cropping</p>
              </div>
              
              <div className="p-6 space-y-4">
                {pdfFiles.map((file, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-8 h-8 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          <p className="text-sm text-gray-600">
                            {file.totalPages} pages • {formatFileSize(file.size)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {file.dimensions.width} × {file.dimensions.height} px
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {file.pageFormat} format
                            </span>
                          </div>
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Preview */}
          {selectedMode && selectedMethod && pdfFiles.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
              <div className="flex items-start space-x-3">
                <Crop className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Crop Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mode:</span>
                      <div className="font-medium text-blue-600">{selectedMode.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Method:</span>
                      <div className="font-medium text-green-600">{selectedMethod.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Format:</span>
                      <div className="font-medium text-purple-600">{selectedPreset?.name || 'Custom'}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Files:</span>
                      <div className="font-medium text-orange-600">{pdfFiles.length} PDF(s)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Process Crop Button */}
          <div className="text-center mb-6">
            <button
              onClick={processCrop}
              disabled={isProcessing || pdfFiles.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Crop...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Crop PDF
                </>
              )}
            </button>
          </div>

          {/* Crop Results */}
          {cropResults.length > 0 && (
            <div className="space-y-4 mb-6">
              {cropResults.map((result, index) => (
                <div key={index} className={`rounded-xl p-6 border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {result.success ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      )}
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.success ? 'Crop Complete!' : 'Crop Failed'}
                        </h3>
                        <p className="text-sm text-gray-600">{result.fileName}</p>
                        {result.success && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {result.cropReduction}% size reduction
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {result.croppedDimensions.width} × {result.croppedDimensions.height}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {result.processingTime}s processing
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {result.success && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                  </div>
                  
                  {result.success && (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Pages</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {result.pagesProcessed}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Original Size</div>
                          <div className="text-lg font-semibold text-blue-600">
                            {result.originalDimensions.width} × {result.originalDimensions.height}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Cropped Size</div>
                          <div className="text-lg font-semibold text-green-600">
                            {result.croppedDimensions.width} × {result.croppedDimensions.height}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Reduction</div>
                          <div className="text-lg font-semibold text-orange-600">
                            {result.cropReduction}%
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">File Size</div>
                          <div className="text-lg font-semibold text-purple-600">
                            {formatFileSize(result.croppedSize)}
                          </div>
                        </div>
                      </div>
                      
                      {result.previewPages.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <h4 className="font-medium text-gray-900 mb-3">Page Previews:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.previewPages.map((page, idx) => (
                              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                                <div className="text-sm font-medium text-gray-900 mb-2">
                                  Page {page.pageNumber}
                                </div>
                                <div className="space-y-1 text-xs text-gray-600">
                                  <div>Original: {page.originalSize}</div>
                                  <div>Cropped: {page.croppedSize}</div>
                                  <div className="text-green-600 font-medium">
                                    {page.reductionPercentage}% smaller
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">✂️ Crop Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Precision crop controls</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple crop modes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Auto margin detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Preset paper formats</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Batch processing</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📐 Advanced Tools</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Maximize2 className="w-4 h-4 text-green-500" />
                  <span>Custom dimensions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Grid3X3 className="w-4 h-4 text-green-500" />
                  <span>Aspect ratio preservation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Move className="w-4 h-4 text-green-500" />
                  <span>Flexible positioning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span>Real-time preview</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span>Advanced options</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Cropping Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Square className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Choose Mode</h4>
                <p className="text-sm text-gray-600">Select crop mode and method</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Upload PDFs</h4>
                <p className="text-sm text-gray-600">Add your PDF documents</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crop className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Process Crop</h4>
                <p className="text-sm text-gray-600">Apply cropping settings</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your cropped documents</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

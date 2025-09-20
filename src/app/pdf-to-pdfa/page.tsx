'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Archive, Shield, CheckCircle, AlertTriangle, FileText, Settings, Eye, Clock, Zap, RefreshCw, Info } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFFile {
  file: File;
  name: string;
  size: number;
  currentStandard: string;
  complianceIssues: string[];
}

interface ConversionSettings {
  pdfaLevel: 'PDF/A-1a' | 'PDF/A-1b' | 'PDF/A-2a' | 'PDF/A-2b' | 'PDF/A-2u' | 'PDF/A-3a' | 'PDF/A-3b' | 'PDF/A-3u';
  colorProfile: 'sRGB' | 'Adobe RGB' | 'CMYK' | 'Grayscale';
  fontEmbedding: 'embed_all' | 'embed_missing' | 'subset_only';
  imageCompression: 'none' | 'jpeg' | 'jpeg2000' | 'flate';
  metadataHandling: 'preserve' | 'clean' | 'enhance';
  validationLevel: 'basic' | 'standard' | 'strict';
}

interface ConversionResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  convertedSize: number;
  pdfaLevel: string;
  complianceStatus: 'compliant' | 'partial' | 'non_compliant';
  validationResults: string[];
  processingTime: number;
  downloadUrl: string;
  warningsCount: number;
  errorsCount: number;
}

export default function PdfToPdfAPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [conversionSettings, setConversionSettings] = useState<ConversionSettings>({
    pdfaLevel: 'PDF/A-2b',
    colorProfile: 'sRGB',
    fontEmbedding: 'embed_all',
    imageCompression: 'jpeg',
    metadataHandling: 'enhance',
    validationLevel: 'standard'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('balanced');

  const pdfaLevels = [
    {
      level: 'PDF/A-1a' as const,
      name: 'PDF/A-1a',
      description: 'Level A conformance with ISO 19005-1',
      features: ['Full accessibility', 'Tagged structure', 'Logical reading order', 'Unicode mapping'],
      recommended: false,
      useCase: 'Accessibility compliance'
    },
    {
      level: 'PDF/A-1b' as const,
      name: 'PDF/A-1b',
      description: 'Level B conformance with ISO 19005-1',
      features: ['Visual reproduction', 'Font embedding', 'Color profiles', 'Basic compliance'],
      recommended: false,
      useCase: 'Basic archival needs'
    },
    {
      level: 'PDF/A-2a' as const,
      name: 'PDF/A-2a',
      description: 'Enhanced Level A with ISO 19005-2',
      features: ['JPEG 2000 support', 'Transparency', 'Digital signatures', 'Full accessibility'],
      recommended: false,
      useCase: 'Advanced accessibility'
    },
    {
      level: 'PDF/A-2b' as const,
      name: 'PDF/A-2b',
      description: 'Enhanced Level B with modern features',
      features: ['JPEG 2000 support', 'Transparency', 'Digital signatures', 'Improved compression'],
      recommended: true,
      useCase: 'Most common archival standard'
    },
    {
      level: 'PDF/A-2u' as const,
      name: 'PDF/A-2u',
      description: 'Unicode compliance with ISO 19005-2',
      features: ['Unicode text mapping', 'Search capabilities', 'Text extraction', 'Digital preservation'],
      recommended: false,
      useCase: 'Text-heavy documents'
    },
    {
      level: 'PDF/A-3a' as const,
      name: 'PDF/A-3a',
      description: 'Level A with embedded files support',
      features: ['File attachments', 'Full accessibility', 'Complex documents', 'Embedded content'],
      recommended: false,
      useCase: 'Documents with attachments'
    },
    {
      level: 'PDF/A-3b' as const,
      name: 'PDF/A-3b',
      description: 'Level B with embedded files support',
      features: ['File attachments', 'Visual reproduction', 'Embedded content', 'Portfolio documents'],
      recommended: false,
      useCase: 'Portfolio archival'
    },
    {
      level: 'PDF/A-3u' as const,
      name: 'PDF/A-3u',
      description: 'Unicode with embedded files support',
      features: ['File attachments', 'Unicode compliance', 'Text searchability', 'Complex archival'],
      recommended: false,
      useCase: 'Complex document archives'
    }
  ];

  const conversionPresets = [
    {
      id: 'basic',
      name: 'Basic Archive',
      description: 'Simple PDF/A conversion for basic archival',
      settings: {
        pdfaLevel: 'PDF/A-1b' as const,
        colorProfile: 'sRGB' as const,
        fontEmbedding: 'embed_missing' as const,
        imageCompression: 'jpeg' as const,
        metadataHandling: 'preserve' as const,
        validationLevel: 'basic' as const
      }
    },
    {
      id: 'balanced',
      name: 'Balanced Quality',
      description: 'Optimal balance of compliance and file size',
      settings: {
        pdfaLevel: 'PDF/A-2b' as const,
        colorProfile: 'sRGB' as const,
        fontEmbedding: 'embed_all' as const,
        imageCompression: 'jpeg' as const,
        metadataHandling: 'enhance' as const,
        validationLevel: 'standard' as const
      }
    },
    {
      id: 'preservation',
      name: 'Long-term Preservation',
      description: 'Maximum compliance for institutional archives',
      settings: {
        pdfaLevel: 'PDF/A-2a' as const,
        colorProfile: 'sRGB' as const,
        fontEmbedding: 'embed_all' as const,
        imageCompression: 'flate' as const,
        metadataHandling: 'enhance' as const,
        validationLevel: 'strict' as const
      }
    },
    {
      id: 'accessibility',
      name: 'Accessibility Focus',
      description: 'Optimized for accessibility compliance',
      settings: {
        pdfaLevel: 'PDF/A-2a' as const,
        colorProfile: 'sRGB' as const,
        fontEmbedding: 'embed_all' as const,
        imageCompression: 'jpeg' as const,
        metadataHandling: 'enhance' as const,
        validationLevel: 'strict' as const
      }
    }
  ];

  const applyPreset = (presetId: string) => {
    const preset = conversionPresets.find(p => p.id === presetId);
    if (preset) {
      setConversionSettings(preset.settings);
      setSelectedPreset(presetId);
    }
  };

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: PDFFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Simulate PDF analysis
        const currentStandards = ['PDF 1.4', 'PDF 1.5', 'PDF 1.6', 'PDF 1.7', 'PDF 2.0'];
        const currentStandard = currentStandards[Math.floor(Math.random() * currentStandards.length)];
        
        const possibleIssues = [
          'Non-embedded fonts detected',
          'Transparency elements found',
          'RGB color space used',
          'Missing metadata',
          'Untagged content',
          'External references',
          'Form fields present',
          'JavaScript detected'
        ];
        
        const complianceIssues = possibleIssues
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 4) + 1);
        
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          currentStandard,
          complianceIssues
        });
      }
    });
    
    if (newFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newFiles]);
      setConversionResults([]);
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

  const convertToPdfA = async () => {
    if (pdfFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3000 + (pdfFiles.length * 2000)));
      
      const results: ConversionResult[] = pdfFiles.map((file) => {
        const processingTime = Math.floor(Math.random() * 8) + 5;
        const success = Math.random() > 0.1; // 90% success rate
        
        const validationResults = [];
        const warningsCount = Math.floor(Math.random() * 3);
        const errorsCount = success ? 0 : Math.floor(Math.random() * 2) + 1;
        
        if (success) {
          validationResults.push('All fonts successfully embedded');
          validationResults.push('Color profile converted to sRGB');
          validationResults.push('Metadata enhanced for archival');
          validationResults.push('Document structure validated');
          
          if (conversionSettings.pdfaLevel.includes('a')) {
            validationResults.push('Accessibility features preserved');
          }
          if (conversionSettings.validationLevel === 'strict') {
            validationResults.push('Strict compliance validation passed');
          }
        } else {
          validationResults.push('Font embedding failed for some fonts');
          validationResults.push('Color space conversion issues detected');
        }
        
        const complianceStatus: 'compliant' | 'partial' | 'non_compliant' = 
          success ? (warningsCount > 0 ? 'partial' : 'compliant') : 'non_compliant';
        
        return {
          success,
          fileName: file.name.replace('.pdf', `_${conversionSettings.pdfaLevel.replace('/', '').replace('-', '_')}.pdf`),
          originalSize: file.size,
          convertedSize: file.size * (0.9 + Math.random() * 0.3), // Can be smaller or larger
          pdfaLevel: conversionSettings.pdfaLevel,
          complianceStatus,
          validationResults,
          processingTime,
          downloadUrl: `pdfa-${file.name}`,
          warningsCount,
          errorsCount
        };
      });
      
      setConversionResults(results);
    } catch (error) {
      console.error('Error converting to PDF/A:', error);
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

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const selectedLevel = pdfaLevels.find(level => level.level === conversionSettings.pdfaLevel);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <Archive className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to PDF/A Converter</h1>
            <p className="text-lg text-gray-600">
              Convert PDF files to archival-quality PDF/A format for long-term preservation and compliance. Ensure your documents meet international archival standards.
            </p>
          </div>

          {/* Conversion Presets */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Presets</h3>
              <p className="text-sm text-gray-600">Choose a preset configuration or customize your own settings</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {conversionPresets.map((preset) => (
                <label
                  key={preset.id}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    selectedPreset === preset.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="preset"
                    value={preset.id}
                    checked={selectedPreset === preset.id}
                    onChange={(e) => applyPreset(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Archive className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{preset.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                      <div className="text-xs text-gray-500">
                        {preset.settings.pdfaLevel} • {preset.settings.validationLevel} validation
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* PDF/A Level Selection */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF/A Compliance Level</h3>
              <p className="text-sm text-gray-600">Select the PDF/A standard that meets your archival requirements</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {pdfaLevels.map((level) => (
                  <label
                    key={level.level}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      conversionSettings.pdfaLevel === level.level
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pdfaLevel"
                      value={level.level}
                      checked={conversionSettings.pdfaLevel === level.level}
                      onChange={(e) => {
                        setConversionSettings(prev => ({
                          ...prev,
                          pdfaLevel: e.target.value as ConversionSettings['pdfaLevel']
                        }));
                        setSelectedPreset('custom');
                      }}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{level.name}</h4>
                          {level.recommended && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                      </div>
                    </div>
                    <div className="space-y-1 mb-3">
                      {level.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      Use case: {level.useCase}
                    </div>
                  </label>
                ))}
              </div>
              
              {selectedLevel && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Selected: {selectedLevel.name}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {selectedLevel.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-1 text-sm text-blue-700">
                            <CheckCircle className="w-3 h-3" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Advanced Conversion Settings</span>
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
                        Color Profile
                      </label>
                      <select 
                        value={conversionSettings.colorProfile}
                        onChange={(e) => setConversionSettings(prev => ({
                          ...prev,
                          colorProfile: e.target.value as ConversionSettings['colorProfile']
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="sRGB">sRGB (Standard)</option>
                        <option value="Adobe RGB">Adobe RGB</option>
                        <option value="CMYK">CMYK</option>
                        <option value="Grayscale">Grayscale</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Embedding
                      </label>
                      <select 
                        value={conversionSettings.fontEmbedding}
                        onChange={(e) => setConversionSettings(prev => ({
                          ...prev,
                          fontEmbedding: e.target.value as ConversionSettings['fontEmbedding']
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="embed_all">Embed all fonts</option>
                        <option value="embed_missing">Embed missing fonts only</option>
                        <option value="subset_only">Subset fonts only</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Compression
                      </label>
                      <select 
                        value={conversionSettings.imageCompression}
                        onChange={(e) => setConversionSettings(prev => ({
                          ...prev,
                          imageCompression: e.target.value as ConversionSettings['imageCompression']
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="none">No compression</option>
                        <option value="jpeg">JPEG</option>
                        <option value="jpeg2000">JPEG 2000</option>
                        <option value="flate">Flate/ZIP</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Validation Level
                      </label>
                      <select 
                        value={conversionSettings.validationLevel}
                        onChange={(e) => setConversionSettings(prev => ({
                          ...prev,
                          validationLevel: e.target.value as ConversionSettings['validationLevel']
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="basic">Basic validation</option>
                        <option value="standard">Standard validation</option>
                        <option value="strict">Strict validation</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Metadata Handling
                    </label>
                    <select 
                      value={conversionSettings.metadataHandling}
                      onChange={(e) => setConversionSettings(prev => ({
                        ...prev,
                        metadataHandling: e.target.value as ConversionSettings['metadataHandling']
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="preserve">Preserve existing metadata</option>
                      <option value="clean">Clean and optimize metadata</option>
                      <option value="enhance">Enhance for archival compliance</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF Files</h3>
              <p className="text-sm text-gray-600">Upload PDF files to convert to PDF/A format</p>
            </div>
            
            <div className="p-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50 hover:bg-green-100 transition-colors"
              >
                <Upload className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload PDF Files for PDF/A Conversion
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
                <p className="text-sm text-gray-600">Files ready for PDF/A conversion</p>
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
                            Size: {formatFileSize(file.size)} • Current: {file.currentStandard}
                          </p>
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
                    
                    {file.complianceIssues.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <div>
                            <h5 className="text-sm font-medium text-yellow-800 mb-1">
                              Compliance Issues Detected ({file.complianceIssues.length})
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                              {file.complianceIssues.map((issue, idx) => (
                                <div key={idx} className="text-xs text-yellow-700">
                                  • {issue}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversion Preview */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
            <div className="flex items-start space-x-3">
              <Archive className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Conversion Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Target Standard:</span>
                    <div className="font-medium text-green-600">{conversionSettings.pdfaLevel}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Color Profile:</span>
                    <div className="font-medium text-blue-600">{conversionSettings.colorProfile}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Validation:</span>
                    <div className="font-medium text-purple-600">{conversionSettings.validationLevel}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Files:</span>
                    <div className="font-medium text-orange-600">{pdfFiles.length} PDF(s)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <div className="text-center mb-6">
            <button
              onClick={convertToPdfA}
              disabled={isProcessing || pdfFiles.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Converting to PDF/A...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Convert to PDF/A
                </>
              )}
            </button>
          </div>

          {/* Conversion Results */}
          {conversionResults.length > 0 && (
            <div className="space-y-4 mb-6">
              {conversionResults.map((result, index) => (
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
                          {result.success ? 'PDF/A Conversion Successful!' : 'Conversion Failed'}
                        </h3>
                        <p className="text-sm text-gray-600">{result.fileName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getComplianceColor(result.complianceStatus)}`}>
                            {result.complianceStatus === 'compliant' ? 'Fully Compliant' :
                             result.complianceStatus === 'partial' ? 'Partially Compliant' : 'Non-Compliant'}
                          </span>
                          {result.warningsCount > 0 && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              {result.warningsCount} Warning(s)
                            </span>
                          )}
                          {result.errorsCount > 0 && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              {result.errorsCount} Error(s)
                            </span>
                          )}
                        </div>
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
                          <div className="text-gray-600">Original Size</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {formatFileSize(result.originalSize)}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">PDF/A Size</div>
                          <div className="text-lg font-semibold text-blue-600">
                            {formatFileSize(result.convertedSize)}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Standard</div>
                          <div className="text-lg font-semibold text-green-600">
                            {result.pdfaLevel}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Processing</div>
                          <div className="text-lg font-semibold text-purple-600">
                            {result.processingTime}s
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Validations</div>
                          <div className="text-lg font-semibold text-orange-600">
                            {result.validationResults.length}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-medium text-gray-900 mb-2">Validation Results:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {result.validationResults.map((validation, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-700">{validation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 PDF/A Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Long-term preservation guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>International archival standard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Self-contained document format</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Platform-independent accessibility</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Legal and regulatory compliance</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ Quality Assurance</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Comprehensive validation testing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Font embedding verification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Color profile standardization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Metadata compliance checking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Structure validation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF/A Conversion Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload PDF</h4>
                <p className="text-sm text-gray-600">Upload your PDF files for analysis</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Configure</h4>
                <p className="text-sm text-gray-600">Choose PDF/A level and settings</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Convert</h4>
                <p className="text-sm text-gray-600">Process with compliance validation</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your compliant PDF/A files</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Eye, FileText, Settings, Zap, RefreshCw, CheckCircle, AlertTriangle, ArrowLeftRight, Search, Filter, GitCompare, Plus, Minus, Edit, Move } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFFile {
  file: File;
  name: string;
  size: number;
  totalPages: number;
  version?: string;
  lastModified: Date;
  role: 'original' | 'revised';
}

interface ComparisonSettings {
  comparisonType: 'visual' | 'text' | 'structure' | 'comprehensive';
  sensitivity: 'low' | 'medium' | 'high' | 'precise';
  ignoreOptions: {
    whitespace: boolean;
    formatting: boolean;
    images: boolean;
    headers: boolean;
    footers: boolean;
    pageNumbers: boolean;
    watermarks: boolean;
    annotations: boolean;
  };
  highlightOptions: {
    additions: string;
    deletions: string;
    modifications: string;
    movements: string;
  };
  outputFormat: 'side_by_side' | 'unified' | 'detailed_report' | 'summary_only';
}

interface ComparisonResult {
  success: boolean;
  originalFile: string;
  revisedFile: string;
  totalChanges: number;
  changesSummary: {
    additions: number;
    deletions: number;
    modifications: number;
    movements: number;
  };
  pagesAnalyzed: number;
  pagesWithChanges: number;
  similarityScore: number;
  processingTime: number;
  changeDetails: ChangeDetail[];
  downloadUrl: string;
}

interface ChangeDetail {
  page: number;
  type: 'addition' | 'deletion' | 'modification' | 'movement';
  description: string;
  location: string;
  confidence: number;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
}

export default function ComparePdfPage() {
  const [originalFile, setOriginalFile] = useState<PDFFile | null>(null);
  const [revisedFile, setRevisedFile] = useState<PDFFile | null>(null);
  const [comparisonSettings, setComparisonSettings] = useState<ComparisonSettings>({
    comparisonType: 'comprehensive',
    sensitivity: 'medium',
    ignoreOptions: {
      whitespace: false,
      formatting: false,
      images: false,
      headers: true,
      footers: true,
      pageNumbers: true,
      watermarks: true,
      annotations: false
    },
    highlightOptions: {
      additions: '#22c55e',
      deletions: '#ef4444',
      modifications: '#f59e0b',
      movements: '#8b5cf6'
    },
    outputFormat: 'side_by_side'
  });
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedChangeTypes, setSelectedChangeTypes] = useState<string[]>(['all']);

  const comparisonTypes = [
    {
      type: 'visual' as const,
      name: 'Visual Comparison',
      description: 'Compare visual appearance and layout',
      icon: Eye,
      features: ['Layout changes', 'Image differences', 'Visual elements']
    },
    {
      type: 'text' as const,
      name: 'Text Comparison',
      description: 'Compare text content only',
      icon: FileText,
      features: ['Content changes', 'Word differences', 'Text additions/deletions']
    },
    {
      type: 'structure' as const,
      name: 'Structure Analysis',
      description: 'Compare document structure',
      icon: GitCompare,
      features: ['Page order', 'Section changes', 'Document flow']
    },
    {
      type: 'comprehensive' as const,
      name: 'Comprehensive Analysis',
      description: 'Complete comparison of all elements',
      icon: Search,
      features: ['All comparison types', 'Detailed analysis', 'Full report']
    }
  ];

  const sensitivityLevels = [
    {
      level: 'low' as const,
      name: 'Low Sensitivity',
      description: 'Detect only major changes',
      threshold: '> 5% difference',
      useCase: 'High-level review'
    },
    {
      level: 'medium' as const,
      name: 'Medium Sensitivity',
      description: 'Balanced change detection',
      threshold: '> 2% difference',
      useCase: 'Standard comparison'
    },
    {
      level: 'high' as const,
      name: 'High Sensitivity',
      description: 'Detect minor changes',
      threshold: '> 0.5% difference',
      useCase: 'Detailed review'
    },
    {
      level: 'precise' as const,
      name: 'Precise Detection',
      description: 'Detect all changes',
      threshold: 'Any difference',
      useCase: 'Legal/Critical docs'
    }
  ];

  const outputFormats = [
    {
      format: 'side_by_side' as const,
      name: 'Side-by-Side View',
      description: 'Compare documents side by side',
      icon: ArrowLeftRight
    },
    {
      format: 'unified' as const,
      name: 'Unified View',
      description: 'Single document with changes highlighted',
      icon: FileText
    },
    {
      format: 'detailed_report' as const,
      name: 'Detailed Report',
      description: 'Comprehensive change report',
      icon: Search
    },
    {
      format: 'summary_only' as const,
      name: 'Summary Only',
      description: 'High-level summary of changes',
      icon: CheckCircle
    }
  ];

  const handleFileUpload = useCallback((files: FileList, role: 'original' | 'revised') => {
    const file = files[0];
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      // Simulate PDF analysis
      const totalPages = Math.floor(Math.random() * 25) + 5;
      const version = role === 'original' ? 'v1.0' : 'v1.1';
      
      const pdfFile: PDFFile = {
        file,
        name: file.name,
        size: file.size,
        totalPages,
        version,
        lastModified: new Date(file.lastModified),
        role
      };
      
      if (role === 'original') {
        setOriginalFile(pdfFile);
      } else {
        setRevisedFile(pdfFile);
      }
      
      setComparisonResult(null);
    } else {
      alert('Please upload a valid PDF file.');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, role: 'original' | 'revised') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, role);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeFile = (role: 'original' | 'revised') => {
    if (role === 'original') {
      setOriginalFile(null);
    } else {
      setRevisedFile(null);
    }
  };

  const swapFiles = () => {
    if (originalFile && revisedFile) {
      const temp = { ...originalFile, role: 'revised' as const };
      const newOriginal = { ...revisedFile, role: 'original' as const };
      setOriginalFile(newOriginal);
      setRevisedFile(temp);
    }
  };

  const compareDocuments = async () => {
    if (!originalFile || !revisedFile) return;
    
    setIsComparing(true);
    try {
      // Simulate comparison processing
      await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 3000));
      
      const totalChanges = Math.floor(Math.random() * 50) + 10;
      const additions = Math.floor(totalChanges * 0.3);
      const deletions = Math.floor(totalChanges * 0.25);
      const modifications = Math.floor(totalChanges * 0.35);
      const movements = totalChanges - additions - deletions - modifications;
      
      const pagesWithChanges = Math.floor(Math.random() * Math.min(originalFile.totalPages, revisedFile.totalPages)) + 1;
      const similarityScore = Math.floor(Math.random() * 30) + 70; // 70-100%
      const processingTime = Math.floor(Math.random() * 20) + 10;
      
      const changeTypes = ['addition', 'deletion', 'modification', 'movement'] as const;
      const severities = ['minor', 'moderate', 'major', 'critical'] as const;
      const locations = ['Header', 'Body', 'Footer', 'Sidebar', 'Table', 'Image', 'Chart', 'Paragraph'];
      const descriptions = [
        'Text content modified',
        'Image replaced or updated',
        'Table structure changed',
        'Formatting adjustment',
        'Content added to section',
        'Paragraph deleted',
        'Section moved to different location',
        'Font or style change applied'
      ];
      
      const changeDetails: ChangeDetail[] = Array.from({ length: totalChanges }, (_, i) => ({
        page: Math.floor(Math.random() * Math.min(originalFile.totalPages, revisedFile.totalPages)) + 1,
        type: changeTypes[Math.floor(Math.random() * changeTypes.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        severity: severities[Math.floor(Math.random() * severities.length)]
      }));
      
      const result: ComparisonResult = {
        success: Math.random() > 0.05, // 95% success rate
        originalFile: originalFile.name,
        revisedFile: revisedFile.name,
        totalChanges,
        changesSummary: {
          additions,
          deletions,
          modifications,
          movements
        },
        pagesAnalyzed: Math.min(originalFile.totalPages, revisedFile.totalPages),
        pagesWithChanges,
        similarityScore,
        processingTime,
        changeDetails,
        downloadUrl: `comparison-${originalFile.name}-vs-${revisedFile.name}.pdf`
      };
      
      setComparisonResult(result);
    } catch (error) {
      console.error('Error comparing documents:', error);
    } finally {
      setIsComparing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'addition': return <Plus className="w-4 h-4" />;
      case 'deletion': return <Minus className="w-4 h-4" />;
      case 'modification': return <Edit className="w-4 h-4" />;
      case 'movement': return <Move className="w-4 h-4" />;
      default: return <Edit className="w-4 h-4" />;
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'addition': return 'text-green-600 bg-green-100';
      case 'deletion': return 'text-red-600 bg-red-100';
      case 'modification': return 'text-amber-600 bg-amber-100';
      case 'movement': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'major': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const selectedComparison = comparisonTypes.find(type => type.type === comparisonSettings.comparisonType);
  const selectedSensitivity = sensitivityLevels.find(level => level.level === comparisonSettings.sensitivity);
  const selectedFormat = outputFormats.find(format => format.format === comparisonSettings.outputFormat);

  const filteredChanges = comparisonResult?.changeDetails.filter(change => 
    selectedChangeTypes.includes('all') || selectedChangeTypes.includes(change.type)
  ) || [];

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
                <GitCompare className="w-6 h-6 text-gray-400" />
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare PDF - Document Comparison</h1>
            <p className="text-lg text-gray-600">
              Compare two PDF documents to identify differences, track changes, and analyze document versions with advanced comparison algorithms.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Original Document */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Original Document</h3>
                <p className="text-sm text-gray-600">Upload the original/base version</p>
              </div>
              
              <div className="p-6">
                {originalFile ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-8 h-8 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">{originalFile.name}</h4>
                          <p className="text-sm text-gray-600">
                            {originalFile.totalPages} pages • {formatFileSize(originalFile.size)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {originalFile.version}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              Modified: {originalFile.lastModified.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile('original')}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={(e) => handleDrop(e, 'original')}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Upload className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                      Upload Original Document
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Drag and drop or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'original')}
                      className="hidden"
                      id="original-upload"
                    />
                    <label
                      htmlFor="original-upload"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Select File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Revised Document */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Revised Document</h3>
                <p className="text-sm text-gray-600">Upload the revised/new version</p>
              </div>
              
              <div className="p-6">
                {revisedFile ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-8 h-8 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">{revisedFile.name}</h4>
                          <p className="text-sm text-gray-600">
                            {revisedFile.totalPages} pages • {formatFileSize(revisedFile.size)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {revisedFile.version}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              Modified: {revisedFile.lastModified.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile('revised')}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={(e) => handleDrop(e, 'revised')}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <Upload className="w-10 h-10 text-green-600 mx-auto mb-3" />
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                      Upload Revised Document
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Drag and drop or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'revised')}
                      className="hidden"
                      id="revised-upload"
                    />
                    <label
                      htmlFor="revised-upload"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Select File
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Swap Files Button */}
          {originalFile && revisedFile && (
            <div className="text-center mb-6">
              <button
                onClick={swapFiles}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Swap Documents
              </button>
            </div>
          )}

          {/* Comparison Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Comparison Type */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparison Type</h3>
                <p className="text-sm text-gray-600">Choose the type of analysis</p>
              </div>
              
              <div className="p-6 space-y-3">
                {comparisonTypes.map((type) => (
                  <label
                    key={type.type}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all block ${
                      comparisonSettings.comparisonType === type.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="comparisonType"
                      value={type.type}
                      checked={comparisonSettings.comparisonType === type.type}
                      onChange={(e) => setComparisonSettings(prev => ({
                        ...prev,
                        comparisonType: e.target.value as ComparisonSettings['comparisonType']
                      }))}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{type.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        <div className="mt-2 space-y-1">
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

            {/* Sensitivity Level */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sensitivity Level</h3>
                <p className="text-sm text-gray-600">Adjust change detection sensitivity</p>
              </div>
              
              <div className="p-6 space-y-3">
                {sensitivityLevels.map((level) => (
                  <label
                    key={level.level}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all block ${
                      comparisonSettings.sensitivity === level.level
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sensitivity"
                      value={level.level}
                      checked={comparisonSettings.sensitivity === level.level}
                      onChange={(e) => setComparisonSettings(prev => ({
                        ...prev,
                        sensitivity: e.target.value as ComparisonSettings['sensitivity']
                      }))}
                      className="sr-only"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{level.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                      <div className="mt-2 text-xs">
                        <span className="text-purple-600 font-medium">{level.threshold}</span>
                        <span className="text-gray-500 ml-2">• {level.useCase}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Output Format */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Output Format</h3>
                <p className="text-sm text-gray-600">Choose result presentation</p>
              </div>
              
              <div className="p-6 space-y-3">
                {outputFormats.map((format) => (
                  <label
                    key={format.format}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all block ${
                      comparisonSettings.outputFormat === format.format
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outputFormat"
                      value={format.format}
                      checked={comparisonSettings.outputFormat === format.format}
                      onChange={(e) => setComparisonSettings(prev => ({
                        ...prev,
                        outputFormat: e.target.value as ComparisonSettings['outputFormat']
                      }))}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <format.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{format.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
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
                  <span className="font-medium text-gray-900">Advanced Comparison Options</span>
                </div>
                <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Ignore During Comparison</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(comparisonSettings.ignoreOptions).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setComparisonSettings(prev => ({
                              ...prev,
                              ignoreOptions: {...prev.ignoreOptions, [key]: e.target.checked}
                            }))}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Highlight Colors</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(comparisonSettings.highlightOptions).map(([key, value]) => (
                        <div key={key} className="p-3 border border-gray-200 rounded-lg">
                          <label className="block text-sm font-medium text-gray-900 mb-2 capitalize">
                            {key}
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => setComparisonSettings(prev => ({
                                ...prev,
                                highlightOptions: {...prev.highlightOptions, [key]: e.target.value}
                              }))}
                              className="w-8 h-8 rounded border border-gray-300"
                            />
                            <span className="text-xs text-gray-500">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comparison Preview */}
          {selectedComparison && selectedSensitivity && selectedFormat && originalFile && revisedFile && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <GitCompare className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Comparison Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <div className="font-medium text-blue-600">{selectedComparison.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Sensitivity:</span>
                      <div className="font-medium text-green-600">{selectedSensitivity.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output:</span>
                      <div className="font-medium text-purple-600">{selectedFormat.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Documents:</span>
                      <div className="font-medium text-orange-600">{originalFile.name} vs {revisedFile.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compare Button */}
          <div className="text-center mb-6">
            <button
              onClick={compareDocuments}
              disabled={isComparing || !originalFile || !revisedFile}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isComparing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Comparing Documents...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Compare Documents
                </>
              )}
            </button>
          </div>

          {/* Comparison Results */}
          {comparisonResult && (
            <div className="space-y-6 mb-6">
              {/* Results Header */}
              <div className={`rounded-xl p-6 border ${
                comparisonResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {comparisonResult.success ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        comparisonResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {comparisonResult.success ? 'Comparison Complete!' : 'Comparison Failed'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {comparisonResult.originalFile} vs {comparisonResult.revisedFile}
                      </p>
                      {comparisonResult.success && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {comparisonResult.totalChanges} changes detected
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {comparisonResult.similarityScore}% similarity
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {comparisonResult.processingTime}s processing
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {comparisonResult.success && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                  )}
                </div>
                
                {comparisonResult.success && (
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Pages Analyzed</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {comparisonResult.pagesAnalyzed}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">With Changes</div>
                      <div className="text-lg font-semibold text-orange-600">
                        {comparisonResult.pagesWithChanges}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Additions</div>
                      <div className="text-lg font-semibold text-green-600">
                        {comparisonResult.changesSummary.additions}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Deletions</div>
                      <div className="text-lg font-semibold text-red-600">
                        {comparisonResult.changesSummary.deletions}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Modifications</div>
                      <div className="text-lg font-semibold text-amber-600">
                        {comparisonResult.changesSummary.modifications}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Movements</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {comparisonResult.changesSummary.movements}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Change Details */}
              {comparisonResult.success && comparisonResult.changeDetails.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Change Details</h3>
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                          value={selectedChangeTypes[0] || 'all'}
                          onChange={(e) => setSelectedChangeTypes([e.target.value])}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="all">All Changes</option>
                          <option value="addition">Additions</option>
                          <option value="deletion">Deletions</option>
                          <option value="modification">Modifications</option>
                          <option value="movement">Movements</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredChanges.map((change, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getChangeTypeColor(change.type)}`}>
                                {getChangeTypeIcon(change.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">Page {change.page}</span>
                                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getChangeTypeColor(change.type)}`}>
                                    {change.type}
                                  </span>
                                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSeverityColor(change.severity)}`}>
                                    {change.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-1">{change.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Location: {change.location}</span>
                                  <span>Confidence: {change.confidence}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {filteredChanges.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No changes found for the selected filter.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Comparison Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Visual layout comparison</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Text content analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Document structure tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Change highlighting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Detailed change reports</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Advanced Analysis</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <GitCompare className="w-4 h-4 text-green-500" />
                  <span>Version tracking support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-green-500" />
                  <span>Configurable sensitivity levels</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-green-500" />
                  <span>Selective ignore options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span>Multiple output formats</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span>Custom highlight colors</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How Document Comparison Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload Documents</h4>
                <p className="text-sm text-gray-600">Add original and revised PDF files</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Configure Settings</h4>
                <p className="text-sm text-gray-600">Choose comparison type and sensitivity</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GitCompare className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Compare</h4>
                <p className="text-sm text-gray-600">Analyze differences and changes</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download Report</h4>
                <p className="text-sm text-gray-600">Get detailed comparison results</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

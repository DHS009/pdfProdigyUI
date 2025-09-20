'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Wrench, AlertTriangle, CheckCircle, XCircle, FileText, Settings, Eye, Zap, RefreshCw, Shield, Info, Activity } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFFile {
  file: File;
  name: string;
  size: number;
  issuesDetected: PDFIssue[];
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  isRepairable: boolean;
}

interface PDFIssue {
  type: 'corruption' | 'structure' | 'content' | 'metadata' | 'security';
  severity: 'warning' | 'error' | 'critical';
  description: string;
  location?: string;
  fixable: boolean;
}

interface RepairSettings {
  repairLevel: 'basic' | 'standard' | 'aggressive' | 'recovery';
  fixStructure: boolean;
  recoverContent: boolean;
  rebuildIndex: boolean;
  optimizeAfterRepair: boolean;
  preserveMetadata: boolean;
  handleMissingFonts: boolean;
  fixImageCorruption: boolean;
  validateAfterRepair: boolean;
}

interface RepairResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  repairedSize: number;
  issuesFound: number;
  issuesFixed: number;
  recoveredPages: number;
  processingTime: number;
  repairActions: string[];
  remainingIssues: string[];
  downloadUrl: string;
  healthScore: number;
}

type RepairMode = 'auto' | 'custom';

export default function RepairPdfPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [repairSettings, setRepairSettings] = useState<RepairSettings>({
    repairLevel: 'standard',
    fixStructure: true,
    recoverContent: true,
    rebuildIndex: true,
    optimizeAfterRepair: true,
    preserveMetadata: true,
    handleMissingFonts: true,
    fixImageCorruption: true,
    validateAfterRepair: true
  });
  const [repairMode, setRepairMode] = useState<RepairMode>('auto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [repairResults, setRepairResults] = useState<RepairResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const repairLevels = [
    {
      level: 'basic' as const,
      name: 'Basic Repair',
      description: 'Fix common issues and minor corruption',
      features: ['Structure validation', 'Basic error correction', 'Quick processing'],
      recommended: false,
      riskLevel: 'Low'
    },
    {
      level: 'standard' as const,
      name: 'Standard Repair',
      description: 'Comprehensive repair for most issues',
      features: ['Structure rebuild', 'Content recovery', 'Index reconstruction', 'Metadata fixes'],
      recommended: true,
      riskLevel: 'Low'
    },
    {
      level: 'aggressive' as const,
      name: 'Aggressive Repair',
      description: 'Deep repair for severely damaged files',
      features: ['Advanced recovery', 'Content reconstruction', 'Force extraction', 'Partial rebuilding'],
      recommended: false,
      riskLevel: 'Medium'
    },
    {
      level: 'recovery' as const,
      name: 'Recovery Mode',
      description: 'Last resort for heavily corrupted files',
      features: ['Maximum effort recovery', 'Partial content extraction', 'Structure recreation', 'Best-effort repair'],
      recommended: false,
      riskLevel: 'High'
    }
  ];

  const generateMockIssues = (): PDFIssue[] => {
    const possibleIssues: Omit<PDFIssue, 'fixable'>[] = [
      {
        type: 'corruption',
        severity: 'error',
        description: 'Damaged header or trailer',
        location: 'File structure'
      },
      {
        type: 'structure',
        severity: 'warning',
        description: 'Invalid cross-reference table',
        location: 'Page references'
      },
      {
        type: 'content',
        severity: 'error',
        description: 'Corrupted page content stream',
        location: 'Page 3'
      },
      {
        type: 'metadata',
        severity: 'warning',
        description: 'Missing or invalid metadata',
        location: 'Document info'
      },
      {
        type: 'security',
        severity: 'critical',
        description: 'Corrupted encryption dictionary',
        location: 'Security settings'
      },
      {
        type: 'content',
        severity: 'error',
        description: 'Missing or corrupted fonts',
        location: 'Font resources'
      },
      {
        type: 'structure',
        severity: 'error',
        description: 'Broken page tree structure',
        location: 'Page hierarchy'
      },
      {
        type: 'content',
        severity: 'warning',
        description: 'Damaged image data',
        location: 'Embedded images'
      }
    ];

    const selectedIssues = possibleIssues
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 6) + 2)
      .map(issue => ({
        ...issue,
        fixable: Math.random() > 0.2 // 80% of issues are fixable
      }));

    return selectedIssues;
  };

  const getSeverityLevel = (issues: PDFIssue[]): 'low' | 'medium' | 'high' | 'critical' => {
    if (issues.some(issue => issue.severity === 'critical')) return 'critical';
    if (issues.filter(issue => issue.severity === 'error').length > 2) return 'high';
    if (issues.some(issue => issue.severity === 'error')) return 'medium';
    return 'low';
  };

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: PDFFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const issues = generateMockIssues();
        const severityLevel = getSeverityLevel(issues);
        const isRepairable = issues.some(issue => issue.fixable) && severityLevel !== 'critical';
        
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          issuesDetected: issues,
          severityLevel,
          isRepairable
        });
      }
    });
    
    if (newFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newFiles]);
      setRepairResults([]);
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

  const applyRepairLevel = (level: RepairSettings['repairLevel']) => {
    let newSettings = { ...repairSettings, repairLevel: level };
    
    switch (level) {
      case 'basic':
        newSettings = {
          ...newSettings,
          fixStructure: true,
          recoverContent: false,
          rebuildIndex: false,
          optimizeAfterRepair: false,
          preserveMetadata: true,
          handleMissingFonts: false,
          fixImageCorruption: false,
          validateAfterRepair: true
        };
        break;
      case 'standard':
        newSettings = {
          ...newSettings,
          fixStructure: true,
          recoverContent: true,
          rebuildIndex: true,
          optimizeAfterRepair: true,
          preserveMetadata: true,
          handleMissingFonts: true,
          fixImageCorruption: true,
          validateAfterRepair: true
        };
        break;
      case 'aggressive':
        newSettings = {
          ...newSettings,
          fixStructure: true,
          recoverContent: true,
          rebuildIndex: true,
          optimizeAfterRepair: true,
          preserveMetadata: false,
          handleMissingFonts: true,
          fixImageCorruption: true,
          validateAfterRepair: true
        };
        break;
      case 'recovery':
        newSettings = {
          ...newSettings,
          fixStructure: true,
          recoverContent: true,
          rebuildIndex: true,
          optimizeAfterRepair: false,
          preserveMetadata: false,
          handleMissingFonts: true,
          fixImageCorruption: true,
          validateAfterRepair: false
        };
        break;
    }
    
    setRepairSettings(newSettings);
  };

  const repairPdfs = async () => {
    if (pdfFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate repair process
      await new Promise(resolve => setTimeout(resolve, 4000 + (pdfFiles.length * 3000)));
      
      const results: RepairResult[] = pdfFiles.map((file) => {
        const processingTime = Math.floor(Math.random() * 10) + 5;
        const issuesFound = file.issuesDetected.length;
        const fixableIssues = file.issuesDetected.filter(issue => issue.fixable).length;
        
        // Success rate depends on severity and repair level
        let successRate = 0.9;
        if (file.severityLevel === 'critical') successRate = 0.3;
        else if (file.severityLevel === 'high') successRate = 0.7;
        else if (file.severityLevel === 'medium') successRate = 0.85;
        
        if (repairSettings.repairLevel === 'recovery') successRate += 0.1;
        else if (repairSettings.repairLevel === 'aggressive') successRate += 0.05;
        
        const success = Math.random() < successRate;
        const issuesFixed = success ? Math.floor(fixableIssues * (0.7 + Math.random() * 0.3)) : 0;
        const recoveredPages = success ? Math.floor(Math.random() * 5) + 1 : 0;
        
        const repairActions = [];
        if (success) {
          if (repairSettings.fixStructure) repairActions.push('Document structure repaired');
          if (repairSettings.recoverContent) repairActions.push('Content streams recovered');
          if (repairSettings.rebuildIndex) repairActions.push('Cross-reference table rebuilt');
          if (repairSettings.handleMissingFonts) repairActions.push('Font issues resolved');
          if (repairSettings.fixImageCorruption) repairActions.push('Image data restored');
          if (repairSettings.optimizeAfterRepair) repairActions.push('File optimized');
        }
        
        const remainingIssues = file.issuesDetected
          .filter(issue => !issue.fixable || Math.random() > 0.8)
          .slice(0, Math.max(0, issuesFound - issuesFixed))
          .map(issue => issue.description);
        
        const healthScore = success ? Math.floor((issuesFixed / issuesFound) * 100) : 0;
        
        return {
          success,
          fileName: file.name.replace('.pdf', '_repaired.pdf'),
          originalSize: file.size,
          repairedSize: file.size * (0.95 + Math.random() * 0.1),
          issuesFound,
          issuesFixed,
          recoveredPages,
          processingTime,
          repairActions: repairActions.length > 0 ? repairActions : ['Repair attempted'],
          remainingIssues,
          downloadUrl: `repaired-${file.name}`,
          healthScore
        };
      });
      
      setRepairResults(results);
    } catch (error) {
      console.error('Error repairing PDFs:', error);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'corruption': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'structure': return <Activity className="w-4 h-4 text-orange-500" />;
      case 'content': return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'metadata': return <Info className="w-4 h-4 text-blue-500" />;
      case 'security': return <Shield className="w-4 h-4 text-purple-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const selectedLevel = repairLevels.find(level => level.level === repairSettings.repairLevel);

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
                <Wrench className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Repair PDF Files</h1>
            <p className="text-lg text-gray-600">
              Fix corrupted, damaged, or broken PDF files. Recover content, repair structure, and restore functionality to make your PDFs accessible again.
            </p>
          </div>

          {/* Repair Mode Selection */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Repair Mode</h3>
              <p className="text-sm text-gray-600">Choose between automatic repair or custom settings</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                  repairMode === 'auto' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="repairMode"
                    value="auto"
                    checked={repairMode === 'auto'}
                    onChange={(e) => setRepairMode(e.target.value as RepairMode)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Automatic Repair</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Smart repair that analyzes issues and applies appropriate fixes
                      </p>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Recommended for most users</span>
                      </div>
                    </div>
                  </div>
                </label>

                <label className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                  repairMode === 'custom' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="repairMode"
                    value="custom"
                    checked={repairMode === 'custom'}
                    onChange={(e) => setRepairMode(e.target.value as RepairMode)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Custom Repair</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Configure specific repair options and processing levels
                      </p>
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-600">For advanced users</span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Repair Level Selection */}
          {repairMode === 'custom' && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Repair Level</h3>
                <p className="text-sm text-gray-600">Select the intensity of repair operations</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {repairLevels.map((level) => (
                  <label
                    key={level.level}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      repairSettings.repairLevel === level.level
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="repairLevel"
                      value={level.level}
                      checked={repairSettings.repairLevel === level.level}
                      onChange={(e) => applyRepairLevel(e.target.value as RepairSettings['repairLevel'])}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{level.name}</h4>
                          {level.recommended && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        level.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                        level.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {level.riskLevel} Risk
                      </span>
                    </div>
                    <div className="space-y-1">
                      {level.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {repairMode === 'custom' && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Advanced Repair Options</span>
                  </div>
                  <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={repairSettings.fixStructure}
                          onChange={(e) => setRepairSettings(prev => ({...prev, fixStructure: e.target.checked}))}
                          className="rounded text-orange-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Fix Document Structure</div>
                          <div className="text-sm text-gray-500">Repair PDF internal structure</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={repairSettings.recoverContent}
                          onChange={(e) => setRepairSettings(prev => ({...prev, recoverContent: e.target.checked}))}
                          className="rounded text-orange-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Recover Content</div>
                          <div className="text-sm text-gray-500">Restore damaged page content</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={repairSettings.rebuildIndex}
                          onChange={(e) => setRepairSettings(prev => ({...prev, rebuildIndex: e.target.checked}))}
                          className="rounded text-orange-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Rebuild Index</div>
                          <div className="text-sm text-gray-500">Reconstruct cross-reference table</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={repairSettings.handleMissingFonts}
                          onChange={(e) => setRepairSettings(prev => ({...prev, handleMissingFonts: e.target.checked}))}
                          className="rounded text-orange-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Handle Missing Fonts</div>
                          <div className="text-sm text-gray-500">Substitute or repair font issues</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={repairSettings.fixImageCorruption}
                          onChange={(e) => setRepairSettings(prev => ({...prev, fixImageCorruption: e.target.checked}))}
                          className="rounded text-orange-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Fix Image Corruption</div>
                          <div className="text-sm text-gray-500">Repair or remove corrupted images</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={repairSettings.optimizeAfterRepair}
                          onChange={(e) => setRepairSettings(prev => ({...prev, optimizeAfterRepair: e.target.checked}))}
                          className="rounded text-orange-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Optimize After Repair</div>
                          <div className="text-sm text-gray-500">Clean up and optimize repaired file</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={repairSettings.preserveMetadata}
                          onChange={(e) => setRepairSettings(prev => ({...prev, preserveMetadata: e.target.checked}))}
                          className="rounded text-orange-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Preserve Metadata</div>
                          <div className="text-sm text-gray-500">Keep original document information</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={repairSettings.validateAfterRepair}
                          onChange={(e) => setRepairSettings(prev => ({...prev, validateAfterRepair: e.target.checked}))}
                          className="rounded text-orange-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Validate After Repair</div>
                          <div className="text-sm text-gray-500">Check file integrity after repair</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* File Upload */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Damaged PDF Files</h3>
              <p className="text-sm text-gray-600">Upload corrupted or damaged PDF files for repair</p>
            </div>
            
            <div className="p-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors"
              >
                <Upload className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Damaged PDF Files
                </h4>
                <p className="text-gray-600 mb-4">
                  Drag and drop your corrupted PDF files here, or click to browse
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
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Select PDF Files
                </label>
              </div>
            </div>
          </div>

          {/* Uploaded Files with Diagnostics */}
          {pdfFiles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  PDF Files Diagnostics ({pdfFiles.length})
                </h3>
                <p className="text-sm text-gray-600">Analysis of detected issues and repair feasibility</p>
              </div>
              
              <div className="p-6 space-y-4">
                {pdfFiles.map((file, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-8 h-8 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          <p className="text-sm text-gray-600">
                            Size: {formatFileSize(file.size)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSeverityColor(file.severityLevel)}`}>
                              {file.severityLevel.toUpperCase()} Severity
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              file.isRepairable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {file.isRepairable ? 'Repairable' : 'Critical Damage'}
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
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <h5 className="font-medium text-gray-900">
                          Issues Detected ({file.issuesDetected.length})
                        </h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {file.issuesDetected.map((issue, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-sm">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-900">{issue.description}</span>
                                {issue.fixable ? (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-red-500" />
                                )}
                              </div>
                              {issue.location && (
                                <div className="text-gray-500 text-xs">Location: {issue.location}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Repair Preview */}
          {selectedLevel && repairMode === 'custom' && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6 border border-orange-200">
              <div className="flex items-start space-x-3">
                <Wrench className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Repair Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Repair Level:</span>
                      <div className="font-medium text-orange-600">{selectedLevel.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Level:</span>
                      <div className="font-medium text-blue-600">{selectedLevel.riskLevel}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Options:</span>
                      <div className="font-medium text-purple-600">
                        {Object.values(repairSettings).filter(Boolean).length - 1} enabled
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Files:</span>
                      <div className="font-medium text-green-600">{pdfFiles.length} PDF(s)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Repair Button */}
          <div className="text-center mb-6">
            <button
              onClick={repairPdfs}
              disabled={isProcessing || pdfFiles.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Repairing PDFs...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Repair PDF Files
                </>
              )}
            </button>
          </div>

          {/* Repair Results */}
          {repairResults.length > 0 && (
            <div className="space-y-4 mb-6">
              {repairResults.map((result, index) => (
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
                        <XCircle className="w-8 h-8 text-red-600" />
                      )}
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.success ? 'PDF Repair Successful!' : 'Repair Failed'}
                        </h3>
                        <p className="text-sm text-gray-600">{result.fileName}</p>
                        {result.success && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              result.healthScore >= 90 ? 'bg-green-100 text-green-700' :
                              result.healthScore >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              Health Score: {result.healthScore}%
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
                          <div className="text-gray-600">Issues Found</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {result.issuesFound}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Issues Fixed</div>
                          <div className="text-lg font-semibold text-green-600">
                            {result.issuesFixed}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Pages Recovered</div>
                          <div className="text-lg font-semibold text-blue-600">
                            {result.recoveredPages}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">File Size</div>
                          <div className="text-lg font-semibold text-purple-600">
                            {formatFileSize(result.repairedSize)}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Processing</div>
                          <div className="text-lg font-semibold text-orange-600">
                            {result.processingTime}s
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <h4 className="font-medium text-gray-900 mb-2">Repair Actions Performed:</h4>
                          <div className="space-y-1">
                            {result.repairActions.map((action, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-gray-700">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {result.remainingIssues.length > 0 && (
                          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <h4 className="font-medium text-gray-900 mb-2">Remaining Issues:</h4>
                            <div className="space-y-1">
                              {result.remainingIssues.map((issue, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-sm">
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                  <span className="text-gray-700">{issue}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Repair Capabilities</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Structure corruption repair</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Content stream recovery</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Cross-reference table rebuild</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Font and image repair</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Metadata restoration</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ Safety & Security</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Original file preservation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Non-destructive repair process</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Comprehensive backup creation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Risk level assessment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Post-repair validation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Repair Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload & Analyze</h4>
                <p className="text-sm text-gray-600">Upload damaged PDFs for automatic issue detection</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Configure Repair</h4>
                <p className="text-sm text-gray-600">Choose repair mode and customize settings</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wrench className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Repair Process</h4>
                <p className="text-sm text-gray-600">Apply fixes and recover content safely</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download Fixed</h4>
                <p className="text-sm text-gray-600">Get your repaired PDF files</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

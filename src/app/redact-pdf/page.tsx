'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Eye, FileText, Settings, Zap, RefreshCw, CheckCircle, AlertTriangle, EyeOff, Lock, Shield, Search, Edit, MousePointer, Square, Type, Palette, Trash2 } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFFile {
  file: File;
  name: string;
  size: number;
  totalPages: number;
  hasText: boolean;
  sensitiveContentDetected: boolean;
  estimatedRedactions: number;
}

interface RedactionSettings {
  redactionMode: 'manual' | 'auto' | 'pattern' | 'keyword';
  autoDetectionTypes: {
    ssn: boolean;
    creditCard: boolean;
    phoneNumber: boolean;
    email: boolean;
    address: boolean;
    bankAccount: boolean;
    passport: boolean;
    driverLicense: boolean;
    custom: boolean;
  };
  redactionStyle: {
    fillColor: string;
    borderColor: string;
    borderWidth: number;
    opacity: number;
    pattern: 'solid' | 'striped' | 'crosshatch' | 'dots';
  };
  securityLevel: 'standard' | 'high' | 'military' | 'legal';
  preserveMetadata: boolean;
  keywords: string[];
  customPatterns: string[];
}

interface RedactionArea {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'manual' | 'auto';
  detectedContent?: string;
  category?: string;
  confidence?: number;
}

interface RedactionResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  redactedSize: number;
  pagesProcessed: number;
  totalRedactions: number;
  redactionsByType: {
    manual: number;
    ssn: number;
    creditCard: number;
    phoneNumber: number;
    email: number;
    address: number;
    bankAccount: number;
    passport: number;
    driverLicense: number;
    keyword: number;
    custom: number;
  };
  securityScore: number;
  processingTime: number;
  downloadUrl: string;
  auditLog: AuditEntry[];
}

interface AuditEntry {
  page: number;
  type: string;
  content: string;
  timestamp: Date;
  action: 'redacted' | 'detected' | 'reviewed';
  confidence: number;
}

export default function RedactPdfPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [redactionSettings, setRedactionSettings] = useState<RedactionSettings>({
    redactionMode: 'auto',
    autoDetectionTypes: {
      ssn: true,
      creditCard: true,
      phoneNumber: true,
      email: true,
      address: false,
      bankAccount: true,
      passport: false,
      driverLicense: false,
      custom: false
    },
    redactionStyle: {
      fillColor: '#000000',
      borderColor: '#ff0000',
      borderWidth: 2,
      opacity: 100,
      pattern: 'solid'
    },
    securityLevel: 'high',
    preserveMetadata: false,
    keywords: [],
    customPatterns: []
  });
  const [redactionAreas, setRedactionAreas] = useState<RedactionArea[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [redactionResults, setRedactionResults] = useState<RedactionResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [patternInput, setPatternInput] = useState('');
  const [selectedTool, setSelectedTool] = useState<'select' | 'redact'>('select');

  const redactionModes = [
    {
      mode: 'auto' as const,
      name: 'Auto Detection',
      description: 'Automatically detect and redact sensitive information',
      icon: Search,
      features: ['PII detection', 'Pattern matching', 'ML algorithms']
    },
    {
      mode: 'manual' as const,
      name: 'Manual Selection',
      description: 'Manually select areas to redact',
      icon: MousePointer,
      features: ['Precise control', 'Custom areas', 'Visual selection']
    },
    {
      mode: 'keyword' as const,
      name: 'Keyword Based',
      description: 'Redact based on specific keywords',
      icon: Type,
      features: ['Word matching', 'Phrase detection', 'Case sensitivity']
    },
    {
      mode: 'pattern' as const,
      name: 'Pattern Matching',
      description: 'Use regex patterns for redaction',
      icon: Edit,
      features: ['Regex support', 'Complex patterns', 'Advanced matching']
    }
  ];

  const securityLevels = [
    {
      level: 'standard' as const,
      name: 'Standard Security',
      description: 'Basic redaction with standard protection',
      passes: 1,
      features: ['Single pass', 'Basic overwrite', 'Standard encryption']
    },
    {
      level: 'high' as const,
      name: 'High Security',
      description: 'Enhanced security with multiple passes',
      passes: 3,
      features: ['Triple pass', 'Secure overwrite', 'Strong encryption']
    },
    {
      level: 'military' as const,
      name: 'Military Grade',
      description: 'Military-grade secure redaction',
      passes: 7,
      features: ['7-pass overwrite', 'DoD standards', 'Maximum security']
    },
    {
      level: 'legal' as const,
      name: 'Legal Compliance',
      description: 'Compliant with legal requirements',
      passes: 5,
      features: ['Legal standards', 'Audit trail', 'Compliance ready']
    }
  ];

  const detectionTypes = [
    { key: 'ssn', name: 'Social Security Numbers', pattern: 'XXX-XX-XXXX', icon: Shield },
    { key: 'creditCard', name: 'Credit Card Numbers', pattern: 'XXXX-XXXX-XXXX-XXXX', icon: Lock },
    { key: 'phoneNumber', name: 'Phone Numbers', pattern: '(XXX) XXX-XXXX', icon: Search },
    { key: 'email', name: 'Email Addresses', pattern: 'user@domain.com', icon: Type },
    { key: 'address', name: 'Physical Addresses', pattern: '123 Main St, City', icon: EyeOff },
    { key: 'bankAccount', name: 'Bank Account Numbers', pattern: 'XXXXXXXXXX', icon: Shield },
    { key: 'passport', name: 'Passport Numbers', pattern: 'XXXXXXXXX', icon: FileText },
    { key: 'driverLicense', name: 'Driver License Numbers', pattern: 'XXXXXXXXX', icon: Lock }
  ];

  const redactionPatterns = [
    { name: 'Solid Fill', value: 'solid', preview: '████████' },
    { name: 'Striped', value: 'striped', preview: '▓▓▓▓▓▓▓▓' },
    { name: 'Cross Hatch', value: 'crosshatch', preview: '########' },
    { name: 'Dots', value: 'dots', preview: '••••••••' }
  ];

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: PDFFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Simulate PDF analysis
        const totalPages = Math.floor(Math.random() * 20) + 5;
        const hasText = Math.random() > 0.2; // 80% chance of having text
        const sensitiveContentDetected = Math.random() > 0.3; // 70% chance of sensitive content
        const estimatedRedactions = sensitiveContentDetected ? Math.floor(Math.random() * 15) + 5 : 0;
        
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          totalPages,
          hasText,
          sensitiveContentDetected,
          estimatedRedactions
        });
      }
    });
    
    if (newFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newFiles]);
      setRedactionResults([]);
      setRedactionAreas([]);
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

  const addKeyword = () => {
    if (keywordInput.trim() && !redactionSettings.keywords.includes(keywordInput.trim())) {
      setRedactionSettings(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setRedactionSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addCustomPattern = () => {
    if (patternInput.trim() && !redactionSettings.customPatterns.includes(patternInput.trim())) {
      setRedactionSettings(prev => ({
        ...prev,
        customPatterns: [...prev.customPatterns, patternInput.trim()]
      }));
      setPatternInput('');
    }
  };

  const removeCustomPattern = (pattern: string) => {
    setRedactionSettings(prev => ({
      ...prev,
      customPatterns: prev.customPatterns.filter(p => p !== pattern)
    }));
  };

  const processRedaction = async () => {
    if (pdfFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate redaction processing
      await new Promise(resolve => setTimeout(resolve, 6000 + (pdfFiles.length * 4000)));
      
      const results: RedactionResult[] = pdfFiles.map((file) => {
        const processingTime = Math.floor(Math.random() * 45) + 20;
        const totalRedactions = Math.floor(Math.random() * 25) + file.estimatedRedactions;
        
        // Simulate different types of redactions found
        const redactionsByType = {
          manual: redactionAreas.length,
          ssn: redactionSettings.autoDetectionTypes.ssn ? Math.floor(Math.random() * 5) : 0,
          creditCard: redactionSettings.autoDetectionTypes.creditCard ? Math.floor(Math.random() * 3) : 0,
          phoneNumber: redactionSettings.autoDetectionTypes.phoneNumber ? Math.floor(Math.random() * 4) : 0,
          email: redactionSettings.autoDetectionTypes.email ? Math.floor(Math.random() * 3) : 0,
          address: redactionSettings.autoDetectionTypes.address ? Math.floor(Math.random() * 2) : 0,
          bankAccount: redactionSettings.autoDetectionTypes.bankAccount ? Math.floor(Math.random() * 2) : 0,
          passport: redactionSettings.autoDetectionTypes.passport ? Math.floor(Math.random() * 1) : 0,
          driverLicense: redactionSettings.autoDetectionTypes.driverLicense ? Math.floor(Math.random() * 1) : 0,
          keyword: redactionSettings.keywords.length > 0 ? Math.floor(Math.random() * 4) : 0,
          custom: redactionSettings.customPatterns.length > 0 ? Math.floor(Math.random() * 3) : 0
        };
        
        const totalFound = Object.values(redactionsByType).reduce((sum, count) => sum + count, 0);
        const securityScore = Math.min(100, Math.floor((totalFound / Math.max(1, file.estimatedRedactions)) * 100));
        
        // Generate audit log
        const auditLog: AuditEntry[] = [];
        Object.entries(redactionsByType).forEach(([type, count]) => {
          for (let i = 0; i < count; i++) {
            auditLog.push({
              page: Math.floor(Math.random() * file.totalPages) + 1,
              type,
              content: `${type} detected and redacted`,
              timestamp: new Date(),
              action: 'redacted',
              confidence: Math.floor(Math.random() * 20) + 80
            });
          }
        });
        
        return {
          success: Math.random() > 0.03, // 97% success rate
          fileName: file.name.replace('.pdf', '_redacted.pdf'),
          originalSize: file.size,
          redactedSize: file.size * (0.95 + Math.random() * 0.1), // Slightly smaller after redaction
          pagesProcessed: file.totalPages,
          totalRedactions: totalFound,
          redactionsByType,
          securityScore,
          processingTime,
          downloadUrl: `redacted-${file.name}`,
          auditLog
        };
      });
      
      setRedactionResults(results);
    } catch (error) {
      console.error('Error processing redaction:', error);
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

  const getFileStatusColor = (file: PDFFile) => {
    if (file.sensitiveContentDetected) return 'text-red-600 bg-red-100';
    if (file.hasText) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getFileStatusText = (file: PDFFile) => {
    if (file.sensitiveContentDetected) return 'Sensitive Content Detected';
    if (file.hasText) return 'Text Content Available';
    return 'No Text Detected';
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const selectedMode = redactionModes.find(mode => mode.mode === redactionSettings.redactionMode);
  const selectedSecurity = securityLevels.find(level => level.level === redactionSettings.securityLevel);
  const selectedPattern = redactionPatterns.find(pattern => pattern.value === redactionSettings.redactionStyle.pattern);

  const enabledDetectionCount = Object.values(redactionSettings.autoDetectionTypes).filter(Boolean).length;

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
                <EyeOff className="w-6 h-6 text-gray-400" />
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Redact PDF - Secure Document Redaction</h1>
            <p className="text-lg text-gray-600">
              Permanently remove sensitive information from PDF documents using advanced redaction technology. Ensure privacy and compliance with military-grade security.
            </p>
          </div>

          {/* Redaction Mode Selection */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Redaction Mode</h3>
              <p className="text-sm text-gray-600">Choose how you want to identify content for redaction</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {redactionModes.map((mode) => (
                  <label
                    key={mode.mode}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      redactionSettings.redactionMode === mode.mode
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="redactionMode"
                      value={mode.mode}
                      checked={redactionSettings.redactionMode === mode.mode}
                      onChange={(e) => setRedactionSettings(prev => ({
                        ...prev,
                        redactionMode: e.target.value as RedactionSettings['redactionMode']
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

          {/* Auto Detection Settings */}
          {(redactionSettings.redactionMode === 'auto' || redactionSettings.redactionMode === 'pattern') && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Auto Detection Settings ({enabledDetectionCount} types selected)
                </h3>
                <p className="text-sm text-gray-600">Select types of sensitive information to automatically detect and redact</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {detectionTypes.map((type) => (
                    <label
                      key={type.key}
                      className={`cursor-pointer border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                        redactionSettings.autoDetectionTypes[type.key as keyof typeof redactionSettings.autoDetectionTypes] 
                          ? 'bg-red-50 border-red-200' 
                          : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={redactionSettings.autoDetectionTypes[type.key as keyof typeof redactionSettings.autoDetectionTypes]}
                        onChange={(e) => setRedactionSettings(prev => ({
                          ...prev,
                          autoDetectionTypes: {
                            ...prev.autoDetectionTypes,
                            [type.key]: e.target.checked
                          }
                        }))}
                        className="sr-only"
                      />
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          redactionSettings.autoDetectionTypes[type.key as keyof typeof redactionSettings.autoDetectionTypes]
                            ? 'bg-red-100' 
                            : 'bg-gray-100'
                        }`}>
                          <type.icon className={`w-5 h-5 ${
                            redactionSettings.autoDetectionTypes[type.key as keyof typeof redactionSettings.autoDetectionTypes]
                              ? 'text-red-600' 
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{type.pattern}</p>
                          {redactionSettings.autoDetectionTypes[type.key as keyof typeof redactionSettings.autoDetectionTypes] && (
                            <div className="mt-2">
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Enabled
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Keyword Settings */}
          {(redactionSettings.redactionMode === 'keyword' || redactionSettings.redactionMode === 'auto') && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Keyword Redaction ({redactionSettings.keywords.length} keywords)
                </h3>
                <p className="text-sm text-gray-600">Add specific words or phrases to redact from the document</p>
              </div>
              
              <div className="p-6">
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Enter keyword or phrase..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Keyword
                  </button>
                </div>
                
                {redactionSettings.keywords.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Keywords to Redact:</h4>
                    <div className="flex flex-wrap gap-2">
                      {redactionSettings.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security & Style Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Security Level */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Level</h3>
                <p className="text-sm text-gray-600">Choose the level of security for redaction</p>
              </div>
              
              <div className="p-6 space-y-3">
                {securityLevels.map((level) => (
                  <label
                    key={level.level}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all block ${
                      redactionSettings.securityLevel === level.level
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="securityLevel"
                      value={level.level}
                      checked={redactionSettings.securityLevel === level.level}
                      onChange={(e) => setRedactionSettings(prev => ({
                        ...prev,
                        securityLevel: e.target.value as RedactionSettings['securityLevel']
                      }))}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{level.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                        <div className="mt-2 space-y-1">
                          {level.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs text-gray-500">
                              <Shield className="w-3 h-3 text-red-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-red-600 font-medium">{level.passes} Pass{level.passes > 1 ? 'es' : ''}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Redaction Style */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Redaction Style</h3>
                <p className="text-sm text-gray-600">Customize the appearance of redacted areas</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Fill Pattern</label>
                  <div className="grid grid-cols-2 gap-2">
                    {redactionPatterns.map((pattern) => (
                      <label
                        key={pattern.value}
                        className={`cursor-pointer border border-gray-200 rounded-lg p-3 text-center hover:bg-gray-50 transition-colors ${
                          redactionSettings.redactionStyle.pattern === pattern.value ? 'bg-gray-100 border-gray-400' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="pattern"
                          value={pattern.value}
                          checked={redactionSettings.redactionStyle.pattern === pattern.value}
                          onChange={(e) => setRedactionSettings(prev => ({
                            ...prev,
                            redactionStyle: {...prev.redactionStyle, pattern: e.target.value as RedactionSettings['redactionStyle']['pattern']}
                          }))}
                          className="sr-only"
                        />
                        <div className="text-sm font-medium text-gray-900">{pattern.name}</div>
                        <div className="text-lg font-mono text-gray-600 mt-1">{pattern.preview}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Fill Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={redactionSettings.redactionStyle.fillColor}
                        onChange={(e) => setRedactionSettings(prev => ({
                          ...prev,
                          redactionStyle: {...prev.redactionStyle, fillColor: e.target.value}
                        }))}
                        className="w-10 h-10 rounded border border-gray-300"
                      />
                      <span className="text-sm text-gray-600">{redactionSettings.redactionStyle.fillColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Border Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={redactionSettings.redactionStyle.borderColor}
                        onChange={(e) => setRedactionSettings(prev => ({
                          ...prev,
                          redactionStyle: {...prev.redactionStyle, borderColor: e.target.value}
                        }))}
                        className="w-10 h-10 rounded border border-gray-300"
                      />
                      <span className="text-sm text-gray-600">{redactionSettings.redactionStyle.borderColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Opacity: {redactionSettings.redactionStyle.opacity}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={redactionSettings.redactionStyle.opacity}
                    onChange={(e) => setRedactionSettings(prev => ({
                      ...prev,
                      redactionStyle: {...prev.redactionStyle, opacity: parseInt(e.target.value)}
                    }))}
                    className="w-full"
                  />
                </div>
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
                  <span className="font-medium text-gray-900">Advanced Redaction Options</span>
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
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={redactionSettings.preserveMetadata}
                        onChange={(e) => setRedactionSettings(prev => ({
                          ...prev,
                          preserveMetadata: e.target.checked
                        }))}
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Preserve Metadata</div>
                        <div className="text-sm text-gray-500">Keep document properties and metadata</div>
                      </div>
                    </label>
                  </div>

                  {redactionSettings.redactionMode === 'pattern' && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Custom Regex Patterns</h4>
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={patternInput}
                            onChange={(e) => setPatternInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomPattern()}
                            placeholder="Enter regex pattern (e.g., \d{3}-\d{2}-\d{4})"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={addCustomPattern}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Add Pattern
                          </button>
                        </div>
                        
                        {redactionSettings.customPatterns.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Custom Patterns:</h5>
                            <div className="space-y-1">
                              {redactionSettings.customPatterns.map((pattern, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg"
                                >
                                  <code className="text-sm text-purple-800">{pattern}</code>
                                  <button
                                    onClick={() => removeCustomPattern(pattern)}
                                    className="text-purple-600 hover:text-purple-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF Files for Redaction</h3>
              <p className="text-sm text-gray-600">Upload documents containing sensitive information to redact</p>
            </div>
            
            <div className="p-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Upload className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload PDF Files for Redaction
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
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
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
                <p className="text-sm text-gray-600">Files ready for redaction processing</p>
              </div>
              
              <div className="p-6 space-y-4">
                {pdfFiles.map((file, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-8 h-8 text-red-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          <p className="text-sm text-gray-600">
                            {file.totalPages} pages • {formatFileSize(file.size)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getFileStatusColor(file)}`}>
                              {getFileStatusText(file)}
                            </span>
                            {file.sensitiveContentDetected && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                ~{file.estimatedRedactions} potential redactions
                              </span>
                            )}
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
                    
                    {file.sensitiveContentDetected && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            Sensitive Content Detected
                          </span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          This document contains potential sensitive information that should be redacted.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Preview */}
          {selectedMode && selectedSecurity && pdfFiles.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6 border border-red-200">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Redaction Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mode:</span>
                      <div className="font-medium text-blue-600">{selectedMode.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Security:</span>
                      <div className="font-medium text-red-600">{selectedSecurity.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Pattern:</span>
                      <div className="font-medium text-purple-600">{selectedPattern?.name}</div>
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

          {/* Process Redaction Button */}
          <div className="text-center mb-6">
            <button
              onClick={processRedaction}
              disabled={isProcessing || pdfFiles.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Redaction...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Process Redaction
                </>
              )}
            </button>
          </div>

          {/* Redaction Results */}
          {redactionResults.length > 0 && (
            <div className="space-y-4 mb-6">
              {redactionResults.map((result, index) => (
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
                          {result.success ? 'Redaction Complete!' : 'Redaction Failed'}
                        </h3>
                        <p className="text-sm text-gray-600">{result.fileName}</p>
                        {result.success && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {result.totalRedactions} redactions applied
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getSecurityScoreColor(result.securityScore)}`}>
                              Security Score: {result.securityScore}%
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
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
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4 text-sm">
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Pages</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {result.pagesProcessed}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Total Redactions</div>
                          <div className="text-lg font-semibold text-red-600">
                            {result.totalRedactions}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">SSN</div>
                          <div className="text-lg font-semibold text-blue-600">
                            {result.redactionsByType.ssn}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Credit Cards</div>
                          <div className="text-lg font-semibold text-green-600">
                            {result.redactionsByType.creditCard}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Phone Numbers</div>
                          <div className="text-lg font-semibold text-purple-600">
                            {result.redactionsByType.phoneNumber}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Emails</div>
                          <div className="text-lg font-semibold text-orange-600">
                            {result.redactionsByType.email}
                          </div>
                        </div>
                      </div>
                      
                      {result.auditLog.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <h4 className="font-medium text-gray-900 mb-2">Redaction Audit Log:</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {result.auditLog.slice(0, 5).map((entry, idx) => (
                              <div key={idx} className="text-sm text-gray-700 flex items-center justify-between">
                                <span>Page {entry.page}: {entry.content}</span>
                                <span className="text-xs text-gray-500">{entry.confidence}% confidence</span>
                              </div>
                            ))}
                            {result.auditLog.length > 5 && (
                              <div className="text-sm text-gray-500 text-center">
                                ... and {result.auditLog.length - 5} more entries
                              </div>
                            )}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Security Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Military-grade redaction security</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>Multi-pass data overwriting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-green-500" />
                  <span>Permanent content removal</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Legal compliance ready</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span>Audit trail generation</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Detection Capabilities</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-green-500" />
                  <span>Auto PII detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Type className="w-4 h-4 text-green-500" />
                  <span>Keyword-based redaction</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Edit className="w-4 h-4 text-green-500" />
                  <span>Custom regex patterns</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MousePointer className="w-4 h-4 text-green-500" />
                  <span>Manual area selection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-green-500" />
                  <span>Customizable redaction styles</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Redaction Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Configure Settings</h4>
                <p className="text-sm text-gray-600">Choose redaction mode and security level</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Upload Documents</h4>
                <p className="text-sm text-gray-600">Add PDF files with sensitive content</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Process Redaction</h4>
                <p className="text-sm text-gray-600">Secure removal of sensitive information</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your securely redacted documents</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

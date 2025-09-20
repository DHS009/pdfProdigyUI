'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Unlock, Lock, Shield, CheckCircle, AlertTriangle, Key, FileText, Eye, EyeOff, RefreshCw, Zap } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFFile {
  file: File;
  name: string;
  size: number;
  isProtected: boolean;
  protectionType: 'owner' | 'user' | 'both' | 'none';
  needsPassword: boolean;
}

interface UnlockResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  unlockedSize: number;
  protectionRemoved: string[];
  processingTime: number;
  downloadUrl: string;
}

type SecurityLevel = 'basic' | 'standard' | 'high' | 'enterprise';

export default function UnlockPdfPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [passwords, setPasswords] = useState<{[key: string]: string}>({});
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [unlockResults, setUnlockResults] = useState<UnlockResult[]>([]);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('standard');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const securityLevels = [
    {
      id: 'basic' as SecurityLevel,
      name: 'Basic Unlock',
      description: 'Remove simple password protection',
      features: ['User password removal', 'Basic restrictions removal', 'Fast processing'],
      recommended: false
    },
    {
      id: 'standard' as SecurityLevel,
      name: 'Standard Unlock',
      description: 'Remove most common protections',
      features: ['User & owner passwords', 'Print restrictions', 'Copy restrictions', 'Edit restrictions'],
      recommended: true
    },
    {
      id: 'high' as SecurityLevel,
      name: 'Advanced Unlock',
      description: 'Remove advanced security features',
      features: ['All standard features', 'Form filling restrictions', 'Annotation restrictions', 'Digital signatures'],
      recommended: false
    },
    {
      id: 'enterprise' as SecurityLevel,
      name: 'Enterprise Unlock',
      description: 'Professional-grade unlocking',
      features: ['All security layers', 'Encryption removal', 'Metadata cleaning', 'Audit trail removal'],
      recommended: false
    }
  ];

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: PDFFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Simulate PDF protection detection
        const isProtected = Math.random() > 0.3; // 70% chance of being protected
        const protectionTypes = ['owner', 'user', 'both'] as const;
        const protectionType = isProtected 
          ? protectionTypes[Math.floor(Math.random() * protectionTypes.length)]
          : 'none';
        
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          isProtected,
          protectionType: protectionType as 'owner' | 'user' | 'both' | 'none',
          needsPassword: isProtected && (protectionType === 'user' || protectionType === 'both')
        });
      }
    });
    
    if (newFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newFiles]);
      setUnlockResults([]);
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

  const updatePassword = (fileName: string, password: string) => {
    setPasswords(prev => ({...prev, [fileName]: password}));
  };

  const togglePasswordVisibility = (fileName: string) => {
    setShowPasswords(prev => ({...prev, [fileName]: !prev[fileName]}));
  };

  const removeFile = (fileName: string) => {
    setPdfFiles(prev => prev.filter(file => file.name !== fileName));
    setPasswords(prev => {
      const newPasswords = {...prev};
      delete newPasswords[fileName];
      return newPasswords;
    });
    setShowPasswords(prev => {
      const newVisibility = {...prev};
      delete newVisibility[fileName];
      return newVisibility;
    });
  };

  const unlockPdfs = async () => {
    if (pdfFiles.length === 0) return;
    
    // Check if password-protected files have passwords
    const passwordProtectedFiles = pdfFiles.filter(file => file.needsPassword);
    const missingPasswords = passwordProtectedFiles.filter(file => !passwords[file.name]?.trim());
    
    if (missingPasswords.length > 0) {
      alert(`Please provide passwords for: ${missingPasswords.map(f => f.name).join(', ')}`);
      return;
    }
    
    setIsProcessing(true);
    try {
      // Simulate unlock process
      await new Promise(resolve => setTimeout(resolve, 3000 + (pdfFiles.length * 1000)));
      
      const results: UnlockResult[] = pdfFiles.map((file) => {
        const processingTime = Math.floor(Math.random() * 5) + 2;
        const protectionRemoved = [];
        
        if (file.protectionType === 'user' || file.protectionType === 'both') {
          protectionRemoved.push('User Password');
        }
        if (file.protectionType === 'owner' || file.protectionType === 'both') {
          protectionRemoved.push('Owner Password');
        }
        if (file.isProtected) {
          protectionRemoved.push('Print Restrictions', 'Copy Restrictions', 'Edit Restrictions');
        }
        
        // Add security level specific removals
        if (securityLevel === 'high' || securityLevel === 'enterprise') {
          protectionRemoved.push('Form Restrictions', 'Annotation Restrictions');
        }
        if (securityLevel === 'enterprise') {
          protectionRemoved.push('Encryption', 'Metadata Protection');
        }
        
        return {
          success: Math.random() > 0.1, // 90% success rate
          fileName: file.name.replace('.pdf', '_unlocked.pdf'),
          originalSize: file.size,
          unlockedSize: file.size * (0.95 + Math.random() * 0.1), // Slightly smaller after unlock
          protectionRemoved: protectionRemoved.length > 0 ? protectionRemoved : ['No Protection Found'],
          processingTime,
          downloadUrl: `unlocked-${file.name}`
        };
      });
      
      setUnlockResults(results);
    } catch (error) {
      console.error('Error unlocking PDFs:', error);
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

  const getProtectionIcon = (protectionType: string) => {
    switch (protectionType) {
      case 'user':
        return <Key className="w-4 h-4 text-orange-500" />;
      case 'owner':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'both':
        return <Lock className="w-4 h-4 text-purple-500" />;
      default:
        return <Unlock className="w-4 h-4 text-green-500" />;
    }
  };

  const getProtectionDescription = (file: PDFFile) => {
    if (!file.isProtected) return 'No protection detected';
    
    switch (file.protectionType) {
      case 'user':
        return 'User password protected - requires password to open';
      case 'owner':
        return 'Owner password protected - restricted permissions';
      case 'both':
        return 'Fully protected - user & owner passwords required';
      default:
        return 'Unknown protection type';
    }
  };

  const selectedLevel = securityLevels.find(level => level.id === securityLevel);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <Lock className="w-8 h-8 text-red-600" />
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <Unlock className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Unlock PDF Files</h1>
            <p className="text-lg text-gray-600">
              Remove passwords and restrictions from PDF files. Unlock password-protected PDFs and remove printing, copying, and editing restrictions safely.
            </p>
          </div>

          {/* Security Level Selection */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Security Level</h3>
              <p className="text-sm text-gray-600">Choose the level of security removal for your PDF files</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityLevels.map((level) => (
                <label
                  key={level.id}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    securityLevel === level.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="securityLevel"
                    value={level.id}
                    checked={securityLevel === level.id}
                    onChange={(e) => setSecurityLevel(e.target.value as SecurityLevel)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Unlock className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{level.name}</h4>
                        {level.recommended && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                      <div className="space-y-1">
                        {level.features.map((feature, index) => (
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

          {/* File Upload */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Protected PDF Files</h3>
              <p className="text-sm text-gray-600">Upload one or multiple password-protected PDF files to unlock</p>
            </div>
            
            <div className="p-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Upload className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Protected PDF Files
                </h4>
                <p className="text-gray-600 mb-4">
                  Drag and drop your password-protected PDF files here, or click to browse
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
                  <Lock className="w-5 h-5 mr-2" />
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
                <p className="text-sm text-gray-600">Review protection status and enter passwords if required</p>
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
                            Size: {formatFileSize(file.size)}
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
                    
                    <div className="flex items-center space-x-2 mb-3">
                      {getProtectionIcon(file.protectionType)}
                      <span className="text-sm text-gray-700">
                        {getProtectionDescription(file)}
                      </span>
                      {file.isProtected && (
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          file.protectionType === 'both' ? 'bg-purple-100 text-purple-700' :
                          file.protectionType === 'user' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {file.protectionType === 'both' ? 'Fully Protected' :
                           file.protectionType === 'user' ? 'User Protected' :
                           'Owner Protected'}
                        </span>
                      )}
                    </div>
                    
                    {file.needsPassword && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Required
                        </label>
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <input
                              type={showPasswords[file.name] ? 'text' : 'password'}
                              value={passwords[file.name] || ''}
                              onChange={(e) => updatePassword(file.name, e.target.value)}
                              placeholder="Enter PDF password"
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(file.name)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords[file.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        {!passwords[file.name]?.trim() && (
                          <div className="flex items-center space-x-1 mt-2 text-xs text-orange-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Password required to unlock this file</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Options */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Advanced Unlock Options</span>
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
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-red-600" defaultChecked />
                      <span className="text-sm text-gray-700">Remove print restrictions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-red-600" defaultChecked />
                      <span className="text-sm text-gray-700">Remove copy restrictions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-red-600" defaultChecked />
                      <span className="text-sm text-gray-700">Remove edit restrictions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-red-600" />
                      <span className="text-sm text-gray-700">Remove form filling restrictions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-red-600" />
                      <span className="text-sm text-gray-700">Remove annotation restrictions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-red-600" />
                      <span className="text-sm text-gray-700">Preserve original metadata</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Level Preview */}
          {selectedLevel && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6 border border-red-200">
              <div className="flex items-start space-x-3">
                <Unlock className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Unlock Preview - {selectedLevel.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Files:</span>
                      <div className="font-medium text-red-600">{pdfFiles.length} PDF(s)</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Protected Files:</span>
                      <div className="font-medium text-orange-600">
                        {pdfFiles.filter(f => f.isProtected).length} files
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Passwords Needed:</span>
                      <div className="font-medium text-purple-600">
                        {pdfFiles.filter(f => f.needsPassword).length} files
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unlock Button */}
          <div className="text-center mb-6">
            <button
              onClick={unlockPdfs}
              disabled={isProcessing || pdfFiles.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Unlocking PDFs...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Unlock PDF Files
                </>
              )}
            </button>
          </div>

          {/* Unlock Results */}
          {unlockResults.length > 0 && (
            <div className="space-y-4 mb-6">
              {unlockResults.map((result, index) => (
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
                          {result.success ? 'PDF Unlocked Successfully!' : 'Unlock Failed'}
                        </h3>
                        <p className="text-sm text-gray-600">{result.fileName}</p>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Original Size</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {formatFileSize(result.originalSize)}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Unlocked Size</div>
                          <div className="text-lg font-semibold text-blue-600">
                            {formatFileSize(result.unlockedSize)}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Processing Time</div>
                          <div className="text-lg font-semibold text-purple-600">
                            {result.processingTime}s
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Restrictions Removed</div>
                          <div className="text-lg font-semibold text-green-600">
                            {result.protectionRemoved.length}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-medium text-gray-900 mb-2">Security Features Removed:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {result.protectionRemoved.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-700">{feature}</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔓 Unlock Capabilities</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Remove user passwords</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Remove owner passwords</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Remove print restrictions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Remove copy restrictions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Remove edit restrictions</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Files processed securely</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Passwords encrypted in transit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Files auto-deleted after 1 hour</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>No data retention</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>GDPR compliant</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Unlocking Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload Files</h4>
                <p className="text-sm text-gray-600">Upload your password-protected PDF files</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Key className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Enter Passwords</h4>
                <p className="text-sm text-gray-600">Provide passwords for protected files</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Process</h4>
                <p className="text-sm text-gray-600">Remove passwords and restrictions securely</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your unlocked PDF files</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

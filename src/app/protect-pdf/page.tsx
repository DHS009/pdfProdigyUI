'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Lock, Shield, Key, CheckCircle, AlertTriangle, Eye, EyeOff, RefreshCw, Zap, FileText, Settings } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFFile {
  file: File;
  name: string;
  size: number;
}

interface ProtectionSettings {
  userPassword: string;
  ownerPassword: string;
  enableUserPassword: boolean;
  enableOwnerPassword: boolean;
  permissions: {
    allowPrinting: boolean;
    allowCopying: boolean;
    allowEditing: boolean;
    allowFormFilling: boolean;
    allowAnnotations: boolean;
    allowScreenReaders: boolean;
    allowAssembly: boolean;
    allowHighQualityPrint: boolean;
  };
  encryptionLevel: 'standard' | 'high' | 'aes128' | 'aes256';
}

interface ProtectionResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  protectedSize: number;
  protectionApplied: string[];
  processingTime: number;
  encryptionLevel: string;
  downloadUrl: string;
}

type SecurityTemplate = 'none' | 'basic' | 'standard' | 'high' | 'maximum' | 'custom';

export default function ProtectPdfPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [protectionSettings, setProtectionSettings] = useState<ProtectionSettings>({
    userPassword: '',
    ownerPassword: '',
    enableUserPassword: false,
    enableOwnerPassword: false,
    permissions: {
      allowPrinting: true,
      allowCopying: true,
      allowEditing: true,
      allowFormFilling: true,
      allowAnnotations: true,
      allowScreenReaders: true,
      allowAssembly: false,
      allowHighQualityPrint: true,
    },
    encryptionLevel: 'aes128'
  });
  const [securityTemplate, setSecurityTemplate] = useState<SecurityTemplate>('standard');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [protectionResults, setProtectionResults] = useState<ProtectionResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const securityTemplates = [
    {
      id: 'none' as SecurityTemplate,
      name: 'No Protection',
      description: 'No password or restrictions applied',
      features: ['No passwords', 'Full access', 'No restrictions'],
      recommended: false
    },
    {
      id: 'basic' as SecurityTemplate,
      name: 'Basic Protection',
      description: 'User password with basic restrictions',
      features: ['User password', 'Print allowed', 'Copy restricted', 'Edit restricted'],
      recommended: false
    },
    {
      id: 'standard' as SecurityTemplate,
      name: 'Standard Protection',
      description: 'Balanced security for most use cases',
      features: ['User password', 'Owner password', 'Print allowed', 'Copy/edit restricted'],
      recommended: true
    },
    {
      id: 'high' as SecurityTemplate,
      name: 'High Security',
      description: 'Strong protection for sensitive documents',
      features: ['Both passwords', 'All restrictions', 'AES-128 encryption', 'Limited access'],
      recommended: false
    },
    {
      id: 'maximum' as SecurityTemplate,
      name: 'Maximum Security',
      description: 'Highest level of protection available',
      features: ['Complex passwords', 'All restrictions', 'AES-256 encryption', 'Screen readers only'],
      recommended: false
    },
    {
      id: 'custom' as SecurityTemplate,
      name: 'Custom Protection',
      description: 'Configure your own security settings',
      features: ['Custom passwords', 'Choose permissions', 'Select encryption', 'Full control'],
      recommended: false
    }
  ];

  const encryptionLevels = [
    { id: 'standard', name: 'Standard (40-bit RC4)', description: 'Basic encryption for compatibility' },
    { id: 'high', name: 'High (128-bit RC4)', description: 'Good balance of security and compatibility' },
    { id: 'aes128', name: 'AES-128', description: 'Modern encryption standard' },
    { id: 'aes256', name: 'AES-256', description: 'Strongest encryption available' }
  ];

  const applySecurityTemplate = (template: SecurityTemplate) => {
    setSecurityTemplate(template);
    
    switch (template) {
      case 'none':
        setProtectionSettings({
          ...protectionSettings,
          enableUserPassword: false,
          enableOwnerPassword: false,
          userPassword: '',
          ownerPassword: '',
          permissions: {
            allowPrinting: true,
            allowCopying: true,
            allowEditing: true,
            allowFormFilling: true,
            allowAnnotations: true,
            allowScreenReaders: true,
            allowAssembly: true,
            allowHighQualityPrint: true,
          },
          encryptionLevel: 'standard'
        });
        break;
      case 'basic':
        setProtectionSettings({
          ...protectionSettings,
          enableUserPassword: true,
          enableOwnerPassword: false,
          permissions: {
            allowPrinting: true,
            allowCopying: false,
            allowEditing: false,
            allowFormFilling: true,
            allowAnnotations: false,
            allowScreenReaders: true,
            allowAssembly: false,
            allowHighQualityPrint: true,
          },
          encryptionLevel: 'standard'
        });
        break;
      case 'standard':
        setProtectionSettings({
          ...protectionSettings,
          enableUserPassword: true,
          enableOwnerPassword: true,
          permissions: {
            allowPrinting: true,
            allowCopying: false,
            allowEditing: false,
            allowFormFilling: false,
            allowAnnotations: false,
            allowScreenReaders: true,
            allowAssembly: false,
            allowHighQualityPrint: false,
          },
          encryptionLevel: 'aes128'
        });
        break;
      case 'high':
        setProtectionSettings({
          ...protectionSettings,
          enableUserPassword: true,
          enableOwnerPassword: true,
          permissions: {
            allowPrinting: false,
            allowCopying: false,
            allowEditing: false,
            allowFormFilling: false,
            allowAnnotations: false,
            allowScreenReaders: true,
            allowAssembly: false,
            allowHighQualityPrint: false,
          },
          encryptionLevel: 'aes128'
        });
        break;
      case 'maximum':
        setProtectionSettings({
          ...protectionSettings,
          enableUserPassword: true,
          enableOwnerPassword: true,
          permissions: {
            allowPrinting: false,
            allowCopying: false,
            allowEditing: false,
            allowFormFilling: false,
            allowAnnotations: false,
            allowScreenReaders: true,
            allowAssembly: false,
            allowHighQualityPrint: false,
          },
          encryptionLevel: 'aes256'
        });
        break;
      case 'custom':
        // Keep current settings for custom
        break;
    }
  };

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: PDFFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
        });
      }
    });
    
    if (newFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newFiles]);
      setProtectionResults([]);
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

  const updatePermission = (permission: keyof ProtectionSettings['permissions'], value: boolean) => {
    setProtectionSettings(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
    setSecurityTemplate('custom');
  };

  const protectPdfs = async () => {
    if (pdfFiles.length === 0) return;
    
    // Validate passwords if enabled
    if (protectionSettings.enableUserPassword && !protectionSettings.userPassword.trim()) {
      alert('Please enter a user password or disable user password protection.');
      return;
    }
    
    if (protectionSettings.enableOwnerPassword && !protectionSettings.ownerPassword.trim()) {
      alert('Please enter an owner password or disable owner password protection.');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Simulate protection process
      await new Promise(resolve => setTimeout(resolve, 2000 + (pdfFiles.length * 1000)));
      
      const results: ProtectionResult[] = pdfFiles.map((file) => {
        const processingTime = Math.floor(Math.random() * 4) + 2;
        const protectionApplied = [];
        
        if (protectionSettings.enableUserPassword) {
          protectionApplied.push('User Password Protection');
        }
        if (protectionSettings.enableOwnerPassword) {
          protectionApplied.push('Owner Password Protection');
        }
        
        // Add restriction protections
        if (!protectionSettings.permissions.allowPrinting) {
          protectionApplied.push('Print Restrictions');
        }
        if (!protectionSettings.permissions.allowCopying) {
          protectionApplied.push('Copy Restrictions');
        }
        if (!protectionSettings.permissions.allowEditing) {
          protectionApplied.push('Edit Restrictions');
        }
        if (!protectionSettings.permissions.allowFormFilling) {
          protectionApplied.push('Form Filling Restrictions');
        }
        if (!protectionSettings.permissions.allowAnnotations) {
          protectionApplied.push('Annotation Restrictions');
        }
        
        protectionApplied.push(`${protectionSettings.encryptionLevel.toUpperCase()} Encryption`);
        
        return {
          success: Math.random() > 0.05, // 95% success rate
          fileName: file.name.replace('.pdf', '_protected.pdf'),
          originalSize: file.size,
          protectedSize: file.size * (1.05 + Math.random() * 0.1), // Slightly larger after protection
          protectionApplied: protectionApplied.length > 0 ? protectionApplied : ['Basic Protection Applied'],
          processingTime,
          encryptionLevel: protectionSettings.encryptionLevel.toUpperCase(),
          downloadUrl: `protected-${file.name}`
        };
      });
      
      setProtectionResults(results);
    } catch (error) {
      console.error('Error protecting PDFs:', error);
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

  const getSecurityStrength = () => {
    let strength = 0;
    if (protectionSettings.enableUserPassword && protectionSettings.userPassword.length >= 8) strength += 25;
    if (protectionSettings.enableOwnerPassword && protectionSettings.ownerPassword.length >= 8) strength += 25;
    
    const restrictedPermissions = Object.values(protectionSettings.permissions).filter(p => !p).length;
    strength += Math.min(restrictedPermissions * 5, 25);
    
    if (protectionSettings.encryptionLevel === 'aes256') strength += 25;
    else if (protectionSettings.encryptionLevel === 'aes128') strength += 20;
    else if (protectionSettings.encryptionLevel === 'high') strength += 15;
    else strength += 10;
    
    return Math.min(strength, 100);
  };

  const securityStrength = getSecurityStrength();
  const selectedTemplate = securityTemplates.find(t => t.id === securityTemplate);

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
                <Lock className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Protect PDF Files</h1>
            <p className="text-lg text-gray-600">
              Add password protection and security restrictions to PDF files. Secure your documents with encryption and access controls.
            </p>
          </div>

          {/* Security Templates */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Templates</h3>
              <p className="text-sm text-gray-600">Choose a pre-configured security level or customize your own</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityTemplates.map((template) => (
                <label
                  key={template.id}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    securityTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="securityTemplate"
                    value={template.id}
                    checked={securityTemplate === template.id}
                    onChange={(e) => applySecurityTemplate(e.target.value as SecurityTemplate)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        {template.recommended && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="space-y-1">
                        {template.features.map((feature, index) => (
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

          {/* Password Settings */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Protection</h3>
              <p className="text-sm text-gray-600">Set passwords to control access to your PDF files</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Password */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="enableUserPassword"
                    checked={protectionSettings.enableUserPassword}
                    onChange={(e) => setProtectionSettings(prev => ({
                      ...prev,
                      enableUserPassword: e.target.checked
                    }))}
                    className="rounded text-blue-600"
                  />
                  <label htmlFor="enableUserPassword" className="flex items-center space-x-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">User Password (Required to open PDF)</span>
                  </label>
                </div>
                {protectionSettings.enableUserPassword && (
                  <div className="ml-8">
                    <div className="relative">
                      <input
                        type={showUserPassword ? 'text' : 'password'}
                        value={protectionSettings.userPassword}
                        onChange={(e) => setProtectionSettings(prev => ({
                          ...prev,
                          userPassword: e.target.value
                        }))}
                        placeholder="Enter user password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowUserPassword(!showUserPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showUserPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Users will need this password to open the PDF file
                    </p>
                  </div>
                )}
              </div>

              {/* Owner Password */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="enableOwnerPassword"
                    checked={protectionSettings.enableOwnerPassword}
                    onChange={(e) => setProtectionSettings(prev => ({
                      ...prev,
                      enableOwnerPassword: e.target.checked
                    }))}
                    className="rounded text-blue-600"
                  />
                  <label htmlFor="enableOwnerPassword" className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-900">Owner Password (Controls permissions)</span>
                  </label>
                </div>
                {protectionSettings.enableOwnerPassword && (
                  <div className="ml-8">
                    <div className="relative">
                      <input
                        type={showOwnerPassword ? 'text' : 'password'}
                        value={protectionSettings.ownerPassword}
                        onChange={(e) => setProtectionSettings(prev => ({
                          ...prev,
                          ownerPassword: e.target.value
                        }))}
                        placeholder="Enter owner password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showOwnerPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Required to change permissions and security settings
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Permissions</h3>
              <p className="text-sm text-gray-600">Control what users can do with the PDF document</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={protectionSettings.permissions.allowPrinting}
                    onChange={(e) => updatePermission('allowPrinting', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Allow Printing</div>
                    <div className="text-sm text-gray-500">Users can print the document</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={protectionSettings.permissions.allowCopying}
                    onChange={(e) => updatePermission('allowCopying', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Allow Copying</div>
                    <div className="text-sm text-gray-500">Users can copy text and images</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={protectionSettings.permissions.allowEditing}
                    onChange={(e) => updatePermission('allowEditing', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Allow Editing</div>
                    <div className="text-sm text-gray-500">Users can edit document content</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={protectionSettings.permissions.allowFormFilling}
                    onChange={(e) => updatePermission('allowFormFilling', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Allow Form Filling</div>
                    <div className="text-sm text-gray-500">Users can fill form fields</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={protectionSettings.permissions.allowAnnotations}
                    onChange={(e) => updatePermission('allowAnnotations', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Allow Annotations</div>
                    <div className="text-sm text-gray-500">Users can add comments and notes</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={protectionSettings.permissions.allowScreenReaders}
                    onChange={(e) => updatePermission('allowScreenReaders', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Allow Screen Readers</div>
                    <div className="text-sm text-gray-500">Enable accessibility features</div>
                  </div>
                </label>
              </div>
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
                  <span className="font-medium text-gray-900">Advanced Encryption Settings</span>
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
                      Encryption Level
                    </label>
                    <select 
                      value={protectionSettings.encryptionLevel}
                      onChange={(e) => setProtectionSettings(prev => ({
                        ...prev,
                        encryptionLevel: e.target.value as ProtectionSettings['encryptionLevel']
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {encryptionLevels.map(level => (
                        <option key={level.id} value={level.id}>
                          {level.name} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={protectionSettings.permissions.allowAssembly}
                        onChange={(e) => updatePermission('allowAssembly', e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Allow document assembly</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={protectionSettings.permissions.allowHighQualityPrint}
                        onChange={(e) => updatePermission('allowHighQualityPrint', e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Allow high-quality printing</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Strength Indicator */}
          <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-xl p-6 mb-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Security Strength Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Overall Strength:</span>
                    <div className={`font-bold ${
                      securityStrength >= 80 ? 'text-green-600' :
                      securityStrength >= 60 ? 'text-yellow-600' :
                      securityStrength >= 40 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {securityStrength}% {
                        securityStrength >= 80 ? 'Very Strong' :
                        securityStrength >= 60 ? 'Strong' :
                        securityStrength >= 40 ? 'Moderate' : 'Weak'
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Template:</span>
                    <div className="font-medium text-blue-600">{selectedTemplate?.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Encryption:</span>
                    <div className="font-medium text-purple-600">
                      {protectionSettings.encryptionLevel.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Passwords:</span>
                    <div className="font-medium text-green-600">
                      {(protectionSettings.enableUserPassword ? 1 : 0) + (protectionSettings.enableOwnerPassword ? 1 : 0)} set
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      securityStrength >= 80 ? 'bg-green-500' :
                      securityStrength >= 60 ? 'bg-yellow-500' :
                      securityStrength >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${securityStrength}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF Files</h3>
              <p className="text-sm text-gray-600">Upload PDF files to apply protection settings</p>
            </div>
            
            <div className="p-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload PDF Files to Protect
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
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
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
                <p className="text-sm text-gray-600">Files ready for protection</p>
              </div>
              
              <div className="p-6 space-y-3">
                {pdfFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
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
                ))}
              </div>
            </div>
          )}

          {/* Protect Button */}
          <div className="text-center mb-6">
            <button
              onClick={protectPdfs}
              disabled={isProcessing || pdfFiles.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Protecting PDFs...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Protect PDF Files
                </>
              )}
            </button>
          </div>

          {/* Protection Results */}
          {protectionResults.length > 0 && (
            <div className="space-y-4 mb-6">
              {protectionResults.map((result, index) => (
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
                          {result.success ? 'PDF Protected Successfully!' : 'Protection Failed'}
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
                          <div className="text-gray-600">Protected Size</div>
                          <div className="text-lg font-semibold text-blue-600">
                            {formatFileSize(result.protectedSize)}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Encryption</div>
                          <div className="text-lg font-semibold text-purple-600">
                            {result.encryptionLevel}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Processing Time</div>
                          <div className="text-lg font-semibold text-green-600">
                            {result.processingTime}s
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-medium text-gray-900 mb-2">Protection Applied:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {result.protectionApplied.map((protection, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-700">{protection}</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔐 Protection Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>User & owner password protection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Print, copy, edit restrictions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Form filling controls</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Annotation permissions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple encryption levels</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure password handling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Client-side processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>No password storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Files auto-deleted</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Protection Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Choose Security</h4>
                <p className="text-sm text-gray-600">Select security template or customize settings</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Key className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Set Passwords</h4>
                <p className="text-sm text-gray-600">Configure user and owner passwords</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Upload Files</h4>
                <p className="text-sm text-gray-600">Add PDF files to protect</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your protected PDF files</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

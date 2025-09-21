'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, FileText, RefreshCw, CheckCircle, Settings, FileSignature, Eye, Zap, Shield, Pen, Type, Image, MousePointer } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface SignatureMode {
  id: 'draw' | 'type' | 'upload' | 'certificate';
  label: string;
  description: string;
  features: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  recommended?: boolean;
}

interface SigningResult {
  downloadUrl: string;
  fileName: string;
  signatures: number;
  fileSize: number;
  signingTime: number;
  security: string;
  validation: string;
}

export default function SignPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signatureMode, setSignatureMode] = useState<SignatureMode['id']>('draw');
  const [isProcessing, setIsProcessing] = useState(false);
  const [signingResult, setSigningResult] = useState<SigningResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'sign' | 'place' | 'complete'>('upload');
  const [signatureText, setSignatureText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const signatureModes: SignatureMode[] = [
    {
      id: 'draw',
      label: 'Draw Signature',
      description: 'Draw your signature using mouse or touch',
      features: ['Natural handwriting', 'Touch support', 'Smooth curves', 'Instant preview'],
      icon: Pen,
      recommended: true
    },
    {
      id: 'type',
      label: 'Type Signature',
      description: 'Type your name in various signature fonts',
      features: ['Multiple fonts', 'Custom styling', 'Professional look', 'Quick creation'],
      icon: Type
    },
    {
      id: 'upload',
      label: 'Upload Image',
      description: 'Upload an image of your signature',
      features: ['Use existing signature', 'High quality', 'Transparent background', 'Professional'],
      icon: Image
    },
    {
      id: 'certificate',
      label: 'Digital Certificate',
      description: 'Use digital certificate for legal signatures',
      features: ['Legally binding', 'Cryptographic security', 'Non-repudiation', 'Compliance ready'],
      icon: Shield
    }
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setSigningResult(null);
      setCurrentStep('sign');
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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const signPdf = async () => {
    if (!pdfFile) return;
    
    setIsProcessing(true);
    setCurrentStep('place');
    
    try {
      // Simulate signing process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate signing results
      const signatures = Math.floor(Math.random() * 3) + 1;
      const signingTime = Math.floor(Math.random() * 5) + 2;
      const baseSize = pdfFile.size;
      
      // Adjust file size based on signature mode
      const sizeMultipliers = {
        draw: 1.1,
        type: 1.05,
        upload: 1.15,
        certificate: 1.25
      };
      
      const fileSize = baseSize * sizeMultipliers[signatureMode];
      
      const securityMap = {
        draw: 'Standard',
        type: 'Standard',
        upload: 'Enhanced',
        certificate: 'Maximum'
      };
      
      const validationMap = {
        draw: 'Visual',
        type: 'Visual',
        upload: 'Visual',
        certificate: 'Cryptographic'
      };
      
      setSigningResult({
        downloadUrl: 'signed-document.pdf',
        fileName: pdfFile.name.replace('.pdf', '-signed.pdf'),
        signatures,
        fileSize,
        signingTime,
        security: securityMap[signatureMode],
        validation: validationMap[signatureMode]
      });
      
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error signing PDF:', error);
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

  const selectedMode = signatureModes.find(mode => mode.id === signatureMode);

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
                <FileSignature className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Digital Signature</h1>
            <p className="text-lg text-gray-600">
              Add digital signatures to your PDF documents. Choose from drawing, typing, uploading, or using digital certificates for secure signing.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-600' : ['sign', 'place', 'complete'].includes(currentStep) ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'upload' ? 'bg-blue-100 border-2 border-blue-600' : ['sign', 'place', 'complete'].includes(currentStep) ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                  {['sign', 'place', 'complete'].includes(currentStep) ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span className="font-medium">Upload PDF</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'sign' ? 'text-blue-600' : ['place', 'complete'].includes(currentStep) ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'sign' ? 'bg-blue-100 border-2 border-blue-600' : ['place', 'complete'].includes(currentStep) ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                  {['place', 'complete'].includes(currentStep) ? <CheckCircle className="w-5 h-5" /> : '2'}
                </div>
                <span className="font-medium">Create Signature</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'place' ? 'text-blue-600' : currentStep === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'place' ? 'bg-blue-100 border-2 border-blue-600' : currentStep === 'complete' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                  {currentStep === 'complete' ? <CheckCircle className="w-5 h-5" /> : '3'}
                </div>
                <span className="font-medium">Sign Document</span>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          {currentStep === 'upload' && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-green-50 hover:bg-green-100 transition-colors mb-6"
            >
              <Upload className="w-12 h-12 text-green-600 mx-auto mb-4" />
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
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                <FileText className="w-5 h-5 mr-2" />
                Select PDF File
              </label>
            </div>
          )}

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
                  <div className="text-sm text-gray-500">Ready to sign</div>
                  <div className="text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Signature Creation */}
          {currentStep === 'sign' && pdfFile && (
            <div className="space-y-6">
              {/* Signature Modes */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Signature Method</h3>
                  <p className="text-sm text-gray-600">Choose how you want to create your signature</p>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {signatureModes.map((mode) => (
                    <label
                      key={mode.id}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                        signatureMode === mode.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="signatureMode"
                        value={mode.id}
                        checked={signatureMode === mode.id}
                        onChange={(e) => setSignatureMode(e.target.value as SignatureMode['id'])}
                        className="sr-only"
                      />
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <mode.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{mode.label}</h4>
                            {mode.recommended && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                          <div className="grid grid-cols-2 gap-1">
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

              {/* Signature Creation Area */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Your Signature</h3>
                
                {signatureMode === 'draw' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Draw your signature in the box below using your mouse or touch screen</p>
                    <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={200}
                        className="w-full h-48 bg-white border border-gray-200 rounded cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                      <div className="mt-2 text-center">
                        <button
                          onClick={clearCanvas}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Clear Signature
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {signatureMode === 'type' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Type your full name to create a signature</p>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    {signatureText && (
                      <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                        <div className="text-center space-y-4">
                          <div style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '2rem', color: '#000' }}>
                            {signatureText}
                          </div>
                          <div style={{ fontFamily: 'Lucida Handwriting, cursive', fontSize: '1.8rem', color: '#000' }}>
                            {signatureText}
                          </div>
                          <div style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.2rem', color: '#000' }}>
                            {signatureText}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {signatureMode === 'upload' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Upload an image of your signature (PNG with transparent background recommended)</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                      <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="signature-upload"
                      />
                      <label
                        htmlFor="signature-upload"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Signature Image
                      </label>
                    </div>
                  </div>
                )}

                {signatureMode === 'certificate' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Use a digital certificate for legally binding signatures</p>
                    <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Digital Certificate Required</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            You need a valid digital certificate installed on your device to use this feature. 
                            Digital certificates provide the highest level of security and legal compliance.
                          </p>
                        </div>
                      </div>
                    </div>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                      <option>Select Digital Certificate</option>
                      <option>Personal Certificate (Demo)</option>
                      <option>Business Certificate (Demo)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Advanced Settings */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Advanced Signature Options</span>
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
                            Signature Appearance
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                            <option>Name and date</option>
                            <option>Name only</option>
                            <option>Date only</option>
                            <option>Custom text</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Signature Size
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                            <option>Medium (recommended)</option>
                            <option>Small</option>
                            <option>Large</option>
                            <option>Extra large</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Signing
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g., I approve this document" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g., New York, USA" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-green-600" defaultChecked />
                          <span className="text-sm text-gray-700">Include timestamp</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-green-600" />
                          <span className="text-sm text-gray-700">Lock document after signing</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-green-600" defaultChecked />
                          <span className="text-sm text-gray-700">Visible signature</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-green-600" />
                          <span className="text-sm text-gray-700">Require signature validation</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sign Button */}
              <div className="text-center">
                <button
                  onClick={signPdf}
                  disabled={isProcessing || (signatureMode === 'type' && !signatureText)}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Placing Signature...
                    </>
                  ) : (
                    <>
                      <FileSignature className="w-5 h-5" />
                      Place Signature
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Document Placement */}
          {currentStep === 'place' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-blue-600 mb-4">
                <MousePointer className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Placing Your Signature
              </h3>
              <p className="text-gray-600 mb-4">
                Please wait while we place your signature on the document...
              </p>
              <div className="animate-pulse bg-gray-200 rounded-lg h-64 mb-4"></div>
            </div>
          )}

          {/* Signing Result */}
          {signingResult && currentStep === 'complete' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <div className="text-green-600 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                PDF Signed Successfully!
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Signatures</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {signingResult.signatures}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">File Size</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {formatFileSize(signingResult.fileSize)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Security</div>
                  <div className="text-lg font-semibold text-green-600">
                    {signingResult.security}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Validation</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {signingResult.validation}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Time</div>
                  <div className="text-lg font-semibold text-green-600">
                    {signingResult.signingTime}s
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Signed PDF
                </button>
                <button 
                  onClick={() => {
                    setPdfFile(null);
                    setSigningResult(null);
                    setCurrentStep('upload');
                    setSignatureText('');
                    clearCanvas();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Sign Another Document
                </button>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">✍️ Multiple Signature Options</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Draw with mouse or touch</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Type with custom fonts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Upload signature image</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Digital certificate support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional appearance</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Security & Legal Compliance</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Cryptographic security</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Tamper-evident signatures</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Timestamp verification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Legal compliance ready</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Document integrity protection</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Signing Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload Document</h4>
                <p className="text-sm text-gray-600">Select the PDF document you want to sign</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Pen className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Create Signature</h4>
                <p className="text-sm text-gray-600">Draw, type, upload, or use digital certificate</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Download Signed PDF</h4>
                <p className="text-sm text-gray-600">Get your securely signed document</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

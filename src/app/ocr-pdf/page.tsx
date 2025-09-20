'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Eye, FileText, Settings, Zap, RefreshCw, CheckCircle, AlertTriangle, Languages, Search, Copy, Type, Globe, Book } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFFile {
  file: File;
  name: string;
  size: number;
  totalPages: number;
  hasText: boolean;
  ocrNeeded: boolean;
  detectedLanguage: string;
}

interface OCRSettings {
  languages: string[];
  outputFormat: 'searchable_pdf' | 'pdf_text' | 'text_only' | 'word_doc';
  accuracy: 'fast' | 'balanced' | 'accurate' | 'premium';
  preprocessing: {
    autoRotate: boolean;
    denoiseImages: boolean;
    enhanceContrast: boolean;
    straightenText: boolean;
    removeBackground: boolean;
  };
  postprocessing: {
    spellCheck: boolean;
    formatText: boolean;
    preserveLayout: boolean;
    detectTables: boolean;
    extractImages: boolean;
  };
}

interface OCRResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  processedSize: number;
  pagesProcessed: number;
  totalPages: number;
  extractedText: string;
  detectedLanguages: string[];
  confidence: number;
  processingTime: number;
  charactersExtracted: number;
  wordsExtracted: number;
  tablesDetected: number;
  imagesExtracted: number;
  downloadUrl: string;
  textPreview: string;
}

export default function OcrPdfPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [ocrSettings, setOcrSettings] = useState<OCRSettings>({
    languages: ['en'],
    outputFormat: 'searchable_pdf',
    accuracy: 'balanced',
    preprocessing: {
      autoRotate: true,
      denoiseImages: true,
      enhanceContrast: true,
      straightenText: true,
      removeBackground: false
    },
    postprocessing: {
      spellCheck: true,
      formatText: true,
      preserveLayout: true,
      detectTables: true,
      extractImages: false
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);

  const supportedLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'it', name: 'Italian', native: 'Italiano' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
    { code: 'ru', name: 'Russian', native: 'Русский' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands' },
    { code: 'sv', name: 'Swedish', native: 'Svenska' },
    { code: 'da', name: 'Danish', native: 'Dansk' },
    { code: 'no', name: 'Norwegian', native: 'Norsk' }
  ];

  const accuracyLevels = [
    {
      level: 'fast' as const,
      name: 'Fast Recognition',
      description: 'Quick processing with good accuracy',
      processingTime: 'Very Fast',
      accuracy: '85-90%',
      useCase: 'Simple documents'
    },
    {
      level: 'balanced' as const,
      name: 'Balanced Mode',
      description: 'Good balance of speed and accuracy',
      processingTime: 'Fast',
      accuracy: '90-95%',
      useCase: 'Most documents'
    },
    {
      level: 'accurate' as const,
      name: 'High Accuracy',
      description: 'Slower but more accurate recognition',
      processingTime: 'Medium',
      accuracy: '95-98%',
      useCase: 'Complex documents'
    },
    {
      level: 'premium' as const,
      name: 'Premium Quality',
      description: 'Maximum accuracy for critical documents',
      processingTime: 'Slow',
      accuracy: '98-99%',
      useCase: 'Critical/Legal docs'
    }
  ];

  const outputFormats = [
    {
      format: 'searchable_pdf' as const,
      name: 'Searchable PDF',
      description: 'Original PDF with searchable text layer',
      icon: FileText,
      features: ['Preserves layout', 'Searchable text', 'Copy-paste enabled']
    },
    {
      format: 'pdf_text' as const,
      name: 'PDF + Text',
      description: 'PDF with extracted text file',
      icon: Copy,
      features: ['Separate text file', 'Easy editing', 'Format flexibility']
    },
    {
      format: 'text_only' as const,
      name: 'Text Only',
      description: 'Plain text extraction',
      icon: Type,
      features: ['Pure text output', 'Small file size', 'Universal format']
    },
    {
      format: 'word_doc' as const,
      name: 'Word Document',
      description: 'Editable Word document',
      icon: Book,
      features: ['Editable format', 'Layout preserved', 'Easy modification']
    }
  ];

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: PDFFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Simulate PDF analysis
        const totalPages = Math.floor(Math.random() * 20) + 5;
        const hasText = Math.random() > 0.3; // 70% chance of having some text
        const ocrNeeded = !hasText || Math.random() > 0.5; // Need OCR if no text or scanned
        const languages = ['en', 'es', 'fr', 'de', 'zh'];
        const detectedLanguage = languages[Math.floor(Math.random() * languages.length)];
        
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          totalPages,
          hasText,
          ocrNeeded,
          detectedLanguage
        });
      }
    });
    
    if (newFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newFiles]);
      setOcrResults([]);
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

  const toggleLanguage = (langCode: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
    
    setOcrSettings(prev => ({
      ...prev,
      languages: selectedLanguages.includes(langCode) 
        ? selectedLanguages.filter(code => code !== langCode)
        : [...selectedLanguages, langCode]
    }));
  };

  const processOCR = async () => {
    if (pdfFiles.length === 0) return;
    
    if (selectedLanguages.length === 0) {
      alert('Please select at least one language for OCR processing.');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 5000 + (pdfFiles.length * 3000)));
      
      const results: OCRResult[] = pdfFiles.map((file) => {
        const processingTime = Math.floor(Math.random() * 30) + 15;
        const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%
        const charactersExtracted = Math.floor(Math.random() * 5000) + 1000;
        const wordsExtracted = Math.floor(charactersExtracted / 5);
        const tablesDetected = Math.floor(Math.random() * 5);
        const imagesExtracted = ocrSettings.postprocessing.extractImages ? Math.floor(Math.random() * 10) : 0;
        
        const sampleTexts = [
          "This is a sample text extracted from the PDF document. The OCR process has successfully recognized and converted the scanned text into searchable and editable format.",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
          "Professional document containing various sections with headers, paragraphs, and structured content that has been accurately processed through optical character recognition.",
          "Financial report showing quarterly results with detailed analysis of market performance and strategic recommendations for future growth initiatives."
        ];
        
        const textPreview = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        
        const languageNames = selectedLanguages.map(code => 
          supportedLanguages.find(lang => lang.code === code)?.name || code
        );
        
        return {
          success: Math.random() > 0.05, // 95% success rate
          fileName: file.name.replace('.pdf', '_ocr.pdf'),
          originalSize: file.size,
          processedSize: file.size * (1.1 + Math.random() * 0.2), // Slightly larger with text layer
          pagesProcessed: file.totalPages,
          totalPages: file.totalPages,
          extractedText: textPreview + '...',
          detectedLanguages: languageNames,
          confidence,
          processingTime,
          charactersExtracted,
          wordsExtracted,
          tablesDetected,
          imagesExtracted,
          downloadUrl: `ocr-${file.name}`,
          textPreview
        };
      });
      
      setOcrResults(results);
    } catch (error) {
      console.error('Error processing OCR:', error);
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
    if (!file.hasText && file.ocrNeeded) return 'text-red-600 bg-red-100';
    if (file.hasText && file.ocrNeeded) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getFileStatusText = (file: PDFFile) => {
    if (!file.hasText && file.ocrNeeded) return 'Scanned - OCR Needed';
    if (file.hasText && file.ocrNeeded) return 'Mixed Content';
    return 'Text Already Present';
  };

  const selectedAccuracy = accuracyLevels.find(level => level.level === ocrSettings.accuracy);
  const selectedFormat = outputFormats.find(format => format.format === ocrSettings.outputFormat);

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
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">OCR PDF - Text Recognition</h1>
            <p className="text-lg text-gray-600">
              Extract text from scanned PDFs and images using advanced Optical Character Recognition. Make your documents searchable, editable, and accessible.
            </p>
          </div>

          {/* Language Selection */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Languages className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">OCR Languages</h3>
              </div>
              <p className="text-sm text-gray-600">Select the languages present in your documents</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {supportedLanguages.map((language) => (
                  <label
                    key={language.code}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all text-center ${
                      selectedLanguages.includes(language.code)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(language.code)}
                      onChange={() => toggleLanguage(language.code)}
                      className="sr-only"
                    />
                    <div className="font-medium text-gray-900 text-sm">{language.name}</div>
                    <div className="text-xs text-gray-500">{language.native}</div>
                  </label>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Selected: {selectedLanguages.length > 0 
                  ? selectedLanguages.map(code => supportedLanguages.find(lang => lang.code === code)?.name).join(', ')
                  : 'None selected'}
              </div>
            </div>
          </div>

          {/* Accuracy & Output Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Accuracy Level */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recognition Accuracy</h3>
                <p className="text-sm text-gray-600">Choose the balance between speed and accuracy</p>
              </div>
              
              <div className="p-6 space-y-3">
                {accuracyLevels.map((level) => (
                  <label
                    key={level.level}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all block ${
                      ocrSettings.accuracy === level.level
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accuracy"
                      value={level.level}
                      checked={ocrSettings.accuracy === level.level}
                      onChange={(e) => setOcrSettings(prev => ({
                        ...prev,
                        accuracy: e.target.value as OCRSettings['accuracy']
                      }))}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{level.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-blue-600 font-medium">{level.accuracy}</div>
                        <div className="text-gray-500">{level.processingTime}</div>
                      </div>
                    </div>
                    <div className="text-xs text-purple-600 mt-2">{level.useCase}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Output Format */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Output Format</h3>
                <p className="text-sm text-gray-600">Choose how you want to receive the results</p>
              </div>
              
              <div className="p-6 space-y-3">
                {outputFormats.map((format) => (
                  <label
                    key={format.format}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all block ${
                      ocrSettings.outputFormat === format.format
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outputFormat"
                      value={format.format}
                      checked={ocrSettings.outputFormat === format.format}
                      onChange={(e) => setOcrSettings(prev => ({
                        ...prev,
                        outputFormat: e.target.value as OCRSettings['outputFormat']
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
                        <div className="mt-2 space-y-1">
                          {format.features.map((feature, index) => (
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
          </div>

          {/* Advanced Processing Options */}
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
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Image Preprocessing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={ocrSettings.preprocessing.autoRotate}
                          onChange={(e) => setOcrSettings(prev => ({
                            ...prev,
                            preprocessing: {...prev.preprocessing, autoRotate: e.target.checked}
                          }))}
                          className="rounded text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Auto-Rotate</div>
                          <div className="text-sm text-gray-500">Automatically correct page orientation</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={ocrSettings.preprocessing.denoiseImages}
                          onChange={(e) => setOcrSettings(prev => ({
                            ...prev,
                            preprocessing: {...prev.preprocessing, denoiseImages: e.target.checked}
                          }))}
                          className="rounded text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Denoise Images</div>
                          <div className="text-sm text-gray-500">Remove noise and artifacts</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={ocrSettings.preprocessing.enhanceContrast}
                          onChange={(e) => setOcrSettings(prev => ({
                            ...prev,
                            preprocessing: {...prev.preprocessing, enhanceContrast: e.target.checked}
                          }))}
                          className="rounded text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Enhance Contrast</div>
                          <div className="text-sm text-gray-500">Improve text clarity</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={ocrSettings.preprocessing.straightenText}
                          onChange={(e) => setOcrSettings(prev => ({
                            ...prev,
                            preprocessing: {...prev.preprocessing, straightenText: e.target.checked}
                          }))}
                          className="rounded text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Straighten Text</div>
                          <div className="text-sm text-gray-500">Correct skewed text lines</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Text Post-Processing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={ocrSettings.postprocessing.spellCheck}
                          onChange={(e) => setOcrSettings(prev => ({
                            ...prev,
                            postprocessing: {...prev.postprocessing, spellCheck: e.target.checked}
                          }))}
                          className="rounded text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Spell Check</div>
                          <div className="text-sm text-gray-500">Correct common OCR errors</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={ocrSettings.postprocessing.formatText}
                          onChange={(e) => setOcrSettings(prev => ({
                            ...prev,
                            postprocessing: {...prev.postprocessing, formatText: e.target.checked}
                          }))}
                          className="rounded text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Format Text</div>
                          <div className="text-sm text-gray-500">Preserve formatting and structure</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={ocrSettings.postprocessing.detectTables}
                          onChange={(e) => setOcrSettings(prev => ({
                            ...prev,
                            postprocessing: {...prev.postprocessing, detectTables: e.target.checked}
                          }))}
                          className="rounded text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Detect Tables</div>
                          <div className="text-sm text-gray-500">Recognize and structure tables</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={ocrSettings.postprocessing.extractImages}
                          onChange={(e) => setOcrSettings(prev => ({
                            ...prev,
                            postprocessing: {...prev.postprocessing, extractImages: e.target.checked}
                          }))}
                          className="rounded text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Extract Images</div>
                          <div className="text-sm text-gray-500">Save images as separate files</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF Files for OCR</h3>
              <p className="text-sm text-gray-600">Upload scanned PDFs or image-based documents for text extraction</p>
            </div>
            
            <div className="p-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload PDF Files for OCR Processing
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
                <p className="text-sm text-gray-600">Files ready for OCR processing</p>
              </div>
              
              <div className="p-6 space-y-4">
                {pdfFiles.map((file, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-8 h-8 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          <p className="text-sm text-gray-600">
                            {file.totalPages} pages • {formatFileSize(file.size)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getFileStatusColor(file)}`}>
                              {getFileStatusText(file)}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              Detected: {supportedLanguages.find(lang => lang.code === file.detectedLanguage)?.name || 'Unknown'}
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
                    
                    {file.ocrNeeded && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            OCR Processing Recommended
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          This file contains scanned content that would benefit from text recognition.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Preview */}
          {selectedAccuracy && selectedFormat && selectedLanguages.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">OCR Processing Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Languages:</span>
                      <div className="font-medium text-blue-600">{selectedLanguages.length} selected</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Accuracy:</span>
                      <div className="font-medium text-green-600">{selectedAccuracy.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output:</span>
                      <div className="font-medium text-purple-600">{selectedFormat.name}</div>
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

          {/* Process OCR Button */}
          <div className="text-center mb-6">
            <button
              onClick={processOCR}
              disabled={isProcessing || pdfFiles.length === 0 || selectedLanguages.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing OCR...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Process OCR
                </>
              )}
            </button>
          </div>

          {/* OCR Results */}
          {ocrResults.length > 0 && (
            <div className="space-y-4 mb-6">
              {ocrResults.map((result, index) => (
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
                          {result.success ? 'OCR Processing Successful!' : 'OCR Processing Failed'}
                        </h3>
                        <p className="text-sm text-gray-600">{result.fileName}</p>
                        {result.success && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Confidence: {result.confidence}%
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              Languages: {result.detectedLanguages.join(', ')}
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
                          <div className="text-gray-600">Characters</div>
                          <div className="text-lg font-semibold text-blue-600">
                            {result.charactersExtracted.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Words</div>
                          <div className="text-lg font-semibold text-green-600">
                            {result.wordsExtracted.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Tables</div>
                          <div className="text-lg font-semibold text-purple-600">
                            {result.tablesDetected}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">Processing</div>
                          <div className="text-lg font-semibold text-orange-600">
                            {result.processingTime}s
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="text-gray-600">File Size</div>
                          <div className="text-lg font-semibold text-red-600">
                            {formatFileSize(result.processedSize)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-medium text-gray-900 mb-2">Extracted Text Preview:</h4>
                        <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 font-mono max-h-32 overflow-y-auto">
                          {result.textPreview}
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
                            <Search className="w-4 h-4 inline mr-1" />
                            Make Searchable
                          </button>
                          <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors">
                            <Copy className="w-4 h-4 inline mr-1" />
                            Copy Text
                          </button>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👁️ OCR Capabilities</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>16+ languages supported</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>High accuracy text recognition</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Table and layout detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Image enhancement preprocessing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple output formats</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Advanced Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  <span>Multi-language document support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Type className="w-4 h-4 text-green-500" />
                  <span>Spell checking and correction</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-green-500" />
                  <span>Searchable PDF creation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span>Custom preprocessing options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span>Confidence scoring</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How OCR Processing Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Languages className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Select Languages</h4>
                <p className="text-sm text-gray-600">Choose the languages in your documents</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Upload PDFs</h4>
                <p className="text-sm text-gray-600">Add your scanned PDF documents</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Process OCR</h4>
                <p className="text-sm text-gray-600">Extract and recognize text content</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your searchable documents</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

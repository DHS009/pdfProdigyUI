'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Code, RefreshCw, CheckCircle, Settings, FileText, Eye, Zap, Shield, Globe, Link, Layout } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface ConversionMode {
  id: 'url' | 'html_code' | 'file_upload' | 'webpage';
  label: string;
  description: string;
  features: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  recommended?: boolean;
}

interface ConversionResult {
  downloadUrl: string;
  fileName: string;
  pages: number;
  fileSize: number;
  conversionTime: number;
  quality: string;
  sourceType: string;
}

export default function HtmlToPdfPage() {
  const [conversionMode, setConversionMode] = useState<ConversionMode['id']>('url');
  const [urlInput, setUrlInput] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const conversionModes: ConversionMode[] = [
    {
      id: 'url',
      label: 'Website URL',
      description: 'Convert any website or webpage to PDF',
      features: ['Live web pages', 'Dynamic content', 'CSS styling', 'Interactive elements'],
      icon: Globe,
      recommended: true
    },
    {
      id: 'html_code',
      label: 'HTML Code',
      description: 'Paste HTML code directly for conversion',
      features: ['Custom HTML', 'Inline CSS', 'Quick conversion', 'Code testing'],
      icon: Code
    },
    {
      id: 'file_upload',
      label: 'HTML File',
      description: 'Upload HTML files from your computer',
      features: ['Local files', 'Complete projects', 'Asset linking', 'Bulk processing'],
      icon: Upload
    },
    {
      id: 'webpage',
      label: 'Webpage Capture',
      description: 'Advanced webpage capture with full rendering',
      features: ['Full page capture', 'JavaScript execution', 'Complete rendering', 'Mobile responsive'],
      icon: Layout
    }
  ];

  const handleFileUpload = useCallback((file: File) => {
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const acceptedExtensions = ['html', 'htm'];
    
    if (acceptedExtensions.includes(fileExtension || '')) {
      setHtmlFile(file);
      setConversionResult(null);
    } else {
      alert('Please upload a valid HTML file (.html, .htm)');
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

  const convertToPdf = async () => {
    let hasContent = false;
    
    // Check if we have content based on conversion mode
    switch (conversionMode) {
      case 'url':
        hasContent = urlInput.trim() !== '';
        break;
      case 'html_code':
        hasContent = htmlCode.trim() !== '';
        break;
      case 'file_upload':
        hasContent = htmlFile !== null;
        break;
      case 'webpage':
        hasContent = urlInput.trim() !== '';
        break;
    }
    
    if (!hasContent) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Simulate conversion results
      const pages = Math.floor(Math.random() * 10) + 1;
      const conversionTime = Math.floor(Math.random() * 8) + 3;
      
      // Estimate file size based on content
      let baseSize = 50000; // Base size in bytes
      
      switch (conversionMode) {
        case 'url':
        case 'webpage':
          baseSize = Math.random() * 500000 + 100000; // 100KB - 600KB
          break;
        case 'html_code':
          baseSize = htmlCode.length * 10 + 50000; // Based on code length
          break;
        case 'file_upload':
          baseSize = htmlFile ? htmlFile.size * 2 : 50000; // Roughly 2x file size
          break;
      }
      
      const qualityMap = {
        url: 'High',
        html_code: 'Standard',
        file_upload: 'Good',
        webpage: 'Premium'
      };
      
      const sourceMap = {
        url: 'Website URL',
        html_code: 'HTML Code',
        file_upload: 'HTML File',
        webpage: 'Webpage Capture'
      };
      
      setConversionResult({
        downloadUrl: 'converted-webpage.pdf',
        fileName: conversionMode === 'url' || conversionMode === 'webpage' 
          ? 'webpage.pdf' 
          : conversionMode === 'file_upload' && htmlFile
            ? htmlFile.name.replace(/\.(html|htm)$/i, '.pdf')
            : 'html-document.pdf',
        pages,
        fileSize: baseSize,
        conversionTime,
        quality: qualityMap[conversionMode],
        sourceType: sourceMap[conversionMode]
      });
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
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

  const selectedMode = conversionModes.find(mode => mode.id === conversionMode);

  const sampleHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Sample HTML Document</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        .highlight { background-color: #ffff99; }
    </style>
</head>
<body>
    <h1>Welcome to HTML to PDF Conversion</h1>
    <p>This is a <span class="highlight">sample HTML document</span> that demonstrates the conversion process.</p>
    <ul>
        <li>Preserves formatting</li>
        <li>Maintains CSS styles</li>
        <li>Supports various elements</li>
    </ul>
</body>
</html>`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <Code className="w-8 h-8 text-orange-600" />
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">HTML to PDF Converter</h1>
            <p className="text-lg text-gray-600">
              Convert HTML code, web pages, and HTML files to PDF documents. Preserve styling, layout, and formatting with high-quality output.
            </p>
          </div>

          {/* Conversion Modes */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Source</h3>
              <p className="text-sm text-gray-600">Choose how you want to provide the HTML content</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {conversionModes.map((mode) => (
                <label
                  key={mode.id}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    conversionMode === mode.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="conversionMode"
                    value={mode.id}
                    checked={conversionMode === mode.id}
                    onChange={(e) => setConversionMode(e.target.value as ConversionMode['id'])}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <mode.icon className="w-5 h-5 text-orange-600" />
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

          {/* Content Input */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HTML Content</h3>
              <p className="text-sm text-gray-600">Provide your HTML content for conversion</p>
            </div>
            
            <div className="p-6">
              {(conversionMode === 'url' || conversionMode === 'webpage') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        onClick={() => setUrlInput('https://example.com')}
                        className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Example
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Enter the complete URL including https:// or http://
                    </p>
                  </div>
                  
                  {urlInput && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-900">URL Preview</span>
                      </div>
                      <div className="text-sm text-gray-600 break-all">{urlInput}</div>
                    </div>
                  )}
                </div>
              )}

              {conversionMode === 'html_code' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTML Code
                    </label>
                    <textarea
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      placeholder="Paste your HTML code here..."
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500">
                        Characters: {htmlCode.length}
                      </p>
                      <button
                        onClick={() => setHtmlCode(sampleHtml)}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200 transition-colors"
                      >
                        Load Sample HTML
                      </button>
                    </div>
                  </div>
                  
                  {htmlCode && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-900">HTML Preview</span>
                      </div>
                      <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-mono text-xs">{htmlCode.substring(0, 300)}
                          {htmlCode.length > 300 && '...'}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {conversionMode === 'file_upload' && (
                <div className="space-y-4">
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Upload HTML File
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your HTML file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".html,.htm"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="html-upload"
                    />
                    <label
                      htmlFor="html-upload"
                      className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
                    >
                      <Code className="w-5 h-5 mr-2" />
                      Select HTML File
                    </label>
                  </div>
                  
                  {htmlFile && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900">{htmlFile.name}</div>
                          <div className="text-sm text-gray-600">
                            Size: {formatFileSize(htmlFile.size)} • HTML File
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                  <span className="font-medium text-gray-900">Advanced PDF Options</span>
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
                        Page Size
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option>A4</option>
                        <option>Letter</option>
                        <option>Legal</option>
                        <option>A3</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Orientation
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option>Portrait</option>
                        <option>Landscape</option>
                        <option>Auto</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Margins
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option>Default</option>
                        <option>None</option>
                        <option>Minimal</option>
                        <option>Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scale
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option>100% (default)</option>
                        <option>75%</option>
                        <option>50%</option>
                        <option>125%</option>
                        <option>150%</option>
                      </select>
                    </div>
                  </div>
                  {(conversionMode === 'url' || conversionMode === 'webpage') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Wait Time (seconds)
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option>0 (immediate)</option>
                          <option>2</option>
                          <option>5</option>
                          <option>10</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile View
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option>Desktop view</option>
                          <option>Mobile view</option>
                          <option>Tablet view</option>
                        </select>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-orange-600" defaultChecked />
                      <span className="text-sm text-gray-700">Include background graphics</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-orange-600" defaultChecked />
                      <span className="text-sm text-gray-700">Enable JavaScript</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-orange-600" />
                      <span className="text-sm text-gray-700">Include headers and footers</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-orange-600" />
                      <span className="text-sm text-gray-700">Password protect PDF</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conversion Preview */}
          {selectedMode && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6 border border-orange-200">
              <div className="flex items-start space-x-3">
                <Layout className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conversion Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Source:</span>
                      <div className="font-medium text-orange-600">{selectedMode.label}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output Format:</span>
                      <div className="font-medium text-red-600">PDF Document</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Content:</span>
                      <div className="font-medium text-green-600">
                        {conversionMode === 'url' && urlInput ? 'URL Ready' :
                         conversionMode === 'html_code' && htmlCode ? 'HTML Code Ready' :
                         conversionMode === 'file_upload' && htmlFile ? 'File Ready' :
                         conversionMode === 'webpage' && urlInput ? 'Webpage Ready' : 'Waiting for content'}
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
              disabled={isProcessing || 
                (conversionMode === 'url' && !urlInput) ||
                (conversionMode === 'html_code' && !htmlCode) ||
                (conversionMode === 'file_upload' && !htmlFile) ||
                (conversionMode === 'webpage' && !urlInput)
              }
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
          {conversionResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <div className="text-green-600 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                HTML Converted to PDF Successfully!
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Pages</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {conversionResult.pages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">File Size</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {formatFileSize(conversionResult.fileSize)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Quality</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {conversionResult.quality}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Source</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {conversionResult.sourceType}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Time</div>
                  <div className="text-lg font-semibold text-green-600">
                    {conversionResult.conversionTime}s
                  </div>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🌐 Web Conversion Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Live website conversion</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>CSS styling preservation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>JavaScript execution</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Responsive design support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple input formats</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Files auto-deleted after 1 hour</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure cloud processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>No registration required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>GDPR compliant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>256-bit SSL encryption</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How HTML to PDF Conversion Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Choose Source</h4>
                <p className="text-sm text-gray-600">Select URL, HTML code, file upload, or webpage capture</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Code className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Provide Content</h4>
                <p className="text-sm text-gray-600">Enter URL, paste HTML, or upload files</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Convert</h4>
                <p className="text-sm text-gray-600">Process with CSS styling and layout preservation</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your high-quality PDF document</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

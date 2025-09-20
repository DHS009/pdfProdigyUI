'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Table, RefreshCw, CheckCircle, Settings, FileText, Eye, Zap, Shield, Layout, BarChart, Grid } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface ConversionMode {
  id: 'worksheet' | 'workbook' | 'selection' | 'charts';
  label: string;
  description: string;
  features: string[];
  icon: string;
  recommended?: boolean;
}

interface ConversionResult {
  downloadUrl: string;
  fileName: string;
  pages: number;
  worksheets: number;
  fileSize: number;
  conversionTime: number;
  quality: string;
}

export default function ExcelToPdfPage() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [conversionMode, setConversionMode] = useState<ConversionMode['id']>('worksheet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const conversionModes: ConversionMode[] = [
    {
      id: 'worksheet',
      label: 'Active Worksheet',
      description: 'Convert the currently active worksheet to PDF',
      features: ['Single worksheet', 'Fast conversion', 'Preserve formatting', 'Auto-fit pages'],
      icon: '📊',
      recommended: true
    },
    {
      id: 'workbook',
      label: 'Entire Workbook',
      description: 'Convert all worksheets to a single PDF',
      features: ['All worksheets', 'Separate pages', 'Table of contents', 'Comprehensive'],
      icon: '📋'
    },
    {
      id: 'selection',
      label: 'Selected Range',
      description: 'Convert specific cell ranges or areas',
      features: ['Custom ranges', 'Print areas', 'Flexible selection', 'Optimized layout'],
      icon: '🎯'
    },
    {
      id: 'charts',
      label: 'Charts & Graphics',
      description: 'Focus on charts, graphs, and visual elements',
      features: ['High-res charts', 'Vector graphics', 'Data visualization', 'Professional quality'],
      icon: '📈'
    }
  ];

  const acceptedFormats = [
    '.xls', '.xlsx', '.xlsm', '.xlsb', '.ods', '.csv'
  ];

  const handleFileUpload = useCallback((file: File) => {
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const acceptedExtensions = ['xls', 'xlsx', 'xlsm', 'xlsb', 'ods', 'csv'];
    
    if (acceptedExtensions.includes(fileExtension || '')) {
      setExcelFile(file);
      setConversionResult(null);
    } else {
      alert('Please upload a valid Excel file (.xls, .xlsx, .xlsm, .xlsb, .ods, .csv)');
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
    if (!excelFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Simulate conversion results
      const worksheets = conversionMode === 'workbook' ? Math.floor(Math.random() * 8) + 2 : 1;
      const conversionTime = Math.floor(Math.random() * 7) + 2;
      const baseSize = excelFile.size;
      
      // Adjust file size and pages based on conversion mode
      const sizeMultipliers = {
        worksheet: 1.5,
        workbook: 2.8,
        selection: 0.8,
        charts: 2.2
      };
      
      const pageMultipliers = {
        worksheet: 1,
        workbook: worksheets,
        selection: 0.5,
        charts: Math.ceil(worksheets * 0.3)
      };
      
      const fileSize = baseSize * sizeMultipliers[conversionMode];
      const pages = Math.ceil(pageMultipliers[conversionMode] * Math.max(1, Math.floor(Math.random() * 5) + 1));
      
      const qualityMap = {
        worksheet: 'High',
        workbook: 'Comprehensive',
        selection: 'Optimized',
        charts: 'Premium'
      };
      
      setConversionResult({
        downloadUrl: 'converted-spreadsheet.pdf',
        fileName: excelFile.name.replace(/\.(xls|xlsx|xlsm|xlsb|ods|csv)$/i, '.pdf'),
        pages,
        worksheets,
        fileSize,
        conversionTime,
        quality: qualityMap[conversionMode]
      });
    } catch (error) {
      console.error('Error converting Excel to PDF:', error);
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    const iconMap: { [key: string]: string } = {
      'xls': '📊',
      'xlsx': '📈',
      'xlsm': '📋',
      'xlsb': '📉',
      'ods': '📄',
      'csv': '📝'
    };
    return iconMap[extension || 'xlsx'] || '📊';
  };

  const selectedMode = conversionModes.find(mode => mode.id === conversionMode);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <Table className="w-8 h-8 text-green-600" />
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Excel to PDF Converter</h1>
            <p className="text-lg text-gray-600">
              Convert Excel spreadsheets to PDF format with perfect formatting preservation. Ideal for reports, data sharing, and professional documents.
            </p>
          </div>

          {/* Supported Formats */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-6">
              <span className="text-sm font-medium text-green-800">Supported formats:</span>
              {acceptedFormats.map((format, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {format.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-green-50 hover:bg-green-100 transition-colors mb-6"
          >
            <Upload className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Excel Spreadsheet
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your Excel file here, or click to browse
            </p>
            <input
              type="file"
              accept=".xls,.xlsx,.xlsm,.xlsb,.ods,.csv"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              <Table className="w-5 h-5 mr-2" />
              Select Excel File
            </label>
          </div>

          {/* Uploaded File Info */}
          {excelFile && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                    {getFileIcon(excelFile.name)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{excelFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {formatFileSize(excelFile.size)} • {excelFile.name.split('.').pop()?.toUpperCase()} Spreadsheet
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Ready to convert</div>
                  <div className="text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conversion Modes */}
          {excelFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Options</h3>
                <p className="text-sm text-gray-600">Choose what part of your Excel file to convert to PDF</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {conversionModes.map((mode) => (
                  <label
                    key={mode.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      conversionMode === mode.id
                        ? 'border-green-500 bg-green-50'
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
                      <div className="text-2xl">{mode.icon}</div>
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
          )}

          {/* Advanced Settings */}
          {excelFile && (
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
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <option>Auto (from Excel)</option>
                          <option>A4</option>
                          <option>Letter</option>
                          <option>Legal</option>
                          <option>A3</option>
                          <option>Tabloid</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Orientation
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <option>Auto (from Excel)</option>
                          <option>Portrait</option>
                          <option>Landscape</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Scaling
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <option>Fit to page width</option>
                          <option>Fit to page</option>
                          <option>100% (no scaling)</option>
                          <option>75% scaling</option>
                          <option>50% scaling</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Margins
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <option>Normal</option>
                          <option>Narrow</option>
                          <option>Wide</option>
                          <option>Custom</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Worksheet Range (if Selection)
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g., A1:Z100" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          disabled={conversionMode !== 'selection'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PDF Quality
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <option>High (recommended)</option>
                          <option>Maximum</option>
                          <option>Medium</option>
                          <option>Web optimized</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600" defaultChecked />
                        <span className="text-sm text-gray-700">Include headers and footers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600" defaultChecked />
                        <span className="text-sm text-gray-700">Include gridlines</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600" />
                        <span className="text-sm text-gray-700">Include comments</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600" />
                        <span className="text-sm text-gray-700">Include error values</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conversion Preview */}
          {excelFile && selectedMode && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
              <div className="flex items-start space-x-3">
                <BarChart className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conversion Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mode:</span>
                      <div className="font-medium text-green-600">{selectedMode.label}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output Format:</span>
                      <div className="font-medium text-red-600">PDF Document</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Content:</span>
                      <div className="font-medium text-blue-600">
                        {conversionMode === 'workbook' ? 'All Worksheets' : 
                         conversionMode === 'selection' ? 'Selected Range' : 
                         conversionMode === 'charts' ? 'Charts & Graphics' : 'Active Worksheet'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          {excelFile && (
            <div className="text-center mb-6">
              <button
                onClick={convertToPdf}
                disabled={isProcessing}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
          )}

          {/* Conversion Result */}
          {conversionResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <div className="text-green-600 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Excel Converted to PDF Successfully!
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Pages</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {conversionResult.pages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-gray-600">Worksheets</div>
                  <div className="text-lg font-semibold text-green-600">
                    {conversionResult.worksheets}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Perfect for Reports</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Preserve Excel formatting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Include charts and graphs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple conversion options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional page layout</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Print-ready output</span>
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
                  <span>No file size limitations</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How Excel to PDF Conversion Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload Excel</h4>
                <p className="text-sm text-gray-600">Choose your spreadsheet file (.xls, .xlsx, .csv, etc.)</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Grid className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Select Content</h4>
                <p className="text-sm text-gray-600">Choose conversion mode and options</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Process</h4>
                <p className="text-sm text-gray-600">Convert with formatting preservation</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Get your professional PDF document</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

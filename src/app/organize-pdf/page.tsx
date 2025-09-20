'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Move, RotateCw, Trash2, Copy, FileText, Eye, Grid3X3, List, ChevronLeft, ChevronRight, RefreshCw, Zap, CheckCircle, AlertTriangle, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

interface PDFPage {
  id: string;
  pageNumber: number;
  thumbnail: string;
  rotation: number;
  width: number;
  height: number;
  isSelected: boolean;
}

interface PDFFile {
  file: File;
  name: string;
  size: number;
  pages: PDFPage[];
  totalPages: number;
}

interface OrganizeResult {
  success: boolean;
  fileName: string;
  originalPages: number;
  finalPages: number;
  operations: string[];
  processingTime: number;
  downloadUrl: string;
}

type ViewMode = 'grid' | 'list';
type Operation = 'reorder' | 'duplicate' | 'delete' | 'rotate' | 'extract';

export default function OrganizePdfPage() {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [draggedPage, setDraggedPage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [organizeResult, setOrganizeResult] = useState<OrganizeResult | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const generateMockPages = (pageCount: number): PDFPage[] => {
    return Array.from({ length: pageCount }, (_, index) => ({
      id: `page-${index + 1}`,
      pageNumber: index + 1,
      thumbnail: `/api/placeholder/200/280?text=Page ${index + 1}`,
      rotation: 0,
      width: 210,
      height: 297,
      isSelected: false
    }));
  };

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      // Simulate PDF processing
      const mockPageCount = Math.floor(Math.random() * 20) + 5; // 5-24 pages
      const pages = generateMockPages(mockPageCount);
      
      setPdfFile({
        file,
        name: file.name,
        size: file.size,
        pages,
        totalPages: mockPageCount
      });
      setSelectedPages([]);
      setOrganizeResult(null);
      setOperations([]);
    } else {
      alert('Please upload a valid PDF file.');
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

  const togglePageSelection = (pageId: string) => {
    setSelectedPages(prev => 
      prev.includes(pageId) 
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const selectAllPages = () => {
    if (!pdfFile) return;
    setSelectedPages(pdfFile.pages.map(page => page.id));
  };

  const clearSelection = () => {
    setSelectedPages([]);
  };

  const handlePageDragStart = (e: React.DragEvent, pageId: string) => {
    setDraggedPage(pageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handlePageDrop = (e: React.DragEvent, targetPageId: string) => {
    e.preventDefault();
    if (!draggedPage || !pdfFile || draggedPage === targetPageId) return;

    const newPages = [...pdfFile.pages];
    const draggedIndex = newPages.findIndex(page => page.id === draggedPage);
    const targetIndex = newPages.findIndex(page => page.id === targetPageId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedPageObj] = newPages.splice(draggedIndex, 1);
      newPages.splice(targetIndex, 0, draggedPageObj);

      // Update page numbers
      newPages.forEach((page, index) => {
        page.pageNumber = index + 1;
      });

      setPdfFile(prev => prev ? { ...prev, pages: newPages } : null);
      if (!operations.includes('reorder')) {
        setOperations(prev => [...prev, 'reorder']);
      }
    }
    setDraggedPage(null);
  };

  const rotatePage = (pageId: string, degrees: number = 90) => {
    if (!pdfFile) return;
    
    const newPages = pdfFile.pages.map(page => 
      page.id === pageId 
        ? { ...page, rotation: (page.rotation + degrees) % 360 }
        : page
    );
    
    setPdfFile(prev => prev ? { ...prev, pages: newPages } : null);
    if (!operations.includes('rotate')) {
      setOperations(prev => [...prev, 'rotate']);
    }
  };

  const rotateSelectedPages = (degrees: number = 90) => {
    if (!pdfFile || selectedPages.length === 0) return;
    
    const newPages = pdfFile.pages.map(page => 
      selectedPages.includes(page.id)
        ? { ...page, rotation: (page.rotation + degrees) % 360 }
        : page
    );
    
    setPdfFile(prev => prev ? { ...prev, pages: newPages } : null);
    if (!operations.includes('rotate')) {
      setOperations(prev => [...prev, 'rotate']);
    }
  };

  const duplicateSelectedPages = () => {
    if (!pdfFile || selectedPages.length === 0) return;
    
    const selectedPageObjects = pdfFile.pages.filter(page => selectedPages.includes(page.id));
    const duplicatedPages = selectedPageObjects.map((page, index) => ({
      ...page,
      id: `${page.id}-copy-${Date.now()}-${index}`,
      pageNumber: pdfFile.pages.length + index + 1
    }));
    
    const newPages = [...pdfFile.pages, ...duplicatedPages];
    
    // Update page numbers
    newPages.forEach((page, index) => {
      page.pageNumber = index + 1;
    });
    
    setPdfFile(prev => prev ? { 
      ...prev, 
      pages: newPages,
      totalPages: newPages.length
    } : null);
    
    if (!operations.includes('duplicate')) {
      setOperations(prev => [...prev, 'duplicate']);
    }
    setSelectedPages([]);
  };

  const deleteSelectedPages = () => {
    if (!pdfFile || selectedPages.length === 0) return;
    
    if (selectedPages.length === pdfFile.pages.length) {
      alert('Cannot delete all pages. PDF must have at least one page.');
      return;
    }
    
    const newPages = pdfFile.pages.filter(page => !selectedPages.includes(page.id));
    
    // Update page numbers
    newPages.forEach((page, index) => {
      page.pageNumber = index + 1;
    });
    
    setPdfFile(prev => prev ? { 
      ...prev, 
      pages: newPages,
      totalPages: newPages.length
    } : null);
    
    if (!operations.includes('delete')) {
      setOperations(prev => [...prev, 'delete']);
    }
    setSelectedPages([]);
  };

  const moveSelectedPages = (direction: 'up' | 'down') => {
    if (!pdfFile || selectedPages.length === 0) return;
    
    const newPages = [...pdfFile.pages];
    const selectedIndices = selectedPages.map(pageId => 
      newPages.findIndex(page => page.id === pageId)
    ).sort((a, b) => direction === 'up' ? a - b : b - a);
    
    selectedIndices.forEach(index => {
      if (direction === 'up' && index > 0) {
        [newPages[index], newPages[index - 1]] = [newPages[index - 1], newPages[index]];
      } else if (direction === 'down' && index < newPages.length - 1) {
        [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
      }
    });
    
    // Update page numbers
    newPages.forEach((page, index) => {
      page.pageNumber = index + 1;
    });
    
    setPdfFile(prev => prev ? { ...prev, pages: newPages } : null);
    if (!operations.includes('reorder')) {
      setOperations(prev => [...prev, 'reorder']);
    }
  };

  const savePdf = async () => {
    if (!pdfFile || operations.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate PDF processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setOrganizeResult({
        success: true,
        fileName: pdfFile.name.replace('.pdf', '_organized.pdf'),
        originalPages: pdfFile.totalPages,
        finalPages: pdfFile.pages.length,
        operations: operations.map(op => {
          switch (op) {
            case 'reorder': return 'Pages Reordered';
            case 'duplicate': return 'Pages Duplicated';
            case 'delete': return 'Pages Deleted';
            case 'rotate': return 'Pages Rotated';
            case 'extract': return 'Pages Extracted';
            default: return 'Unknown Operation';
          }
        }),
        processingTime: Math.floor(Math.random() * 5) + 2,
        downloadUrl: `organized-${pdfFile.name}`
      });
    } catch (error) {
      console.error('Error organizing PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPdf = () => {
    if (!pdfFile) return;
    
    const originalPages = generateMockPages(pdfFile.totalPages);
    setPdfFile(prev => prev ? { ...prev, pages: originalPages } : null);
    setSelectedPages([]);
    setOperations([]);
    setOrganizeResult(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <Move className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Organize PDF Pages</h1>
            <p className="text-lg text-gray-600">
              Reorder, rotate, duplicate, and delete PDF pages. Organize your PDF documents with drag-and-drop simplicity.
            </p>
          </div>

          {/* File Upload */}
          {!pdfFile && (
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF File</h3>
                <p className="text-sm text-gray-600">Upload a PDF file to start organizing its pages</p>
              </div>
              
              <div className="p-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload PDF File to Organize
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your PDF file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Select PDF File
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* PDF Organizer Interface */}
          {pdfFile && (
            <>
              {/* Control Panel */}
              <div className="bg-white rounded-xl border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{pdfFile.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pdfFile.pages.length} pages • {formatFileSize(pdfFile.size)}
                        {operations.length > 0 && (
                          <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            {operations.length} operation(s) pending
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-sm font-medium text-gray-700">Selection:</span>
                    <button
                      onClick={selectAllPages}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      disabled={selectedPages.length === 0}
                    >
                      Clear ({selectedPages.length})
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Actions:</span>
                    
                    <button
                      onClick={() => moveSelectedPages('up')}
                      disabled={selectedPages.length === 0}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <ArrowUp className="w-4 h-4 mr-1" />
                      Move Up
                    </button>
                    
                    <button
                      onClick={() => moveSelectedPages('down')}
                      disabled={selectedPages.length === 0}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <ArrowDown className="w-4 h-4 mr-1" />
                      Move Down
                    </button>
                    
                    <button
                      onClick={() => rotateSelectedPages(90)}
                      disabled={selectedPages.length === 0}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <RotateCw className="w-4 h-4 mr-1" />
                      Rotate
                    </button>
                    
                    <button
                      onClick={duplicateSelectedPages}
                      disabled={selectedPages.length === 0}
                      className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicate
                    </button>
                    
                    <button
                      onClick={deleteSelectedPages}
                      disabled={selectedPages.length === 0 || selectedPages.length === pdfFile.pages.length}
                      className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                    
                    <button
                      onClick={resetPdf}
                      disabled={operations.length === 0}
                      className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Pages Display */}
              <div className="bg-white rounded-xl border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Pages</h3>
                  <p className="text-sm text-gray-600">Drag and drop pages to reorder, or use the controls above</p>
                </div>
                
                <div className="p-6">
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {pdfFile.pages.map((page) => (
                        <div
                          key={page.id}
                          draggable
                          onDragStart={(e) => handlePageDragStart(e, page.id)}
                          onDragOver={handlePageDragOver}
                          onDrop={(e) => handlePageDrop(e, page.id)}
                          className={`relative border-2 rounded-lg p-2 cursor-move transition-all ${
                            selectedPages.includes(page.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${draggedPage === page.id ? 'opacity-50' : ''}`}
                        >
                          <div
                            onClick={() => togglePageSelection(page.id)}
                            className="relative group"
                          >
                            <div 
                              className="w-full aspect-[3/4] bg-gray-100 rounded border flex items-center justify-center text-gray-500 overflow-hidden"
                              style={{ 
                                transform: `rotate(${page.rotation}deg)`,
                                transition: 'transform 0.3s ease'
                              }}
                            >
                              <FileText className="w-8 h-8" />
                            </div>
                            
                            {selectedPages.includes(page.id) && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3" />
                              </div>
                            )}
                            
                            <div className="mt-2 text-center">
                              <div className="text-sm font-medium text-gray-900">
                                Page {page.pageNumber}
                              </div>
                              {page.rotation > 0 && (
                                <div className="text-xs text-orange-600">
                                  Rotated {page.rotation}°
                                </div>
                              )}
                            </div>
                            
                            <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  rotatePage(page.id, 90);
                                }}
                                className="p-1 bg-white border border-gray-300 rounded shadow hover:bg-gray-50"
                              >
                                <RotateCw className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pdfFile.pages.map((page) => (
                        <div
                          key={page.id}
                          draggable
                          onDragStart={(e) => handlePageDragStart(e, page.id)}
                          onDragOver={handlePageDragOver}
                          onDrop={(e) => handlePageDrop(e, page.id)}
                          className={`flex items-center p-3 border rounded-lg cursor-move transition-all ${
                            selectedPages.includes(page.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${draggedPage === page.id ? 'opacity-50' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPages.includes(page.id)}
                            onChange={() => togglePageSelection(page.id)}
                            className="mr-3 rounded text-blue-600"
                          />
                          
                          <div className="w-12 h-16 bg-gray-100 rounded border flex items-center justify-center mr-4">
                            <FileText className="w-6 h-6 text-gray-500" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              Page {page.pageNumber}
                            </div>
                            <div className="text-sm text-gray-600">
                              {page.width} × {page.height} mm
                              {page.rotation > 0 && (
                                <span className="ml-2 text-orange-600">
                                  • Rotated {page.rotation}°
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => rotatePage(page.id, 90)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>
                            <ArrowUpDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={savePdf}
                  disabled={isProcessing || operations.length === 0}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Save Organized PDF
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setPdfFile(null)}
                  className="px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Upload New PDF
                </button>
              </div>
            </>
          )}

          {/* Organize Result */}
          {organizeResult && (
            <div className={`rounded-xl p-6 border mb-6 ${
              organizeResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {organizeResult.success ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      organizeResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {organizeResult.success ? 'PDF Organized Successfully!' : 'Organization Failed'}
                    </h3>
                    <p className="text-sm text-gray-600">{organizeResult.fileName}</p>
                  </div>
                </div>
                {organizeResult.success && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
              </div>
              
              {organizeResult.success && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Original Pages</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {organizeResult.originalPages}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Final Pages</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {organizeResult.finalPages}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Operations</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {organizeResult.operations.length}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-gray-600">Processing Time</div>
                      <div className="text-lg font-semibold text-green-600">
                        {organizeResult.processingTime}s
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-gray-900 mb-2">Operations Performed:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {organizeResult.operations.map((operation, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">{operation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Organization Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Drag and drop page reordering</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Rotate pages individually or in bulk</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Duplicate pages with one click</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Delete unwanted pages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Grid and list view modes</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Client-side processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Files never leave your device</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No registration required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>100% privacy guaranteed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How PDF Organization Works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Upload PDF</h4>
                <p className="text-sm text-gray-600">Upload your PDF file to start organizing</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Move className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Organize Pages</h4>
                <p className="text-sm text-gray-600">Drag, rotate, duplicate, or delete pages</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Preview Changes</h4>
                <p className="text-sm text-gray-600">See your changes in real-time</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">4. Download</h4>
                <p className="text-sm text-gray-600">Save your organized PDF</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

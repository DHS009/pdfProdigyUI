'use client';

import { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Type, Save } from 'lucide-react';

interface ReliablePDFEditorProps {
  pdfUrl: string;
  activeTool: string | null;
  fileId?: string;
  onSave?: (annotations: any[]) => Promise<void>;
}

interface TextAnnotation {
  id: string;
  text: string;
  x: number;
  y: number;
  page: number;
  fontSize: number;
  color: string;
}

export default function ReliablePDFEditor({ pdfUrl, activeTool, fileId, onSave }: ReliablePDFEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load PDF when component mounts and pdfUrl changes
  useEffect(() => {
    if (isClient && pdfUrl) {
      loadPDF();
    }
  }, [pdfUrl, isClient]);

  // Re-render page when page number or scale changes
  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale]);

  const loadPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading PDF from URL:', pdfUrl);

      // Dynamically import PDF.js to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker path
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      
      console.log('PDF loaded successfully:', pdf);
      
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async (pageNumber: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      console.log('Rendering page:', pageNumber);
      
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      console.log('Page rendered successfully');
      
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'add-text') return;

    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAnnotation: TextAnnotation = {
      id: Date.now().toString(),
      text: 'Click to edit',
      x,
      y,
      page: currentPage,
      fontSize: 16,
      color: '#000000'
    };

    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleAnnotationEdit = (id: string, newText: string) => {
    setAnnotations(prev => 
      prev.map(ann => ann.id === id ? { ...ann, text: newText } : ann)
    );
  };

  const handleSave = async () => {
    if (!onSave || !fileId) return;
    
    try {
      await onSave(annotations);
      alert('Annotations saved successfully!');
    } catch (error) {
      console.error('Error saving annotations:', error);
      alert('Failed to save annotations');
    }
  };

  // Navigation functions
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => setScale(Math.min(scale * 1.2, 3));
  const zoomOut = () => setScale(Math.max(scale / 1.2, 0.5));

  // Loading state
  if (!isClient || loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading PDF...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your document</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load PDF</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600 min-w-[100px] text-center">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <button
            onClick={zoomIn}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {annotations.length > 0 && (
            <button
              onClick={handleSave}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          <div className="relative bg-white shadow-lg">
            <canvas 
              ref={canvasRef} 
              className="block max-w-full h-auto"
            />
            
            {/* Overlay for annotations and interactions */}
            <div
              ref={overlayRef}
              className="absolute inset-0 cursor-crosshair"
              onClick={handleCanvasClick}
            >
              {/* Render annotations for current page */}
              {annotations
                .filter(ann => ann.page === currentPage)
                .map(annotation => (
                  <div
                    key={annotation.id}
                    className="absolute bg-yellow-200 border border-yellow-400 p-1 min-w-[100px]"
                    style={{
                      left: annotation.x,
                      top: annotation.y,
                      fontSize: annotation.fontSize,
                      color: annotation.color
                    }}
                  >
                    <input
                      type="text"
                      value={annotation.text}
                      onChange={(e) => handleAnnotationEdit(annotation.id, e.target.value)}
                      className="bg-transparent border-none outline-none w-full"
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tool Instructions */}
      {activeTool && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2">
          <p className="text-sm text-blue-700">
            {activeTool === 'add-text' && '💡 Click anywhere on the PDF to add text'}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * API Service Layer
 * Handles all communication with the PDF Prodigy backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

export interface FileUploadResponse {
  success: boolean;
  message: string;
  files: FileInfo[];
}

export interface FileInfo {
  filename: string;
  size: number;
  mime_type: string;
  file_id: string;
  file_url: string;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface Annotation {
  id: string;
  type: string;
  page: number;
  data: any;
  position: any;
}

export interface SaveAnnotationsResponse {
  success: boolean;
  message: string;
  file_id: string;
  annotation_count: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}${API_VERSION}`;
  }

  /**
   * Upload PDF file(s) to backend
   */
  async uploadFile(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('files', file);

    console.log('Uploading file to:', `${this.baseUrl}/files/upload`);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });

    try {
      const response = await fetch(`${this.baseUrl}/files/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        throw new Error(errorData.detail || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload success:', result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Validate file format before upload
   */
  async validateFile(filename: string): Promise<{
    filename: string;
    is_valid: boolean;
    supported_formats: string[];
    message: string;
  }> {
    console.log('Validating file:', filename);
    
    try {
      const response = await fetch(`${this.baseUrl}/files/validate/${encodeURIComponent(filename)}`);
      
      console.log('Validation response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const result = await response.json();
      console.log('Validation result:', result);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }

  /**
   * Check backend health
   */
  async healthCheck(): Promise<{
    status: string;
    app_name: string;
    version: string;
    timestamp?: number;
  }> {
    console.log('Checking backend health at:', `${API_BASE_URL}/health`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      console.log('Health check response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Health check failed');
      }

      const result = await response.json();
      console.log('Health check result:', result);
      return result;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  /**
   * Save annotations for a PDF file
   */
  async saveAnnotations(fileId: string, annotations: Annotation[]): Promise<SaveAnnotationsResponse> {
    console.log('Saving annotations for file:', fileId);
    console.log('Annotations:', annotations);
    
    try {
      const response = await fetch(`${this.baseUrl}/files/${fileId}/annotations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: fileId,
          annotations: annotations
        }),
      });

      console.log('Save annotations response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save annotations');
      }

      const result = await response.json();
      console.log('Annotations saved successfully:', result);
      return result;
    } catch (error) {
      console.error('Save annotations error:', error);
      throw error;
    }
  }

  /**
   * Get annotations for a PDF file
   */
  async getAnnotations(fileId: string): Promise<{ file_id: string; annotations: Annotation[]; message?: string }> {
    console.log('Getting annotations for file:', fileId);
    
    try {
      const response = await fetch(`${this.baseUrl}/files/${fileId}/annotations`);

      if (!response.ok) {
        throw new Error('Failed to get annotations');
      }

      const result = await response.json();
      console.log('Got annotations:', result);
      return result;
    } catch (error) {
      console.error('Get annotations error:', error);
      throw error;
    }
  }

  /**
   * Export PDF with annotations
   */
  async exportPDF(fileId: string): Promise<Blob> {
    console.log('Exporting PDF with annotations for file:', fileId);
    
    try {
      const response = await fetch(`${this.baseUrl}/files/${fileId}/export`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to export PDF');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export PDF error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

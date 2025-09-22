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
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

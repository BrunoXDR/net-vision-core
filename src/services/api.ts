const API_BASE_URL = 'http://localhost:5000/api/v1';

export interface UploadResponse {
  message: string;
  job_id: string;
}

export interface Job {
  id: string;
  created: string;
}

export interface Report {
  id: string;
  name: string;
}

class ApiService {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`http://localhost:5000/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  async getJobs(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  }

  async getAvailableReports(jobId: string): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/reports`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch available reports');
    }

    return response.json();
  }

  async getReportData(jobId: string, reportId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/reports/${reportId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch report data');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
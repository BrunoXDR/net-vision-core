const API_BASE_URL = 'http://localhost:5000';

export interface UploadResponse {
  message: string;
  job_id: string;
}

export interface Job {
  id: string;
  created: string;
}

export interface ReportFile {
  name: string;
  size: string;
  modified: string;
}

class ApiService {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
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

  async getJobReports(jobId: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch job reports');
    }

    return response.json();
  }

  async getReportData(jobId: string, reportName: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/reports/${reportName}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch report data');
    }

    return response.json();
  }

  async deleteReports(jobId: string, files: string[]): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/reports`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete reports');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
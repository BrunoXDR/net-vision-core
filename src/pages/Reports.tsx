import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/DataTable";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { FolderOpen, FileText, Trash2 } from "lucide-react";

interface Job {
  id: string;
  created: string;
}

interface ReportFile {
  name: string;
  size: string;
  modified: string;
}

export default function Reports() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [reportFiles, setReportFiles] = useState<ReportFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const jobIds = await apiService.getJobs();
      const jobsWithDates = jobIds.map(id => ({
        id,
        created: id.replace('Report_', '').replace(/-/g, '/').replace(/-/g, ':')
      }));
      setJobs(jobsWithDates);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    }
  };

  const handleJobSelect = async (jobId: string) => {
    setSelectedJob(jobId);
    setSelectedReport(null);
    setTableData([]);
    setSelectedFiles([]);
    setLoading(true);
    
    try {
      const reports = await apiService.getJobReports(jobId);
      const reportsWithMetadata = reports.map(name => ({
        name,
        size: "Unknown", // API doesn't provide size info
        modified: "Unknown" // API doesn't provide modification time
      }));
      setReportFiles(reportsWithMetadata);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reports for this job",
        variant: "destructive",
      });
      setReportFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (fileName: string) => {
    if (!selectedJob) return;
    
    setSelectedReport(fileName);
    setLoading(true);
    
    try {
      const data = await apiService.getReportData(selectedJob, fileName);
      setTableData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive",
      });
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0 || !selectedJob) return;
    
    try {
      const result = await apiService.deleteReports(selectedJob, selectedFiles);
      
      // Remove deleted files from the list
      setReportFiles(prev => prev.filter(file => !selectedFiles.includes(file.name)));
      setSelectedFiles([]);
      
      // Clear table data if current report was deleted
      if (selectedReport && selectedFiles.includes(selectedReport)) {
        setSelectedReport(null);
        setTableData([]);
      }
      
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected files",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pt-20 px-6 pb-6 min-h-screen">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyber-glow mb-2 animate-fade-in-up">
            Reports Management
          </h1>
          <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            View and manage your network analysis reports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs Panel */}
          <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-glow">
                <FolderOpen className="h-5 w-5" />
                Analysis Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {jobs.map((job) => (
                <Button
                  key={job.id}
                  variant={selectedJob === job.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => handleJobSelect(job.id)}
                >
                  <div>
                    <div className="font-medium">{job.id}</div>
                    <div className="text-sm text-muted-foreground">{job.created}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Files Panel */}
          <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-glow">
                <FileText className="h-5 w-5" />
                Report Files
                {selectedFiles.length > 0 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-auto"
                    onClick={handleDeleteSelected}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete ({selectedFiles.length})
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedJob ? (
                reportFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-cyber-glow/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedFiles.includes(file.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFiles(prev => [...prev, file.name]);
                        } else {
                          setSelectedFiles(prev => prev.filter(f => f !== file.name));
                        }
                      }}
                    />
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleFileSelect(file.name)}
                    >
                      <div className={`font-medium ${selectedReport === file.name ? 'text-cyber-glow' : ''}`}>
                        {file.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {file.size} • {file.modified}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Select a job to view report files
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Viewer Panel */}
          <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="text-cyber-glow">
                Data Viewer
                {selectedReport && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {selectedReport}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tableData.length > 0 ? (
                <DataTable data={tableData} />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Click on a report file to view its data
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
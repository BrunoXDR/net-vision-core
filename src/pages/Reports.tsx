import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/DataTable";
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [reportFiles, setReportFiles] = useState<ReportFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockJobs = [
      { id: "Report_07-09-2025-22-10-15", created: "2025-09-07 22:10:15" },
      { id: "Report_06-09-2025-15-30-45", created: "2025-09-06 15:30:45" },
      { id: "Report_05-09-2025-09-20-12", created: "2025-09-05 09:20:12" },
    ];
    setJobs(mockJobs);
  }, []);

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId);
    setSelectedReport(null);
    setTableData([]);
    
    // Mock report files
    const mockFiles = [
      { name: "E1_top_regras.csv", size: "2.4 MB", modified: "2025-09-07 22:11:30" },
      { name: "F1_top_destinos.csv", size: "1.8 MB", modified: "2025-09-07 22:11:45" },
      { name: "G1_top_aplicacoes.csv", size: "3.2 MB", modified: "2025-09-07 22:12:00" },
      { name: "ED2_distribuicao_regras.csv", size: "1.5 MB", modified: "2025-09-07 22:12:15" },
    ];
    setReportFiles(mockFiles);
    setSelectedFiles([]);
  };

  const handleFileSelect = (fileName: string) => {
    setSelectedReport(fileName);
    
    // Mock table data
    const mockData = [
      { id: 1, rule: "ALLOW_HTTP", count: 15420, percentage: "45.2%" },
      { id: 2, rule: "BLOCK_MALWARE", count: 8730, percentage: "25.6%" },
      { id: 3, rule: "ALLOW_HTTPS", count: 6890, percentage: "20.2%" },
      { id: 4, rule: "MONITOR_DNS", count: 3080, percentage: "9.0%" },
    ];
    setTableData(mockData);
  };

  const handleDeleteSelected = () => {
    if (selectedFiles.length === 0) return;
    
    // Remove selected files from the list
    setReportFiles(prev => prev.filter(file => !selectedFiles.includes(file.name)));
    setSelectedFiles([]);
    
    if (selectedReport && selectedFiles.includes(selectedReport)) {
      setSelectedReport(null);
      setTableData([]);
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
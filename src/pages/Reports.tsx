import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { useToast } from "@/hooks/use-toast";
import { apiService, Report } from "@/services/api";
import { FolderOpen, FileText } from "lucide-react";

interface Job {
  id: string;
  created: string;
}

export default function Reports() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [availableReports, setAvailableReports] = useState<Report[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
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
    setLoading(true);
    
    try {
      const reports = await apiService.getAvailableReports(jobId);
      setAvailableReports(reports);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reports for this job",
        variant: "destructive",
      });
      setAvailableReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSelect = async (report: Report) => {
    if (!selectedJob) return;
    
    setSelectedReport(report);
    setLoading(true);
    
    try {
      const data = await apiService.getReportData(selectedJob, report.id);
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

          {/* Reports Panel */}
          <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-glow">
                <FileText className="h-5 w-5" />
                Available Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedJob ? (
                availableReports.map((report) => (
                  <Button
                    key={report.id}
                    variant={selectedReport?.id === report.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => handleReportSelect(report)}
                  >
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {report.id}</div>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Select a job to view available reports
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
                    {selectedReport.name}
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
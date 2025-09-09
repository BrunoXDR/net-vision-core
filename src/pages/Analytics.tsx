import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, Report } from "@/services/api";
import ChartCard from "@/components/ChartCard";

interface ChartData {
  name: string;
  value: number;
  category?: string;
}

export default function Analytics() {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [jobs, setJobs] = useState<string[]>([]);
  const [chartData, setChartData] = useState<Record<string, ChartData[]>>({});
  const [loading, setLoading] = useState(false);

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const jobIds = await apiService.getJobs();
      setJobs(jobIds);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    }
  };

  const loadChartData = async (jobId: string) => {
    setLoading(true);
    const newChartData: Record<string, ChartData[]> = {};

    try {
      // Get all available reports for this job
      const reports = await apiService.getAvailableReports(jobId);
      
      // Map report IDs to chart data keys
      const chartReportIds = [
        'E1', 'E2', 'E3', 'E4', 'E5', 'E6', // Rules charts
        'F1', 'F2', 'F3', 'F4', 'F5'       // Protocols charts  
      ];

      // Load data for each chart report
      for (const report of reports) {
        if (chartReportIds.includes(report.id)) {
          try {
            const data = await apiService.getReportData(jobId, report.id);
            // Data comes pre-formatted from the API
            newChartData[report.id] = data;
          } catch (error) {
            console.warn(`Failed to load data for ${report.name}:`, error);
          }
        }
      }

      setChartData(newChartData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chart data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobChange = (jobId: string) => {
    setSelectedJob(jobId);
    if (jobId) {
      loadChartData(jobId);
    } else {
      setChartData({});
    }
  };


  return (
    <div className="pt-20 px-6 pb-6 min-h-screen">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyber-glow mb-2 animate-fade-in-up">
            Network Analytics
          </h1>
          <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Interactive data visualization and insights
          </p>
        </div>

        {/* Job Selector */}
        <Card className="cyber-glow mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyber-glow">
              <Activity className="h-5 w-5" />
              Select Analysis Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedJob} onValueChange={handleJobChange}>
              <SelectTrigger className="w-full md:w-[400px]">
                <SelectValue placeholder="Choose a job to analyze" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job} value={job}>
                    {job}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedJob && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {chartData.E1 && (
              <ChartCard
                title="Top Firewall Rules"
                data={chartData.E1}
                animationDelay="0.3s"
              />
            )}
            {chartData.E2 && (
              <ChartCard
                title="Rules by Application"
                data={chartData.E2}
                filterKey="category"
                animationDelay="0.4s"
              />
            )}
            {chartData.E3 && (
              <ChartCard
                title="Rules by Port"
                data={chartData.E3}
                filterKey="category"
                animationDelay="0.5s"
              />
            )}
            {chartData.E4 && (
              <ChartCard
                title="Rules by Source"
                data={chartData.E4}
                filterKey="category"
                animationDelay="0.6s"
              />
            )}
            {chartData.E5 && (
              <ChartCard
                title="Rules by Protocol"
                data={chartData.E5}
                filterKey="category"
                animationDelay="0.7s"
              />
            )}
            {chartData.E6 && (
              <ChartCard
                title="Rules by Domain"
                data={chartData.E6}
                filterKey="category"
                animationDelay="0.8s"
              />
            )}
            {chartData.F1 && (
              <ChartCard
                title="Top Protocols"
                data={chartData.F1}
                animationDelay="0.9s"
              />
            )}
            {chartData.F2 && (
              <ChartCard
                title="Protocols by Application"
                data={chartData.F2}
                filterKey="category"
                animationDelay="1.0s"
              />
            )}
            {chartData.F3 && (
              <ChartCard
                title="Protocols by Port"
                data={chartData.F3}
                filterKey="category"
                animationDelay="1.1s"
              />
            )}
            {chartData.F4 && (
              <ChartCard
                title="Protocols by Source"
                data={chartData.F4}
                filterKey="category"
                animationDelay="1.2s"
              />
            )}
            {chartData.F5 && (
              <ChartCard
                title="Protocols by Domain"
                data={chartData.F5}
                filterKey="category"
                animationDelay="1.3s"
              />
            )}
          </div>
        )}

        {loading && (
          <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Activity className="h-16 w-16 mx-auto mb-4 opacity-50 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">Loading Data...</h3>
                <p>Fetching analytics data from the backend</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedJob && (
          <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Job Selected</h3>
                <p>Please select an analysis job to view the analytics dashboard</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
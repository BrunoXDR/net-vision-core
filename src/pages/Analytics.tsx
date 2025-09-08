import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
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
      // Get all reports for this job
      const reports = await apiService.getJobReports(jobId);
      
      // Map report names to chart data keys
      const reportMapping: Record<string, string> = {
        'top_regras.csv': 'top_regras',
        'top_regras_por_app.csv': 'top_regras_por_app',
        'top_regras_por_porta.csv': 'top_regras_por_porta',
        'top_regras_por_origem.csv': 'top_regras_por_origem',
        'top_regras_por_protocolo.csv': 'top_regras_por_protocolo',
        'top_regras_por_dominio.csv': 'top_regras_por_dominio',
        'top_protocolos.csv': 'top_protocolos',
        'top_protocolos_por_app.csv': 'top_protocolos_por_app',
        'top_protocolos_por_porta.csv': 'top_protocolos_por_porta',
        'top_protocolos_por_origem.csv': 'top_protocolos_por_origem',
        'top_protocolos_por_dominio.csv': 'top_protocolos_por_dominio',
      };

      // Load data for each matching report
      for (const report of reports) {
        const chartKey = reportMapping[report];
        if (chartKey) {
          try {
            const data = await apiService.getReportData(jobId, report);
            // Transform data to match ChartData interface
            newChartData[chartKey] = data.map(item => ({
              name: Object.values(item)[0] as string, // First column as name
              value: Object.values(item)[1] as number, // Second column as value
              category: Object.values(item)[2] as string || undefined // Third column as category if exists
            }));
          } catch (error) {
            console.warn(`Failed to load data for ${report}:`, error);
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
            {chartData.top_regras && (
              <ChartCard
                title="Top Regras"
                data={chartData.top_regras}
                animationDelay="0.3s"
              />
            )}
            {chartData.top_regras_por_app && (
              <ChartCard
                title="Top Regras por App"
                data={chartData.top_regras_por_app}
                filterKey="category"
                animationDelay="0.4s"
              />
            )}
            {chartData.top_regras_por_porta && (
              <ChartCard
                title="Top Regras por Porta"
                data={chartData.top_regras_por_porta}
                filterKey="category"
                animationDelay="0.5s"
              />
            )}
            {chartData.top_regras_por_origem && (
              <ChartCard
                title="Top Regras por Origem"
                data={chartData.top_regras_por_origem}
                filterKey="category"
                animationDelay="0.6s"
              />
            )}
            {chartData.top_regras_por_protocolo && (
              <ChartCard
                title="Top Regras por Protocolo"
                data={chartData.top_regras_por_protocolo}
                filterKey="category"
                animationDelay="0.7s"
              />
            )}
            {chartData.top_regras_por_dominio && (
              <ChartCard
                title="Top Regras por Domínio"
                data={chartData.top_regras_por_dominio}
                filterKey="category"
                animationDelay="0.8s"
              />
            )}
            {chartData.top_protocolos && (
              <ChartCard
                title="Top Protocolos"
                data={chartData.top_protocolos}
                animationDelay="0.9s"
              />
            )}
            {chartData.top_protocolos_por_app && (
              <ChartCard
                title="Top Protocolos por App"
                data={chartData.top_protocolos_por_app}
                filterKey="category"
                animationDelay="1.0s"
              />
            )}
            {chartData.top_protocolos_por_porta && (
              <ChartCard
                title="Top Protocolos por Porta"
                data={chartData.top_protocolos_por_porta}
                filterKey="category"
                animationDelay="1.1s"
              />
            )}
            {chartData.top_protocolos_por_origem && (
              <ChartCard
                title="Top Protocolos por Origem"
                data={chartData.top_protocolos_por_origem}
                filterKey="category"
                animationDelay="1.2s"
              />
            )}
            {chartData.top_protocolos_por_dominio && (
              <ChartCard
                title="Top Protocolos por Domínio"
                data={chartData.top_protocolos_por_dominio}
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
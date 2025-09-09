import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import ChartCard from "@/components/ChartCard";

interface ChartData {
  name: string;
  value: number;
  category?: string;
}

interface ChartConfig {
  id: string;
  title: string;
  description: string;
  hasCategory: boolean;
  categoryKey?: string;
}

// Configuration for Top 10 charts
const CHART_CONFIGS: ChartConfig[] = [
  { id: "T10_E1", title: "Top 10 Firewall Rules", description: "Most frequently used firewall rules", hasCategory: false },
  { id: "T10_E2", title: "Top 10 Rules by Application", description: "Most used rules grouped by application", hasCategory: true, categoryKey: "Application" },
  { id: "T10_E3", title: "Top 10 Rules by Port", description: "Most used rules grouped by port", hasCategory: true, categoryKey: "Port" },
  { id: "T10_E4", title: "Top 10 Rules by Source", description: "Most used rules grouped by source", hasCategory: true, categoryKey: "Source" },
  { id: "T10_E5", title: "Top 10 Rules by Protocol", description: "Most used rules grouped by protocol", hasCategory: true, categoryKey: "Protocol" },
  { id: "T10_E6", title: "Top 10 Rules by Domain", description: "Most used rules grouped by domain", hasCategory: true, categoryKey: "Domain" },
  { id: "T10_F1", title: "Top 10 Protocols", description: "Most frequently used network protocols", hasCategory: false },
  { id: "T10_F2", title: "Top 10 Protocols by Application", description: "Most used protocols grouped by application", hasCategory: true, categoryKey: "Application" },
  { id: "T10_F3", title: "Top 10 Protocols by Port", description: "Most used protocols grouped by port", hasCategory: true, categoryKey: "Port" },
  { id: "T10_F4", title: "Top 10 Protocols by Source", description: "Most used protocols grouped by source", hasCategory: true, categoryKey: "Source" },
  { id: "T10_F5", title: "Top 10 Protocols by Domain", description: "Most used protocols grouped by domain", hasCategory: true, categoryKey: "Domain" }
];

export default function Analytics() {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [jobs, setJobs] = useState<string[]>([]);
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
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
    const newChartData: Record<string, any[]> = {};

    try {
      // Load data for each configured chart
      for (const config of CHART_CONFIGS) {
        try {
          const data = await apiService.getReportData(jobId, config.id);
          // Data comes clean from the API, ready for charts
          newChartData[config.id] = data;
        } catch (error) {
          console.warn(`Failed to load data for ${config.title}:`, error);
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
          <Accordion type="multiple" className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {CHART_CONFIGS.map((config, index) => (
              chartData[config.id] && (
                <AccordionItem key={config.id} value={config.id} className="cyber-glow">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <BarChart3 className="h-5 w-5 text-cyber-glow" />
                      <div>
                        <h3 className="text-lg font-semibold text-cyber-glow">{config.title}</h3>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-6">
                    <div className="w-full">
                      <ChartCard
                        title={config.title}
                        data={chartData[config.id]}
                        categoryKey={config.categoryKey}
                        animationDelay={`${0.3 + index * 0.1}s`}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            ))}
          </Accordion>
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
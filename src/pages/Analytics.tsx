import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "lucide-react";
import ChartCard from "@/components/ChartCard";

interface ChartData {
  name: string;
  value: number;
  category?: string;
}

export default function Analytics() {
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [jobs] = useState([
    "Report_07-09-2025-22-10-15",
    "Report_06-09-2025-15-30-45", 
    "Report_05-09-2025-09-20-12"
  ]);

  // Mock data for different chart types
  const chartData = {
    top_regras: [
      { name: "ALLOW_HTTP", value: 15420 },
      { name: "BLOCK_MALWARE", value: 8730 },
      { name: "ALLOW_HTTPS", value: 6890 },
      { name: "MONITOR_DNS", value: 3080 },
      { name: "BLOCK_SPAM", value: 2150 },
    ],
    top_regras_por_app: [
      { name: "ALLOW_HTTP", value: 5420, category: "Web" },
      { name: "BLOCK_MALWARE", value: 3730, category: "Security" },
      { name: "ALLOW_SSH", value: 2890, category: "Remote" },
      { name: "MONITOR_FTP", value: 1980, category: "File Transfer" },
      { name: "BLOCK_SPAM", value: 1150, category: "Email" },
    ],
    top_regras_por_porta: [
      { name: "ALLOW_80", value: 12420, category: "HTTP" },
      { name: "ALLOW_443", value: 9730, category: "HTTPS" },
      { name: "BLOCK_22", value: 4890, category: "SSH" },
      { name: "MONITOR_21", value: 2980, category: "FTP" },
      { name: "ALLOW_25", value: 1950, category: "SMTP" },
    ],
    top_regras_por_origem: [
      { name: "INTERNAL_ALLOW", value: 18420, category: "Internal" },
      { name: "EXTERNAL_BLOCK", value: 12730, category: "External" },
      { name: "DMZ_MONITOR", value: 6890, category: "DMZ" },
      { name: "VPN_ALLOW", value: 4980, category: "VPN" },
      { name: "GUEST_BLOCK", value: 2150, category: "Guest" },
    ],
    top_regras_por_protocolo: [
      { name: "TCP_ALLOW", value: 25420, category: "TCP" },
      { name: "UDP_BLOCK", value: 15730, category: "UDP" },
      { name: "ICMP_MONITOR", value: 8890, category: "ICMP" },
      { name: "HTTP_ALLOW", value: 6980, category: "HTTP" },
      { name: "HTTPS_ALLOW", value: 5150, category: "HTTPS" },
    ],
    top_regras_por_dominio: [
      { name: "google.com", value: 18420, category: "Search" },
      { name: "microsoft.com", value: 12730, category: "Software" },
      { name: "amazonaws.com", value: 9890, category: "Cloud" },
      { name: "cloudflare.com", value: 6980, category: "CDN" },
      { name: "github.com", value: 4150, category: "Development" },
    ],
    top_protocolos: [
      { name: "HTTP", value: 28420 },
      { name: "HTTPS", value: 22730 },
      { name: "TCP", value: 15890 },
      { name: "UDP", value: 12980 },
      { name: "ICMP", value: 8150 },
    ],
    top_protocolos_por_app: [
      { name: "HTTP", value: 18420, category: "Web Browser" },
      { name: "HTTPS", value: 15730, category: "Web Browser" },
      { name: "SSH", value: 8890, category: "Terminal" },
      { name: "FTP", value: 6980, category: "File Manager" },
      { name: "SMTP", value: 4150, category: "Email Client" },
    ],
    top_protocolos_por_porta: [
      { name: "HTTP:80", value: 25420, category: "Web" },
      { name: "HTTPS:443", value: 20730, category: "Secure Web" },
      { name: "SSH:22", value: 12890, category: "Remote Access" },
      { name: "FTP:21", value: 8980, category: "File Transfer" },
      { name: "SMTP:25", value: 6150, category: "Email" },
    ],
    top_protocolos_por_origem: [
      { name: "HTTP", value: 22420, category: "Internal" },
      { name: "HTTPS", value: 18730, category: "Internal" },
      { name: "TCP", value: 14890, category: "External" },
      { name: "UDP", value: 11980, category: "External" },
      { name: "ICMP", value: 8150, category: "Internal" },
    ],
    top_protocolos_por_dominio: [
      { name: "HTTPS", value: 28420, category: "google.com" },
      { name: "HTTP", value: 22730, category: "microsoft.com" },
      { name: "TCP", value: 15890, category: "amazonaws.com" },
      { name: "UDP", value: 12980, category: "cloudflare.com" },
      { name: "ICMP", value: 8150, category: "github.com" },
    ],
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
            <Select value={selectedJob} onValueChange={setSelectedJob}>
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

        {selectedJob && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <ChartCard
              title="Top Regras"
              data={chartData.top_regras}
              animationDelay="0.3s"
            />
            <ChartCard
              title="Top Regras por App"
              data={chartData.top_regras_por_app}
              filterKey="category"
              animationDelay="0.4s"
            />
            <ChartCard
              title="Top Regras por Porta"
              data={chartData.top_regras_por_porta}
              filterKey="category"
              animationDelay="0.5s"
            />
            <ChartCard
              title="Top Regras por Origem"
              data={chartData.top_regras_por_origem}
              filterKey="category"
              animationDelay="0.6s"
            />
            <ChartCard
              title="Top Regras por Protocolo"
              data={chartData.top_regras_por_protocolo}
              filterKey="category"
              animationDelay="0.7s"
            />
            <ChartCard
              title="Top Regras por Domínio"
              data={chartData.top_regras_por_dominio}
              filterKey="category"
              animationDelay="0.8s"
            />
            <ChartCard
              title="Top Protocolos"
              data={chartData.top_protocolos}
              animationDelay="0.9s"
            />
            <ChartCard
              title="Top Protocolos por App"
              data={chartData.top_protocolos_por_app}
              filterKey="category"
              animationDelay="1.0s"
            />
            <ChartCard
              title="Top Protocolos por Porta"
              data={chartData.top_protocolos_por_porta}
              filterKey="category"
              animationDelay="1.1s"
            />
            <ChartCard
              title="Top Protocolos por Origem"
              data={chartData.top_protocolos_por_origem}
              filterKey="category"
              animationDelay="1.2s"
            />
            <ChartCard
              title="Top Protocolos por Domínio"
              data={chartData.top_protocolos_por_dominio}
              filterKey="category"
              animationDelay="1.3s"
            />
          </div>
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
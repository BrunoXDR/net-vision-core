import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  count?: number;
}

export default function Analytics() {
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [jobs] = useState([
    "Report_07-09-2025-22-10-15",
    "Report_06-09-2025-15-30-45", 
    "Report_05-09-2025-09-20-12"
  ]);

  const [topRulesData] = useState<ChartData[]>([
    { name: "ALLOW_HTTP", value: 15420 },
    { name: "BLOCK_MALWARE", value: 8730 },
    { name: "ALLOW_HTTPS", value: 6890 },
    { name: "MONITOR_DNS", value: 3080 },
    { name: "BLOCK_SPAM", value: 2150 },
  ]);

  const [topDestinationsData] = useState<ChartData[]>([
    { name: "192.168.1.100", value: 12500 },
    { name: "10.0.0.50", value: 9800 },
    { name: "172.16.0.25", value: 7600 },
    { name: "192.168.1.200", value: 5400 },
    { name: "10.0.0.75", value: 3200 },
  ]);

  const [applicationDistribution] = useState<ChartData[]>([
    { name: "HTTP", value: 35, count: 15420 },
    { name: "HTTPS", value: 28, count: 12380 },
    { name: "DNS", value: 18, count: 7950 },
    { name: "SSH", value: 12, count: 5300 },
    { name: "FTP", value: 7, count: 3100 },
  ]);

  const COLORS = [
    'hsl(193 100% 50%)',   // Cyber glow
    'hsl(88 100% 55%)',    // Terminal green
    'hsl(348 100% 61%)',   // Hot pink
    'hsl(39 100% 50%)',    // Warning orange
    'hsl(270 100% 60%)',   // Purple
  ];

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Rules Chart */}
            <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyber-glow">
                  <BarChart3 className="h-5 w-5" />
                  Top Security Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topRulesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid-lines))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--cyber-glow))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--cyber-glow))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Destinations Chart */}
            <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyber-glow">
                  <BarChart3 className="h-5 w-5" />
                  Top Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topDestinationsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid-lines))" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--foreground))' }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--cyber-glow))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--terminal-green))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Application Distribution */}
            <Card className="cyber-glow animate-fade-in-up lg:col-span-2" style={{ animationDelay: "0.5s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyber-glow">
                  <PieChartIcon className="h-5 w-5" />
                  Application Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={applicationDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {applicationDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--cyber-glow))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyber-glow">Detailed Breakdown</h4>
                    {applicationDistribution.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.value}%</div>
                          <div className="text-sm text-muted-foreground">{item.count?.toLocaleString()} requests</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedJob && (
          <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
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
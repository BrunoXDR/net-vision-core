import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileSpreadsheet, Shield, Zap, Activity } from "lucide-react";

export default function Index() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.endsWith('.csv'));
    
    if (!csvFile) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }
    
    handleFileUpload(csvFile);
  }, [toast]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      
      toast({
        title: "Analysis Started",
        description: "Your file has been uploaded and analysis is in progress.",
      });
      
      // Redirect to reports page after successful upload
      setTimeout(() => {
        navigate('/reports');
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your file.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1500);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type", 
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      handleFileUpload(file);
    }
  };

  return (
    <div className="pt-20 px-6 pb-6 min-h-screen flex items-center justify-center">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-cyber-glow animate-glow-pulse mr-4" />
            <div>
              <h1 className="text-6xl font-bold text-cyber-glow mb-2">
                Network Intelligence Engine
              </h1>
              <p className="text-xl text-secondary">
                Advanced Security Analysis Platform
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your network traffic data and get comprehensive security insights through AI-powered analysis
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Card className="cyber-glow text-center">
            <CardContent className="pt-6">
              <Zap className="h-10 w-10 text-cyber-glow mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cyber-glow mb-2">Real-time Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Instant processing of network traffic patterns and anomaly detection
              </p>
            </CardContent>
          </Card>
          
          <Card className="cyber-glow text-center">
            <CardContent className="pt-6">
              <Activity className="h-10 w-10 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary mb-2">Smart Insights</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered recommendations and threat intelligence reports
              </p>
            </CardContent>
          </Card>
          
          <Card className="cyber-glow text-center">
            <CardContent className="pt-6">
              <FileSpreadsheet className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-accent mb-2">Data Visualization</h3>
              <p className="text-sm text-muted-foreground">
                Interactive charts and comprehensive reporting dashboard
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="cyber-glow max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyber-glow text-center justify-center">
              <Upload className="h-6 w-6" />
              Upload Network Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isUploading ? (
              <div
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer
                  ${isDragOver 
                    ? 'border-cyber-glow bg-cyber-glow/10' 
                    : 'border-border hover:border-cyber-glow/50 hover:bg-cyber-glow/5'
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <FileSpreadsheet className={`h-16 w-16 mx-auto mb-4 ${isDragOver ? 'text-cyber-glow' : 'text-muted-foreground'}`} />
                <h3 className="text-lg font-semibold mb-2">
                  {isDragOver ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Or click to browse and select your network traffic data file
                </p>
                <Button 
                  variant="outline" 
                  className="hover:border-cyber-glow hover:text-cyber-glow"
                >
                  Browse Files
                </Button>
                <input
                  id="fileInput"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <Shield className="h-16 w-16 text-cyber-glow animate-glow-pulse mx-auto" />
                  <h3 className="text-xl font-semibold text-cyber-glow">Processing Your Data</h3>
                  <p className="text-muted-foreground">
                    Analyzing network patterns and generating security insights...
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress < 100 ? `${Math.round(uploadProgress)}% complete` : 'Finalizing analysis...'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <p className="text-sm text-muted-foreground">
            Supported formats: CSV • Maximum file size: 100MB • All data is processed securely
          </p>
        </div>
      </div>
    </div>
  );
}
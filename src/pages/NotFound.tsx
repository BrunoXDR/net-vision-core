import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center pt-20 px-6">
      <div className="text-center max-w-md mx-auto animate-fade-in-up">
        <Shield className="h-20 w-20 text-cyber-glow animate-glow-pulse mx-auto mb-6" />
        <h1 className="mb-4 text-6xl font-bold text-cyber-glow">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">System Access Denied</h2>
        <p className="mb-8 text-muted-foreground">
          The requested neural pathway does not exist in our network matrix.
        </p>
        <Button asChild className="cyber-glow">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Command Center
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

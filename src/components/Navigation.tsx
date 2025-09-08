import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Shield, FileText, BarChart3 } from "lucide-react";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Upload", icon: Shield },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-cyber-glow/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-cyber-glow animate-glow-pulse" />
            <h1 className="text-xl font-bold text-cyber-glow">
              Network Intelligence Engine
            </h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                    "border border-transparent hover:border-cyber-glow/50",
                    isActive
                      ? "bg-cyber-glow/20 border-cyber-glow text-cyber-glow"
                      : "text-foreground hover:text-cyber-glow hover:bg-cyber-glow/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
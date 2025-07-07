import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Successfully logged in to admin panel",
        });
        setLocation("/admin");
      } else {
        const error = await response.json();
        toast({
          title: "Login Failed",
          description: error.message || "Invalid password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2" style={{ borderColor: 'hsl(220, 26%, 14%)' }}>
        <CardHeader className="text-center space-y-4 pb-8" style={{ backgroundColor: 'hsl(220, 26%, 14%)', color: '#ffffff' }}>
          <div className="flex justify-center">
            <div className="p-4 bg-white/20 rounded-full">
              <Shield className="h-12 w-12" />
            </div>
          </div>
          <CardTitle className="text-2xl" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
            Admin Panel Access
          </CardTitle>
          <p className="text-white/80 text-sm" style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}>
            Enter your admin password to continue
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-2 rounded-lg focus:ring-2 transition-all duration-300"
                  style={{ 
                    fontFamily: 'mayo-sans, Times New Roman, sans-serif',
                    borderColor: 'hsl(220, 26%, 14%)',
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-300"
              style={{ 
                fontFamily: 'mayo-sans, Times New Roman, sans-serif',
                backgroundColor: 'hsl(220, 26%, 14%)',
                color: '#ffffff'
              }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Authenticating...
                </div>
              ) : (
                "Access Admin Panel"
              )}
            </Button>
          </form>
          
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500" style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}>
              Medigo Korea Admin Portal
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
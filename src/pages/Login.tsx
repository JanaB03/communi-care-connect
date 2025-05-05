// Simplified Login Component for debugging - Replace src/pages/Login.tsx temporarily

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";

const Login = () => {
  console.log("Login component rendering");
  const { login, isLoading } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent, userType: string) => {
    e.preventDefault();
    console.log("Login attempt with type:", userType);
    
    try {
      const loginEmail = userType === "client" ? "client@example.com" : "staff@example.com";
      
      const success = await login(loginEmail, password || "password");
      
      if (success) {
        console.log("Login successful, navigating...");
        navigate(userType === "client" ? "/client" : "/staff");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple/20 to-sky-blue/20 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-navy mb-2 text-center">CommuniCare Debug Login</h1>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple/90 to-purple text-white rounded-t-lg">
            <CardTitle className="text-xl">Client Login</CardTitle>
            <CardDescription className="text-white/90">
              Debug simplified login
            </CardDescription>
          </CardHeader>
          <form onSubmit={(e) => handleLogin(e, "client")}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input 
                  id="client-email" 
                  type="email" 
                  placeholder="client@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-password">Password</Label>
                <Input 
                  id="client-password" 
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-purple hover:bg-purple/90 py-5 text-base"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
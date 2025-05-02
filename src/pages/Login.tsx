
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login, isLoading } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent, userType: string) => {
    e.preventDefault();
    
    try {
      // Add demo user email for easy testing
      const loginEmail = userType === "client" ? "client@example.com" : "staff@example.com";
      
      const success = await login(loginEmail, password || "password");
      
      if (success) {
        toast({
          title: "Login successful!",
          description: `Welcome back to CommuniCare.`,
        });
        
        navigate(userType === "client" ? "/client" : "/staff");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple/20 to-sky-blue/20 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-navy mb-2">CommuniCare</h1>
          <p className="text-gray-600">Connecting care providers and clients</p>
        </div>
        
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="client">Client Login</TabsTrigger>
            <TabsTrigger value="staff">Staff Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="client">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple/90 to-purple text-white rounded-t-lg">
                <CardTitle className="text-xl">Client Login</CardTitle>
                <CardDescription className="text-white/90">
                  Access your services, appointments, and chat with your care team.
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
                      required
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="client-password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-gray-300 pr-10"
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <input type="checkbox" id="remember" className="mr-2" />
                      <label htmlFor="remember">Remember me</label>
                    </div>
                    <a href="#" className="text-purple hover:underline">Forgot password?</a>
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
          </TabsContent>
          
          <TabsContent value="staff">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-navy/90 to-navy text-white rounded-t-lg">
                <CardTitle className="text-xl">Staff Login</CardTitle>
                <CardDescription className="text-white/90">
                  Access client information, manage cases, and communicate with clients.
                </CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleLogin(e, "staff")}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <Input 
                      id="staff-email" 
                      type="email" 
                      placeholder="staff@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="staff-password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-gray-300 pr-10"
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <input type="checkbox" id="remember-staff" className="mr-2" />
                      <label htmlFor="remember-staff">Remember me</label>
                    </div>
                    <a href="#" className="text-navy hover:underline">Forgot password?</a>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-navy hover:bg-navy/90 py-5 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>For demo purposes, you can click Sign In with empty fields.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

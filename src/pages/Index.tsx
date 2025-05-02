
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // If user is authenticated, redirect to appropriate dashboard
        if (user?.role === "client") {
          navigate("/client");
        } else {
          navigate("/staff");
        }
      } else {
        // If not authenticated, redirect to login
        navigate("/login");
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy/10 to-purple/10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-navy">CommuniCare</h1>
        <p className="text-xl text-gray-600 mb-4">Connecting care providers and clients</p>
        <div className="animate-pulse text-navy">Loading...</div>
      </div>
    </div>
  );
};

export default Index;

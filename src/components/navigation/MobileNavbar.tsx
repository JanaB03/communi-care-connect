
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Home, MessageCircle, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNavbar = () => {
  const { user } = useUser();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const dashboardPath = user?.role === "client" ? "/client" : "/staff";
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex justify-around py-2">
        <Link 
          to={dashboardPath} 
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            isActive(dashboardPath) ? "text-orange" : "text-gray-500"
          )}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link 
          to="/chat" 
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            isActive("/chat") ? "text-orange" : "text-gray-500"
          )}
        >
          <MessageCircle size={24} />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        <Link 
          to={`/${user?.role === "client" ? "client" : "staff"}#appointments`}
          className="flex flex-col items-center justify-center p-2 rounded-md text-gray-500"
        >
          <Calendar size={24} />
          <span className="text-xs mt-1">Appointments</span>
        </Link>
        <Link 
          to="/resources" 
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            isActive("/resources") ? "text-orange" : "text-gray-500"
          )}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">Resources</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;

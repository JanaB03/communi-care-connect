
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { BookOpen, MapPin, MessageCircle, LogOut } from "lucide-react";

const MainNavbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-navy text-white py-3 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link to={user?.role === "client" ? "/client" : "/staff"} className="text-xl md:text-2xl font-bold">
          CommuniCare
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/resources" className="flex items-center gap-2 hover:text-gold transition-colors">
            <BookOpen size={20} />
            <span>Resources</span>
          </Link>
          <Link to="/map" className="flex items-center gap-2 hover:text-gold transition-colors">
            <MapPin size={20} />
            <span>Map</span>
          </Link>
          <Link to="/chat" className="flex items-center gap-2 hover:text-gold transition-colors">
            <MessageCircle size={20} />
            <span>Chat</span>
          </Link>
          <div className="flex items-center gap-2">
            {user?.avatar && (
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={user.avatar}
                  alt={`${user.name}'s avatar`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=random";
                  }}
                />
              </div>
            )}
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleLogout}
              className="bg-orange hover:bg-orange/90"
            >
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;

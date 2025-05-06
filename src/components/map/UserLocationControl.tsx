import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "@/contexts/LocationContext";
import { useNavigate } from "react-router-dom";

interface UserLocationControlProps {
  mapRef?: React.RefObject<mapboxgl.Map>;
  className?: string;
}

const UserLocationControl: React.FC<UserLocationControlProps> = ({ 
  mapRef, 
  className 
}) => {
  const { user } = useUser();
  const { addPin } = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to share your location.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Add a pin to the location context
        addPin({
          userId: user.id,
          userName: user.name,
          latitude,
          longitude,
          address: "My Current Location",
          pinType: "current"
        });

        // Show success message
        toast({
          title: "Location shared",
          description: "Your location has been successfully shared.",
        });

        // Fly to location if map is available
        if (mapRef && mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true
          });
        }

        setIsLoading(false);
      },
      (error) => {
        let errorMessage: string;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location services in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred while trying to get your location.";
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className={`absolute ${className || "bottom-5 right-5"} z-10`}>
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center text-xs text-red-700">
          <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <Button
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="bg-white text-purple hover:bg-purple/10 border border-gray-300 shadow-md"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <MapPin className="w-4 h-4 mr-2" />
        )}
        {isLoading ? "Locating..." : "Share My Location"}
      </Button>
    </div>
  );
};

export default UserLocationControl;
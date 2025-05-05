// Fixed ShareLocationCard that safely uses useUser

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { getCurrentLocation } from "@/utils/mapUtils";

const ShareLocationCard: React.FC = () => {
  const { addPin, pins } = useLocation();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = React.useState(false);

  const handleShareLocation = async () => {
    // Check if user exists before proceeding
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to share your location",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    
    try {
      const position = await getCurrentLocation();
      
      addPin({
        userId: user.id,
        userName: user.name,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      
      toast({
        title: "Location Shared",
        description: "Your location has been shared successfully!",
      });
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: "Location Error",
        description: "Could not access your location. Please check your browser permissions.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  // Check if the user already has a pin
  const hasSharedLocation = React.useMemo(() => {
    return user ? pins.some(pin => pin.userId === user.id) : false;
  }, [pins, user]);

  // Only render if user exists
  if (!user) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md mb-6">
      <CardContent className="p-4">
        <Button 
          className={`w-full ${hasSharedLocation ? "bg-orange" : "bg-sky-blue"} hover:bg-sky-blue/90 mb-4`}
          onClick={handleShareLocation}
          disabled={isSharing}
        >
          <MapPin className="mr-2 h-4 w-4" /> 
          {isSharing ? "Sharing..." : hasSharedLocation ? "Update My Location" : "Share My Current Location"}
        </Button>
        <p className="text-sm text-gray-600">
          Sharing your location helps your care team provide better support.
          Your location is only shared with authorized staff members.
        </p>
      </CardContent>
    </Card>
  );
};

export default ShareLocationCard;
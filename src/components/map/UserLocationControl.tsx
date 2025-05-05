import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Trash, Clock, ExternalLink } from "lucide-react";
import { useLocation, LocationPin } from "@/contexts/LocationContext";
import { formatCoordinates } from "@/utils/mapUtils";
import { useUser } from "@/contexts/UserContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const UserLocationControl = () => {
  const { user } = useUser();
  const { pins, deletePin, getUserPins } = useLocation();
  
  if (!user) return null;
  
  // Get the user's current pin
  const userPins = getUserPins(user.id);
  const userPin = userPins.length > 0 ? userPins[0] : null;
  
  if (!userPin) {
    return (
      <Card className="border shadow-md mb-6">
        <CardContent className="p-4 text-center">
          <p className="text-gray-600 mb-2">You haven't shared your location yet</p>
          <p className="text-sm text-gray-500">
            Click on the map to drop a pin and share your location with the case management team.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Format the timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Get Google Maps directions URL
  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <Card className="border-0 shadow-md mb-6">
      <CardHeader className="bg-blue-50 pb-3">
        <CardTitle className="text-lg">Your Shared Location</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-purple" />
          <span>{userPin.address || "Custom location"}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-orange" />
          <span>Shared on {formatTime(userPin.timestamp)}</span>
        </div>
        <div className="text-xs text-gray-500">
          {formatCoordinates(userPin.latitude, userPin.longitude)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50 py-3">
        <a 
          href={getDirectionsUrl(userPin.latitude, userPin.longitude)} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-1" /> Get Directions
          </Button>
        </a>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-500">
              <Trash className="h-4 w-4 mr-1" /> Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Shared Location?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove your location pin from the map. Your care team will no longer be able to see your location.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deletePin(userPin.id)}
                className="bg-red-500 hover:bg-red-600"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default UserLocationControl;
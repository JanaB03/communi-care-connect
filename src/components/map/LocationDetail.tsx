
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageSquare, Clock } from "lucide-react";
import { useLocation, LocationPin } from "@/contexts/LocationContext";
import { formatCoordinates } from "@/utils/mapUtils";
import { Link } from "react-router-dom";

interface LocationDetailProps {
  pinId?: string;
}

const LocationDetail: React.FC<LocationDetailProps> = ({ pinId }) => {
  const { pins, selectedPinId } = useLocation();
  
  // Get the selected pin or use the provided pinId
  const pin = React.useMemo(() => {
    const id = pinId || selectedPinId;
    return pins.find(p => p.id === id) || null;
  }, [pins, pinId, selectedPinId]);
  
  if (!pin) {
    return (
      <Card className="border shadow">
        <CardContent className="p-6 text-center text-gray-500">
          No location selected
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

  return (
    <Card className="border-0 shadow">
      <CardHeader>
        <CardTitle>{pin.userName}</CardTitle>
        <CardDescription>{pin.address || "Unknown location"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-purple" />
          <span>{formatCoordinates(pin.latitude, pin.longitude)}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-orange" />
          <span>Updated {formatTime(pin.timestamp)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <MapPin className="h-4 w-4 mr-1" /> Get Directions
        </Button>
        <Link to="/chat">
          <Button>
            <MessageSquare className="h-4 w-4 mr-1" /> Contact
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LocationDetail;

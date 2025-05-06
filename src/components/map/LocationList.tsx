import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Info } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCoordinates } from "@/utils/mapUtils";

interface LocationListProps {
  onSelectLocation?: (pinId: string) => void;
  filterByType?: boolean;
}

const LocationList: React.FC<LocationListProps> = ({ 
  onSelectLocation,
  filterByType = true
}) => {
  const { pins, selectedPinId, setSelectedPinId } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationType, setLocationType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("all"); // "all", "current", "future"
  
  // Mock service location types for filtering
  const locationTypes = ["Shelter", "Medical", "Food", "Support Services"];
  
  // Filter pins based on search query, selected type, and view mode
  const filteredPins = React.useMemo(() => {
    return pins.filter(pin => {
      // Filter by search query
      const matchesSearch = searchQuery
        ? pin.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (pin.address && pin.address.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
        
      // Filter by location type
      const matchesType = locationType
        ? pin.address && pin.address.toLowerCase().includes(locationType.toLowerCase())
        : true;
      
      // Filter by pin type (current/future)
      const matchesPinType = viewMode === "all" 
        ? true 
        : viewMode === "current" 
          ? pin.pinType !== "future"
          : pin.pinType === "future";
        
      return matchesSearch && matchesType && matchesPinType;
    });
  }, [pins, searchQuery, locationType, viewMode]);
  
  // Handle location selection
  const handleSelectLocation = (pinId: string) => {
    setSelectedPinId(pinId);
    if (onSelectLocation) {
      onSelectLocation(pinId);
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    // Check how long ago this was
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6 h-full overflow-hidden flex flex-col">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10 shadow"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filterByType && (
        <div className="flex flex-wrap gap-2">
          {locationTypes.map(type => (
            <Button
              key={type}
              variant={locationType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setLocationType(locationType === type ? null : type)}
              className={locationType === type ? "bg-purple hover:bg-purple/90" : ""}
            >
              {type}
            </Button>
          ))}
        </div>
      )}
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setViewMode}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="future">Planned</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="overflow-y-auto flex-1 -mr-2 pr-2">
        {filteredPins.length > 0 ? (
          filteredPins.map(pin => (
            <Card 
              key={pin.id} 
              className={`mb-4 border-0 shadow hover:shadow-md transition-all overflow-hidden ${
                pin.id === selectedPinId ? "ring-2 ring-purple" : ""
              }`}
              onClick={() => handleSelectLocation(pin.id)}
            >
              <CardHeader className="border-l-4 border-purple bg-gray-50 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{pin.userName}</CardTitle>
                    <p className="text-sm text-gray-500">{pin.address || "Unknown location"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-orange mr-2 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      {formatCoordinates(pin.latitude, pin.longitude)}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 text-navy mr-2 mt-0.5" />
                    <p className="text-sm text-gray-600">Updated {formatTime(pin.timestamp)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm" className="text-navy">
                    <MapPin className="h-4 w-4 mr-1" /> Directions
                  </Button>
                  <Button size="sm" className="bg-purple hover:bg-purple/90">
                    <Info className="h-4 w-4 mr-1" /> Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No locations found
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationList;
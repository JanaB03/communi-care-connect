import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { LocationProvider } from "@/contexts/LocationContext";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/map/LocationList";
import ShareLocationCard from "@/components/map/ShareLocationCard";
import LocationDetail from "@/components/map/LocationDetail";
import UserLocationControl from "@/components/map/UserLocationControl";

const Map = () => {
  const { user } = useUser();
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("all"); // "all", "current", "future"
  
  const handlePinSelect = (pinId: string) => {
    setSelectedPinId(pinId);
  };

  return (
    <LocationProvider>
      <div className="container mx-auto px-4 py-6 animate-fade-in">
        <div className="flex flex-col md:flex-row mb-6 gap-6">
          {/* Left sidebar */}
          <div className="w-full md:w-1/3 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-navy">
              {user?.role === "client" ? "Location Sharing" : "Client Locations"}
            </h1>
            
            {/* Show specific components based on user role */}
            {user?.role === "client" && (
              <>
                <ShareLocationCard />
                <UserLocationControl />
              </>
            )}
            
            <LocationList 
              onSelectLocation={handlePinSelect} 
              filterByType={user?.role === "staff"}
            />
          </div>
          
          {/* Map area */}
          <div className="w-full md:w-2/3">
            <MapView 
              height="500px" 
              onPinClick={handlePinSelect}
              allowPinDrop={user?.role === "client"}
              viewMode={viewMode}
            />
            
            {selectedPinId && (
              <div className="mt-6">
                <LocationDetail pinId={selectedPinId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </LocationProvider>
  );
};

export default Map;
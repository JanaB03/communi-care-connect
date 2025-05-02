
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { LocationProvider } from "@/contexts/LocationContext";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/map/LocationList";
import ShareLocationCard from "@/components/map/ShareLocationCard";
import LocationDetail from "@/components/map/LocationDetail";

const Map = () => {
  const { user } = useUser();
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  
  const handlePinSelect = (pinId: string) => {
    setSelectedPinId(pinId);
  };

  return (
    <LocationProvider>
      <div className="container mx-auto px-4 py-6 animate-fade-in">
        <div className="flex flex-col md:flex-row mb-6 gap-6">
          <div className="w-full md:w-1/3 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-navy">Service Locations</h1>
            
            {user?.role === "client" && (
              <ShareLocationCard />
            )}
            
            <LocationList onSelectLocation={handlePinSelect} />
          </div>
          
          <div className="w-full md:w-2/3">
            <MapView 
              height="500px" 
              onPinClick={handlePinSelect}
              allowPinDrop={user?.role === "client"}
            />
            
            {selectedPinId && (
              <div className="mt-6">
                <LocationDetail pinId={selectedPinId} />
              </div>
            )}
          </div>
        </div>
        
        {user?.role === "staff" && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-navy mb-4">Client Locations</h2>
            <p className="text-gray-600 mb-4">
              These are the current locations shared by clients. Location data is updated in real-time.
            </p>
          </div>
        )}
      </div>
    </LocationProvider>
  );
};

export default Map;

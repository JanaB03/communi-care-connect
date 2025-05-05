import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/map/LocationList";
import UserLocationControl from "@/components/map/UserLocationControl";
import LocationDetail from "@/components/map/LocationDetail";

const Map = () => {
  const { user } = useUser();
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  
  const handlePinSelect = (pinId: string) => {
    setSelectedPinId(pinId);
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row mb-6 gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-navy">
            {user?.role === "client" ? "Share Your Location" : "Service Locations"}
          </h1>
          
          {user?.role === "client" && (
            <UserLocationControl />
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
          <h2 className="text-xl font-bold text-navy mb-4">Client Service Locations</h2>
          <p className="text-gray-600 mb-4">
            Primary service locations include the Day Center, Central Library Resource Hub, 
            Imperial Street Shelter, and Old Town Station Mobile Clinic. Clients can drop pins 
            at these locations or share their current position for outreach support.
          </p>
        </div>
      )}
    </div>
  );
};

export default Map;
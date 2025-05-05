// Fixed LocationContext - Replace src/contexts/LocationContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

export interface LocationPin {
  id: string;
  userId: string;
  userName: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  address?: string;
}

interface LocationContextType {
  pins: LocationPin[];
  addPin: (pin: Omit<LocationPin, "id" | "timestamp">) => void;
  updatePin: (pin: LocationPin) => void;
  deletePin: (id: string) => void;
  loading: boolean;
  selectedPinId: string | null;
  setSelectedPinId: (id: string | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pins, setPins] = useState<LocationPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  // Load initial pins (mock data for now)
  useEffect(() => {
    // In a real app, this would fetch from a backend
    const mockPins: LocationPin[] = [
      {
        id: "pin-1",
        userId: "client-123",
        userName: "Jessie Smith",
        latitude: 47.6062,
        longitude: -122.3321,
        timestamp: new Date(Date.now() - 900000), // 15 min ago
        address: "Downtown Library"
      },
      {
        id: "pin-2",
        userId: "client-456",
        userName: "Taylor Johnson",
        latitude: 47.6101,
        longitude: -122.3420,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        address: "City Park"
      }
    ];

    setPins(mockPins);
    setLoading(false);

    // This would be a real-time listener in a production app
    const interval = setInterval(() => {
      // Simulate real-time updates
      setPins(currentPins => {
        // Don't modify pins in this mock interval for demo purposes
        return [...currentPins];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addPin = (pinData: Omit<LocationPin, "id" | "timestamp">) => {
    const newPin: LocationPin = {
      ...pinData,
      id: `pin-${Date.now()}`,
      timestamp: new Date()
    };
    
    setPins(current => [...current, newPin]);
    
    // In a real app, this would save to a backend
    console.log("Added new pin:", newPin);
  };

  const updatePin = (updatedPin: LocationPin) => {
    setPins(current => 
      current.map(pin => pin.id === updatedPin.id ? updatedPin : pin)
    );
    
    // In a real app, this would update in a backend
    console.log("Updated pin:", updatedPin);
  };

  const deletePin = (id: string) => {
    setPins(current => current.filter(pin => pin.id !== id));
    
    // In a real app, this would delete from a backend
    console.log("Deleted pin:", id);
  };

  return (
    <LocationContext.Provider value={{ 
      pins, 
      addPin, 
      updatePin, 
      deletePin, 
      loading,
      selectedPinId,
      setSelectedPinId
    }}>
      {children}
    </LocationContext.Provider>
  );
};
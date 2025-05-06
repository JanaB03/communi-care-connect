import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

export interface LocationPin {
  id: string;
  userId: string;
  userName: string;
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: Date;
  pinType?: "current" | "future";
}

interface LocationContextType {
  pins: LocationPin[];
  selectedPinId: string | null;
  setSelectedPinId: (id: string | null) => void;
  addPin: (data: Omit<LocationPin, "id" | "timestamp">) => void;
  deletePin: (id: string) => void;
  getUserPins: (userId: string) => LocationPin[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

// Mock data for testing
const mockPins: LocationPin[] = [
  {
    id: "pin-1",
    userId: "client-123",
    userName: "Jessie Smith",
    latitude: 47.6062,
    longitude: -122.3321,
    address: "Central Library",
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    pinType: "current"
  },
  {
    id: "pin-2",
    userId: "client-456",
    userName: "Taylor Johnson",
    latitude: 47.6101,
    longitude: -122.3420,
    address: "Old Town Station",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    pinType: "current"
  },
  {
    id: "pin-3",
    userId: "client-123",
    userName: "Jessie Smith",
    latitude: 47.6142,
    longitude: -122.3450,
    address: "Day Center",
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    pinType: "future"
  }
];

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [pins, setPins] = useState<LocationPin[]>(mockPins);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  // Add a new pin
  const addPin = (pinData: Omit<LocationPin, "id" | "timestamp">) => {
    const newPin: LocationPin = {
      id: `pin-${Date.now()}`,
      timestamp: new Date(),
      ...pinData
    };

    setPins(prev => [...prev, newPin]);
    return newPin;
  };

  // Delete a pin
  const deletePin = (id: string) => {
    setPins(prev => prev.filter(pin => pin.id !== id));
  };

  // Get pins for a specific user
  const getUserPins = (userId: string) => {
    return pins.filter(pin => pin.userId === userId);
  };

  return (
    <LocationContext.Provider
      value={{
        pins,
        selectedPinId,
        setSelectedPinId,
        addPin,
        deletePin,
        getUserPins
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocation } from "@/contexts/LocationContext";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MapViewProps {
  height?: string;
  onPinClick?: (pinId: string) => void;
  allowPinDrop?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
  height = "500px", 
  onPinClick,
  allowPinDrop = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { pins, addPin, selectedPinId, setSelectedPinId } = useLocation();
  const [mapboxToken, setMapboxToken] = useState<string | null>(localStorage.getItem("mapbox-token"));
  const [markers, setMarkers] = useState<{[key: string]: mapboxgl.Marker}>({});
  const { toast } = useToast();
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-122.3321, 47.6062], // Default: Seattle
      zoom: 12,
    });

    newMap.addControl(new mapboxgl.NavigationControl(), "top-right");
    
    if (allowPinDrop) {
      // Allow pin dropping on click for client view
      newMap.on("click", (e) => {
        if (!allowPinDrop) return;
        
        toast({
          title: "Location Selected",
          description: `Latitude: ${e.lngLat.lat.toFixed(4)}, Longitude: ${e.lngLat.lng.toFixed(4)}`,
        });
        
        // Get current user information and add a new pin
        // In a real implementation, you would use the actual user data
        addPin({
          userId: "client-123", // This would be the actual user ID
          userName: "Jessie Smith", // This would be the actual user name
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
          address: "Custom location" // In a real app, you would reverse geocode to get the address
        });
      });
    }

    map.current = newMap;

    return () => {
      newMap.remove();
    };
  }, [mapboxToken, allowPinDrop, addPin, toast]);

  // Update markers when pins change
  useEffect(() => {
    if (!map.current) return;
    
    // Clear existing markers
    Object.values(markers).forEach(marker => marker.remove());
    const newMarkers: {[key: string]: mapboxgl.Marker} = {};

    // Add new markers
    pins.forEach(pin => {
      // Create a custom marker element
      const el = document.createElement("div");
      el.className = "flex flex-col items-center";
      
      const markerPin = document.createElement("div");
      markerPin.className = `w-8 h-8 rounded-full ${pin.id === selectedPinId ? "bg-orange" : "bg-purple"} 
        flex items-center justify-center text-white shadow-lg transition-all duration-300 
        hover:scale-110 cursor-pointer z-10`;
      
      // Add an SVG icon
      markerPin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      
      el.appendChild(markerPin);

      // Add a tooltip that shows on hover
      const tooltip = document.createElement("div");
      tooltip.className = "absolute bottom-full mb-2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap opacity-0 transition-opacity duration-200";
      tooltip.innerText = `${pin.userName} • ${pin.timestamp.toLocaleTimeString()}`;
      
      markerPin.addEventListener("mouseenter", () => {
        tooltip.classList.replace("opacity-0", "opacity-100");
      });
      
      markerPin.addEventListener("mouseleave", () => {
        tooltip.classList.replace("opacity-100", "opacity-0");
      });
      
      el.appendChild(tooltip);

      // Create and add the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(map.current!);
        
      // Add click handler
      markerPin.addEventListener("click", () => {
        setSelectedPinId(pin.id);
        if (onPinClick) onPinClick(pin.id);
      });
      
      newMarkers[pin.id] = marker;
    });
    
    setMarkers(newMarkers);
    
    // If we have pins and no selectedPinId, select the first one
    if (pins.length > 0 && !selectedPinId) {
      setSelectedPinId(pins[0].id);
    }
    
    // Fit map to show all pins if we have multiple pins
    if (pins.length > 1 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      pins.forEach(pin => {
        bounds.extend([pin.longitude, pin.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } else if (pins.length === 1 && map.current) {
      map.current.flyTo({
        center: [pins[0].longitude, pins[0].latitude],
        zoom: 14
      });
    }
  }, [pins, map.current, selectedPinId, setSelectedPinId, onPinClick]);

  // Handle token input if not available
  if (!mapboxToken) {
    return (
      <div className="border rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Map API Token Required</h3>
        <p className="mb-4 text-gray-600">
          Please provide a Mapbox public token to enable the map feature.
        </p>
        <form onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem('token') as HTMLInputElement;
          const token = input.value.trim();
          if (token) {
            localStorage.setItem("mapbox-token", token);
            setMapboxToken(token);
          }
        }}>
          <div className="flex flex-col space-y-2">
            <input 
              name="token"
              type="text" 
              placeholder="Enter your Mapbox public token" 
              className="px-3 py-2 border rounded"
            />
            <div className="text-xs text-gray-500 mb-2">
              Get your free token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">mapbox.com</a>
            </div>
            <Button type="submit">Save Token</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ height, position: 'relative' }} className="rounded-lg overflow-hidden shadow-md">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapView;

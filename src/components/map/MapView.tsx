import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocation } from "@/contexts/LocationContext";
import { MapPin, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

interface MapViewProps {
  height?: string;
  onPinClick?: (pinId: string) => void;
  allowPinDrop?: boolean;
}

// For demo purposes - using a public token
// In production, you should use environment variables
const MAPBOX_TOKEN = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const MapView: React.FC<MapViewProps> = ({ 
  height = "500px", 
  onPinClick,
  allowPinDrop = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { pins, addPin, selectedPinId, setSelectedPinId } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState<{[key: string]: mapboxgl.Marker}>({});
  const { toast } = useToast();
  const { user } = useUser();
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Use the token from the constant or environment variable
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-122.3321, 47.6062], // Default: Seattle
      zoom: 12,
      attributionControl: false
    });

    // Add map controls
    newMap.addControl(new mapboxgl.NavigationControl(), "top-right");
    newMap.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    
    // Wait for map to load
    newMap.on('load', () => {
      setIsLoading(false);
      
      // Add click handler for pin dropping
      if (allowPinDrop && user?.role === "client") {
        newMap.on("click", (e) => {
          // Get coordinates
          const lat = e.lngLat.lat;
          const lng = e.lngLat.lng;
          
          // Perform reverse geocoding (in a real app)
          // For demo, randomly select from realistic locations
          const locations = ["Imperial Street", "Day Center", "Central Library", "Old Town Station"];
          const mockAddress = locations[Math.floor(Math.random() * locations.length)];
          
          // Add the pin
          addPin({
            userId: user.id,
            userName: user.name,
            latitude: lat,
            longitude: lng,
            address: mockAddress
          });
          
          toast({
            title: "Location Shared",
            description: `Pin dropped at ${mockAddress}`,
          });
        });
      }
    });

    map.current = newMap;

    return () => {
      newMap.remove();
    };
  }, [user, allowPinDrop, addPin, toast]);

  // Update markers when pins change
  useEffect(() => {
    if (!map.current || isLoading) return;
    
    // Clear existing markers
    Object.values(markers).forEach(marker => marker.remove());
    const newMarkers: {[key: string]: mapboxgl.Marker} = {};

    // Add new markers
    pins.forEach(pin => {
      // Create a custom marker element
      const el = document.createElement("div");
      el.className = "relative flex flex-col items-center";
      
      const markerPin = document.createElement("div");
      markerPin.className = `w-8 h-8 rounded-full ${pin.id === selectedPinId ? "bg-orange" : "bg-purple"} 
        flex items-center justify-center text-white shadow-lg transition-all duration-300 
        hover:scale-110 cursor-pointer z-10`;
      
      // Add an SVG icon
      markerPin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      
      el.appendChild(markerPin);

      // Add a tooltip
      const tooltip = document.createElement("div");
      tooltip.className = "absolute bottom-full mb-2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap opacity-0 transition-opacity duration-200 z-20";
      tooltip.innerText = `${pin.userName}${pin.address ? ` • ${pin.address}` : ''}`;
      
      markerPin.addEventListener("mouseenter", () => {
        tooltip.style.opacity = "1";
      });
      
      markerPin.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
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
        
        // Fly to the pin
        map.current?.flyTo({
          center: [pin.longitude, pin.latitude],
          zoom: 14,
          duration: 1000
        });
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
        maxZoom: 15,
        duration: 1000
      });
    } else if (pins.length === 1 && map.current) {
      map.current.flyTo({
        center: [pins[0].longitude, pins[0].latitude],
        zoom: 14,
        duration: 1000
      });
    }
  }, [pins, map.current, selectedPinId, setSelectedPinId, onPinClick, isLoading]);

  return (
    <div style={{ height, position: 'relative' }} className="rounded-lg overflow-hidden shadow-md">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="animate-spin h-8 w-8 text-purple mb-2" />
            <p className="text-navy font-medium">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Pin drop instructions */}
      {allowPinDrop && user?.role === "client" && !isLoading && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-white p-2 rounded-md shadow-md text-sm max-w-xs text-center">
            <p className="font-medium text-navy">Click anywhere on the map to drop a pin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
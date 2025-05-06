import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "@/contexts/LocationContext";
import { MapPin, Calendar, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import UserLocationControl from "@/components/map/UserLocationControl";

// Need to declare mapboxgl to use it with TypeScript
// In a real project, you would install @types/mapbox-gl
declare global {
  interface Window {
    mapboxgl: any;
  }
}

interface MapViewProps {
  height?: string;
  onPinClick?: (pinId: string) => void;
  allowPinDrop?: boolean;
  viewMode?: string;
}

// Replace with env var in production
const MAPBOX_TOKEN = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const MapView: React.FC<MapViewProps> = ({
  height = "500px",
  onPinClick,
  allowPinDrop = false,
  viewMode = "all"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const { pins, addPin, selectedPinId, setSelectedPinId } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();
  const { user } = useUser();
  const [pinType, setPinType] = useState<"current" | "future">("current");

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Load mapboxgl script dynamically
    const loadMapbox = () => {
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js';
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
      
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    
    const initializeMap = () => {
      if (!window.mapboxgl) {
        console.error("Mapbox GL JS failed to load");
        return;
      }
      
      window.mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const newMap = new window.mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-122.3321, 47.6062], // Seattle
        zoom: 12,
        attributionControl: false
      });
      
      newMap.addControl(new window.mapboxgl.NavigationControl(), "top-right");
      newMap.addControl(new window.mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));
      
      newMap.on("load", () => {
        setIsLoading(false);
        
        if (allowPinDrop && user?.role === "client") {
          newMap.on("click", (e: any) => {
            const lat = e.lngLat.lat;
            const lng = e.lngLat.lng;
            
            // Mock addresses for demo
            const locations = ["Imperial Street", "Day Center", "Central Library", "Old Town Station"];
            const mockAddress = locations[Math.floor(Math.random() * locations.length)];
            
            if (user) {
              addPin({
                userId: user.id,
                userName: user.name,
                latitude: lat,
                longitude: lng,
                address: mockAddress,
                pinType
              });
              
              toast({
                title: pinType === "current" ? "Current Location Shared" : "Future Location Planned",
                description: `Pin dropped at ${mockAddress}`,
              });
            }
          });
        }
      });
      
      map.current = newMap;
    };
    
    // Check if mapboxgl is already loaded
    if (window.mapboxgl) {
      initializeMap();
    } else {
      loadMapbox();
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [user, allowPinDrop, addPin, toast, pinType]);

  // Update markers when pins or selectedPinId change
  useEffect(() => {
    if (!map.current || isLoading) return;
    
    // Clear existing markers
    Object.values(markers).forEach((marker: any) => marker.remove());
    const newMarkers: { [key: string]: any } = {};
    
    // Filter pins based on viewMode if needed
    const filteredPins = viewMode === "all" 
      ? pins 
      : viewMode === "current" 
        ? pins.filter(pin => pin.pinType !== "future")
        : pins.filter(pin => pin.pinType === "future");
    
    // Add markers for each pin
    filteredPins.forEach(pin => {
      const el = document.createElement("div");
      el.className = "relative flex flex-col items-center";
      
      const markerPin = document.createElement("div");
      markerPin.className = `w-8 h-8 rounded-full ${pin.id === selectedPinId ? "bg-orange" : "bg-purple"} 
        flex items-center justify-center text-white shadow-lg transition-all duration-300 
        hover:scale-110 cursor-pointer z-10`;
      
      markerPin.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>`;
      
      el.appendChild(markerPin);
      
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
      
      const marker = new window.mapboxgl.Marker(el)
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(map.current);
      
      markerPin.addEventListener("click", () => {
        setSelectedPinId(pin.id);
        if (onPinClick) onPinClick(pin.id);
        
        map.current?.flyTo({
          center: [pin.longitude, pin.latitude],
          zoom: 14,
          duration: 1000
        });
      });
      
      newMarkers[pin.id] = marker;
    });
    
    setMarkers(newMarkers);
    
    // Auto-select first pin if none selected
    if (filteredPins.length > 0 && !selectedPinId) {
      setSelectedPinId(filteredPins[0].id);
    }
    
    // Fit map to show all pins
    if (filteredPins.length > 1) {
      const bounds = new window.mapboxgl.LngLatBounds();
      filteredPins.forEach(pin => bounds.extend([pin.longitude, pin.latitude]));
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 1000 });
    } else if (filteredPins.length === 1) {
      map.current.flyTo({ 
        center: [filteredPins[0].longitude, filteredPins[0].latitude], 
        zoom: 14, 
        duration: 1000 
      });
    }
  }, [pins, selectedPinId, setSelectedPinId, onPinClick, isLoading, viewMode]);

  return (
    <div style={{ height, position: "relative" }} className="rounded-lg overflow-hidden shadow-md">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="animate-spin h-8 w-8 text-purple mb-2" />
            <p className="text-navy font-medium">Loading map...</p>
          </div>
        </div>
      )}
      
      {allowPinDrop && user?.role === "client" && !isLoading && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white p-2 rounded-md shadow-md flex space-x-2">
            <Button
              size="sm"
              variant={pinType === "current" ? "default" : "outline"}
              onClick={() => setPinType("current")}
              className={pinType === "current" ? "bg-purple" : ""}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Current
            </Button>
            <Button
              size="sm"
              variant={pinType === "future" ? "default" : "outline"}
              onClick={() => setPinType("future")}
              className={pinType === "future" ? "bg-sky-blue" : ""}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Future
            </Button>
          </div>
        </div>
      )}
      
      {/* Add custom user location control */}
      <UserLocationControl 
        mapRef={map} 
        className="bottom-5 left-5" 
      />
    </div>
  );
};

export default MapView;
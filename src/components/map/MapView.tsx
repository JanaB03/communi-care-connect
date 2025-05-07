import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "@/contexts/LocationContext";
import { MapPin, Calendar, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import UserLocationControl from "@/components/map/UserLocationControl";

// Better loading state management
interface MapLoadingState {
  isLoading: boolean;
  status: "idle" | "loading" | "script-loading" | "map-initializing" | "ready" | "error";
  error: string | null;
}

interface MapViewProps {
  height?: string;
  onPinClick?: (pinId: string) => void;
  allowPinDrop?: boolean;
  viewMode?: string;
}

// Use the provided token directly
const MAPBOX_TOKEN ="pk.eyJ1IjoiYXlqejEyIiwiYSI6ImNtOXJvMzZjZDA1MGYycnBxOThycXdyb3AifQ.bEikadUdxNNIT8C8Oa7Ibg";

const MapView: React.FC<MapViewProps> = ({
  height = "500px",
  onPinClick,
  allowPinDrop = false,
  viewMode = "all"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const { pins, addPin, selectedPinId, setSelectedPinId } = useLocation();
  const [loading, setLoading] = useState<MapLoadingState>({
    isLoading: true,
    status: "idle",
    error: null
  });
  const [markers, setMarkers] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();
  const { user } = useUser();
  const [pinType, setPinType] = useState<"current" | "future">("current");
  const scriptLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    // Set loading state
    setLoading({
      isLoading: true,
      status: "script-loading",
      error: null
    });
    
    // Add timeout detection for script loading
    scriptLoadingTimeoutRef.current = setTimeout(() => {
      setLoading({
        isLoading: true,
        status: "script-loading",
        error: "Mapbox is taking longer than expected to load. Check your internet connection."
      });
    }, 8000); // 8 second timeout
    
    // Load mapboxgl script dynamically
    const loadMapbox = () => {
      // Check if it's already loaded
      if (window.mapboxgl) {
        if (scriptLoadingTimeoutRef.current) {
          clearTimeout(scriptLoadingTimeoutRef.current);
        }
        initializeMap();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js';
      script.async = true;
      script.onload = () => {
        if (scriptLoadingTimeoutRef.current) {
          clearTimeout(scriptLoadingTimeoutRef.current);
        }
        initializeMap();
      };
      script.onerror = () => {
        if (scriptLoadingTimeoutRef.current) {
          clearTimeout(scriptLoadingTimeoutRef.current);
        }
        setLoading({
          isLoading: true,
          status: "error",
          error: "Failed to load Mapbox script. Check your internet connection."
        });
      };
      document.body.appendChild(script);
      
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    
    const initializeMap = () => {
      if (!window.mapboxgl) {
        setLoading({
          isLoading: true,
          status: "error",
          error: "Mapbox GL JS failed to load"
        });
        return;
      }
      
      setLoading({
        isLoading: true,
        status: "map-initializing",
        error: null
      });
      
      try {
        // Set the access token to our hardcoded value
        window.mapboxgl.accessToken = MAPBOX_TOKEN;
        
        // Create a default style that loads faster
        const newMap = new window.mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/light-v10", // Using a lighter style that loads faster
          center: [-122.3321, 47.6062], // Seattle
          zoom: 12,
          attributionControl: false,
          trackResize: true,
          fadeDuration: 0 // Reduce animation time to speed loading
        });
        
        newMap.on('style.load', () => {
          setLoading({
            isLoading: false,
            status: "ready",
            error: null
          });
        });
        
        newMap.on("error", (e: any) => {
          console.error("Mapbox error:", e);
          setLoading({
            isLoading: true,
            status: "error",
            error: "Error loading map: " + (e.error?.message || "Unknown error")
          });
        });
        
        // Add minimal controls
        newMap.addControl(new window.mapboxgl.NavigationControl({
          showCompass: false // Hide compass to reduce initialization time
        }), "top-right");
        
        newMap.on("load", () => {
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
      } catch (error) {
        console.error("Map initialization error:", error);
        setLoading({
          isLoading: true,
          status: "error",
          error: "Failed to initialize map: " + (error instanceof Error ? error.message : "Unknown error")
        });
      }
    };
    
    // Start loading Mapbox
    loadMapbox();
    
    return () => {
      if (scriptLoadingTimeoutRef.current) {
        clearTimeout(scriptLoadingTimeoutRef.current);
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [user, allowPinDrop, addPin, toast, pinType]);

  // Update markers when pins or selectedPinId change
  useEffect(() => {
    if (!map.current || loading.isLoading) return;
    
    try {
      // Clear existing markers
      Object.values(markers).forEach((marker: any) => marker.remove());
      const newMarkers: { [key: string]: any } = {};
      
      // Only draw markers once the map is fully loaded
      if (map.current.loaded() && map.current.isStyleLoaded()) {
        // Filter pins based on viewMode if needed
        const filteredPins = viewMode === "all" 
          ? pins 
          : viewMode === "current" 
            ? pins.filter(pin => pin.pinType !== "future")
            : pins.filter(pin => pin.pinType === "future");
        
        // Add markers for each pin - batch them for better performance
        filteredPins.forEach(pin => {
          // Create a simpler marker element
          const el = document.createElement("div");
          el.className = "relative";
          
          const markerPin = document.createElement("div");
          markerPin.className = `w-6 h-6 rounded-full ${pin.id === selectedPinId ? "bg-orange" : "bg-purple"} 
            flex items-center justify-center text-white shadow-lg`;
          
          markerPin.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" 
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>`;
          
          el.appendChild(markerPin);
          
          // Only add tooltip on hover
          markerPin.addEventListener("mouseenter", () => {
            const tooltip = document.createElement("div");
            tooltip.className = "absolute bottom-full mb-2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap z-20";
            tooltip.style.left = "50%";
            tooltip.style.transform = "translateX(-50%)";
            tooltip.innerText = `${pin.userName}${pin.address ? ` • ${pin.address}` : ''}`;
            el.appendChild(tooltip);
            
            // Remove the tooltip when mouse leaves
            markerPin.addEventListener("mouseleave", () => {
              if (tooltip.parentNode === el) {
                el.removeChild(tooltip);
              }
            }, { once: true });
          });
          
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
        
        // Fit map to show all pins - only do this on initial load
        if (filteredPins.length > 1 && Object.keys(markers).length === 0) {
          const bounds = new window.mapboxgl.LngLatBounds();
          filteredPins.forEach(pin => bounds.extend([pin.longitude, pin.latitude]));
          map.current.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 1000 });
        } else if (filteredPins.length === 1 && Object.keys(markers).length === 0) {
          map.current.flyTo({ 
            center: [filteredPins[0].longitude, filteredPins[0].latitude], 
            zoom: 14, 
            duration: 1000 
          });
        }
      }
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  }, [pins, selectedPinId, setSelectedPinId, onPinClick, loading.isLoading, viewMode]);

  // Helper function for loading state message
  const getLoadingMessage = () => {
    switch (loading.status) {
      case "script-loading":
        return "Loading map resources...";
      case "map-initializing":
        return "Initializing map...";
      case "loading":
        return "Loading map...";
      case "error":
        return loading.error || "Error loading map";
      default:
        return "Loading...";
    }
  };

  return (
    <div style={{ height, position: "relative" }} className="rounded-lg overflow-hidden shadow-md">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} className="bg-gray-100" />
      
      {loading.isLoading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
            <Loader className="animate-spin h-8 w-8 text-purple mb-2" />
            <p className="text-navy font-medium">{getLoadingMessage()}</p>
            {loading.status === "script-loading" && (
              <p className="text-sm text-gray-500 mt-1">This may take a moment...</p>
            )}
            {loading.status === "error" && (
              <div>
                <p className="text-red-500 text-sm mt-2">{loading.error}</p>
                <Button 
                  className="mt-3"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {allowPinDrop && user?.role === "client" && !loading.isLoading && (
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
      {!loading.isLoading && (
        <UserLocationControl 
          mapRef={map} 
          className="bottom-5 left-5" 
        />
      )}
    </div>
  );
};

export default MapView;
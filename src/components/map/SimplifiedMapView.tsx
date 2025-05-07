import React, { useEffect, useRef, useState } from "react";

interface SimplifiedMapViewProps {
  height?: string;
}

// Hardcoded token for testing
const MAPBOX_TOKEN = "pk.eyJ1IjoiamFuYWItIiwiYSI6ImNtYWQzajRxcTAyNXYya3BxZmVscGE0bnUifQ.Gl42xm7Z17yk7AVjrY9WAg";

const SimplifiedMapView: React.FC<SimplifiedMapViewProps> = ({
  height = "500px"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For easier debugging
    console.log("Initializing simplified map with token:", MAPBOX_TOKEN);
    
    // Create and add script tag
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js';
    script.async = true;
    
    script.onload = () => {
      console.log("Mapbox script loaded successfully");
      
      try {
        // Set the token
        window.mapboxgl.accessToken = MAPBOX_TOKEN;
        
        console.log("Creating map instance...");
        // Create the map with minimal options
        const map = new window.mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-74.5, 40],
          zoom: 9
        });
        
        map.on('load', () => {
          console.log("Map loaded successfully!");
          setIsLoading(false);
        });
        
        map.on('error', (e: any) => {
          console.error("Mapbox error:", e);
          setError(e.error?.message || "Unknown map error");
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Error initializing map:", err);
        setError(err instanceof Error ? err.message : "Unknown initialization error");
        setIsLoading(false);
      }
    };
    
    script.onerror = () => {
      console.error("Failed to load Mapbox script");
      setError("Failed to load Mapbox script");
      setIsLoading(false);
    };
    
    // Add CSS
    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Add script to document
    document.body.appendChild(script);
    
    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div style={{ height, width: '100%' }} ref={mapContainer} className="bg-gray-100" />
      
      {isLoading && (
        <div className="p-4 text-center">
          <p>Loading map...</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mt-4">
          <h3 className="text-red-700 font-bold">Map Error</h3>
          <p className="text-red-600">{error}</p>
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded">
            <p className="text-sm">
              <strong>Debugging tip:</strong> Check your browser console for more detailed error messages.
              Press F12 to open developer tools, then click on the "Console" tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplifiedMapView;
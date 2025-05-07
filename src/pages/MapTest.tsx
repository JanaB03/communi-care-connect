import React from "react";
import SimplifiedMapView from "../components/map/SimplifiedMapView";

const MapTest = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Map Testing Page</h1>
      <p className="mb-4">This is a simplified page to test just the map component.</p>
      
      <div className="border rounded-lg overflow-hidden mb-4">
        <SimplifiedMapView height="400px" />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h2 className="font-bold text-blue-800 mb-2">Debugging Instructions</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Check your browser console for errors (F12 → Console tab)</li>
          <li>If you see "Error: 401" it means the Mapbox token is invalid</li>
          <li>If you see "Error loading script", it could be a network issue</li>
          <li>Take a screenshot of any errors for troubleshooting</li>
        </ol>
      </div>
    </div>
  );
};

export default MapTest;
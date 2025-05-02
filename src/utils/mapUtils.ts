
// Helper functions for map operations
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${lng.toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
};

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
};

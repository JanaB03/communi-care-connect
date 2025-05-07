/**
 * Utility to check if a Mapbox token is valid
 */

// Your hardcoded token - this is only for testing
const MAPBOX_TOKEN = "pk.eyJ1IjoiamFuYWItIiwiYSI6ImNtYWQzajRxcTAyNXYya3BxZmVscGE0bnUifQ.Gl42xm7Z17yk7AVjrY9WAg";

/**
 * Validates a Mapbox token by making a request to the Mapbox API
 * @param token The Mapbox token to validate
 * @returns A promise that resolves to an object containing validity info
 */
export const validateMapboxToken = async (token: string = MAPBOX_TOKEN): Promise<{
  isValid: boolean;
  message: string;
}> => {
  try {
    // Simple validation by requesting a styles endpoint
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${token}`
    );
    
    if (response.ok) {
      return { isValid: true, message: "Token is valid!" };
    } else {
      // Parse the error
      const data = await response.json();
      return { 
        isValid: false, 
        message: `Token validation failed: ${data.message || response.statusText}`
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message: `Error validating token: ${error instanceof Error ? error.message : "Unknown error"}`
    };
  }
};

/**
 * Checks if the browser supports WebGL (required for Mapbox)
 */
export const checkWebGLSupport = (): {
  supported: boolean;
  message: string;
} => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return {
        supported: false,
        message: "WebGL is not supported by your browser, which is required for Mapbox."
      };
    }
    
    return {
      supported: true,
      message: "WebGL is supported"
    };
  } catch (e) {
    return {
      supported: false,
      message: "Error checking WebGL support"
    };
  }
};

/**
 * Run both checks and log the results to console
 */
export const runMapboxDiagnostics = async (): Promise<void> => {
  console.group("Mapbox Diagnostics");
  
  // Check WebGL support
  const webglSupport = checkWebGLSupport();
  console.log("WebGL Support:", webglSupport);
  
  // Validate the token
  console.log("Validating token...");
  const tokenValidation = await validateMapboxToken();
  console.log("Token Validation:", tokenValidation);
  
  console.groupEnd();
  
  return;
};

// Export default hardcoded token for easy access
export default MAPBOX_TOKEN;
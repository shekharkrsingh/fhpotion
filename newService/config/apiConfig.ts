import Constants from "expo-constants";

const getApiBaseUrl = (): string => {
  const envUrl = Constants.expoConfig?.extra?.apiBaseUrl || 
                 process.env.EXPO_PUBLIC_API_BASE_URL;
  
  if (envUrl) {
    return envUrl.endsWith("/") ? envUrl : `${envUrl}/`;
  }
  // Previous (local) URL:
  // return "http://localhost:8080/";
  // Remote hosted URL (set your cloud API base here, or prefer env via EXPO_PUBLIC_API_BASE_URL):
  return "https://your-cloud-api.example.com/";
};

const getWebSocketBaseUrl = (): string => {
  const envUrl = Constants.expoConfig?.extra?.wsBaseUrl || 
                 process.env.EXPO_PUBLIC_WS_BASE_URL;
  
  if (envUrl) {
    return envUrl.endsWith("/") ? envUrl : `${envUrl}/`;
  }
  // Previous (local) URL:
  // return "http://localhost:8080/";
  // Remote hosted URL for WebSocket/SockJS handshake (match your server base):
  return "https://your-cloud-api.example.com/";
};

export const API_BASE_URL: string = getApiBaseUrl();
export const WS_BASE_URL: string = getWebSocketBaseUrl();

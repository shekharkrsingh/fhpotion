import Constants from "expo-constants";

const getApiBaseUrl = (): string => {
  const envUrl = Constants.expoConfig?.extra?.apiBaseUrl || 
                 process.env.EXPO_PUBLIC_API_BASE_URL;
  
  if (envUrl) {
    return envUrl.endsWith("/") ? envUrl : `${envUrl}/`;
  }
  return "http://localhost:8080/";
};

const getWebSocketBaseUrl = (): string => {
  const envUrl = Constants.expoConfig?.extra?.wsBaseUrl || 
                 process.env.EXPO_PUBLIC_WS_BASE_URL;
  
  if (envUrl) {
    return envUrl.endsWith("/") ? envUrl : `${envUrl}/`;
  }
  return "http://localhost:8080/";
};

export const API_BASE_URL: string = getApiBaseUrl();
export const WS_BASE_URL: string = getWebSocketBaseUrl();

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { router } from "expo-router";
import { getValidToken } from "@/utils/tokenService";
import { API_BASE_URL } from "@/newService/config/apiConfig";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

interface ApiConnectorParams<T = any> {
  method: Method;
  url: string;
  bodyData?: T;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  tokenRequired?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
}

axiosInstance.interceptors.request.use(async (config) => {
  const tokenRequired = (config as any).tokenRequired ?? true;

  if (tokenRequired) {
    // getValidToken automatically checks expiration and redirects if invalid
    const token = await getValidToken();
    if (!token) {
      // getValidToken already handled redirect, just reject the request
      return Promise.reject({
        response: {
          status: 401,
          data: { message: "Authentication token missing or expired" },
        },
      });
    }
    if (!config.headers) config.headers = {};
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized responses (token expired or invalid on backend)
    if (error?.response?.status === 401) {
      // Token is invalid on backend (expired, revoked, etc.)
      // Remove token from storage and redirect to auth
      const { removeToken } = await import("@/utils/tokenService");
      await removeToken();
      router.replace('/(auth)');
    }
    return Promise.reject(error);
  }
);

export const apiConnector = async <T = any>({
  method,
  url,
  bodyData,
  headers,
  params,
  tokenRequired = true,
  responseType = 'json',
}: ApiConnectorParams): Promise<AxiosResponse<T>> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data: bodyData ?? null,
    headers: {
      ...headers,
      ...(responseType === 'arraybuffer' && { 'Accept': 'application/pdf' }),
    },
    params,
    responseType,
  };

  (config as any).tokenRequired = tokenRequired;

  return axiosInstance(config);
};
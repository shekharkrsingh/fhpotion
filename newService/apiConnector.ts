import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const axiosInstance: AxiosInstance = axios.create({});

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
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.replace('/(auth)');
      return Promise.reject({
        response: {
          status: 401,
          data: { message: "Authentication token missing" },
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
  (error) => Promise.reject(error)
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
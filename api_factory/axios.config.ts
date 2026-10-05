import axios, { type AxiosResponse } from "axios";
import { useCustomToast } from '@/composables/core/useCustomToast'

const isDev = import.meta.env.DEV;
const envApiUrl = import.meta.env.VITE_API_BASE_URL;
const rawBaseUrl = envApiUrl || (isDev ? "http://localhost:3005" : "https://api.erranders.org");
const cleanBaseUrl = rawBaseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

const $GATEWAY_ENDPOINT = `${cleanBaseUrl}/api/v1`;

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA,
];

instanceArray.forEach((instance) => {
  instance.defaults.timeout = 15000; // Set global timeout to 15 seconds
  instance.interceptors.request.use((config: any) => {
    let currentToken = null;
    if (typeof window !== 'undefined') {
      currentToken = localStorage.getItem('barter_token');
    }
    
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    (err: any) => {
      // Check for timeout or network connection error
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error') || typeof err.response === "undefined") {
        let errorMessage = "Network Error. Please check your connection.";
        // In a browser, if it's a Network Error and we are online, it's highly likely a CORS error or server down
        if (typeof window !== 'undefined' && window.navigator.onLine && err.message?.includes('Network Error')) {
          errorMessage = "Network Error (or CORS error). The server might be unreachable or rejecting the request origin.";
        }

        useCustomToast().showToast({
          title: "Connection Error",
          message: errorMessage,
          toastType: "error",
          duration: 4000
        });

        // We reject so existing try...catch blocks in barter work, but the global toast is handled here robustly
        return Promise.reject(err);
      }

      if (err.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('barter_token');
          window.location.href = '/login';
        }
        useCustomToast().showToast({
          title: "Session Expired",
          message: "Please log in again.",
          toastType: "error",
          duration: 3000
        });
        return Promise.reject(err);
      } else if (err.response.status === 404) {
        return Promise.reject(err);
      } else if (statusCodeStartsWith(err.response.status, 4) || err.response.status === 500) {
        if (err.response.data?.message || err.response.data?.error) {
          useCustomToast().showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occurred",
            toastType: "error",
            duration: 3000
          });
        }
        return Promise.reject(err);
      }
      
      return Promise.reject(err);
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};

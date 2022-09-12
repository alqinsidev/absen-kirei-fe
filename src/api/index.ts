import { EnhancedStore } from "@reduxjs/toolkit";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";
import config from "../config";
import { LogoutAsync } from "../redux/slice/AuthSlice";
import { AppDispatch } from "../redux/store";

let store: EnhancedStore;
export const injectStore = (_store: EnhancedStore) => (store = _store);

const client = axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
});

client.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const Auth = store.getState().auth;
    const accessToken = Auth.access_token;
    const header = config.headers as AxiosRequestHeaders;
    header.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response?.status === 401) {
      const AppDispatcher = store.dispatch as AppDispatch;
      AppDispatcher(LogoutAsync());
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);
export { client };

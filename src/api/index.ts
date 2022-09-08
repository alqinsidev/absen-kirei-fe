import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";

const client = axios.create({
  baseURL: "https://presensi.kirei.co.id/api",
  timeout: 10000,
});

client.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const accessToken = localStorage.getItem("@accessToken");
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
      localStorage.setItem("@userInfo", "");
      localStorage.setItem("@accessToken", "");
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);
export { client };

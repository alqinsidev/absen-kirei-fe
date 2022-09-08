import axios from "axios";

const accessToken = localStorage.getItem("@accessToken");

const client = axios.create({
  baseURL: "https://server-1.kirei.co.id/api",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  timeout: 10000,
});
export { client };

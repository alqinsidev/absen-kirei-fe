import axios from "axios";

const accessToken = localStorage.getItem("@accessToken");

const client = axios.create({
  baseURL: "http://server-1.kirei.co.id:9999",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  timeout: 10000,
});
export { client };

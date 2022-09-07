import { client } from "../api";

const AbsenService = {
  loginScanner: async () => {
    return await client.post("/auth/login", {
      username: "absen",
      password: "absen123",
    });
  },
  login: async (payload: any) => {
    return await client.post("/auth/login", payload);
  },
  getQr: async () => {
    return await client.get("/employee/token");
  },
  storePresence: async (payload: any) => {
    return await client.post("/employee", payload);
  },
};
export default AbsenService;

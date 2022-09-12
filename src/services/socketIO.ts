import { io } from "socket.io-client";
import config from "../config";

const SocketIO = io(config.baseUrl, {
  path: "/api/socket.io",
  transports: ["websocket"],
});

export default SocketIO;

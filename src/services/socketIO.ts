import { io } from "socket.io-client";
import config from "../config";

const SocketIO = io(config.baseUrl, {
  path: "/api/socket.io",
});

export default SocketIO;

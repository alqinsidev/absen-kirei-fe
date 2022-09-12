import { io } from "socket.io-client";
import config from "../config";

const SocketIO = io(config.baseUrl);

export default SocketIO;

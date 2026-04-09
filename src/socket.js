import { io } from "socket.io-client";
import { baseAPI } from "./constants/APIRoutes";

const socketUrl = import.meta.env.VITE_SOCKET_URL?.trim() || baseAPI;
const socketPath =
  import.meta.env.VITE_SOCKET_PATH?.trim() ||
  (socketUrl.includes("webpubsub.azure.com") ? "/clients/socketio/hubs/Hub" : undefined);
const socketTransports = import.meta.env.VITE_SOCKET_TRANSPORTS
  ? import.meta.env.VITE_SOCKET_TRANSPORTS
      .split(",")
      .map((transport) => transport.trim())
      .filter(Boolean)
  : socketPath === "/clients/socketio/hubs/Hub"
    ? ["polling"]
    : ["websocket", "polling"];

const socketOptions = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1500,
  timeout: 10000,
  transports: socketTransports,
  withCredentials: true,
  ...(socketPath ? { path: socketPath } : {}),
};

export const socket = io(socketUrl, socketOptions);

let loggingAttached = false;

const attachSocketLogging = () => {
  if (loggingAttached) return;

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  loggingAttached = true;
};

attachSocketLogging();

export const connectSocket = () => {
  if (!socket.connected && !socket.active) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected || socket.active) {
    socket.disconnect();
  }
};

import { io } from "socket.io-client";

export const adminSocket = io("http://localhost:3001", {
  transports: ["websocket"],
});

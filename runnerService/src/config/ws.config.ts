import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

let io: Server;

export const initIO = (server: HTTPServer): Server => {
    io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"], credentials: true }
    });
    return io;
};

export const getIO = (): Server => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};

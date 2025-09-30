import { Server, Socket } from "socket.io";
import { FileService } from "../service/fs.service";

const fsClient = new FileService();

export const registerSocketRoutes = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('new connection id', socket.id);

        // TODO: can get cookies so can have better authN
        const host = socket.handshake.headers.host;
        console.log("host", host);

        const replId = host?.split('.')[0]; // xxxxx.rpel.com
        console.log("replId", replId);    // xxxxx

        if (!replId) {
            console.log("repl id not available- disconnecting...");
            socket.disconnect();
            return;
        }

        socket.emit('isConnected', {
            success: true,
            message: "connected successfully",
            replId,
            socketId: socket.id
        });

        initRoutes(socket, replId);

    });
}

const initRoutes = (socket: Socket, replId: string) => {
    socket.on("fileSystem", (obj) => {
        const {path} = obj;
        fsClient.getAllDirectories(path);
    })

    socket.on("allFileAndFolders", (obj) => {
        const {path} = obj;
        fsClient.getAllFilesAndFolders(path);
    })
}


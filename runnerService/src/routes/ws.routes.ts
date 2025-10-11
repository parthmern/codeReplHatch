import { Server, Socket } from "socket.io";
import { FileService } from "../service/fs.service";
import { PTYService } from "../service/pty.service";

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

    const ptyService = new PTYService(socket);

    socket.on('terminal-input', (data: string) => {
        //console.log("terminal-input -> ", data)
        ptyService.writeTerminal(data);
    });


    socket.on("fileSystem", (obj, callback) => {
        const { path } = obj;
        try {
            const dirs = fsClient.getAllDirectories(path);
            callback({ success: true, path, dirs });
        } catch (err: unknown) {
            callback({ success: false, error: err });
        }
    });


    socket.on("allFileAndFolders", (obj, callback) => {
        const { path } = obj;
        try {
            const dirs = fsClient.getAllFilesAndFolders(path);
            callback({ success: true, path, dirs });
        } catch (err: unknown) {
            callback({ success: false, error: err });
        }
    })

    socket.on("fetchContent", async ({ path: filePath }: { path: string }, callback) => {
        const fullPath = `/workspace/${filePath}`;
        try {
            const data = await fsClient.fetchFileContent(fullPath);
            callback({ success: true, data });
        } catch (err: unknown) {
            callback({ success: false, error: err });
        }
    });

    socket.on("fetchEverything", async ({ path }: { path: string }, callback) => {
        const fullPath = path;
        try {
            const data = await fsClient.fetchEverything(fullPath);
            console.log("fetchEverything", data);
            callback({ success: true, data });
        } catch (err: unknown) {
            callback({ success: false, error: err });
        }
    })

    socket.on("writeInFile", async ({ path, data }: { path: string, data: string }, callback) => {
        const fullPath = `/workspace/${path}`;
        try {
            await fsClient.writeInFile(fullPath, data);
            console.log("writeInFile done");
            callback({ success: true, fullPath: fullPath })
        }
        catch (err: unknown) {
            callback({ success: false, error: err });
        }
    })

}


import { Server } from "socket.io";

export const registerSocketRoutes = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('new connection id', socket.id);

        socket.on('message', (msg) => {
            console.log('received:', msg);
            socket.emit('reply', 'Got your message!');
        });

    });
}


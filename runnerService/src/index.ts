import express from "express";
import cors from 'cors';
import { s3Service } from "./service/s3.service";
import { createServer } from "http";
import { Server } from "socket.io";
import { getIO, initIO } from "./config/ws.config";
import { registerSocketRoutes } from "./routes/ws.routes";

const app = express();
const PORT: number = 4000;

app.use(express.json());
app.use(cors());

const server = createServer(app);
initIO(server);     // WS init config
const io = getIO();
registerSocketRoutes(io);

app.get("/", (req, res) => {
    return res.status(200).send(`Server listening on http://localhost:${PORT} V4`)
})

server.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT} V4`);
    // const s3 = new s3Service();
    // const res = await s3.getAllObject();
    // console.log(res);

})
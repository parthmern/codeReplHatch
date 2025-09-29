import express from "express";
import { s3Service } from "./service/s3.service";

const app = express();
const PORT: number = 4000;

app.listen(PORT, async () => {
    console.log(`Server running on ${PORT}`);
    const s3 = new s3Service();
    // const res = await s3.getAllObject();
    // console.log(res);

})
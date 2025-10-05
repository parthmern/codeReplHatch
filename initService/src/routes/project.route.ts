import { Hono } from "hono";
import * as z from 'zod'
import { s3Service } from "../services/s3.service.js";
const projectRouter = new Hono();

const LANGUAGES = ["nodejs", "reactjs"];

const initSchema = z.object({
    projectId: z.string().refine(
        (val) => !LANGUAGES.includes(val),
        {
            message: "projectId cannot be same as languageName"
        }
    ),
    language: z.enum(LANGUAGES)
});

type initReqType = z.infer<typeof initSchema>;


projectRouter.post('/init', async (c) => {
    try {
        const body: initReqType = await c.req.json();
        console.log("/project/init | ", body);
        initSchema.parse(body);

        // TODO: check in DB is project existed or not

        const s3 = new s3Service();
        const res = await s3.copyS3Folder(body.language, body.projectId);

        return c.json({ success: true, message: "Project initialized", data: res });
    }
    catch (error) {
        console.log("ERROR projectRouter /init ", error);
        return c.json({ success: false, error }, 400);
    }
})

export default projectRouter;
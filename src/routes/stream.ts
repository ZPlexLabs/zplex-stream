import { Hono } from "hono";
import { GoogleDrive } from "../lib/googleDrive";
import { authMiddleware } from "../middleware/auth";
import type { Env } from "../types/env";

export const streamRouter = new Hono<{ Bindings: Env }>();

streamRouter.use("/api/stream/*", (c, next) => authMiddleware(c.env.SECRET_KEY)(c, next));

streamRouter.get("/api/stream/:fileId", async (c) => {
    const fileId = c.req.param("fileId");
    const range = c.req.header("range") ?? undefined;
    const drive = new GoogleDrive(c.env);

    try {
        const res = await drive.getFileStream(fileId, range);
        return new Response(res.body, {
            status: res.status,
            headers: res.headers,
        });
    } catch (err: any) {
        return c.text(`Error fetching file: ${err.message}`, 500);
    }
});

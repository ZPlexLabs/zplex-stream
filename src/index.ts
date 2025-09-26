import { Hono } from "hono";
import { streamRouter } from "./routes/stream";
import type { Env } from "./types/env";

const app = new Hono<{ Bindings: Env }>();

app.route("/", streamRouter);

export default app;

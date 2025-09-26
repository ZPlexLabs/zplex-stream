import { Context, Next } from "hono";
import { verifyJWT } from "../lib/jwt";

export const authMiddleware = (secret: string) => {
    return async (c: Context, next: Next) => {
        const auth = c.req.header("authorization");
        if (!auth?.startsWith("Bearer ")) return c.text("Unauthorized", 401);

        const token = auth.slice(7);
        try {
            const payload = verifyJWT(token, secret);
            c.set("user", payload);
            await next();
        } catch (err: any) {
            return c.json(
                { message: "Unauthorized", details: "Missing or invalid JWT" },
                401
            );
        }
    };
};

// src/lib/jwt.ts
import jwt from "jsonwebtoken";
import type { Token } from "../types/token";

export function verifyJWT(token: string, secretKey: string): Token {
    try {
        const payload = jwt.verify(token, secretKey, { algorithms: ["HS256"] }) as Token;

        if (payload.tokenType !== "access") {
            throw new Error("Invalid token type");
        }
        if (!payload.capabilities.includes(2)) {
            throw new Error("Insufficient capabilities");
        }

        return payload;
    } catch (err: any) {
        throw new Error(`JWT verification failed: ${err.message}`);
    }
}

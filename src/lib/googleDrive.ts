import jwt from "jsonwebtoken";
import { GoogleToken } from "../types/GoogleToken";

export class GoogleDrive {
    constructor(private env: any) { }

    private getPrivateKey(): string {
        return this.env.GOOGLE_DRIVE_PRIVATE_KEY_PKCS8.replace(/\\n/g, "\n").trim();
    }

    private async fetchNewAccessToken(): Promise<GoogleToken> {
        const now = Math.floor(Date.now() / 1000);

        const payload = {
            iss: this.env.GOOGLE_DRIVE_CLIENT_EMAIL,
            scope: "https://www.googleapis.com/auth/drive.readonly",
            aud: "https://oauth2.googleapis.com/token",
            exp: now + 3600,
            iat: now,
        };

        const jwtToken = jwt.sign(payload, this.getPrivateKey(), {
            algorithm: "RS256",
            keyid: this.env.GOOGLE_DRIVE_CLIENT_ID,
            header: { typ: "JWT", alg: "RS256" },
        });

        const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion: jwtToken,
            }),
        });

        if (!res.ok) throw new Error(`Google OAuth failed: ${res.status}`);
        const data = await res.json<{
            access_token: string,
            expires_in: number,
            token_type: string
        }>();

        console.log("Fetched new Google Drive access token");
        return {
            token: data.access_token,
            expiresAt: now + data.expires_in,
            tokenType: data.token_type
        };
    }

    public async getAccessToken(): Promise<string> {
        const kvKey = "google_drive_access_token";
        const cached = await this.env.zplex.get(kvKey, "json") as GoogleToken | null;
        const now = Math.floor(Date.now() / 1000);

        if (cached && now < cached.expiresAt - 60) {
            console.log("Using cached Google Drive access token");
            return cached.token;
        }

        const newToken = await this.fetchNewAccessToken();
        await this.env.zplex.put(kvKey, JSON.stringify(newToken));
        return newToken.token;
    }

    async getFileStream(fileId: string, range?: string) {
        const accessToken = await this.getAccessToken();
        const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}` };
        if (range) headers.Range = range;

        return fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers,
        });
    }
}

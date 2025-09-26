import jwt from "jsonwebtoken";

export class GoogleDrive {
    constructor(private env: any) { }

    private getPrivateKey(): string {
        return this.env.GOOGLE_DRIVE_PRIVATE_KEY_PKCS8.replace(/\\n/g, "\n").trim();
    }

    private async getAccessToken(): Promise<string> {
        const now = Math.floor(Date.now() / 1000);

        const payload = {
            iss: this.env.GOOGLE_DRIVE_CLIENT_EMAIL,
            scope: "https://www.googleapis.com/auth/drive.readonly",
            aud: "https://oauth2.googleapis.com/token",
            exp: now + 3600,
            iat: now,
        };

        const privateKey = this.getPrivateKey();
        const jwtToken = jwt.sign(payload, privateKey, {
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
        const data = await res.json<{ access_token: string }>();

        return data.access_token;
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

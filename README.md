# zplex-stream 🚀

**zplex-stream** is a blazing-fast **Cloudflare Worker** that securely streams files from **Google Drive** straight to your client apps. With **JWT authentication** from `zplex-api` 🔑 and full support for **video seeking** 🎬, it’s the perfect way to serve content without exposing your credentials.

---

## Features ✨

* Stream Google Drive files **securely** to clients 🛡️
* Authenticate users via **JWT tokens** (must match `zplex-api`) 🔑
* **Supports HTTP Range requests** for smooth video playback ⏯️
* Lightweight, fast, and production-ready ⚡
* No sensitive credentials are ever exposed to the client 🔒

---

## Setup 🛠️

### Install dependencies

```bash
npm install
```

### Add secrets

For local development and production, add your credentials via Wrangler:

```bash
wrangler secret put SECRET_KEY        # Must be the same as zplex-api
wrangler secret put GOOGLE_DRIVE_CLIENT_EMAIL
wrangler secret put GOOGLE_DRIVE_CLIENT_ID
wrangler secret put GOOGLE_DRIVE_PRIVATE_KEY_ID
wrangler secret put GOOGLE_DRIVE_PRIVATE_KEY_PKCS8
```

### Run locally

```bash
npm run dev
```

### Deploy to Cloudflare

```bash
npm run deploy
```

---

## Usage 📡

```http
GET /stream/:fileId HTTP/1.1
Host: your-worker-domain
Authorization: Bearer <JWT_TOKEN>
Range: bytes=0-1023
```

* **Authorization**: JWT from `zplex-api` 🔑
* **Range**: optional; allows partial content requests for video seeking ⏩

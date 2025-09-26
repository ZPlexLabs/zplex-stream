# zplex-stream 🚀

**zplex-stream** is a blazing-fast **Cloudflare Worker** that securely streams files from **Google Drive** straight to your client apps. With **JWT authentication** from [`zplex-api`](https://github.com/ZPlexLabs/zplex-api) 🔑 and full support for **video seeking** 🎬, it’s the perfect way to serve content without exposing your credentials.

---

## Features ✨

* Stream Google Drive files **securely** to clients 🛡️
* Authenticate users via JWT issued by [`zplex-api`](https://github.com/ZPlexLabs/zplex-api) 🔑 (Users must have 'Stream' capability)
* **Supports HTTP Range requests** for smooth video playback ⏯️
* Lightweight, fast, and production-ready ⚡
* No sensitive credentials are ever exposed to the client 🔒
* **Workers KV caching** of Google access tokens for efficiency  

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
wrangler secret put GOOGLE_DRIVE_PRIVATE_KEY_PKCS8 # single line, replace newlines with \n
```

### Setup Workers KV

```bash
npx wrangler kv namespace create zplex
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

* **Authorization**: JWT issued by [`zplex-api`](https://github.com/ZPlexLabs/zplex-api) 🔑
* **Range**: optional; allows partial content requests for video seeking ⏩

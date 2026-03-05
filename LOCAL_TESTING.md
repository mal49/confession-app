# Local Testing Guide

This guide shows you how to run the full application locally for testing.

## Quick Start

### 1. Start the Backend (Worker)

Open a terminal and run:

```bash
cd worker
npx wrangler dev
```

The Worker will start at: **http://localhost:8787**

### 2. Start the Frontend

Open another terminal and run:

```bash
cd frontend
npm run dev
```

The frontend will start at: **http://localhost:5173**

### 3. Access the App

- **Homepage**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin

## Default Local Credentials

| Setting | Value |
|---------|-------|
| Admin API Key | `test123` |
| Turnstile Site Key | `1x00000000000000000000AA` (test key - always passes) |
| Turnstile Secret | `1x0000000000000000000000000000000AA` (test key) |

## Environment Setup

Create a `worker/.dev.vars` file with local secrets:

```bash
cd worker
cat > .dev.vars << EOF
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
ADMIN_API_KEY=test123

# Optional: Threads API for auto-posting (get from Meta Developers)
# THREADS_ACCESS_TOKEN=your_threads_access_token_here
# THREADS_USER_ID=your_threads_user_id_here
EOF
```

This file is automatically loaded by Wrangler during local development and is ignored by git.

## Local Database

The local D1 database is stored in:
```
worker/.wrangler/state/v3/d1/
```

To reset the database, delete this folder and restart `wrangler dev`.

## Testing the Full Flow

1. **Submit a confession** at http://localhost:5173
2. **Go to admin** at http://localhost:5173/admin
3. **Login** with API key: `test123`
4. **Approve/Reject** the confession

---

## Testing Threads API (Auto-Posting)

There are **three ways** to test the Threads auto-posting feature locally:

### Option 1: API Endpoints (Recommended for Testing)

Use `curl` or any HTTP client to test directly:

```bash
# 1. Check Threads configuration status
curl http://localhost:8787/api/admin/threads-status \
  -H "X-API-Key: test123"

# Expected response (not configured):
# {"success":true,"data":{"configured":false,"message":"Threads API credentials not configured..."}}

# 2. Post a test message (only works if credentials are configured)
curl -X POST http://localhost:8787/api/admin/test-threads \
  -H "X-API-Key: test123"

# Expected response (success):
# {"success":true,"data":{"postId":"123456789","permalink":"https://threads.net/@user/post/123456789","message":"Test post successful!"}}
```

### Option 2: Test Through Admin Panel

1. Configure Threads credentials in `.dev.vars` (see below)
2. Restart the Worker: `npx wrangler dev`
3. Submit a test confession at http://localhost:5173
4. Go to http://localhost:5173/admin
5. Approve the confession
6. Check the toast notification:
   - ✅ Green "Approved & Posted to Threads" = Success
   - ⚠️ Yellow "Approved (Auto-post Failed)" = API error
   - ✅ Green "Confession Approved" = No credentials configured

### Option 3: Direct API Test with Confession

```bash
# 1. Submit a confession first
curl -X POST http://localhost:8787/api/confession \
  -H "Content-Type: application/json" \
  -d '{"content":"Test confession for Threads posting","category":"other","turnstileToken":"1x0000000000000000000000000000000AA"}'

# Note the ID from the response (e.g., id: 1)

# 2. Approve it (this triggers auto-post if configured)
curl -X POST http://localhost:8787/api/confession/1/approve \
  -H "X-API-Key: test123" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Testing auto-post"}'

# 3. Check the response for posting status
# {
#   "success": true,
#   "data": {
#     "id": 1,
#     "status": "posted",  # or "approved" if no credentials
#     "posted": true,      # true if posted to Threads
#     "postId": "123456",
#     "permalink": "https://threads.net/@user/post/123456"
#   }
# }
```

### Getting Threads API Credentials

To test with real Threads posting:

1. **Create a Meta App** at https://developers.facebook.com/
2. **Add Threads API** product to your app
3. **Get Access Token**:
   - Go to https://developers.facebook.com/tools/explorer/
   - Select your app
   - Generate token with permissions: `threads_basic`, `threads_content_publish`
4. **Get User ID**: Query `GET /me?fields=id,username` in Graph API Explorer
5. **Add to `.dev.vars`**:
   ```
   THREADS_ACCESS_TOKEN=your_actual_token_here
   THREADS_USER_ID=your_user_id_here
   ```
6. **Restart Worker**: `npx wrangler dev`

### Testing Without Real Credentials

If you don't have Threads API access yet, you can:

1. **Leave credentials unset** - The app will approve but not auto-post
2. **Use invalid credentials** - The app will approve and report the error
3. **Mock the API** - Modify `worker/src/services/threads-api.ts` to return success:
   ```typescript
   // Temporary mock for testing
   export async function postToThreads(content: string, credentials: ThreadsCredentials): Promise<PostResult> {
     console.log('MOCK: Would post to Threads:', content);
     return {
       success: true,
       postId: 'mock-123',
       permalink: 'https://threads.net/@test/post/mock-123',
     };
   }
   ```

---

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure the Worker is running and `frontend/.env.local` has:
```
VITE_API_URL=http://localhost:8787
```

### Database Errors
If the database seems empty or missing tables:
```bash
cd worker
npx wrangler d1 migrations apply confession-db --local
```

### Port Already in Use
If port 8787 or 5173 is busy, the commands will suggest alternative ports automatically.

## Switching to Production

When you're ready to use production:

1. **Frontend**: Update `VITE_API_URL` in `.env.production` to your Worker URL
2. **Build & Deploy**: `npm run build && npm run deploy`
3. **Backend**: Already deployed at https://confession-worker.ikhmalhanif60.workers.dev/

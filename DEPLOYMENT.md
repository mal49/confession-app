# Deployment Guide

## Cloudflare Pages (Frontend) - CLI Deployment

### Prerequisites

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

### Initial Deployment

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Pages**
   ```bash
   cd frontend
   wrangler pages deploy dist --project-name=confession-app
   ```

   - If this is your first deploy, Wrangler will ask to create a new project
   - Select **"Create a new project"**
   - The project will be created at: `https://confession-app.pages.dev`

3. **Set Environment Variables**
   ```bash
   cd frontend
   wrangler pages secret put VITE_API_URL
   # Enter your Worker URL: https://confession-worker.your-account.workers.dev
   
   wrangler pages secret put VITE_TURNSTILE_SITE_KEY
   # Enter your Turnstile site key
   ```

   Or set them in the Cloudflare Dashboard:
   - Go to **Pages** > **confession-app** > **Settings** > **Environment variables**
   - Add:
     - `VITE_API_URL` = `https://confession-worker.your-account.workers.dev`
     - `VITE_TURNSTILE_SITE_KEY` = `your-turnstile-site-key`

### Deploy Updates

After making changes to the frontend:

```bash
cd frontend
npm run build
wrangler pages deploy dist --project-name=confession-app
```

Or add a script to `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && wrangler pages deploy dist --project-name=confession-app"
  }
}
```

Then just run:
```bash
cd frontend
npm run deploy
```

### Production & Preview Deployments

- **Production**: `wrangler pages deploy dist --project-name=confession-app --branch=main`
- **Preview**: `wrangler pages deploy dist --project-name=confession-app --branch=preview`

Preview deployments get a unique URL like `https://preview-name.confession-app.pages.dev`

---

## Cloudflare Worker (Backend)

### Initial Setup

1. **Install Wrangler CLI** (if not done)
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Create D1 Database**
   ```bash
   cd worker
   wrangler d1 create confession-db
   ```
   Copy the database ID and update `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "confession-db"
   database_id = "your-database-id-here"
   ```

4. **Apply Migrations**
   ```bash
   cd worker
   wrangler d1 migrations apply confession-db
   ```

5. **Set Secrets**
   ```bash
   cd worker
   wrangler secret put TURNSTILE_SECRET_KEY
   wrangler secret put ADMIN_API_KEY
   
   # Optional: For auto-posting to Threads
   wrangler secret put THREADS_ACCESS_TOKEN
   wrangler secret put THREADS_USER_ID
   ```

6. **Deploy Worker**
   ```bash
   cd worker
   wrangler deploy
   ```

### Deploy Updates

```bash
cd worker
wrangler deploy
```

---

## Threads API Setup (Optional)

To enable auto-posting approved confessions to Threads:

### 1. Create a Meta App
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select **Other** > **Business**
4. Enter app name (e.g., "Confession App")
5. Complete the security check

### 2. Add Threads Product
1. In your app dashboard, click **Add Product**
2. Find **Threads API** and click **Set Up**
3. Complete the configuration steps

### 3. Get Access Token
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click **Generate Access Token**
4. Grant the following permissions:
   - `threads_basic`
   - `threads_content_publish`
5. Copy the generated token

### 4. Get Your Threads User ID
1. In the Graph API Explorer, query: `GET /me?fields=id,username`
2. Copy the `id` value (this is your Threads User ID)

### 5. Set Worker Secrets
```bash
cd worker
wrangler secret put THREADS_ACCESS_TOKEN
# Paste your access token

wrangler secret put THREADS_USER_ID
# Paste your user ID
```

### 6. Test the Integration

#### Option A: API Test Endpoint (Recommended)
```bash
# Check configuration status
curl -H "X-API-Key: your-admin-api-key" \
  https://your-worker.workers.dev/api/admin/threads-status

# Post a test message
curl -X POST -H "X-API-Key: your-admin-api-key" \
  https://your-worker.workers.dev/api/admin/test-threads
```

#### Option B: Through Admin Panel
1. Go to your admin panel
2. Approve a confession
3. Check the response - it should show `posted: true` and a `permalink`
4. Verify the post appears on your Threads account

### Token Refresh
Access tokens expire periodically. To refresh:
1. Visit the Graph API Explorer
2. Generate a new token
3. Update the secret: `wrangler secret put THREADS_ACCESS_TOKEN`

---

## Cloudflare Turnstile Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Turnstile**
2. Click **Add Site**
3. Enter your domain (or `localhost` for testing)
4. Select **Managed** widget type
5. Copy the **Site Key** and **Secret Key**
6. Add Site Key to Pages environment variables (via `wrangler pages secret put` or Dashboard)
7. Add Secret Key to Worker secrets (via `wrangler secret put`)

---

## Local Development

### Terminal 1: Start Worker
```bash
cd worker
npm run dev        # Runs on http://localhost:8787
```

### Terminal 2: Start Frontend  
```bash
cd frontend
npm run dev        # Runs on http://localhost:5173
```

---

## Production Checklist

- [ ] D1 Database created and migrated
- [ ] Worker deployed and responding
- [ ] Pages site deployed via CLI
- [ ] Environment variables set for Pages
- [ ] Secrets set for Worker
- [ ] Turnstile keys configured
- [ ] Admin API key set as secret
- [ ] Threads API configured (optional - for auto-posting)
- [ ] Custom domain configured (optional)
- [ ] HTTPS enforced (automatic)

---

## Useful Wrangler Commands

```bash
# Pages commands
wrangler pages project list                    # List all Pages projects
wrangler pages deployment list                 # List deployments
wrangler pages deployment tail                 # View real-time logs
wrangler pages secret list                     # List secrets

# Worker commands
wrangler tail                                  # View Worker logs
wrangler secret list                           # List Worker secrets
wrangler d1 execute confession-db --command="SELECT * FROM confessions LIMIT 5"
```

# Deployment Guide

## Cloudflare Pages (Frontend)

### Initial Setup

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/confession-app.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Pages** > **Create a project**
   - Connect your GitHub repository
   - Select the `frontend` folder as the root directory

3. **Build Settings**
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `frontend`

4. **Environment Variables**
   Add these in the Cloudflare Dashboard:
   ```
   VITE_API_URL=https://confession-worker.your-account.workers.dev
   VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
   ```

### Deploy Updates

Cloudflare Pages automatically deploys when you push to your main branch.

## Cloudflare Worker (Backend)

### Initial Setup

1. **Install Wrangler CLI**
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
   wrangler d1 migrations apply confession-db
   ```

5. **Set Secrets**
   ```bash
   wrangler secret put TURNSTILE_SECRET_KEY
   wrangler secret put ADMIN_API_KEY
   ```

6. **Deploy Worker**
   ```bash
   wrangler deploy
   ```

### Deploy Updates

```bash
cd worker
wrangler deploy
```

## Cloudflare Turnstile Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Turnstile**
2. Click **Add Site**
3. Enter your domain (or `localhost` for testing)
4. Select **Managed** widget type
5. Copy the **Site Key** and **Secret Key**
6. Add Site Key to Pages environment variables
7. Add Secret Key to Worker secrets

## Local Development

### Terminal 1: Start Worker
```bash
cd worker
npm run dev
```
Worker runs at http://localhost:8787

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs at http://localhost:5173

## Production Checklist

- [ ] D1 Database created and migrated
- [ ] Worker deployed and responding
- [ ] Pages site connected to Git
- [ ] Turnstile keys configured
- [ ] Admin API key set as secret
- [ ] Environment variables configured in Dashboard
- [ ] Custom domain configured (optional)
- [ ] HTTPS enforced

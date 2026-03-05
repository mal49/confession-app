# 🚀 Publish Now - Final Steps

## Pre-Deploy Checklist ✅

- [x] Production secrets configured
- [x] Threads API configured  
- [x] Local testing complete

---

## Deploy Commands

### Step 1: Deploy Backend (Worker)

```bash
cd worker

# Deploy to production
npx wrangler deploy

# Verify it's working
curl https://confession-worker.ikhmalhanif60.workers.dev/api/health
```

### Step 2: Build & Deploy Frontend

```bash
cd frontend

# Build for production
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=confession-app
```

---

## Post-Deploy Verification

### 1. Health Check
```bash
curl https://confession-worker.ikhmalhanif60.workers.dev/api/health
```

### 2. Test Confession Submission
- Visit your Pages URL
- Submit a test confession
- Check that it appears in the admin panel

### 3. Test Admin Flow
- Go to `/admin`
- Login with your production API key
- Approve the test confession
- Verify it auto-posts to Threads

### 4. Check Stats API
```bash
curl https://confession-worker.ikhmalhanif60.workers.dev/api/admin/stats \
  -H "X-API-Key: your-admin-api-key"
```

---

## 🎉 You're Live!

Your app should now be accessible at:
- **Frontend**: https://confession-app.pages.dev
- **API**: https://confession-worker.ikhmalhanif60.workers.dev

---

## Quick Rollback (If Needed)

If something breaks, you can quickly rollback:

```bash
# Rollback Worker
cd worker
npx wrangler rollback

# Rollback Pages (redeploy previous build)
cd frontend
# Rebuild from previous commit, then:
npx wrangler pages deploy dist --project-name=confession-app
```

---

## Need Help?

Check logs:
```bash
# Worker logs
npx wrangler tail

# Pages logs  
npx wrangler pages deployment tail --project-name=confession-app
```

Good luck! 🎊

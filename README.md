# 🪶 Unveil - Anonymous Confession App

A safe space for unspoken thoughts. Built with Cloudflare's edge infrastructure for zero-cost, production-ready deployment.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)

## ✨ Features

- **🔒 Fully Anonymous** - No accounts, no tracking, no identity
- **🛡️ Privacy-First** - IP addresses are hashed, not stored
- **🤖 Bot Protection** - Cloudflare Turnstile CAPTCHA
- **⏱️ Rate Limiting** - 3 submissions per hour per IP
- **📝 Content Filtering** - Spam and profanity detection
- **📱 Responsive Design** - Works beautifully on all devices
- **🎨 Beautiful UI** - Threads-inspired interface with light/dark themes
- **⚡ Edge-Powered** - Fast global performance via Cloudflare

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │  PAGES (React)   │───────▶│ WORKER (Hono)    │               │
│  │  • Vite + TS     │  API   │  • TypeScript    │               │
│  │  • Tailwind v4   │        │  • D1 Database   │               │
│  │  • shadcn/ui     │        │  • Rate limiting │               │
│  └──────────────────┘        └────────┬─────────┘               │
│           │                           │                         │
│           │              ┌────────────┘                         │
│           │              │                                      │
│           ▼              ▼                                      │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  TURNSTILE       │  │  D1 DATABASE     │                     │
│  │  (CAPTCHA)       │  │  • confessions   │                     │
│  └──────────────────┘  │  • moderation_log│                     │
│                        └──────────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Cloudflare account (free tier works)
- Wrangler CLI: `npm install -g wrangler`

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd confession-app
   npm install
   cd frontend && npm install
   cd ../worker && npm install
   ```

2. **Set up environment variables**
   ```bash
   # In frontend/.env.local
   VITE_API_URL=http://localhost:8787
   VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
   VITE_ADMIN_API_KEY=your-admin-key
   ```

3. **Set up D1 Database (local development)**
   ```bash
   cd worker
   wrangler d1 create confession-db
   # Copy the database ID to wrangler.toml
   wrangler d1 migrations apply confession-db --local
   ```

4. **Start development servers**

   Terminal 1 - Worker:
   ```bash
   cd worker
   npm run dev
   ```

   Terminal 2 - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
confession-app/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # UI components (shadcn/ui)
│   │   ├── api/          # API client
│   │   └── hooks/        # React hooks
│   ├── public/           # Static assets
│   └── wrangler.toml     # Pages config
│
├── worker/               # Cloudflare Worker backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # CORS, auth, rate limiting, content filter
│   │   └── db/          # Database schema
│   ├── migrations/       # D1 migrations
│   └── wrangler.toml    # Worker config
│
├── shared/              # Shared TypeScript types
│   └── types/
│       └── index.ts
│
├── PROJECT_PLAN.md      # Development roadmap
├── DEPLOYMENT.md        # Deployment guide
└── README.md           # This file
```

## 🔧 Configuration

### Turnstile Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Turnstile
2. Add your site domain (or `localhost` for development)
3. Copy Site Key → `VITE_TURNSTILE_SITE_KEY` in frontend `.env.local`
4. Copy Secret Key → Run `wrangler secret put TURNSTILE_SECRET_KEY` in worker

### Environment Variables

**Frontend** (`.env.local`):
```env
VITE_API_URL=http://localhost:8787
VITE_TURNSTILE_SITE_KEY=your-site-key
VITE_ADMIN_API_KEY=your-admin-key
```

**Worker Secrets** (via `wrangler secret put`):
```
TURNSTILE_SECRET_KEY=your-secret-key
ADMIN_API_KEY=your-admin-key
```

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy:

```bash
# Deploy Worker
cd worker
wrangler deploy

# Deploy Frontend
cd frontend
npm run build
wrangler pages deploy dist --project-name=confession-app
```

## 🛡️ Security Features

| Feature | Implementation |
|---------|---------------|
| **Rate Limiting** | 3 submissions/hour per IP (hashed) |
| **CAPTCHA** | Cloudflare Turnstile verification |
| **Content Filter** | Profanity, spam, and quality checks |
| **XSS Protection** | Input sanitization on server |
| **CORS** | Strict origin checking |
| **IP Privacy** | SHA-256 hashed IPs with salt |

## 📊 Database Schema

```sql
-- Confessions table
CREATE TABLE confessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    ip_hash TEXT,           -- Privacy-safe IP hash
    turnstile_token TEXT,   -- CAPTCHA verification
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_at DATETIME,
    posted_by TEXT
);

-- Moderation audit log
CREATE TABLE moderation_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    confession_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    admin_ip TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/confession` | Submit confession | - |
| GET | `/api/confession/pending` | List pending | Admin |
| POST | `/api/confession/:id/approve` | Approve confession | Admin |
| POST | `/api/confession/:id/reject` | Reject confession | Admin |
| GET | `/api/admin/stats` | Dashboard stats | Admin |
| GET | `/api/health` | Health check | - |

## 📝 Content Guidelines

- **Min length**: 500 characters
- **Max length**: 800 characters
- **No spam/promotional content**
- **No hate speech or slurs**
- **No personal information (PII)**

All confessions are manually reviewed before posting to Threads.

## 🎨 Customization

### Themes

The app supports light and dark themes via CSS variables. Edit `frontend/src/index.css`:

```css
.dark {
  --bg-primary: #000000;
  --text-primary: #fafaf9;
  /* ... */
}

.light {
  --bg-primary: #ffffff;
  --text-primary: #18181b;
  /* ... */
}
```

### Categories

Edit `CATEGORY_OPTIONS` in `confession-form-threads.tsx`:

```typescript
const CATEGORY_OPTIONS = [
  { value: 'relationship', label: 'Relationship', icon: '💕', color: '...' },
  { value: 'work', label: 'Work', icon: '💼', color: '...' },
  // Add your own...
];
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Cloudflare](https://workers.cloudflare.com/) - Edge infrastructure
- [Hono](https://hono.dev/) - Fast, lightweight web framework

---

<p align="center">
  Built with care for those who need to be heard.<br>
  <strong>Your secrets are safe here.</strong> 🤍
</p>

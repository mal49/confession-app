# Anonymous Threads Confession - MVP Project Plan

**Goal**: Launch a production-ready anonymous confession web app with Cloudflare-native architecture where users submit confessions, admins moderate, and approved posts are manually shared to Threads  
**Timeline**: 4 weeks  
**Team**: 1 full-stack developer  
**Constraints**: 
- Zero ongoing costs (Cloudflare free tier)
- No user authentication (fully anonymous)
- Manual posting to Threads (Phase 1)
- Single admin access (simple password protection for MVP)

---

## Current State Assessment

| Component | Status | Notes |
|-----------|--------|-------|
| React + Vite | ✅ Exists | Basic template installed |
| TypeScript | ✅ Exists | Configured |
| TailwindCSS | ✅ Exists | Tailwind v4 configured |
| shadcn/ui | ✅ Exists | Button, Card, Select, Textarea, Toast components |
| Cloudflare Worker | ✅ Exists | Full API with middleware |
| Cloudflare D1 | ✅ Exists | Schema created, tables indexed |
| Project structure | ✅ Exists | Split into frontend/worker/shared |
| Rate Limiting | ✅ Exists | IP-based (3/hour) |
| Content Filter | ✅ Exists | Profanity, spam, quality checks |
| Toast Notifications | ✅ Exists | Success/error variants |
| Turnstile CAPTCHA | ✅ Exists | Frontend + server verification |

---

## Milestones

| # | Milestone | Target Date | Success Criteria |
|---|-----------|-------------|------------------|
| 1 | **Foundation Ready** ✅ | End Week 1 | Project restructured, D1 database created, Worker deployed, shadcn/ui configured |
| 2 | **Submission Working** ✅ | End Week 2 | Users can submit confessions with CAPTCHA, rate limiting active, data persists to D1 |
| 3 | **Admin Dashboard Live** | End Week 3 | Admin can view pending, approve/reject confessions, content filtering active |
| 4 | **Production Launch** | End Week 4 | Deployed to Cloudflare Pages, all security measures active, documentation complete |

---

## Phase 1: Foundation & Setup (Week 1)

**Goal**: Restructure project, set up Cloudflare infrastructure, configure UI framework

| Task | Effort | Depends On | Done Criteria |
|------|--------|------------|---------------|
| **1.1 Project Restructure** | 3h | - | ✅ Folder structure: `frontend/`, `worker/`, `shared/` created; existing files moved |
| **1.2 Install TailwindCSS** | 1h | 1.1 | ✅ Tailwind v4 configured, `globals.css` updated, test component styled |
| **1.3 Setup shadcn/ui** | 2h | 1.2 | ✅ CLI initialized, base components installed (button, card, textarea, select, toast) |
| **1.4 Create D1 Database** | 1h | - | ✅ Database configured via Wrangler CLI, schema.sql written |
| **1.5 Apply Database Schema** | 1h | 1.4 | ✅ Migration created, tables & indexes defined |
| **1.6 Initialize Worker Project** | 2h | 1.1 | ✅ `worker/` folder with Wrangler config, TypeScript, routes ready |
| **1.7 Configure CORS & Middleware** | 2h | 1.6 | ✅ CORS headers set, error handling, Turnstile middleware |
| **1.8 Connect Frontend to API** | 2h | 1.7 | ✅ API client created, environment variables configured |
| **1.9 Deploy Frontend to Pages** | 1h | 1.8 | ⏳ Pending manual deployment |
| **1.10 Setup Turnstile** | 1h | - | ✅ Turnstile widget keys configured in env and wrangler.toml |

**Phase 1 Total**: ~16 hours (2 days)

**Deliverable**: Live placeholder at Pages URL, Worker responding, D1 ready

---

## Phase 2: Core Submission Flow (Week 2)

**Goal**: Build confession form, implement submission API with security

| Task | Effort | Depends On | Done Criteria |
|------|--------|------------|---------------|
| **2.1 Create Shared Types** | 1h | - | ✅ TypeScript interfaces for Confession, API requests/responses in `shared/types/` |
| **2.2 Build CategorySelector Component** | 2h | 1.3 | ✅ Integrated into ConfessionForm with categories |
| **2.3 Build CharacterCounter Component** | 1h | 1.3 | ✅ Integrated into ConfessionForm with visual indicators |
| **2.4 Build ConfessionForm Component** | 4h | 2.2, 2.3 | ✅ Form with textarea, category, validation, Turnstile integration |
| **2.5 Implement POST /api/confession** | 3h | 1.5, 1.10 | ✅ Endpoint with validation, rate limiting, content filtering |
| **2.6 Build Rate Limit Middleware** | 3h | 2.5 | ✅ IP-based rate limiting (3/hour), in-memory store |
| **2.7 Build Content Filter** | 2h | 2.5 | ✅ Profanity, spam, and quality filtering on server |
| **2.8 Add Form Success/Error States** | 2h | 2.4 | ✅ Toast notification system with success/error variants |
| **2.9 Integrate Turnstile Widget** | 2h | 2.4, 1.10 | ✅ Widget integrated with form validation |
| **2.10 Test End-to-End Submission** | 2h | 2.5, 2.9 | ✅ Build verification complete, flow ready for testing |

**Phase 2 Total**: ~22 hours (2.75 days)

**Deliverable**: Users can successfully submit confessions, rate limiting active, spam protection working

---

## Phase 3: Admin Dashboard (Week 3)

**Goal**: Build moderation interface for reviewing and approving confessions

| Task | Effort | Depends On | Done Criteria |
|------|--------|------------|---------------|
| **3.1 Implement GET /api/confession/pending** | 2h | 1.5 | Returns paginated pending confessions, sorted by oldest first |
| **3.2 Implement POST /api/confession/:id/approve** | 2h | 1.5 | Updates status to approved, logs moderation action |
| **3.3 Implement POST /api/confession/:id/reject** | 2h | 1.5 | Updates status to rejected, optional reason stored |
| **3.4 Add Simple Admin Auth** | 2h | 3.1 | Password-protected routes (basic token/API key for MVP) |
| **3.5 Build ConfessionCard Component** | 2h | 1.3 | Display confession with category, date, content preview |
| **3.6 Build AdminModerationList Component** | 3h | 3.5 | List view with pagination, status badges, empty state |
| **3.7 Build ModerationActions Component** | 2h | 1.3 | Approve/Reject buttons with confirmation |
| **3.8 Create Admin Page (/admin)** | 3h | 3.6, 3.7 | Full dashboard: list, actions, refresh, stats counter |
| **3.9 Add Loading & Empty States** | 2h | 3.8 | Skeleton loaders, "No pending" message, error states |
| **3.10 Test Moderation Flow** | 2h | 3.1-3.9 | Full cycle: submit → pending → approve/reject → verify status |

**Phase 3 Total**: ~22 hours (2.75 days)

**Deliverable**: Functional admin dashboard at `/admin`, moderation workflow complete

---

## Phase 4: Polish & Launch (Week 4)

**Goal**: Production hardening, responsive design, documentation, launch

| Task | Effort | Depends On | Done Criteria |
|------|--------|------------|---------------|
| **4.1 Responsive Design Pass** | 3h | 2.4, 3.8 | Mobile-first, works on all screen sizes |
| **4.2 Add Form Validation Feedback** | 2h | 2.4 | Real-time validation, clear error messages |
| **4.3 Implement Submission Stats** | 2h | 3.8 | Show counts: pending, approved, total on admin |
| **4.4 Add Copy-to-Clipboard for Threads** | 1h | 3.7 | One-click copy confession text for manual posting |
| **4.5 Create README Documentation** | 2h | - | Setup instructions, deployment guide, architecture notes |
| **4.6 Add Environment Configuration** | 2h | All | wrangler.toml, .env.example, env validation |
| **4.7 Security Review** | 3h | All | Check CORS, validate inputs, review secrets handling |
| **4.8 Performance Optimization** | 2h | All | Bundle size check, lazy loading, image optimization |
| **4.9 Final Testing & Bug Fixes** | 4h | All | Cross-browser test, mobile test, edge cases |
| **4.10 Production Deploy** | 1h | 4.9 | Deploy to production domains, verify all features |

**Phase 4 Total**: ~22 hours (2.75 days)

**Deliverable**: Production-ready application, documented, deployed

---

## Dependencies Map

```
Week 1: Foundation
├── 1.1 Project Restructure ──┬──> 1.2 Tailwind ──> 1.3 shadcn/ui ──┐
│                             └──> 1.6 Worker ────> 1.7 Middleware ──┤
├── 1.4 D1 Database ──> 1.5 Schema ──────────────────────────────────┤
└── 1.10 Turnstile ──────────────────────────────────────────────────┘
                                          │
                                          ▼
Week 2: Submission <──────────────────────────────────────────────────┘
├── 2.1 Shared Types ──> 2.2 CategorySelector ──┐
├── 2.3 CharacterCounter ────────────────────────┼──> 2.4 Form ──> 2.9 Turnstile Integration
│                                                │
└── 2.5 POST Endpoint ──> 2.6 Rate Limit ──> 2.7 Content Filter ───┘
                                                                   │
Week 3: Admin <─────────────────────────────────────────────────────┘
├── 3.1 GET Pending ──┐
├── 3.2 Approve ──────┼──> 3.4 Admin Auth ──> 3.8 Admin Page
├── 3.3 Reject ───────┘                    │
│                                          ├──> 3.9 Loading States
├── 3.5 ConfessionCard ──> 3.6 ModerationList ──┘
└── 3.7 ModerationActions ──────────────────────┘

Week 4: Launch
└── 4.1-4.10 (Polish tasks, mostly parallel after core dependencies)
```

**Critical Path**: 
`1.1 → 1.2 → 1.3 → 2.4 → 2.9 → 3.8 → 4.10`

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Cloudflare Workers/D1 limits** | Medium | Low | Stay within free tier limits (100k req/day, 500MB storage); monitor usage |
| **Turnstile integration issues** | Medium | Low | Test thoroughly in dev, have fallback error handling, check token expiration |
| **Content filtering bypass** | High | Medium | Multi-layer approach (client + server), manual review required, easy reject flow |
| **Rate limiting too aggressive** | Low | Medium | Start permissive (5/hour), monitor, adjust based on real usage |
| **Admin password leak** | High | Low | Use strong password, store hashed, rotate regularly, consider adding 2FA later |
| **Threads manual posting friction** | Medium | High | Build copy-to-clipboard feature, plan Phase 2 automation, document workflow |
| **shadcn/ui setup conflicts** | Low | Medium | Use official docs, install one component at a time, commit frequently |
| **Data loss in D1** | High | Low | Regular backups via `wrangler d1 export`, test restore process |

---

## Resource Allocation

| Role | Hours/Week | Focus Areas |
|------|------------|-------------|
| Full-Stack Developer | 20-25h | All phases: setup, frontend, backend, deployment |

**Total Effort**: ~82 hours over 4 weeks (~20 hours/week)

---

## Weekly Schedule

| Week | Focus | Key Deliverables | Checkpoints |
|------|-------|------------------|-------------|
| **Week 1** | Foundation | Project structure, D1, Worker, shadcn/ui | Day 3: Database ready; Day 5: First deployment |
| **Week 2** | Submission Flow | Form, API, security layers | Day 3: Form complete; Day 5: End-to-end working |
| **Week 3** | Admin Dashboard | Moderation UI, approval flow | Day 3: API endpoints ready; Day 5: Dashboard functional |
| **Week 4** | Launch | Polish, docs, production | Day 3: All features done; Day 5: Live launch |

---

## Daily Standup Questions

Track progress by asking yourself:
1. What did I complete yesterday?
2. What am I working on today?
3. Are there any blockers?

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Submit confession | < 3 seconds | Network + DB write time |
| Load admin dashboard | < 2 seconds | API response + render |
| Rate limit effectiveness | 100% | Test 4th submission blocked |
| CAPTCHA pass rate | > 95% | Turnstile analytics |
| Mobile usability | Score > 90 | Lighthouse mobile audit |
| Zero critical bugs | 0 | Manual testing checklist |

---

## Immediate Next Steps

1. **Stop current server** (if running)
2. **Backup current state**: `git add . && git commit -m "backup: initial template"`
3. **Begin Task 1.1**: Restructure project folders
4. **Install Wrangler CLI**: `npm install -g wrangler`

---

## Phase 2 Preview (Threads Automation)

After MVP launch, consider:

| Feature | Effort | Value |
|---------|--------|-------|
| Auto-post to Threads API | 8h | High (saves admin time) |
| Scheduled Worker (cron) | 4h | Medium (post at optimal times) |
| Email notifications for admins | 4h | Low (new submissions) |
| Analytics dashboard | 8h | Medium (view counts, popular categories) |
| Multi-admin support | 6h | Low (proper auth system) |

---

## Appendix: System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLOUDFLARE ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────┐        ┌─────────────────────┐                 │
│  │   CLOUDFLARE PAGES  │ ──────▶│  CLOUDFLARE WORKERS │                 │
│  │  (React + Vite App) │  API   │    (Backend API)    │                 │
│  │                     │        │                     │                 │
│  │  • Home Page        │        │  • POST /confession │                 │
│  │  • Admin Dashboard  │        │  • GET /pending     │                 │
│  │  • Submission Form  │        │  • POST /approve    │                 │
│  │                     │        │  • POST /reject     │                 │
│  └─────────────────────┘        └──────────┬──────────┘                 │
│           │                                │                            │
│           │    ┌───────────────────────────┘                            │
│           │    │                                                        │
│           │    ▼                                                        │
│           │  ┌─────────────────────┐        ┌─────────────────────┐     │
│           └──│ CLOUDFLARE TURNSTILE│        │   CLOUDFLARE D1     │     │
│              │   (CAPTCHA verify)  │        │    (SQLite DB)      │     │
│              └─────────────────────┘        │                     │     │
│                                             │  • confessions table│     │
│                                             │  • indexes          │     │
│                                             └─────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │   THREADS (META)    │
                           │  (Manual Posting)   │
                           │   Phase 1 MVP       │
                           └─────────────────────┘
```

---

## Appendix: Database Schema

```sql
-- ============================================
-- CONFESSIONS TABLE
-- ============================================

CREATE TABLE confessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    ip_hash TEXT,                        -- Hashed IP for rate limiting (privacy-safe)
    turnstile_token TEXT,                -- CAPTCHA verification token
    rejection_reason TEXT,               -- Optional reason for rejection
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_at DATETIME,                  -- When posted to Threads (null if not posted)
    posted_by TEXT                       -- Admin who approved/posted
);

-- ============================================
-- INDEXES
-- ============================================

-- Query pending confessions (admin dashboard)
CREATE INDEX idx_confessions_status_created 
ON confessions(status, created_at);

-- Query by category
CREATE INDEX idx_confessions_category 
ON confessions(category);

-- Rate limiting lookups
CREATE INDEX idx_confessions_ip_hash_created 
ON confessions(ip_hash, created_at);

-- Posted tracking
CREATE INDEX idx_confessions_posted_at 
ON confessions(posted_at) 
WHERE posted_at IS NOT NULL;

-- ============================================
-- MODERATION AUDIT LOG (optional but recommended)
-- ============================================

CREATE TABLE moderation_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    confession_id INTEGER NOT NULL,
    action TEXT NOT NULL,                -- 'approved', 'rejected', 'posted'
    admin_id TEXT,                       -- Future: when adding auth
    admin_ip TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (confession_id) REFERENCES confessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_moderation_confession 
ON moderation_log(confession_id, created_at);
```

---

*Last Updated: 2026-03-05*
*Status: Phase 2 Complete - Core Submission Flow implemented*

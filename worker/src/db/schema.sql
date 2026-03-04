-- ============================================
-- CONFESSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS confessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    ip_hash TEXT,                        -- Hashed IP for rate limiting (privacy-safe)
    turnstile_token TEXT,                -- CAPTCHA verification token (stored for audit)
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
CREATE INDEX IF NOT EXISTS idx_confessions_status_created 
ON confessions(status, created_at);

-- Query by category
CREATE INDEX IF NOT EXISTS idx_confessions_category 
ON confessions(category);

-- Rate limiting lookups
CREATE INDEX IF NOT EXISTS idx_confessions_ip_hash_created 
ON confessions(ip_hash, created_at);

-- Posted tracking
CREATE INDEX IF NOT EXISTS idx_confessions_posted_at 
ON confessions(posted_at) 
WHERE posted_at IS NOT NULL;

-- ============================================
-- MODERATION AUDIT LOG
-- ============================================

CREATE TABLE IF NOT EXISTS moderation_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    confession_id INTEGER NOT NULL,
    action TEXT NOT NULL,                -- 'approved', 'rejected', 'posted'
    admin_id TEXT,                       -- Future: when adding auth
    admin_ip TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (confession_id) REFERENCES confessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_moderation_confession 
ON moderation_log(confession_id, created_at);

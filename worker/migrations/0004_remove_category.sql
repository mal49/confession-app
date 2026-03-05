-- ============================================
-- REMOVE CATEGORY COLUMN
-- ============================================

-- Create new table without category
CREATE TABLE confessions_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    ip_hash TEXT,
    turnstile_token TEXT,
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_at DATETIME,
    posted_by TEXT
);

-- Copy data from old table (without category)
INSERT INTO confessions_new (
    id, content, status, ip_hash, turnstile_token, 
    rejection_reason, created_at, updated_at, posted_at, posted_by
)
SELECT 
    id, content, status, ip_hash, turnstile_token,
    rejection_reason, created_at, updated_at, posted_at, posted_by
FROM confessions;

-- Drop old table
DROP TABLE confessions;

-- Rename new table
ALTER TABLE confessions_new RENAME TO confessions;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_confessions_status_created 
ON confessions(status, created_at);

CREATE INDEX IF NOT EXISTS idx_confessions_ip_hash_created 
ON confessions(ip_hash, created_at);

CREATE INDEX IF NOT EXISTS idx_confessions_posted_at 
ON confessions(posted_at) 
WHERE posted_at IS NOT NULL;

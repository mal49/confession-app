-- Fresh schema for new D1 database

-- Confessions table (no category column)
CREATE TABLE IF NOT EXISTS confessions (
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_confessions_status_created 
ON confessions(status, created_at);

CREATE INDEX IF NOT EXISTS idx_confessions_ip_hash_created 
ON confessions(ip_hash, created_at);

CREATE INDEX IF NOT EXISTS idx_confessions_posted_at 
ON confessions(posted_at) WHERE posted_at IS NOT NULL;

-- Moderation log table
CREATE TABLE IF NOT EXISTS moderation_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    confession_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    admin_id TEXT,
    admin_ip TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (confession_id) REFERENCES confessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_moderation_confession 
ON moderation_log(confession_id, created_at);

-- Stats table
CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    posted_count INTEGER NOT NULL DEFAULT 0,
    rejected_count INTEGER NOT NULL DEFAULT 0,
    total_submitted INTEGER NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Initialize stats row
INSERT OR IGNORE INTO stats (id, posted_count, rejected_count, total_submitted) 
VALUES (1, 0, 0, 0);

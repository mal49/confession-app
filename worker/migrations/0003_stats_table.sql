-- ============================================
-- STATS TABLE (for tracking counts after deletion)
-- ============================================

CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),  -- Only one row, id always 1
    posted_count INTEGER NOT NULL DEFAULT 0,
    rejected_count INTEGER NOT NULL DEFAULT 0,
    total_submitted INTEGER NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Initialize stats row
INSERT OR IGNORE INTO stats (id, posted_count, rejected_count, total_submitted) 
VALUES (1, 0, 0, 0);

-- ============================================
-- MIGRATE EXISTING DATA (if any)
-- ============================================

-- Count existing posted confessions and update stats
UPDATE stats 
SET posted_count = (
    SELECT COUNT(*) FROM confessions WHERE status = 'posted'
),
rejected_count = (
    SELECT COUNT(*) FROM confessions WHERE status = 'rejected'
),
total_submitted = (
    SELECT COUNT(*) FROM confessions
)
WHERE id = 1;

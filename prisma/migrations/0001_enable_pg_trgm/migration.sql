-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create indexes for text search on normalized fields
CREATE INDEX IF NOT EXISTS idx_entries_normalized_trgm ON entries USING gin (normalized gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_variants_normalized_trgm ON variants USING gin (normalized gin_trgm_ops);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_entries_headword_fts ON entries USING gin (to_tsvector('english', headword));
CREATE INDEX IF NOT EXISTS idx_definitions_definition_fts ON definitions USING gin (to_tsvector('english', definition));

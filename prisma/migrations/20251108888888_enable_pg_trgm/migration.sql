-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Indexes for faster similarity search
CREATE INDEX IF NOT EXISTS idx_food_items_name_trgm
  ON food_items USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_food_items_description_trgm
  ON food_items USING GIN (description gin_trgm_ops);

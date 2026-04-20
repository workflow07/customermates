-- Rename the legacy chip-color vocabulary to match shadcn's badge variants.
--   old `default`  -> `secondary`  (both rendered grey; collapse to one name)
--   old `primary`  -> `default`    (primary-colored filled chip)
--   old `danger`   -> `destructive`
--   `secondary` / `success` / `warning` stay as-is.
--
-- Colors live inside `CustomColumn.options` JSONB. Audit logs snapshot those
-- JSON payloads inside `AuditLog.eventData` — remap both so historical views
-- keep rendering.
--
-- The order below is critical: migrating `default -> secondary` must run BEFORE
-- `primary -> default`, otherwise the freshly-renamed `primary` values would
-- be overwritten to `secondary`.

UPDATE "CustomColumn"
SET options = regexp_replace(
  regexp_replace(
    regexp_replace(
      options::text,
      '"color"\s*:\s*"default"', '"color": "secondary"', 'g'
    ),
    '"color"\s*:\s*"primary"', '"color": "default"', 'g'
  ),
  '"color"\s*:\s*"danger"', '"color": "destructive"', 'g'
)::jsonb
WHERE options IS NOT NULL;

UPDATE "AuditLog"
SET "eventData" = regexp_replace(
  regexp_replace(
    regexp_replace(
      "eventData"::text,
      '"color"\s*:\s*"default"', '"color": "secondary"', 'g'
    ),
    '"color"\s*:\s*"primary"', '"color": "default"', 'g'
  ),
  '"color"\s*:\s*"danger"', '"color": "destructive"', 'g'
)::jsonb
WHERE "eventData" IS NOT NULL;

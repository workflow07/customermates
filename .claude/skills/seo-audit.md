# SEO Audit Skill

Weekly rank tracking for all checked Customermates keywords. Checks current Google positions per locale, applies action flags, and updates the knowledge base.

## Usage

```
/seo-audit [--locale en|de|all] [--days 28]
```

- `--locale en|de|all` — which locale to audit (default: `all`)
- `--days N` — look back N days for ranking history (default: 28)

## Instructions

### Step 0: Load knowledge base

Read `.claude/seo/seo-keywords-overview.json`.

Filter keywords to audit:
- `status` is `"checked"`, `"ranking"`, or `"winning"`
- Matches the `--locale` flag

If no keywords match, tell the user: "No keywords ready for audit. Run `/seo-check` first to check content quality."

Group keywords by locale:
- `locale: "en"` → check on google.com (`us` database)
- `locale: "de"` → check on google.de (`de` database)

### Step 1: Rank tracking

For each keyword group, use the DataForSEO MCP SERP tracking tools to check current rankings.

Query parameters:
- Keyword: the keyword string
- Target domain: `customermates.com`
- Database: `us` for EN, `de` for DE
- Date range: last `--days` days

Record for each keyword:
- Current position (or `null` if not in top 100)
- Position change vs last check (if `lastPositionCheck` exists in knowledge base)
- Estimated impressions (if available)
- CTR (if available)

### Step 2: Apply action flags

For each keyword, apply the appropriate flag based on current data:

| Condition | Flag | Recommended Action |
|---|---|---|
| Position 1–3 | Winning | Expand cluster — write related keywords |
| Position 4–10, CTR < 2% | Low CTR despite ranking | Rewrite meta title + description to improve CTR |
| Position 11–20 | Near page 1 | Deepen content, add internal links from high-traffic pages |
| Position 21–50 | Building | Monitor — may need more backlinks or content depth |
| Position > 50 | Not ranking | Check: is page indexed? Is keyword match correct? |
| Position > 50, impressions < 10 | Not indexed / wrong keyword | Verify indexing, reconsider keyword |
| Position improving (+5 or more) | Momentum | Continue current strategy |
| Position declining (–5 or more) | Losing ground | Check for competitor updates, freshen content |

### Step 3: Output report

Produce a structured report with DE section first (highest priority):

```
# SEO Audit Report — {YYYY-MM-DD}

## DE Keywords (google.de)

| Keyword                        | Position | Change | Impressions | CTR  | Flag                    |
|---|---|---|---|---|---|
| DSGVO konformes CRM            | 14       | +3     | 420         | 3.2% | Near page 1 — deepen content |
| Open-Source-CRM für Teams      | 8        | +1     | 890         | 1.4% | Low CTR — fix meta title     |
| Pipedrive Alternative          | 47       | -2     | 32          | 0.8% | Building — monitor           |

## EN Keywords (google.com)

| Keyword                        | Position | Change | Impressions | CTR  | Flag                    |
|---|---|---|---|---|---|
| open source crm for small teams| 22       | +6     | 1,240       | 2.1% | Near page 1 — deepen content |
| pipedrive alternative free     | 67       | 0      | 18          | 0.5% | Not ranking — check indexing |

## Summary

- Keywords tracked: {N}
- Ranking (top 50): {N}
- Winning (top 10): {N}
- Near page 1 (11–20): {N}
- Not ranking: {N}

## Priority Actions

1. {highest-priority action based on flags}
2. {second-priority action}
3. {third-priority action}
```

### Step 4: Update knowledge base

For each keyword, update `.claude/seo/seo-keywords-overview.json`:

```json
{
  "currentPosition": 14,
  "lastPositionCheck": "YYYY-MM-DD",
  "status": "ranking"
}
```

Status update rules:
- Position 1–10 → `"winning"`
- Position 11–50 → `"ranking"`
- Position > 50 or null → keep existing status (don't downgrade from `"ranking"` to `"checked"` on one bad result)
- If previously `"winning"` and now position > 10 → `"ranking"` (downgrade is intentional here)

### Step 5: Sync CSV

Run: `npx tsx .claude/seo/export-csv.ts`

Confirm: "Knowledge base updated and CSV synced. Audit complete."

## Key rules

- Always audit DE first — lower competition means faster movement, higher ROI.
- One bad ranking week is not a trend. Only change strategy after 2+ consecutive weeks of decline.
- "Near page 1" (positions 11–20) is the highest-leverage opportunity — a small content update can double traffic.
- Never delete keywords from the knowledge base — set `notes` field to explain status instead.

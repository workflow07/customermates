# SEO Research Skill

Run a full competitive SEO analysis for Customermates. Identifies keyword gaps, maps existing pages, and discovers rankable keyword opportunities for both EN and DE locales.

## Usage

```
/seo-research [--locale en|de|all]
```

- `--locale en` — EN only (google.com / `us` database)
- `--locale de` — DE only (google.de / `de` database)
- `--locale all` (default) — run both locales independently

## Instructions

You are running the Customermates SEO research pipeline. Follow each step in order.

### Step 0: Load knowledge base and competitors

Read `.claude/seo/seo-keywords-overview.json`. Extract:
- `competitors[]` — list of competitor domains + categories
- `keywords[]` — existing tracked keywords (to avoid duplicates)

If `competitors` is empty, stop and tell the user: "No competitors found in `.claude/seo/seo-keywords-overview.json`. Add competitor domains to the `competitors` array first."

Determine which locales to run based on the `--locale` flag (default: `all`).

Locale → DataForSEO database mapping:
- `en` → `us` (google.com)
- `de` → `de` (google.de)

### Step 1: Competitive gap analysis

For each competitor domain, use the DataForSEO MCP to get their top organic keywords. For each locale being analyzed:

1. Call `domain_rank_overview` (or equivalent keyword gap tool) for each competitor domain in the target locale's database.
2. Collect keywords where Customermates is NOT already ranking (not in existing `keywords[]`).
3. Group discovered keywords into thematic clusters, for example:
   - "open source CRM" / "Open-Source-CRM"
   - "Pipedrive alternative" / "Pipedrive Alternative"
   - "CRM for small teams" / "CRM für kleine Teams"
   - "DSGVO CRM" / "GDPR CRM"
   - "n8n CRM integration"
   - "sales pipeline tool"
4. For each cluster, note: what content types rank (comparison pages, tutorials, landing pages), what angles competitors are using, and what angles are MISSING that Customermates could own (GDPR/DSGVO, n8n integration, open-source, affordable pricing).

### Step 2: Page mapping

Read all MDX files in these directories (frontmatter only — title, description, tags):
- `content/blog-posts/en/` and `content/blog-posts/de/`
- `content/compare/`
- `content/features/`

For each page, try to match it to the best keyword from Step 1 or from the existing knowledge base. Output a table:

```
Page                                    | Matched Keyword              | Status
content/blog-posts/en/calendly-crm.mdx | calendly crm integration     | mapped
content/compare/pipedrive.mdx           | pipedrive alternative        | mapped
content/blog-posts/en/some-page.mdx     | (none)                       | ORPHANED
```

Flag:
- **Orphaned pages** — pages with no matching keyword (lost traffic opportunity)
- **Content gaps** — high-priority keywords from Step 1 with no existing page

### Step 3: Keyword deep-dive

For each locale and the keyword clusters identified in Step 1, use the DataForSEO MCP keyword research tools to find rankable keywords:

1. Use `keyword_research` and `related_keywords` for the cluster seed terms.
2. Filter results:
   - Keyword Difficulty (KD) < 35
   - Monthly search volume ≥ 100 and ≤ 50,000
3. Classify priority:
   - **HIGH**: KD < 20 + volume 200–5,000 + commercial/transactional intent
   - **MEDIUM**: KD 20–35
   - **LOW**: everything else that passes the filter
4. Check search intent: commercial or transactional > informational. Prioritize keywords that drive signups.
5. Verify business relevance: keyword must map to a real Customermates feature (pipeline, deals, contacts, automations, DSGVO, open-source, n8n).
6. Check competitor weakness: if all top 3 results are DA 70+, flag as hard.

Present results as ranked tables per locale:

```
[EN — google.com]
Keyword                              | Vol   | KD | CPC   | Intent      | Priority | Notes
open source crm for small teams      | 1,300 | 18 | $4.20 | commercial  | HIGH     |
pipedrive alternative free           |   880 | 22 | $6.10 | commercial  | HIGH     |
crm with n8n integration             |   210 | 12 | $3.80 | commercial  | HIGH     |
best crm for startups                | 4,400 | 31 | $5.50 | commercial  | MEDIUM   |

[DE — google.de]
Keyword                              | Vol  | KD | CPC   | Intent      | Priority | Notes
DSGVO konformes CRM                  |  320 | 11 | €3.20 | commercial  | HIGH     |
Open-Source-CRM für kleine Unternehmen|  180 | 14 | €2.90 | commercial  | HIGH     |
Pipedrive Alternative kostenlos      |  390 | 19 | €4.80 | commercial  | HIGH     |
CRM für Startups                     | 1100 | 28 | €4.10 | commercial  | MEDIUM   |
```

### Step 4: Backlink targets (optional)

Skip this step unless the user explicitly asks for backlink analysis. Note that DataForSEO backlinks API costs $100/month minimum.

If requested:
1. Use `backlinks_domain_intersection` to find domains linking to 2+ competitors but NOT customermates.com.
2. Filter for domainRank ≥ 40.
3. Store results in `backlinkTargets[]` in the knowledge base.

### Step 5: Output and knowledge base update

1. Present the full findings summary to the user:
   - Cluster analysis with content angles
   - Page mapping table
   - Keyword tables (HIGH priority first)

2. Ask: "Which keywords should I add to the knowledge base? Reply with 'all HIGH', 'all', or list specific keywords."

3. After user confirms, add approved keywords to `.claude/seo/seo-keywords-overview.json` under `keywords[]` with:
   ```json
   {
     "keyword": "...",
     "locale": "en|de",
     "volume": 0,
     "difficulty": 0,
     "cpc": 0.0,
     "intent": "commercial|informational|transactional",
     "priority": "high|medium|low",
     "status": "researched",
     "targetPage": null,
     "currentPosition": null,
     "lastPositionCheck": null,
     "contentFile": null,
     "onPageScore": null,
     "addedDate": "YYYY-MM-DD",
     "notes": ""
   }
   ```

4. Write a strategy summary to `.claude/seo/strategy-{YYYY-MM-DD}.md` with:
   - Top clusters and why they're opportunities
   - Recommended content creation order (HIGH priority DE first, then EN)
   - Orphaned pages that need keyword mapping
   - Content gaps (keywords with no page)

5. Run the CSV export: `npx tsx .claude/seo/export-csv.ts`

## Key rules

- **DE is highest priority.** Lower competition, DSGVO differentiator resonates with German SMBs. Always address DE first when locale is `all`.
- Never add a keyword that already exists in the knowledge base (check `keyword` + `locale` combo).
- Do not hardcode any competitor domains — always read from `seo-keywords-overview.json`.
- Commercial intent keywords drive signups; prefer them over informational.

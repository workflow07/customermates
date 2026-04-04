# SEO Optimize Skill

Optimize one content page at a time for maximum search ranking potential. Analyzes competitors, identifies gaps, rewrites content following 14 SEO principles, and presents a before/after summary for manual review.

## Usage

```
/seo-optimize [keyword|slug|--next]
```

- `keyword` or `slug` — optimize the page targeting this specific keyword
- `--next` — pick the next highest-scored unoptimized page from the knowledge base

## Instructions

You are optimizing an existing Customermates MDX content page for SEO. Follow each step in order. Do NOT skip steps.

### Step 0: Select the page to optimize

1. Read `.claude/seo/seo-keywords-overview.json`.
2. If `--next`: find the primary keyword (`isPrimaryForPage === true`) with the highest `optimizationScore` where `status === "content-created"`. If no unoptimized pages remain, tell the user.
3. If a keyword/slug is provided: find the matching entry. If multiple locales exist, pick the one with the higher score.
4. Identify ALL keywords in the cluster (same `targetPage`) — these must all be woven into the content.
5. Determine the content type from the file path:
   - `content/blog-posts/` → blog post
   - `content/compare/` → compare page
   - `content/for-pages/` → industry/use-case page
   - `content/feature-pages/` → feature page
6. Show the user a summary and ask for confirmation:

```
Page: /de/blog/free-crm
Primary keyword: crm system kostenlos (590/mo, KD 13)
Cluster keywords: crm kostenlos (390), kostenloses crm (390), crm system freeware (390), ...
Combined volume: 3,030/mo
Optimization rank: #1 of 151
Content type: blog post
File: content/blog-posts/de/free-crm.mdx

Proceed with optimization?
```

### Step 1: Audit current content

Read the existing MDX file and catalog:

- **Frontmatter**: title, description, hero title/description (check character counts)
- **Headings**: H1, all H2s, all H3s (check hierarchy — no orphan H3s)
- **Word count**: approximate
- **Keyword presence**: Is the primary keyword in title? H1? Description? First paragraph? H2s?
- **Internal links**: count and list targets
- **External links**: count and list targets
- **CTA**: present? Links to `/auth/signup`?
- **Images**: hero image exists? Inline images? Alt text present?

Output a "Current State" summary table.

### Step 2: SERP competitor analysis

Use DataForSEO to analyze who currently ranks for this keyword:

1. Call `mcp__dataforseo__serp_organic_live_advanced`:
   - EN keywords: `location_name: "United States"`, `language_code: "en"`
   - DE keywords: `location_name: "Germany"`, `language_code: "de"`
   - `depth: 10`
2. From the results, extract positions 1-5 organic results. Skip: Reddit, Quora, YouTube, Wikipedia, answer boxes.
3. **MANDATORY**: For each competitor URL (top 3 minimum), use `WebFetch` to retrieve the full page content. Extract:
   - Title tag and meta description
   - H1, H2, H3 heading structure
   - Approximate word count
   - Key semantic terms / NLP entities
   - Internal linking patterns
   - CTA approach
   - Image usage (count, types, alt text)
4. Call `mcp__dataforseo__dataforseo_labs_google_keyword_overview` with the primary + all cluster keywords to get:
   - Related keyword suggestions for natural variations
   - SERP feature types (featured snippets, PAA, AI overview)

Aggregate into a **Competitor Brief**:
- Average word count across top 5
- Common H2 topics (in 3+ of 5 = "table stakes")
- Key NLP terms (appear in 3+ pages)
- SERP features present (featured snippet format, PAA questions)
- Missing angles Customermates can own: DSGVO/GDPR, n8n automation, open source, self-hosting, EUR 10/user pricing

### Step 3: Gap analysis

Compare current page vs competitors. Output a clear gap table:

| Gap type | Current page | Competitors (avg) | Action needed |
|----------|-------------|-------------------|---------------|
| Word count | 800 | 2,200 | Expand to ~2,000 |
| H2 sections | 4 | 7 | Add 3 sections |
| Primary keyword in title | No | 5/5 | Add to title |
| Internal links | 1 | 4 | Add 3 more |
| External links | 0 | 2 | Add 1-2 |
| FAQ section | No | 3/5 have FAQ | Add FAQ |
| Entity: "pipeline" | Not defined | Defined in 4/5 | Define it |

### Step 4: Rewrite the page

Rewrite the entire MDX file applying all 14 SEO principles. Follow this checklist:

**1. Keywords and intent**
- Primary keyword in: title (~60 chars), meta description (150-160 chars), H1, first paragraph, 2+ H2 headings
- All cluster keywords appear naturally at least once
- Use related keyword variations from DataForSEO — never repeat the exact same phrase in consecutive sentences

**2. Title and headings**
- Title: primary keyword first, ~60 characters, compelling
- H1: can differ from title, but must contain primary keyword
- H2s: logical sections covering all "table stakes" topics + unique angles
- H3s: only under parent H2s, for sub-topics
- Headings match real search queries (use PAA questions as H2s where relevant)

**3. Meta description**
- 150-160 characters
- Includes primary keyword
- Specific benefit or outcome (not generic)
- Ends with a reason to click

**4. Content quality**
- Word count: match or exceed competitor average (±10%)
- Every section adds value — no filler paragraphs
- Define terms on first use
- Explain cause and effect, not just state facts
- Add unique Customermates angles: DSGVO/GDPR compliance, n8n automation, open source, self-hostable, EUR 10/user/month

**5. Answer intent early**
- First 1-3 sentences under every H2 directly answer the question that heading implies
- No preamble, no "In this section we will discuss..."
- Answer first, explain second, expand third

**6. Readability**
- Paragraphs: 2-4 sentences maximum
- Use bullet points for lists of 3+ items
- Use numbered lists for sequential steps
- Direct language, no filler ("It's worth noting that...", "In today's fast-paced...")
- Active voice preferred

**7. Keyword variations**
- Primary keyword: 3-5 natural occurrences
- Each cluster keyword: at least once
- Related terms from DataForSEO: sprinkled throughout
- Never stuff — if it reads unnaturally, rephrase

**8. Entity coverage**
- Define every key concept on first mention
- Explain relationships between entities
- Cover all topics from the gap analysis

**9. Authority signals**
- Cite specific data with sources (year + source name)
- Link to official sources for claims (GDPR regulation, competitor pricing pages)
- Author: Benjamin Wagner
- First-hand product knowledge — describe actual Customermates features accurately

**10. Internal and external links**

Build a link map by reading existing content files to find the most relevant internal targets.

Internal links (3-5 per page):
- At least 1 to a feature page (`/features/{slug}`)
- At least 1 to a compare page (`/compare/{slug}`) — pick the most relevant competitor
- At least 1 to `/pricing`
- Cross-link to related blog posts or for-pages where natural
- Use descriptive anchor text: "contact management features" not "click here"

External links (1-2 per page):
- Industry data: Gartner, Forrester, Statista for market stats
- Regulatory: official GDPR/DSGVO pages for compliance claims
- Competitor docs: official pricing pages when comparing costs (shows fairness)
- Technical: n8n.io docs when describing automation

**11. Rich media: images, screenshots, YouTube, status icons**

Hero images: Check `public/images/light/{locale}/{slug}.png`. If missing, generate with `npx tsx .claude/seo/generate-hero-image.ts --text "Title – <purple>accent</purple>" --out "public/images/light/{locale}/{slug}.png"`. The script auto-generates a Flux illustration (saved to `public/images/base/`), applies the hero mask from `public/images/base/hero-mask.png`, and copies to dark/. Reuse existing base images with `--bg "public/images/base/{slug}.png"` to skip Flux.

Competitor screenshots: Place manually in `public/images/light/competitors/` (and copy to dark/). Reference with `<MarkdownImage alt="Screenshot: [Competitor] ([domain], [date])" src="competitors/[name].png" />`.

YouTube embeds: Use `<YouTube id="VIDEO_ID" title="description" />` in MDX. Place after first H2 for engagement.

Status icons in tables: Use `<StatusAvailable />` `<StatusPartial />` `<StatusUnavailable />` with HTML table syntax (not markdown). See `content/docs/de/comparison.mdx` for reference.

Open source mentions: Cite n8n, Cal.com, Plausible, Hetzner, SuiteCRM, Twenty where relevant. Link to official sites for authority.

Alt text: descriptive, under 125 chars, keyword where natural.

**12. Mobile optimization**
- Short paragraphs (already enforced)
- No wide markdown tables (use responsive formats)
- Bullet points over dense prose

**13. Evergreen content**
- Remove time-specific language unless genuinely needed (pricing comparisons can keep the year)
- Answer recurring questions, not trends
- Use "currently" instead of specific months/quarters

**14. Quality verification**
- Verify ALL feature claims against `content/features/` and `content/pricing/`
- Current pricing: check `content/pricing/en/pricing.mdx` for actual numbers
- Check all internal links point to pages that exist
- Remove broken or outdated references

**Content-type-specific rules:**

For **blog posts**: Update `blogPost.date` to today's date. Keep same slug and tags (update tags if content changed significantly).

For **compare pages**: Verify the comparison table in frontmatter matches current competitor pricing/features. The MDX body below is the content to optimize.

For **for-pages**: Hero + CTA + body. Body must address industry-specific pain points from SERP analysis.

For **feature pages**: Hero + CTA + body. Body must accurately describe the Customermates feature.

**Locale rules:**
- DE: Native German, not translated. Use DSGVO (not GDPR). Check existing page for du/Sie convention and match it. Use German CRM terms (Kontakte, Unternehmen, Aufgaben, Angebote).
- EN: American English. Lead with product benefits. Use GDPR where relevant.

### Step 4b: Post-rewrite validation (MANDATORY — do not skip)

Run these checks on the rewritten content before presenting to the user:

**Keyword density check:**
- Count occurrences of the primary keyword. Must appear 3-5 times naturally.
- Each cluster keyword must appear at least once.
- If any keyword is missing or over-stuffed, fix before proceeding.

**Internal link audit:**
- Verify every internal link target actually exists as a content file.
- Check bidirectional linking: if page A links to page B, page B should link back to A where natural. Note any missing backlinks to fix in those pages later.
- Minimum 3 internal links for short pages, 5+ for pillar pages.

**Meta description check:**
- Must be 150-160 characters. Count precisely.
- Must contain the primary keyword.
- Must end with a benefit or action that compels a click.

**Image alt text optimization:**
- Hero image: alt text should include the primary keyword naturally.
- Competitor screenshots (`<MarkdownImage>`): alt text should describe the screenshot AND include a relevant keyword.
- Example: `alt="HubSpot CRM Pipeline-Ansicht – kostenloses CRM im Vergleich"` instead of `alt="Screenshot: HubSpot"`

**Content freshness:**
- Update `blogPost.date` to today's date.
- If the page references specific years or dates, ensure they are current.

**YouTube embeds:**
- Only embed videos with 10,000+ views. Verify via `mcp__dataforseo__serp_youtube_video_info_live_advanced` before embedding.
- Must be genuinely relevant to the page topic.

### Step 5: Present before/after for user review

Output a structured summary:

```
## Optimization Summary: [keyword] ([locale])

### Metadata
| Field | Before | After |
|-------|--------|-------|
| Title (chars) | [old] ([count]) | [new] ([count]) |
| Description (chars) | [old] ([count]) | [new] ([count]) |
| H1 | [old] | [new] |

### Structure
- Word count: [old] -> [new]
- H2 sections: [old count] -> [new count]
- H2s added: [list]
- H2s removed: [list]
- Internal links: [old] -> [new] ([targets])
- External links: [old] -> [new] ([targets])

### Keyword Coverage
- Primary keyword in title: [yes/no]
- Primary keyword in H1: [yes/no]
- Primary keyword in description: [yes/no]
- Primary keyword in first paragraph: [yes/no]
- Cluster keywords covered: [x/y] — [list with checkmarks]

### Gaps Addressed
- [gap]: Addressed in [H2 section]
- [gap]: Addressed in [H2 section]

### Image Status
- Hero image: [exists / MISSING — suggest: pipeline screenshot]

### SEO Checklist
- [ ] or [x] for each of the 14 principles
```

Ask the user: **"Should I write this to the file? Reply 'yes' to apply, or describe what to change."**

Do NOT write the file until the user approves.

### Step 6: Write and update KB

Only after user approval:

1. Write the optimized MDX to the content file (overwrite existing).
2. Update the knowledge base:
   - Set `status: "optimized"` for ALL keywords with the same `targetPage`
   - Set `optimizedDate` to today's date (YYYY-MM-DD)
3. Run `npx tsx .claude/seo/export-csv.ts` to sync CSV.

### Step 7 (Optional): Full on-page quality check via tunnel

If the user wants a live quality check (recommended after each optimization):

1. Ask the user to start the tunnel: `bash .claude/seo/tunnel.sh`
2. Once the tunnel URL is available, construct the full page URL: `{TUNNEL_URL}/{locale}/blog/{slug}` (adjust path for compare/for/features pages).
3. Run all 3 DataForSEO checks in sequence:

**Check A — SEO audit** (`mcp__dataforseo__on_page_instant_pages`):
- Pass the full page URL
- Returns: on-page score, title/description analysis, H1-H6 structure, word count, keyword density, internal/external link counts, OG tags, schema markup
- Flag any score below 70

**Check B — Lighthouse** (`mcp__dataforseo__on_page_lighthouse`):
- Pass the full page URL with `enable_javascript: true`
- Returns: Performance, Accessibility, Best Practices, SEO scores (0-100 each)
- Flag any SEO score below 90 or Performance below 50

**Check C — Content structure** (`mcp__dataforseo__on_page_content_parsing`):
- Pass the full page URL
- Returns: structured headings, all links with anchor text, text blocks
- Verify: heading hierarchy matches the MDX, all internal links resolve, anchor text is descriptive

4. Present a combined report:

```
## On-Page Quality Report: [url]

| Check | Score | Status |
|-------|-------|--------|
| On-Page SEO | 82/100 | ✓ Pass |
| Lighthouse SEO | 95/100 | ✓ Pass |
| Lighthouse Performance | 67/100 | ⚠ Check images |
| Lighthouse Accessibility | 91/100 | ✓ Pass |

### Issues Found
- [issue 1]: [recommendation]
- [issue 2]: [recommendation]

### Content Structure Verified
- H1: [text] ✓
- H2s: [count] ✓
- Internal links: [count] ([targets]) ✓
- External links: [count] ✓
```

5. Update knowledge base: `onPageScore`, `status → "checked"` if on-page score ≥ 70.
6. If issues found, suggest specific fixes and offer to apply them.

### Step 8: Next page prompt

Tell the user:
- What was optimized (keyword, locale, word count, internal links added)
- Hero image status (exists or needs creation)
- The next page in the queue (keyword, locale, score, volume)
- "Run `/seo-optimize --next` to continue, or `/seo-optimize [keyword]` to pick a specific page."

## Key Rules

- DE content is written independently in native German — never translated from EN.
- Never fabricate Customermates features — only claim what is documented in `/content/features/` and `/content/pricing/`.
- Always present the before/after summary BEFORE writing any changes.
- The user must explicitly approve before the file is modified.
- Process both locales of a page in sequence: optimize the higher-scored locale first, then immediately offer to optimize the other locale of the same page.

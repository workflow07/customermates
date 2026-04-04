# SEO Content Skill

Generate locale-specific, SEO-optimized MDX blog post content for Customermates. DE and EN content is written independently — DE is never translated from EN.

## Usage

```
/seo-content [keyword|--from-kb] [--locale en|de|all]
```

- `keyword` — specific keyword to target (must exist in knowledge base with `status: "researched"`)
- `--from-kb` — pick the next highest-priority `researched` keyword from the knowledge base
- `--locale en|de|all` — which locale to generate for (default: `de` — DE is highest priority)

With `--locale all`: generates EN and DE versions independently in sequence.

## Instructions

You are generating SEO-optimized MDX blog content for Customermates. Follow each step carefully.

### Step 0: Resolve keyword and locale

1. Read `.claude/seo/seo-keywords-overview.json`.
2. If `--from-kb`: select the next keyword where `status === "researched"`, sorted by priority (high first), then DE before EN.
3. If a keyword string is provided: find it in the knowledge base. If not found, stop and tell the user to run `/seo-research` first.
4. Confirm the keyword + locale + slug (kebab-case version of keyword) with the user before proceeding.

Slug rules: lowercase, hyphens only, max 60 chars. Example: "open source crm for small teams" → `open-source-crm-for-small-teams`

### Step 1: SERP analysis

Use DataForSEO MCP to get the top 10 organic results for the keyword in the correct locale:
- EN keyword → `us` database (google.com)
- DE keyword → `de` database (google.de)

Focus on positions 1–5 for the content brief.

### Step 2: Competitor page analysis

For each of the top 5 competitor URLs (skip: Reddit, Quora, YouTube, Wikipedia, directories):
1. Fetch the page via HTTP GET (use WebFetch).
2. Extract:
   - Page title and meta description
   - H1, all H2s, all H3s
   - Approximate word count
   - Key NLP/semantic terms (industry vocabulary used frequently)
   - Internal linking patterns
   - CTA approach

Aggregate findings into a brief:
- **Average word count** across top 5 pages
- **Common H2 topics** (appear in ≥3 of 5 pages — these are table-stakes sections)
- **NLP terms** (appear frequently in ≥3 pages — include these naturally in our content)
- **Missing angles** — what do none of the top 5 pages cover that Customermates can own?
  - GDPR/DSGVO compliance angle
  - n8n automation integration
  - Open-source transparency
  - Affordable pricing vs enterprise tools
  - Self-hosted option

### Step 3: Quality gate — verify Customermates feature claims

Before writing, verify any feature claims against the actual product. Read relevant files:
- `content/features/` — feature descriptions
- `content/pricing/` — current pricing (check for current price)
- `content/compare/` — existing comparison pages (avoid contradictions)

Do NOT invent features. Only claim what is documented. If a claim is uncertain, phrase it conservatively or omit it.

### Step 4: Generate MDX content

Write the blog post following the brief from Step 2.

**Frontmatter** (must match `core/fumadocs/schemas/blog-posts.ts` exactly):

```yaml
---
title: {keyword-first title, ~60 chars}
description: {150-160 chars, includes keyword, compelling}

hero:
  title: {H1-style hero headline, can differ from title}
  description: {1-2 sentence hero subtext}
  
blogPost:
  author: Benjamin Wagner
  backToBlog: {EN: "Back to blog" | DE: "Zurück zum Blog"}
  by: {EN: "by Benjamin Wagner" | DE: "von Benjamin Wagner"}
  date: {YYYY-MM-DD — today's date}
  tags:
    - {3-5 kebab-case tags relevant to the content}
---
```

**Content rules:**
- Target word count = average from brief ±10%
- Primary keyword in: title, description, H1, first paragraph, ≥2 H2s
- H2 structure: cover all "common H2 topics" from brief, plus ≥1 unique Customermates angle
- Include NLP terms naturally throughout (don't stuff)
- Internal links (at least 3):
  - `/pricing` or `/en/pricing` / `/de/pricing`
  - `/features` or a specific `/features/{slug}`
  - A relevant `/compare/{competitor}` page if one exists
- CTA: at least one call-to-action linking to `/auth/signup`
  - EN: "Start free for 3 days"
  - DE: "Kostenlos 3 Tage testen"
- Tone: practical, direct, no fluff — match the style of `content/blog-posts/en/calendly-crm-integration.mdx`
- For DE content: write in native German, not translated English. Use DSGVO (not GDPR) naturally.

**File path:**
```
content/blog-posts/{locale}/{slug}.mdx
```

### Step 5: Knowledge base update

After writing the file, update the keyword entry in `.claude/seo/seo-keywords-overview.json`:
```json
{
  "status": "content-created",
  "contentFile": "content/blog-posts/{locale}/{slug}.mdx",
  "targetPage": "/{locale}/blog/{slug}"
}
```

### Step 6: Confirmation

Tell the user:
- File written: `content/blog-posts/{locale}/{slug}.mdx`
- Word count
- Internal links included
- Next step: run `/seo-check {slug} --locale {locale}` after starting dev server

## Key rules

- DE content uses German keywords, German SERP data, German tone. Never translate from EN.
- Never fabricate Customermates features — only claim what's documented.
- Always use today's date for `blogPost.date`.
- The slug must be consistent across EN and DE if both are generated for the same topic — use the EN slug for both (DE URLs use the same slug as EN in next-intl routing).

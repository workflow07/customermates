# SEO Check Skill

Run DataForSEO on-page analysis against live Customermates pages via a Cloudflare tunnel. Scores each page and flags SEO issues against the target keyword.

## Usage

```
/seo-check [slug|--all-unchecked] [--locale en|de|all]
```

- `slug` — specific blog post slug to check (e.g. `open-source-crm-for-small-teams`)
- `--all-unchecked` — check all knowledge base keywords with `status: "content-created"`
- `--locale en|de|all` — which locale(s) to check (default: `all`)

## Prerequisites

- `cloudflared` must be installed: `brew install cloudflared`
- The Next.js dev server will be started automatically by `tunnel.sh`

## Instructions

### Step 1: Start the Cloudflare tunnel

Run the tunnel script in the background:

```bash
bash .claude/seo/tunnel.sh
```

This script:
1. Starts `next dev -p 3000` (if not already running)
2. Starts a Cloudflare quick tunnel on port 3000
3. Outputs `TUNNEL_URL=https://xxxx.trycloudflare.com`

Wait for the script to output the tunnel URL. It may take up to 15 seconds.

If the script fails to output a URL, tell the user to:
1. Check that `cloudflared` is installed (`brew install cloudflared`)
2. Run `bash .claude/seo/tunnel.sh` manually and share the output

### Step 2: Resolve slugs to check

Read `.claude/seo/seo-keywords-overview.json`.

If `slug` is provided: find that keyword entry (matching `contentFile` or `targetPage` slug), filter by `--locale`.
If `--all-unchecked`: find all keywords with `status: "content-created"`, filtered by `--locale`.

For each entry, construct the URL:
```
{TUNNEL_URL}/{locale}/blog/{slug}
```

Example: `https://abc123.trycloudflare.com/en/blog/open-source-crm-for-small-teams`

### Step 3: Run DataForSEO on-page analysis

For each URL, use the DataForSEO MCP `on_page_instant_pages` tool (or equivalent on-page API endpoint).

Parameters to pass:
- URL: the constructed tunnel URL
- Target keyword: from the knowledge base entry

DataForSEO returns:
- **OnPage Score** (0–100)
- Title tag + meta description
- H1, H2, H3 headings
- Word count
- Keyword density / presence
- Internal links count
- OG tags (og:title, og:description, og:image)
- Page speed indicators

Cost: ~$0.000125 per page (SSR pages — no JS rendering multiplier needed).

### Step 4: Analyze results and flag issues

For each page, compare DataForSEO results against the target keyword from the knowledge base. Flag these issues:

| Issue | Condition | Fix |
|---|---|---|
| Missing keyword in title | Keyword not in `<title>` | Add keyword to title tag |
| Missing keyword in H1 | Keyword not in H1 | Update H1 to include keyword |
| Meta description too short | < 140 chars | Expand meta description |
| Meta description too long | > 165 chars | Shorten meta description |
| Low keyword density | < 0.5% | Add keyword naturally in body |
| High keyword density | > 2.5% | Reduce — risk of stuffing penalty |
| Low word count | < 600 words | Expand content |
| Missing OG tags | og:title or og:description absent | Add to page metadata |
| Low OnPage Score | < 70 | Address all flagged issues |
| No internal links | 0 internal links | Add internal links |

Output a clear report for each page:

```
Checking: /en/blog/open-source-crm-for-small-teams
Target keyword: "open source crm for small teams"
OnPage Score: 74/100
Word count: 1,847

Issues:
  ⚠ Keyword not in H1: current H1 is "The Best Free CRM for Growing Startups"
  ✓ Keyword in title: "Open Source CRM for Small Teams | Customermates"
  ✓ Meta description: 152 chars, keyword present
  ✓ Internal links: 4 found
  ✓ OG tags: present

Recommendation: Update H1 to include "open source crm for small teams"
```

### Step 5: Update knowledge base

For each checked page, update the knowledge base entry in `.claude/seo/seo-keywords-overview.json`:
```json
{
  "onPageScore": 74,
  "status": "checked"
}
```

Only set `status: "checked"` if OnPage Score ≥ 70. Otherwise keep `status: "content-created"` and note the issues.

### Step 6: Stop the tunnel

After all checks are complete, stop the tunnel:
```bash
# The tunnel.sh script exits when you kill the process
# Tell the user to press Ctrl+C in the terminal running tunnel.sh
```

Inform the user: "On-page check complete. Kill the tunnel with Ctrl+C in the tunnel terminal."

## Key rules

- DataForSEO crawls the public tunnel URL — the pages must be server-rendered (SSR). Next.js App Router with Customermates handles this automatically.
- Each page costs ~$0.000125. With 10 pages that's $0.00125 — essentially free.
- Always match the slug check to the correct locale (`/en/blog/` vs `/de/blog/`).
- If `onPageScore >= 70`, the page is ready for audit tracking. If < 70, fix issues before marking as checked.

/**
 * Hero Image Generator
 *
 * Layers (bottom to top):
 * 1. Solid #111114 background (1920x1080)
 * 2. AI-generated illustration (right 60% of canvas, 1248x1080)
 * 3. Hero mask overlay (public/images/base/hero-mask.png — handles fade, logo, frame)
 * 4. Title text at margin-top:511 margin-left:109, Inter Semibold 90px, white + purple #9487F3
 *
 * Usage:
 *   npx tsx .claude/seo/generate-hero-image.ts \
 *     --title "CRM System kostenlos" \
 *     --accent "Die besten Gratis-Lösungen" \
 *     --out public/images/light/de/free-crm.png
 *
 *   npx tsx .claude/seo/generate-hero-image.ts \
 *     --title "CRM System kostenlos" \
 *     --accent "Die besten Gratis-Lösungen" \
 *     --bg path/to/existing-image.png \
 *     --out public/images/light/de/free-crm.png
 *
 *   npx tsx .claude/seo/generate-hero-image.ts --batch
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import Replicate from "replicate";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const WIDTH = 1920;
const HEIGHT = 1080;

const BG_COLOR = { r: 17, g: 17, b: 20, alpha: 255 }; // #111114
const MASK_PATH = path.join(ROOT, "public/images/base/hero-mask.png");

interface HeroConfig {
  /** Full text with optional <purple>...</purple> markers for accent color */
  text: string;
  /** Plain title (no markers) used for Flux prompt generation */
  plainTitle: string;
  bgImage?: string;
  fluxPrompt?: string;
  outputPath: string;
}

/**
 * Generate an image using Flux Pro via Replicate API
 */
async function generateFluxImage(prompt: string): Promise<Buffer> {
  const token = process.env.REPLICATE_API_TOKEN || "";
  if (!token) {
    throw new Error("REPLICATE_API_TOKEN not set. Add it to .env or .env.local");
  }

  const replicate = new Replicate({ auth: token });

  console.log(`  Generating Flux image: "${prompt.slice(0, 80)}..."`);

  const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
    input: {
      prompt,
      width: 1248,
      height: 1080,
      prompt_upsampling: true,
    },
  });

  // Output is a URL string or ReadableStream
  const url = typeof output === "string" ? output : String(output);
  console.log(`  Downloading from Replicate...`);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download: ${response.status}`);

  return Buffer.from(await response.arrayBuffer());
}

/**
 * Create SVG text overlay.
 *
 * Input is a single sentence with optional <purple>...</purple> markers:
 *   "Outlook automatisch aus dem CRM versenden – <purple>Integration mit n8n</purple>"
 *
 * The sentence wraps naturally. Words inside <purple> tags render in #9487F3,
 * everything else in white. No forced line breaks between white and purple.
 */
function createTextOverlay(text: string): Buffer {
  const MARGIN_LEFT = 109;
  const MARGIN_TOP = 511;
  const FONT_SIZE = 90;
  const LINE_HEIGHT = 105;
  // SVG text y = baseline, not top. Ascent is ~75% of font size for Inter.
  const ASCENT = Math.round(FONT_SIZE * 0.75);
  const MAX_CHARS_PER_LINE = 22;

  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Parse text into colored word tokens
  type Token = { word: string; purple: boolean };
  const tokens: Token[] = [];
  let inPurple = false;
  // Split by <purple> and </purple> tags
  const parts = text.split(/(<purple>|<\/purple>)/);
  for (const part of parts) {
    if (part === "<purple>") { inPurple = true; continue; }
    if (part === "</purple>") { inPurple = false; continue; }
    if (!part.trim()) continue;
    for (const word of part.split(/\s+/).filter(Boolean)) {
      // Attach dashes (–, —, -) to the previous token so they don't wrap alone
      if ((word === "–" || word === "—" || word === "-") && tokens.length > 0) {
        tokens[tokens.length - 1].word += " " + word;
      } else {
        tokens.push({ word, purple: inPurple });
      }
    }
  }

  // Word-wrap into lines, preserving color per word
  type LineWord = { word: string; purple: boolean };
  const lines: LineWord[][] = [];
  let currentLine: LineWord[] = [];
  let currentLen = 0;

  for (const token of tokens) {
    const wordLen = token.word.length;
    const spaceNeeded = currentLen > 0 ? 1 : 0;

    if (currentLen + spaceNeeded + wordLen > MAX_CHARS_PER_LINE && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [token];
      currentLen = wordLen;
    } else {
      currentLine.push(token);
      currentLen += spaceNeeded + wordLen;
    }
  }
  if (currentLine.length > 0) lines.push(currentLine);

  // First baseline = margin-top + ascent (so the top of the text visually aligns with MARGIN_TOP)
  const startY = MARGIN_TOP + ASCENT;

  // Render each line as SVG <text> with <tspan> color segments
  const FONT = 'font-family="Inter, Arial, Helvetica, sans-serif" font-size="' + FONT_SIZE + '" font-weight="600" letter-spacing="-0.02em"';

  const svgLines = lines
    .map((lineWords, i) => {
      const y = startY + i * LINE_HEIGHT;

      // Group consecutive words by color to minimize tspan count
      type Segment = { text: string; purple: boolean };
      const segments: Segment[] = [];
      for (const lw of lineWords) {
        const last = segments[segments.length - 1];
        if (last && last.purple === lw.purple) {
          last.text += " " + lw.word;
        } else {
          segments.push({ text: lw.word, purple: lw.purple });
        }
      }

      const spans = segments
        .map((seg, si) => {
          const fill = seg.purple ? "#9487F3" : "white";
          const prefix = si > 0 ? "&#160;" : "";
          return `<tspan fill="${fill}">${prefix}${esc(seg.text)}</tspan>`;
        })
        .join("");

      return `<text xml:space="preserve" x="${MARGIN_LEFT}" y="${y}" ${FONT}>${spans}</text>`;
    })
    .join("\n  ");

  const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  ${svgLines}
</svg>`;

  return Buffer.from(svg);
}

/**
 * Style prefix matching the Customermates brand illustrations:
 * - 3D rendered objects with metallic chrome finish
 * - Dark background (#111114)
 * - Green (#17c964) and purple (#9487F3) neon glow accents
 * - Floating UI cards, badges, gear icons as decoration
 * - SaaS/tech aesthetic, clean composition
 */
const STYLE_SUFFIX =
  ", isometric 3D render, glossy metallic chrome objects floating in space, very dark nearly black background rgb(17 17 20) with subtle grid lines, bright neon green rgb(23 201 100) and vibrant purple rgb(148 135 243) glow trails and light effects, small floating UI elements like notification badges and chat bubbles and progress bars with green checkmarks as decoration, objects positioned on the right side with left side fading to dark background, no characters, no people, no animals, no mascots, no text, no words, no letters, no watermarks";

/**
 * Get a context-fitting Flux prompt based on the blog post title.
 * The subject changes per topic but the visual style stays consistent.
 */
function getFluxPrompt(title: string): string {
  const t = title.toLowerCase();

  // Free / kostenlos
  if (t.includes("kostenlos") || t.includes("free") || t.includes("gratis") || t.includes("freeware"))
    return "A glowing open gift box with floating purple and green software dashboard cards and sparkles emerging from it" + STYLE_SUFFIX;

  // Sales pipeline
  if (t.includes("pipeline") || t.includes("vertrieb") || t.includes("sales funnel"))
    return "A chrome sales funnel with glowing green deal cards flowing through stages, purple energy swirl around the funnel" + STYLE_SUFFIX;

  // Comparison / alternative
  if (t.includes("vergleich") || t.includes("comparison") || t.includes("alternative") || t.includes("vs"))
    return "Two floating software dashboard screens side by side with a large glowing green checkmark between them" + STYLE_SUFFIX;

  // ERP / integration
  if (t.includes("erp") || t.includes("integration"))
    return "Two chrome cubes connected by glowing data stream ribbons and rotating gears between them" + STYLE_SUFFIX;

  // Email
  if (t.includes("email") || t.includes("outlook") || t.includes("gmail") || t.includes("e-mail"))
    return "Floating chrome email envelopes in a sequence connected by glowing arrows, a CRM dashboard screen showing an inbox, chat bubble notifications" + STYLE_SUFFIX;

  // Startup
  if (t.includes("startup") || t.includes("gründer") || t.includes("start-up"))
    return "A chrome rocket launching from a laptop screen showing a CRM dashboard, trailing green and purple exhaust" + STYLE_SUFFIX;

  // DSGVO / GDPR / data protection
  if (t.includes("dsgvo") || t.includes("gdpr") || t.includes("datenschutz") || t.includes("self-hosted") || t.includes("on premise"))
    return "A large chrome shield with a glowing lock icon, floating data cards orbiting around it, EU stars subtle in background" + STYLE_SUFFIX;

  // Pricing / cost
  if (t.includes("kosten") || t.includes("pricing") || t.includes("preis") || t.includes("cost") || t.includes("affordable") || t.includes("cheapest"))
    return "Floating chrome price tags and a transparent calculator with glowing green numbers, coins scattered below" + STYLE_SUFFIX;

  // Automation / workflow / n8n
  if (t.includes("automatisierung") || t.includes("automation") || t.includes("workflow") || t.includes("n8n"))
    return "Connected chrome workflow nodes in a flow diagram with glowing green and purple arrows between them, a robot arm activating the first node" + STYLE_SUFFIX;

  // Contact / customer management
  if (t.includes("kontakt") || t.includes("contact") || t.includes("kunden") || t.includes("customer"))
    return "Floating chrome contact cards with profile avatars and data fields, connected by subtle glowing lines forming a network" + STYLE_SUFFIX;

  // Excel / spreadsheet
  if (t.includes("excel") || t.includes("spreadsheet") || t.includes("google sheets") || t.includes("tabelle"))
    return "A spreadsheet grid morphing and transforming into a modern purple CRM dashboard with charts and pipeline, transition effect in the middle" + STYLE_SUFFIX;

  // Open source
  if (t.includes("open source") || t.includes("quelloff"))
    return "Glowing code brackets { } with a heart inside, surrounded by floating contributor avatars connected in a network" + STYLE_SUFFIX;

  // Reporting / analytics / ROI
  if (t.includes("report") || t.includes("roi") || t.includes("analyt") || t.includes("dashboard"))
    return "A floating chrome dashboard screen showing bar charts and pie graphs with glowing green upward trend arrows" + STYLE_SUFFIX;

  // Implementation / guide / strategy
  if (t.includes("implementation") || t.includes("implementierung") || t.includes("einführung") || t.includes("strategie") || t.includes("strategy") || t.includes("guide") || t.includes("leitfaden"))
    return "A chrome clipboard with a glowing checklist, floating step-number badges 1 2 3 connected by arrows" + STYLE_SUFFIX;

  // Follow up / email template
  if (t.includes("follow up") || t.includes("follow-up") || t.includes("template") || t.includes("vorlage"))
    return "A chrome clock with floating email envelopes arranged in a sequence, green checkmarks appearing on each" + STYLE_SUFFIX;

  // Best / top / review
  if (t.includes("best") || t.includes("top") || t.includes("review") || t.includes("test"))
    return "A chrome trophy with a star on top, surrounded by floating software logo badges and rating stars" + STYLE_SUFFIX;

  // CRM system / what is CRM / definition
  if (t.includes("crm system") || t.includes("crm-system") || t.includes("was ist") || t.includes("what is") || t.includes("definition") || t.includes("bedeutung"))
    return "A large floating chrome CRM dashboard with contact cards, deal pipeline columns, and analytics widgets orbiting around it" + STYLE_SUFFIX;

  // App / mobile
  if (t.includes("app") || t.includes("mobile"))
    return "A chrome smartphone showing a CRM app interface with floating notification badges and contact cards popping out" + STYLE_SUFFIX;

  // Database
  if (t.includes("database") || t.includes("datenbank"))
    return "Chrome database cylinders stacked with glowing data streams flowing between them, floating data cards" + STYLE_SUFFIX;

  // Training / onboarding
  if (t.includes("training") || t.includes("schulung") || t.includes("onboarding"))
    return "A chrome graduation cap floating above a laptop showing tutorials, with step arrows and lightbulb icons" + STYLE_SUFFIX;

  // Default CRM illustration
  return "A large floating chrome CRM dashboard screen showing contact cards, deal pipeline columns, and analytics charts, with floating gear icons and notification badges around it" + STYLE_SUFFIX;
}

async function generateHeroImage(config: HeroConfig): Promise<void> {
  const { text, plainTitle, bgImage, fluxPrompt, outputPath } = config;

  const composites: sharp.OverlayOptions[] = [];

  // Layer 2: AI illustration on the right 60%
  let illustrationBuffer: Buffer | null = null;

  if (bgImage && fs.existsSync(bgImage)) {
    illustrationBuffer = await sharp(bgImage).resize({ width: 1248, height: HEIGHT, fit: "cover" }).toBuffer();
  } else if (process.env.REPLICATE_API_TOKEN) {
    const prompt = fluxPrompt || getFluxPrompt(plainTitle);
    try {
      const raw = await generateFluxImage(prompt);
      illustrationBuffer = await sharp(raw).resize({ width: 1248, height: HEIGHT, fit: "cover" }).toBuffer();
    } catch (err) {
      console.warn(`  Flux generation failed: ${err}. Continuing without illustration.`);
    }
  }

  if (illustrationBuffer) {
    // Save raw Flux image to base folder for reuse
    if (!bgImage) {
      const baseSlug = path.basename(outputPath, ".png");
      const basePath = path.join(ROOT, `public/images/base/${baseSlug}.png`);
      if (!fs.existsSync(basePath)) {
        await sharp(illustrationBuffer).toFile(basePath);
        console.log(`  Saved to base: ${baseSlug}.png`);
      }
    }

    // Position: right-aligned, covering right 60% of canvas
    composites.push({
      input: illustrationBuffer,
      left: WIDTH - 1248,
      top: 0,
      blend: "over",
    });
  }

  // Layer 3: Hero mask overlay
  if (fs.existsSync(MASK_PATH)) {
    const mask = await sharp(MASK_PATH).resize(WIDTH, HEIGHT).toBuffer();
    composites.push({
      input: mask,
      left: 0,
      top: 0,
      blend: "over",
    });
  }

  // Layer 4: Title text
  const textOverlay = createTextOverlay(text);
  composites.push({
    input: textOverlay,
    left: 0,
    top: 0,
    blend: "over",
  });

  // Composite and save
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .composite(composites)
    .png({ quality: 90, compressionLevel: 6 })
    .toFile(outputPath);

  // Copy to dark theme
  const darkPath = outputPath.replace("/light/", "/dark/");
  if (darkPath !== outputPath) {
    const darkDir = path.dirname(darkPath);
    if (!fs.existsSync(darkDir)) fs.mkdirSync(darkDir, { recursive: true });
    fs.copyFileSync(outputPath, darkPath);
  }

  console.log(`Generated: ${outputPath}`);
}

// --- Batch mode ---
async function batchGenerate() {
  const blogDir = path.join(ROOT, "content/blog-posts");

  let generated = 0;
  let skipped = 0;

  for (const locale of ["en", "de"]) {
    const localeDir = path.join(blogDir, locale);
    if (!fs.existsSync(localeDir)) continue;

    for (const file of fs.readdirSync(localeDir)) {
      if (!file.endsWith(".mdx")) continue;
      const slug = file.replace(".mdx", "");

      const lightPath = path.join(ROOT, `public/images/light/${locale}/${slug}.png`);
      if (fs.existsSync(lightPath)) {
        skipped++;
        continue;
      }

      // Extract title from MDX frontmatter
      const mdxContent = fs.readFileSync(path.join(localeDir, file), "utf-8");
      const heroTitleMatch = mdxContent.match(/hero:\s*\n\s*title:\s*["']?(.+?)["']?\s*$/m);
      const titleMatch = mdxContent.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      const fullTitle = heroTitleMatch?.[1] || titleMatch?.[1] || slug;

      // Split on ":" or "—" — part after separator becomes purple
      let text = fullTitle;
      const splitMatch = fullTitle.match(/^(.+?)[:\u2014\u2013]\s*(.+)$/);
      if (splitMatch) {
        text = `${splitMatch[1].trim()} – <purple>${splitMatch[2].trim()}</purple>`;
      }

      await generateHeroImage({
        text,
        plainTitle: fullTitle,
        outputPath: lightPath,
      });

      generated++;

      // Rate limit Flux API calls
      if (generated % 5 === 0) {
        console.log(`  Progress: ${generated} generated, ${skipped} skipped. Pausing 5s...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  console.log(`\nBatch complete: ${generated} generated, ${skipped} skipped (already exist)`);
}

// --- CLI ---
function getArg(args: string[], flag: string): string | null {
  const idx = args.indexOf(flag);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
}

async function main() {
  // Load .env
  const envPath = path.join(ROOT, ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const match = line.match(/^([^#=]+)=(.+)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  }

  const args = process.argv.slice(2);

  if (args.includes("--batch")) {
    await batchGenerate();
    return;
  }

  const rawText = getArg(args, "--text") || getArg(args, "--title") || "Customermates";
  const bgImage = getArg(args, "--bg") || undefined;
  const fluxPrompt = getArg(args, "--prompt") || undefined;
  const outputPath = getArg(args, "--out") || "hero.png";

  // Strip <purple> tags to get plain title for Flux prompt
  const plainTitle = rawText.replace(/<\/?purple>/g, "");

  await generateHeroImage({
    text: rawText,
    plainTitle,
    bgImage: bgImage ? path.resolve(ROOT, bgImage) : undefined,
    fluxPrompt,
    outputPath: path.resolve(ROOT, outputPath),
  });
}

main().catch(console.error);

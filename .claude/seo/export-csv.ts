import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const KB_PATH = path.join(ROOT, ".claude/seo/seo-keywords-overview.json");
const CSV_PATH = path.join(ROOT, ".claude/seo/seo-keywords-overview.csv");

interface Keyword {
  keyword: string;
  locale: string;
  volume: number | null;
  difficulty: number | null;
  cpc: number | null;
  avgBacklinksToRank: number | null;
  intent: string;
  priority: string;
  status: string;
  targetPage: string | null;
  currentPosition: number | null;
  lastPositionCheck: string | null;
  contentFile: string | null;
  onPageScore: number | null;
  addedDate: string;
  notes: string;
  optimizationScore: number | null;
  optimizationRank: number | null;
  isPrimaryForPage: boolean | null;
  optimizedDate: string | null;
}

interface KnowledgeBase {
  keywords: Keyword[];
}

function escapeCSV(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const raw = fs.readFileSync(KB_PATH, "utf-8");
const kb: KnowledgeBase = JSON.parse(raw);

const headers = [
  "keyword",
  "locale",
  "volume",
  "difficulty",
  "cpc",
  "avgBacklinksToRank",
  "intent",
  "priority",
  "status",
  "targetPage",
  "currentPosition",
  "lastPositionCheck",
  "contentFile",
  "onPageScore",
  "addedDate",
  "notes",
  "optimizationScore",
  "optimizationRank",
  "isPrimaryForPage",
  "optimizedDate",
];

const rows = kb.keywords.map((kw) =>
  headers.map((h) => escapeCSV(kw[h as keyof Keyword])).join(",")
);

const csv = [headers.join(","), ...rows].join("\n") + "\n";
fs.writeFileSync(CSV_PATH, csv, "utf-8");

console.log(`Exported ${kb.keywords.length} keywords to ${CSV_PATH}`);

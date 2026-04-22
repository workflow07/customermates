import { z } from "zod";
import { encode } from "@toon-format/toon";

export function encodeToToon(data: unknown): string {
  try {
    return encode(data);
  } catch (error) {
    return String(error);
  }
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDatesRecursively(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (value instanceof Date) return formatDate(value);

  if (typeof value === "string") {
    const dateTimeResult = z.iso.datetime().safeParse(value);
    const dateResult = z.iso.date().safeParse(value);
    if (dateTimeResult.success || dateResult.success) return formatDate(value);
  }

  if (Array.isArray(value)) return value.map(formatDatesRecursively);

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) result[key] = formatDatesRecursively(val);

    return result;
  }

  return value;
}

export function formatDatesInResponse<T>(data: T): T {
  return formatDatesRecursively(data) as T;
}

export const FILTER_SYNTAX = {
  operators: {
    string: ["equals", "contains", "gt", "gte", "lt", "lte"],
    array: ["in", "notIn"],
    range: ["between"],
    noValue: ["isNull", "isNotNull", "hasNone", "hasSome"],
  },
  examples: [
    { field: "status", operator: "equals", value: "active" },
    { field: "createdAt", operator: "between", value: ["2024-01-01", "2024-12-31"] },
    { field: "assigneeId", operator: "in", value: ["id1", "id2"] },
    { field: "email", operator: "isNotNull" },
  ],
};

/**
 * Inline-description string for any tool that accepts a `filters` array.
 * Always include this in the .describe() so weak models see example syntax
 * without having to call `get_entity_configuration` first.
 */
export const FILTER_FIELD_DESCRIPTION =
  "Array of filter rules, AND-combined. Each rule is { field, operator, value? }. " +
  "Operators: equals, contains, gt, gte, lt, lte, in, notIn, between, isNull, isNotNull, hasNone, hasSome. " +
  'Example: [{"field":"name","operator":"contains","value":"acme"},{"field":"createdAt","operator":"gte","value":"2024-01-01"}]. ' +
  "Call get_entity_configuration to see all filterable fields.";

/**
 * Append a `(one of: a, b, c)` hint to a zod enum description.
 * Weak models cannot resolve external TS enums, so the legal values must be
 * spelled out in the MCP-exposed description.
 */
export function enumHint(values: readonly string[]): string {
  return `(one of: ${values.join(", ")})`;
}

/**
 * Refuse `null` on the listed fields so a weak model passing
 * `{ organizationIds: null }` gets a validation error instead of silently
 * wiping the relationship. `undefined` (omit) still means "keep existing",
 * `[]` still means "explicitly clear".
 */
export function forbidNullFields<T extends z.ZodObject<z.ZodRawShape>>(schema: T, fields: readonly string[]) {
  return schema.superRefine((value, ctx) => {
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    for (const field of fields) {
      if (record[field] === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message:
            `Refusing to set '${field}' to null — that would wipe the relationship. ` +
            `Omit the field to keep existing links, pass [] to explicitly clear, ` +
            `or use unlink_entities to remove specific ids.`,
        });
      }
    }
  });
}

export const NO_NULL_WIPE_WARNING =
  "NEVER pass null on relationship arrays — it would wipe existing links. " +
  "Omit the field to keep existing, pass [] to explicitly clear all, " +
  "or use unlink_entities to remove specific ids.";

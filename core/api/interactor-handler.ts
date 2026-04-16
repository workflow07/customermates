import { NextResponse } from "next/server";
import { z } from "zod";

import { AppError } from "@/core/errors/app-errors";

export const ErrorResponseSchema = z.string();

export const CommonApiResponses = {
  "400": {
    description: "Bad Request - Validation error",
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
      },
    },
  },
  "401": {
    description: "Not authenticated",
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
      },
    },
  },
  "403": {
    description: "Not authorized",
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
      },
    },
  },
  "500": {
    description: "Unexpected error",
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
      },
    },
  },
} as const;

export function handleError(source: unknown): NextResponse {
  if (source instanceof AppError) return NextResponse.json(source.message, { status: source.statusCode });

  throw source instanceof Error ? source : new Error("Unexpected non-Error thrown", { cause: source });
}

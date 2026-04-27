import { z } from "zod";

import { ContactReferenceSchema, DealReferenceSchema } from "@/core/base/base-entity.schema";

export const LineItemDtoSchema = z.object({
  id: z.uuid(),
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  total: z.number(),
  sortOrder: z.number(),
});

export type LineItemDto = z.infer<typeof LineItemDtoSchema>;

export const EstimateDtoSchema = z.object({
  id: z.uuid(),
  number: z.number(),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  dueDate: z.date().nullable(),
  taxPercent: z.number(),
  subtotal: z.number(),
  grandTotal: z.number(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  contact: ContactReferenceSchema.nullable(),
  deal: DealReferenceSchema.nullable(),
  lineItems: z.array(LineItemDtoSchema),
});

export type EstimateDto = z.infer<typeof EstimateDtoSchema>;

export const LineItemInputSchema = z.object({
  id: z.uuid().optional(),
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  sortOrder: z.number().int().min(0).default(0),
});

export type LineItemInput = z.infer<typeof LineItemInputSchema>;

export const UpsertEstimateSchema = z.object({
  id: z.uuid().optional(),
  contactId: z.uuid().nullable().optional(),
  dealId: z.uuid().nullable().optional(),
  status: z.enum(["draft", "sent", "paid", "overdue"]).optional(),
  dueDate: z.date().nullable().optional(),
  taxPercent: z.number().min(0).max(100).default(0),
  notes: z.string().nullable().optional(),
  lineItems: z.array(LineItemInputSchema).default([]),
});

export type UpsertEstimateData = z.infer<typeof UpsertEstimateSchema>;

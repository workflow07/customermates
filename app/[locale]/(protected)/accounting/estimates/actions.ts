"use server";

import type { UpsertEstimateData } from "@/features/estimates/estimate.schema";
import type { DeleteEstimateData } from "@/features/estimates/delete/delete-estimate.interactor";
import type { GetEstimateByIdData } from "@/features/estimates/get/get-estimate-by-id.interactor";

import {
  getGetEstimatesInteractor,
  getGetEstimateByIdInteractor,
  getUpsertEstimateInteractor,
  getDeleteEstimateInteractor,
  getUpsertInvoiceInteractor,
} from "@/core/di";
import { serializeResult } from "@/core/utils/action-result";

export async function getEstimatesAction() {
  const result = await getGetEstimatesInteractor().invoke();
  return result.ok ? { items: result.data.items } : { items: [] };
}

export async function getEstimateByIdAction(data: GetEstimateByIdData) {
  const result = await getGetEstimateByIdInteractor().invoke(data);
  return result.ok ? result.data : null;
}

export async function upsertEstimateAction(data: UpsertEstimateData) {
  return serializeResult(getUpsertEstimateInteractor().invoke(data));
}

export async function deleteEstimateAction(data: DeleteEstimateData) {
  return serializeResult(getDeleteEstimateInteractor().invoke(data));
}

export async function convertEstimateToInvoiceAction(estimateId: string) {
  const estimateResult = await getGetEstimateByIdInteractor().invoke({ id: estimateId });
  if (!estimateResult.ok || !estimateResult.data) return { ok: false as const, error: "Estimate not found" };

  const e = estimateResult.data;
  return serializeResult(
    getUpsertInvoiceInteractor().invoke({
      contactId: e.contact?.id ?? null,
      dealId: e.deal?.id ?? null,
      status: "draft",
      dueDate: e.dueDate,
      taxPercent: e.taxPercent,
      notes: e.notes,
      lineItems: e.lineItems.map((li) => ({
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        sortOrder: li.sortOrder,
      })),
    }),
  );
}

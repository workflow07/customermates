"use server";

import type { UpsertInvoiceData } from "@/features/invoices/invoice.schema";
import type { DeleteInvoiceData } from "@/features/invoices/delete/delete-invoice.interactor";
import type { GetInvoiceByIdData } from "@/features/invoices/get/get-invoice-by-id.interactor";

import {
  getGetInvoicesInteractor,
  getGetInvoiceByIdInteractor,
  getUpsertInvoiceInteractor,
  getDeleteInvoiceInteractor,
} from "@/core/di";
import { serializeResult } from "@/core/utils/action-result";

export async function getInvoicesAction() {
  const result = await getGetInvoicesInteractor().invoke();
  return result.ok ? { items: result.data.items } : { items: [] };
}

export async function getInvoiceByIdAction(data: GetInvoiceByIdData) {
  const result = await getGetInvoiceByIdInteractor().invoke(data);
  return result.ok ? result.data : null;
}

export async function upsertInvoiceAction(data: UpsertInvoiceData) {
  return serializeResult(getUpsertInvoiceInteractor().invoke(data));
}

export async function deleteInvoiceAction(data: DeleteInvoiceData) {
  return serializeResult(getDeleteInvoiceInteractor().invoke(data));
}

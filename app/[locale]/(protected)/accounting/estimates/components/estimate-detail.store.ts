import type { EstimateDto, LineItemInput } from "@/features/estimates/estimate.schema";
import type { InvoiceDto } from "@/features/invoices/invoice.schema";

import { makeObservable, observable, action, computed } from "mobx";

import { upsertEstimateAction, deleteEstimateAction, convertEstimateToInvoiceAction } from "../actions";

type LineItemRow = LineItemInput & { _key: string };

export class EstimateDetailStore {
  id: string | undefined = undefined;
  contactId: string | null = null;
  dealId: string | null = null;
  status: EstimateDto["status"] = "draft";
  dueDate: Date | null = null;
  taxPercent = 0;
  notes: string | null = null;
  lineItems: LineItemRow[] = [];

  isSaving = false;
  isDeleting = false;
  isConverting = false;
  error: string | null = null;

  constructor() {
    makeObservable(this, {
      id: observable,
      contactId: observable,
      dealId: observable,
      status: observable,
      dueDate: observable,
      taxPercent: observable,
      notes: observable,
      lineItems: observable,
      isSaving: observable,
      isDeleting: observable,
      isConverting: observable,
      error: observable,
      subtotal: computed,
      grandTotal: computed,
      initFromDto: action,
      initNew: action,
      setField: action,
      addLineItem: action,
      removeLineItem: action,
      updateLineItem: action,
    });
  }

  get subtotal() {
    return this.lineItems.reduce((sum, li) => sum + (li.quantity || 0) * (li.unitPrice || 0), 0);
  }

  get grandTotal() {
    return this.subtotal * (1 + (this.taxPercent || 0) / 100);
  }

  initNew() {
    this.id = undefined;
    this.contactId = null;
    this.dealId = null;
    this.status = "draft";
    this.dueDate = null;
    this.taxPercent = 0;
    this.notes = null;
    this.lineItems = [this.emptyLine(0)];
    this.error = null;
  }

  initFromDto(dto: EstimateDto) {
    this.id = dto.id;
    this.contactId = dto.contact?.id ?? null;
    this.dealId = dto.deal?.id ?? null;
    this.status = dto.status;
    this.dueDate = dto.dueDate;
    this.taxPercent = dto.taxPercent;
    this.notes = dto.notes;
    this.lineItems = dto.lineItems.map((li, idx) => ({
      _key: crypto.randomUUID(),
      id: li.id,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      sortOrder: li.sortOrder ?? idx,
    }));
    this.error = null;
  }

  setField<K extends keyof Omit<EstimateDetailStore, "lineItems">>(key: K, value: EstimateDetailStore[K]) {
    (this as any)[key] = value;
  }

  addLineItem() {
    this.lineItems.push(this.emptyLine(this.lineItems.length));
  }

  removeLineItem(key: string) {
    this.lineItems = this.lineItems.filter((li) => li._key !== key);
  }

  updateLineItem(key: string, field: keyof LineItemInput, value: string | number) {
    const li = this.lineItems.find((l) => l._key === key);
    if (!li) return;
    (li as any)[field] = value;
  }

  async save(): Promise<EstimateDto | null> {
    this.isSaving = true;
    this.error = null;
    try {
      const result = await upsertEstimateAction({
        id: this.id,
        contactId: this.contactId,
        dealId: this.dealId,
        status: this.status,
        dueDate: this.dueDate,
        taxPercent: this.taxPercent,
        notes: this.notes,
        lineItems: this.lineItems.map((li, idx) => ({
          id: li.id,
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          sortOrder: idx,
        })),
      });
      if (result.ok) {
        this.initFromDto(result.data);
        return result.data;
      }
      this.error = "Failed to save";
      return null;
    } finally {
      this.isSaving = false;
    }
  }

  async convertToInvoice(): Promise<InvoiceDto | null> {
    if (!this.id) return null;
    this.isConverting = true;
    this.error = null;
    try {
      const result = await convertEstimateToInvoiceAction(this.id);
      return result.ok ? result.data : null;
    } finally {
      this.isConverting = false;
    }
  }

  async delete(): Promise<boolean> {
    if (!this.id) return false;
    this.isDeleting = true;
    this.error = null;
    try {
      const result = await deleteEstimateAction({ id: this.id });
      return result.ok;
    } finally {
      this.isDeleting = false;
    }
  }

  private emptyLine(index: number): LineItemRow {
    return { _key: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, sortOrder: index };
  }
}

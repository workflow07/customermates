import type { GetQueryParams } from "@/core/base/base-get.schema";
import type { RootStore } from "@/core/stores/root.store";
import type { TableColumn } from "@/core/base/base-data-view.store";
import type { InvoiceDto } from "@/features/invoices/invoice.schema";

import { Resource } from "@/generated/prisma";

import { getInvoicesAction } from "../actions";

import { BaseDataViewStore } from "@/core/base/base-data-view.store";

export class InvoicesStore extends BaseDataViewStore<InvoiceDto> {
  constructor(public readonly rootStore: RootStore) {
    super(rootStore, Resource.invoices, undefined);
  }

  get columnsDefinition(): TableColumn[] {
    return [
      { uid: "number", sortable: true },
      { uid: "contact" },
      { uid: "deal" },
      { uid: "status", sortable: true },
      { uid: "grandTotal", sortable: true },
      { uid: "dueDate", sortable: true },
      { uid: "createdAt", sortable: true },
    ];
  }

  protected async refreshAction(params?: GetQueryParams) {
    return await getInvoicesAction();
  }
}

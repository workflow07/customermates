import type { GetQueryParams } from "@/core/base/base-get.schema";
import type { RootStore } from "@/core/stores/root.store";
import type { TableColumn } from "@/core/base/base-data-view.store";
import type { EstimateDto } from "@/features/estimates/estimate.schema";

import { Resource } from "@/generated/prisma";

import { getEstimatesAction } from "../actions";

import { BaseDataViewStore } from "@/core/base/base-data-view.store";


export class EstimatesStore extends BaseDataViewStore<EstimateDto> {
  constructor(public readonly rootStore: RootStore) {
    super(rootStore, Resource.estimates, undefined);
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
    return await getEstimatesAction();
  }
}

import type { GetQueryParams } from "@/core/base/base-get.schema";
import type { Validated } from "@/core/validation/validation.utils";

import { z } from "zod";
import { Resource, Action } from "@/generated/prisma";

import { InvoiceDtoSchema } from "../invoice.schema";
import { PrismaInvoiceRepo } from "../prisma-invoice.repository";

import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { AllowInDemoMode } from "@/core/decorators/allow-in-demo-mode.decorator";
import { BaseInteractor } from "@/core/base/base-interactor";

const ResultSchema = z.object({ items: z.array(InvoiceDtoSchema), total: z.number().optional() });

@AllowInDemoMode
@TentantInteractor({
  permissions: [{ resource: Resource.invoices, action: Action.readAll }],
  condition: "OR",
})
export class GetInvoicesInteractor extends BaseInteractor<GetQueryParams | undefined, z.infer<typeof ResultSchema>> {
  constructor(private repo: PrismaInvoiceRepo) {
    super();
  }

  async invoke(params?: GetQueryParams): Validated<z.infer<typeof ResultSchema>> {
    const result = await this.repo.getAll(params);
    return { ok: true as const, data: result };
  }
}

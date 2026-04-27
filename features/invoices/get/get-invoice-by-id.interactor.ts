import type { Validated } from "@/core/validation/validation.utils";

import { z } from "zod";
import { Resource, Action } from "@/generated/prisma";

import { InvoiceDtoSchema } from "../invoice.schema";
import { PrismaInvoiceRepo } from "../prisma-invoice.repository";

import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { AllowInDemoMode } from "@/core/decorators/allow-in-demo-mode.decorator";
import { BaseInteractor } from "@/core/base/base-interactor";

const InputSchema = z.object({ id: z.uuid() });
export type GetInvoiceByIdData = z.infer<typeof InputSchema>;

@AllowInDemoMode
@TentantInteractor({
  permissions: [{ resource: Resource.invoices, action: Action.readAll }],
  condition: "OR",
})
export class GetInvoiceByIdInteractor extends BaseInteractor<GetInvoiceByIdData, z.infer<typeof InvoiceDtoSchema> | null> {
  constructor(private repo: PrismaInvoiceRepo) {
    super();
  }

  async invoke(data: GetInvoiceByIdData): Validated<z.infer<typeof InvoiceDtoSchema> | null> {
    const invoice = await this.repo.getById(data.id);
    return { ok: true as const, data: invoice };
  }
}

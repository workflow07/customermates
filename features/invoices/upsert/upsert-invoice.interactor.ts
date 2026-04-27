import type { Validated } from "@/core/validation/validation.utils";

import { Resource, Action } from "@/generated/prisma";

import { InvoiceDtoSchema, UpsertInvoiceSchema, type InvoiceDto, type UpsertInvoiceData } from "../invoice.schema";
import { PrismaInvoiceRepo } from "../prisma-invoice.repository";

import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { Validate } from "@/core/decorators/validate.decorator";
import { ValidateOutput } from "@/core/decorators/validate-output.decorator";
import { BaseInteractor } from "@/core/base/base-interactor";

@TentantInteractor({
  permissions: [
    { resource: Resource.invoices, action: Action.create },
    { resource: Resource.invoices, action: Action.update },
  ],
  condition: "OR",
})
export class UpsertInvoiceInteractor extends BaseInteractor<UpsertInvoiceData, InvoiceDto> {
  constructor(private repo: PrismaInvoiceRepo) {
    super();
  }

  @Validate(UpsertInvoiceSchema)
  @ValidateOutput(InvoiceDtoSchema)
  async invoke(data: UpsertInvoiceData): Validated<InvoiceDto> {
    const invoice = await this.repo.upsert(data);
    return { ok: true as const, data: invoice };
  }
}

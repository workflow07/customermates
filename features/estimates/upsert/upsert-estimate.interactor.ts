import type { Validated } from "@/core/validation/validation.utils";

import { Resource, Action } from "@/generated/prisma";

import { EstimateDtoSchema, UpsertEstimateSchema, type EstimateDto, type UpsertEstimateData } from "../estimate.schema";
import { PrismaEstimateRepo } from "../prisma-estimate.repository";

import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { Validate } from "@/core/decorators/validate.decorator";
import { ValidateOutput } from "@/core/decorators/validate-output.decorator";
import { BaseInteractor } from "@/core/base/base-interactor";

@TentantInteractor({
  permissions: [
    { resource: Resource.estimates, action: Action.create },
    { resource: Resource.estimates, action: Action.update },
  ],
  condition: "OR",
})
export class UpsertEstimateInteractor extends BaseInteractor<UpsertEstimateData, EstimateDto> {
  constructor(private repo: PrismaEstimateRepo) {
    super();
  }

  @Validate(UpsertEstimateSchema)
  @ValidateOutput(EstimateDtoSchema)
  async invoke(data: UpsertEstimateData): Validated<EstimateDto> {
    const estimate = await this.repo.upsert(data);
    return { ok: true as const, data: estimate };
  }
}

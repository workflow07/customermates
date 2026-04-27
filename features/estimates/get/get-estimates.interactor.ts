import type { GetQueryParams } from "@/core/base/base-get.schema";
import type { Data, Validated } from "@/core/validation/validation.utils";

import { z } from "zod";
import { Resource, Action } from "@/generated/prisma";

import { type EstimateDto, EstimateDtoSchema } from "../estimate.schema";
import { PrismaEstimateRepo } from "../prisma-estimate.repository";

import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { AllowInDemoMode } from "@/core/decorators/allow-in-demo-mode.decorator";
import { BaseInteractor } from "@/core/base/base-interactor";

const ResultSchema = z.object({ items: z.array(EstimateDtoSchema), total: z.number().optional() });

@AllowInDemoMode
@TentantInteractor({
  permissions: [{ resource: Resource.estimates, action: Action.readAll }],
  condition: "OR",
})
export class GetEstimatesInteractor extends BaseInteractor<GetQueryParams | undefined, z.infer<typeof ResultSchema>> {
  constructor(private repo: PrismaEstimateRepo) {
    super();
  }

  async invoke(params?: GetQueryParams): Validated<z.infer<typeof ResultSchema>> {
    const result = await this.repo.getAll(params);
    return { ok: true as const, data: result };
  }
}

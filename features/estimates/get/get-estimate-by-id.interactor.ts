import type { Data, Validated } from "@/core/validation/validation.utils";

import { z } from "zod";
import { Resource, Action } from "@/generated/prisma";

import { EstimateDtoSchema } from "../estimate.schema";
import { PrismaEstimateRepo } from "../prisma-estimate.repository";

import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { AllowInDemoMode } from "@/core/decorators/allow-in-demo-mode.decorator";
import { BaseInteractor } from "@/core/base/base-interactor";

const InputSchema = z.object({ id: z.uuid() });
export type GetEstimateByIdData = z.infer<typeof InputSchema>;

@AllowInDemoMode
@TentantInteractor({
  permissions: [{ resource: Resource.estimates, action: Action.readAll }],
  condition: "OR",
})
export class GetEstimateByIdInteractor extends BaseInteractor<GetEstimateByIdData, z.infer<typeof EstimateDtoSchema> | null> {
  constructor(private repo: PrismaEstimateRepo) {
    super();
  }

  async invoke(data: GetEstimateByIdData): Validated<z.infer<typeof EstimateDtoSchema> | null> {
    const estimate = await this.repo.getById(data.id);
    return { ok: true as const, data: estimate };
  }
}

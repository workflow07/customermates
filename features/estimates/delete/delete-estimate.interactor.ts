import type { Validated } from "@/core/validation/validation.utils";

import { z } from "zod";
import { Resource, Action } from "@/generated/prisma";

import { PrismaEstimateRepo } from "../prisma-estimate.repository";

import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { Validate } from "@/core/decorators/validate.decorator";
import { ValidateOutput } from "@/core/decorators/validate-output.decorator";
import { BaseInteractor } from "@/core/base/base-interactor";

const DeleteSchema = z.object({ id: z.uuid() });
export type DeleteEstimateData = z.infer<typeof DeleteSchema>;

@TentantInteractor({ resource: Resource.estimates, action: Action.delete })
export class DeleteEstimateInteractor extends BaseInteractor<DeleteEstimateData, string> {
  constructor(private repo: PrismaEstimateRepo) {
    super();
  }

  @Validate(DeleteSchema)
  @ValidateOutput(z.string())
  async invoke(data: DeleteEstimateData): Validated<string> {
    await this.repo.delete(data.id);
    return { ok: true as const, data: data.id };
  }
}

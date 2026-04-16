import type { GetResult } from "@/core/base/base-get.interactor";
import type { GetQueryParamsApi } from "@/core/base/base-get.schema";
import type { Validated } from "@/core/validation/validation.utils";
import type { GetUsersRepo } from "./get-users.interactor";
import type { P13nRepo } from "@/core/base/base-get.interactor";

import { Resource, Action } from "@/generated/prisma";

import { type UserDto } from "../user.schema";

import { getCompanyRepo, getValidateQueryParams } from "@/core/di";
import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { BaseGetInteractor } from "@/core/base/base-get.interactor";
import { Validate } from "@/core/decorators/validate.decorator";
import { AllowInDemoMode } from "@/core/decorators/allow-in-demo-mode.decorator";
import { GetQueryParamsApiSchema } from "@/core/base/base-get.schema";

const GetUsersQueryParamsApiSchema = GetQueryParamsApiSchema.omit({ filters: true }).superRefine(async (data, ctx) => {
  await getValidateQueryParams().invoke(getCompanyRepo(), undefined, data, ctx);
});

@AllowInDemoMode
@TentantInteractor({
  permissions: [
    { resource: Resource.users, action: Action.readAll },
    { resource: Resource.users, action: Action.readOwn },
  ],
  condition: "OR",
})
export class GetUsersApiInteractor extends BaseGetInteractor<UserDto> {
  constructor(repo: GetUsersRepo, p13nRepo: P13nRepo) {
    super(repo, p13nRepo, {
      sortDescriptor: { field: "name", direction: "asc" },
    });
  }

  @Validate(GetUsersQueryParamsApiSchema)
  async invoke(params: GetQueryParamsApi = {}): Validated<GetResult<UserDto>, GetQueryParamsApi> {
    return await super.invoke(params);
  }
}

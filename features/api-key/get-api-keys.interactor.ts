import type { AuthService } from "@/features/auth/auth.service";

import { z } from "zod";
import { Action, Resource } from "@/generated/prisma";

import { AllowInDemoMode } from "@/core/decorators/allow-in-demo-mode.decorator";
import { BaseInteractor } from "@/core/base/base-interactor";
import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { ValidateOutput } from "@/core/decorators/validate-output.decorator";

export const ApiKeyDtoSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  createdAt: z.date(),
  expiresAt: z.date().nullable(),
  lastRequest: z.date().nullable(),
});

export interface ApiKey {
  id: string;
  name: string | null;
  createdAt: Date;
  expiresAt: Date | null;
  lastRequest: Date | null;
}

@AllowInDemoMode
@TentantInteractor({ resource: Resource.api, action: Action.readAll })
export class GetApiKeysInteractor extends BaseInteractor<void, ApiKey[]> {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @ValidateOutput(ApiKeyDtoSchema)
  async invoke(): Promise<{ ok: true; data: ApiKey[] }> {
    const keys = await this.authService.listApiKeys();

    return {
      ok: true,
      data: keys.map((key) => ({
        id: key.id,
        name: key.name,
        createdAt: key.createdAt,
        expiresAt: key.expiresAt,
        lastRequest: key.lastRequest,
      })),
    };
  }
}

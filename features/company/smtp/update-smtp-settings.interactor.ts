import { z } from "zod";

import type { Data } from "@/core/validation/validation.utils";
import type { Validated } from "@/core/validation/validation.utils";

import { BaseInteractor } from "@/core/base/base-interactor";
import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { Validate } from "@/core/decorators/validate.decorator";
import { ValidateOutput } from "@/core/decorators/validate-output.decorator";

const Schema = z.object({
  smtpHost: z.string().nullable(),
  smtpPort: z.coerce.number().int().positive().nullable(),
  smtpUser: z.string().nullable(),
  smtpPassword: z.string().nullable(),
  smtpFromEmail: z.string().email().nullable(),
  emailSignature: z.string().nullable().optional(),
});

const ResultSchema = z.object({ saved: z.boolean() });

export type UpdateSmtpSettingsData = Data<typeof Schema>;

export abstract class UpdateSmtpSettingsRepo {
  abstract updateSmtpSettings(args: UpdateSmtpSettingsData): Promise<void>;
}

@TentantInteractor()
export class UpdateSmtpSettingsInteractor extends BaseInteractor<UpdateSmtpSettingsData, Data<typeof ResultSchema>> {
  constructor(private readonly repo: UpdateSmtpSettingsRepo) {
    super();
  }

  @Validate(Schema)
  @ValidateOutput(ResultSchema)
  async invoke(data: UpdateSmtpSettingsData): Validated<Data<typeof ResultSchema>> {
    await this.repo.updateSmtpSettings(data);
    return { ok: true as const, data: { saved: true } };
  }
}

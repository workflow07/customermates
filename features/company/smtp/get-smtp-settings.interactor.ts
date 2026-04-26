import { z } from "zod";

import { BaseInteractor } from "@/core/base/base-interactor";
import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { ValidateOutput } from "@/core/decorators/validate-output.decorator";
import { AllowInDemoMode } from "@/core/decorators/allow-in-demo-mode.decorator";

export const SmtpSettingsDtoSchema = z.object({
  smtpHost: z.string().nullable(),
  smtpPort: z.number().int().nullable(),
  smtpUser: z.string().nullable(),
  smtpPassword: z.string().nullable(),
  smtpFromEmail: z.string().nullable(),
  emailSignature: z.string().nullable(),
});

export type SmtpSettingsDto = z.infer<typeof SmtpSettingsDtoSchema>;

export abstract class GetSmtpSettingsRepo {
  abstract getSmtpSettings(): Promise<SmtpSettingsDto>;
}

@AllowInDemoMode
@TentantInteractor()
export class GetSmtpSettingsInteractor extends BaseInteractor<void, SmtpSettingsDto> {
  constructor(private readonly repo: GetSmtpSettingsRepo) {
    super();
  }

  @ValidateOutput(SmtpSettingsDtoSchema)
  async invoke(): Promise<{ ok: true; data: SmtpSettingsDto }> {
    return { ok: true as const, data: await this.repo.getSmtpSettings() };
  }
}

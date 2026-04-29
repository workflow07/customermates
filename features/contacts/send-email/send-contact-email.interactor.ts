import type { EmailService, SmtpConfig } from "@/features/email/email.service";
import type { EventService } from "@/features/event/event.service";
import type { GetSmtpSettingsRepo } from "@/features/company/smtp/get-smtp-settings.interactor";
import type { Validated, Data } from "@/core/validation/validation.utils";

import React from "react";
import { z } from "zod";

import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { BaseInteractor } from "@/core/base/base-interactor";
import { Validate } from "@/core/decorators/validate.decorator";
import { ValidateOutput } from "@/core/decorators/validate-output.decorator";
import { Resource, Action } from "@/generated/prisma";
import { DomainEvent } from "@/features/event/domain-events";
import ContactEmail from "@/components/emails/contact-email";

const Schema = z.object({
  contactId: z.uuid(),
  to: z.email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  signature: z.string().nullable().optional(),
  documentHtml: z.string().nullable().optional(),
  pdfBase64: z.string().nullable().optional(),
  pdfFilename: z.string().nullable().optional(),
});

const ResultSchema = z.object({ sent: z.boolean() });

export type SendContactEmailData = Data<typeof Schema>;

@TentantInteractor({ resource: Resource.contacts, action: Action.readAll })
export class SendContactEmailInteractor extends BaseInteractor<SendContactEmailData, Data<typeof ResultSchema>> {
  constructor(
    private readonly emailService: EmailService,
    private readonly eventService: EventService,
    private readonly smtpSettingsRepo: GetSmtpSettingsRepo,
  ) {
    super();
  }

  @Validate(Schema)
  @ValidateOutput(ResultSchema)
  async invoke(data: SendContactEmailData): Validated<Data<typeof ResultSchema>> {
    const settings = await this.smtpSettingsRepo.getSmtpSettings();

    let smtpConfig: SmtpConfig | null = null;
    if (settings.smtpHost && settings.smtpUser && settings.smtpPassword) {
      smtpConfig = {
        host: settings.smtpHost,
        port: settings.smtpPort ?? 465,
        user: settings.smtpUser,
        pass: settings.smtpPassword,
        fromEmail: settings.smtpFromEmail ?? settings.smtpUser,
      };
    }

    const attachments =
      data.pdfBase64 && data.pdfFilename
        ? [{ filename: data.pdfFilename, content: Buffer.from(data.pdfBase64, "base64"), contentType: "application/pdf" }]
        : undefined;

    await this.emailService.send(
      {
        to: data.to,
        subject: data.subject,
        react: React.createElement(ContactEmail, {
          subject: data.subject,
          body: data.body,
          signature: data.signature ?? null,
          documentHtml: data.documentHtml ?? null,
        }),
        attachments,
      },
      smtpConfig,
    );

    await this.eventService.publish(DomainEvent.CONTACT_EMAIL_SENT, {
      entityId: data.contactId,
      payload: { to: data.to, subject: data.subject },
    });

    return { ok: true as const, data: { sent: true } };
  }
}

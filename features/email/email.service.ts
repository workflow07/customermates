import type React from "react";

import { render } from "@react-email/components";
import nodemailer from "nodemailer";

import { IS_DEVELOPMENT, SMTP_FROM_EMAIL } from "@/constants/env";

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
};

type SendArgs = {
  to: string;
  subject: string;
  react: React.ReactElement<Record<string, unknown>>;
  from?: string;
};

function createTransport(config?: SmtpConfig | null) {
  const host = config?.host ?? process.env.SMTP_HOST;
  const port = config?.port ?? Number(process.env.SMTP_PORT ?? 465);
  const user = config?.user ?? process.env.SMTP_USER;
  const pass = config?.pass ?? process.env.SMTP_PASS;

  if (!host || !user || !pass) throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASS are required");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export class EmailService {
  async send(args: SendArgs, smtpConfig?: SmtpConfig | null): Promise<void> {
    const hasSmtp = !!(
      (smtpConfig?.host ?? process.env.SMTP_HOST) &&
      (smtpConfig?.user ?? process.env.SMTP_USER) &&
      (smtpConfig?.pass ?? process.env.SMTP_PASS)
    );

    if (IS_DEVELOPMENT && !hasSmtp) {
      console.log("[EmailService] EMAIL (local only — set SMTP_HOST/SMTP_USER/SMTP_PASS to send for real)", {
        from: args.from ?? `Customermates <${smtpConfig?.fromEmail ?? SMTP_FROM_EMAIL}>`,
        to: args.to,
        subject: args.subject,
        props: args.react.props,
      });

      return;
    }

    const html = await render(args.react);
    const transport = createTransport(smtpConfig);
    const defaultSender = `Customermates <${smtpConfig?.fromEmail ?? SMTP_FROM_EMAIL}>`;

    await transport.sendMail({
      from: args.from ?? defaultSender,
      to: args.to,
      subject: args.subject,
      html,
    });
  }
}

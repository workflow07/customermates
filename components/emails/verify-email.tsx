import enMessages from "@/i18n/locales/en.json";
import { EmailButton } from "@/components/emails/base/email-button";
import { EmailLayout } from "@/components/emails/base/email-layout";
import { EmailLink } from "@/components/emails/base/email-link";
import { EmailSection } from "@/components/emails/base/email-section";
import { EmailText } from "@/components/emails/base/email-text";

type Props = {
  url: string;
  subject: string;
  intro: string;
  fallback: string;
  securityNotice: string;
};

export default function VerifyEmail({ url, subject, intro, fallback, securityNotice }: Props) {
  return (
    <EmailLayout preview={subject} title={subject}>
      <EmailText>{intro}</EmailText>

      <EmailSection>
        <EmailButton href={url}>{subject}</EmailButton>
      </EmailSection>

      <EmailText>{securityNotice}</EmailText>

      <EmailText>
        {fallback}

        <EmailLink href={url}>{url}</EmailLink>
      </EmailText>
    </EmailLayout>
  );
}

const verifyEmailTranslations = enMessages.VerifyEmail;

VerifyEmail.PreviewProps = {
  url: "https://example.com/auth/verify?token=TEST",
  subject: verifyEmailTranslations.subject,
  intro: verifyEmailTranslations.intro,
  fallback: verifyEmailTranslations.fallback,
  securityNotice: verifyEmailTranslations.securityNotice,
};

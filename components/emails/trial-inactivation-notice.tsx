import enMessages from "@/i18n/locales/en.json";
import { EmailLayout } from "@/components/emails/base/email-layout";
import { EmailText } from "@/components/emails/base/email-text";

type Props = {
  greeting: string;
  body: string;
  dismiss: string;
  signoff: string;
  subject: string;
  title: string;
};

export default function TrialInactivationNotice({ greeting, body, dismiss, signoff, subject, title }: Props) {
  return (
    <EmailLayout preview={subject} title={title}>
      <EmailText>{greeting}</EmailText>

      <EmailText>{body}</EmailText>

      <EmailText>{dismiss}</EmailText>

      <EmailText>{signoff}</EmailText>
    </EmailLayout>
  );
}

const noticeTranslations = enMessages.TrialInactivationNotice;
const previewFirstName = "Sofia";

TrialInactivationNotice.PreviewProps = {
  greeting: noticeTranslations.greeting.replace("{firstName}", previewFirstName),
  body: noticeTranslations.body,
  dismiss: noticeTranslations.dismiss,
  signoff: noticeTranslations.signoff,
  subject: noticeTranslations.subject,
  title: noticeTranslations.title,
};

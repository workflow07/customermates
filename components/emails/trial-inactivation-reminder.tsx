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

export default function TrialInactivationReminder({ greeting, body, dismiss, signoff, subject, title }: Props) {
  return (
    <EmailLayout preview={subject} title={title}>
      <EmailText>{greeting}</EmailText>

      <EmailText>{body}</EmailText>

      <EmailText>{dismiss}</EmailText>

      <EmailText>{signoff}</EmailText>
    </EmailLayout>
  );
}

const reminderTranslations = enMessages.TrialInactivationReminder;
const previewFirstName = "Sofia";

TrialInactivationReminder.PreviewProps = {
  greeting: reminderTranslations.greeting.replace("{firstName}", previewFirstName),
  body: reminderTranslations.body,
  dismiss: reminderTranslations.dismiss,
  signoff: reminderTranslations.signoff,
  subject: reminderTranslations.subject,
  title: reminderTranslations.title,
};

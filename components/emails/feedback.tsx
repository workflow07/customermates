import { EmailLayout } from "@/components/emails/base/email-layout";
import { EmailSection } from "@/components/emails/base/email-section";
import { EmailText } from "@/components/emails/base/email-text";

type Props = {
  feedback: string;
  userEmail: string;
  userName: string;
  subject: string;
};

export default function Feedback({ feedback, userEmail, userName, subject }: Props) {
  return (
    <EmailLayout preview={subject} title={subject}>
      <EmailSection>
        <EmailText>
          <strong>From:</strong>

          {` ${userName} (${userEmail})`}
        </EmailText>

        <EmailText>
          <strong>Type:</strong>

          {` ${subject}`}
        </EmailText>

        <EmailText>
          <strong>Feedback:</strong>
        </EmailText>

        <EmailText className="whitespace-pre-wrap">{feedback}</EmailText>
      </EmailSection>
    </EmailLayout>
  );
}

Feedback.PreviewProps = {
  feedback: "The CRM is working great! I found it very helpful for managing my contacts.",
  userEmail: "user@example.com",
  userName: "John Doe",
  subject: "Product Feedback",
};

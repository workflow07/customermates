import { EmailField } from "@/components/emails/base/email-field";
import { EmailLayout } from "@/components/emails/base/email-layout";

type Props = {
  feedback: string;
  userEmail: string;
  userName: string;
  subject: string;
};

export default function Feedback({ feedback, userEmail, userName, subject }: Props) {
  return (
    <EmailLayout preview={subject} title={subject}>
      <EmailField label="From">{`${userName} (${userEmail})`}</EmailField>

      <EmailField label="Type">{subject}</EmailField>

      <EmailField label="Feedback">{feedback}</EmailField>
    </EmailLayout>
  );
}

Feedback.PreviewProps = {
  feedback: "The CRM is working great! I found it very helpful for managing my contacts.",
  userEmail: "user@example.com",
  userName: "John Doe",
  subject: "Product Feedback",
};

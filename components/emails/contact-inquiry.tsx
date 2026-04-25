import { EmailField } from "@/components/emails/base/email-field";
import { EmailLayout } from "@/components/emails/base/email-layout";

type Props = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export default function ContactInquiry({ name, email, company, message }: Props) {
  const subject = "New contact inquiry";

  return (
    <EmailLayout preview={subject} title={subject}>
      <EmailField label="From">{`${name} (${email})`}</EmailField>

      {company ? <EmailField label="Company">{company}</EmailField> : null}

      <EmailField label="Message">{message}</EmailField>
    </EmailLayout>
  );
}

ContactInquiry.PreviewProps = {
  name: "Jane Doe",
  email: "jane@example.com",
  company: "Acme Inc.",
  message: "Hi, I'd like to learn more about Customermates for my agency.",
};

import { EmailField } from "@/components/emails/base/email-field";
import { EmailLayout } from "@/components/emails/base/email-layout";

type Props = {
  email: string;
  name: string;
  provider?: string;
};

export default function NewUserNotification({ email, name, provider }: Props) {
  const subject = "New user registration";

  return (
    <EmailLayout preview={subject} title={subject}>
      <EmailField label="User">{`${name} (${email})`}</EmailField>

      {provider ? <EmailField label="Provider">{provider}</EmailField> : null}
    </EmailLayout>
  );
}

NewUserNotification.PreviewProps = {
  email: "user@example.com",
  name: "John Doe",
  provider: "Google",
};

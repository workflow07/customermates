import { EmailLayout } from "@/components/emails/base/email-layout";
import { EmailText } from "@/components/emails/base/email-text";

type Props = {
  email: string;
  name: string;
  provider?: string;
};

export default function NewUserNotification({ email, name, provider }: Props) {
  return (
    <EmailLayout preview="New User Registration" title="New User Registration">
      <EmailText>A new user has registered{provider ? ` via ${provider}` : ""}:</EmailText>

      <EmailText>{`${name} (${email})`}</EmailText>
    </EmailLayout>
  );
}

NewUserNotification.PreviewProps = {
  email: "user@example.com",
  name: "John Doe",
  provider: "Google",
};

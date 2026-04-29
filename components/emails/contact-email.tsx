import { Hr } from "@react-email/components";

import { EmailLayout } from "@/components/emails/base/email-layout";

type Props = {
  subject: string;
  body: string;
  signature?: string | null;
  documentHtml?: string | null;
};

export default function ContactEmail({ subject, body, signature, documentHtml }: Props) {
  return (
    <EmailLayout preview={subject} title={subject}>
      <div dangerouslySetInnerHTML={{ __html: body }} />

      {documentHtml && (
        <div dangerouslySetInnerHTML={{ __html: documentHtml }} />
      )}

      {signature && (
        <>
          <Hr className="my-4 border-default-200" />

          <div dangerouslySetInnerHTML={{ __html: signature }} />
        </>
      )}
    </EmailLayout>
  );
}

ContactEmail.PreviewProps = {
  subject: "Following up on our conversation",
  body: "<p>Hi,</p><p>Just wanted to follow up on our last conversation.</p>",
  signature: "<p><strong>Jane Doe</strong></p><p>Sales Manager · +1 555 000 1234</p>",
};

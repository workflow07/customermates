import enMessages from "@/i18n/locales/en.json";
import { EmailLayout } from "@/components/emails/base/email-layout";
import { EmailLink } from "@/components/emails/base/email-link";
import { EmailText } from "@/components/emails/base/email-text";
const DEMO_HREF_EN = "https://calendly.com/customermates/product-demo";
const DEMO_HREF_DE = "https://calendly.com/customermates/produkt-demo";

type Props = {
  greeting: string;
  body: string;
  scheduleFallback: string;
  signoff: string;
  subject: string;
  title: string;
  href?: string;
};

export default function TrialExpiredOffer({ greeting, body, scheduleFallback, signoff, subject, title, href }: Props) {
  const resolvedHref = href ?? DEMO_HREF_EN;
  const shouldRenderFallbackLink = resolvedHref === DEMO_HREF_EN || resolvedHref === DEMO_HREF_DE;

  return (
    <EmailLayout preview={subject} title={title}>
      <EmailText>{greeting}</EmailText>

      <EmailText>{body}</EmailText>

      {shouldRenderFallbackLink ? (
        <EmailText>
          {scheduleFallback}

          <EmailLink href={resolvedHref}>{resolvedHref}</EmailLink>
        </EmailText>
      ) : null}

      <EmailText>{signoff}</EmailText>
    </EmailLayout>
  );
}

const offerTranslations = enMessages.TrialExpiredOffer;
const previewFirstName = "Sofia";

TrialExpiredOffer.PreviewProps = {
  greeting: offerTranslations.greeting.replace("{firstName}", previewFirstName),
  body: offerTranslations.body,
  scheduleFallback: offerTranslations.scheduleFallback,
  signoff: offerTranslations.signoff,
  subject: offerTranslations.subject,
  title: offerTranslations.title,
  href: DEMO_HREF_EN,
};

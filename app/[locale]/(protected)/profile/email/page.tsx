import { ProfileEmailForm } from "../components/profile-email-form";

import { getGetSmtpSettingsInteractor, getRouteGuardService } from "@/core/di";
import { PageContainer } from "@/components/shared/page-container";

export default async function ProfileEmailPage() {
  await getRouteGuardService().ensureAccessOrRedirect();

  const result = await getGetSmtpSettingsInteractor().invoke();
  const settings = result.ok ? result.data : null;

  return (
    <PageContainer>
      <ProfileEmailForm initialSettings={settings} />
    </PageContainer>
  );
}

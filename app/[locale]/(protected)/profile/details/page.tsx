import { UserDetailsForm } from "../components/user-details-form";

import { getGetUserDetailsInteractor, getRouteGuardService } from "@/core/di";
import { PageContainer } from "@/components/shared/page-container";

export default async function ProfileDetailsPage() {
  await getRouteGuardService().ensureAccessOrRedirect();

  const result = await getGetUserDetailsInteractor().invoke();

  return (
    <PageContainer>
      <UserDetailsForm userDetails={result.data} />
    </PageContainer>
  );
}

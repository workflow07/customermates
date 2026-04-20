import { Resource, TaskType } from "@/generated/prisma";

import { CompanyDetailsForm } from "../components/company-details/company-details-form";

import {
  getGetCompanyDetailsInteractor,
  getGetSubscriptionInteractor,
  getGetTaskByTypeInteractor,
  getRouteGuardService,
} from "@/core/di";
import { PageContainer } from "@/components/shared/page-container";
import { IS_CLOUD_HOSTED } from "@/constants/env";

export default async function CompanyDetailsPage() {
  await getRouteGuardService().ensureAccessOrRedirect({ resource: Resource.company });

  const [companyResult, taskResult, subscriptionResult] = await Promise.all([
    getGetCompanyDetailsInteractor().invoke(),
    getGetTaskByTypeInteractor().invoke({ type: TaskType.companyOnboarding }),
    IS_CLOUD_HOSTED ? getGetSubscriptionInteractor().invoke() : Promise.resolve({ ok: true as const, data: null }),
  ]);

  const isCompanyOnboarding = Boolean(taskResult.data);

  return (
    <PageContainer>
      <CompanyDetailsForm
        company={companyResult.data}
        initialSubscription={subscriptionResult.data}
        isCompanyOnboarding={isCompanyOnboarding}
        showSubscription={IS_CLOUD_HOSTED}
      />
    </PageContainer>
  );
}

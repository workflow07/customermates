import { redirect } from "next/navigation";
import { SubscriptionStatus } from "@/generated/prisma";
import { Resource } from "@/generated/prisma";

import { SubscriptionExpiredView } from "./components/subscription-expired-view";

import { getGetSubscriptionInteractor, getRouteGuardService } from "@/core/di";
import { PageContainer } from "@/components/shared/page-container";

export default async function SubscriptionExpiredPage() {
  await getRouteGuardService().ensureAccessOrRedirect({
    resource: Resource.company,
    skipSubscriptionCheck: true,
  });

  const subscriptionResult = await getGetSubscriptionInteractor().invoke();
  const subscription = subscriptionResult.data;

  const isExpired =
    subscription.status === SubscriptionStatus.unPaid ||
    subscription.status === SubscriptionStatus.expired ||
    (subscription.status === SubscriptionStatus.trial &&
      subscription.trialEndDate !== null &&
      subscription.trialEndDate < new Date());

  if (!isExpired) redirect("/company/details");

  return (
    <PageContainer>
      <div className="size-full flex flex-1 items-center justify-center p-4">
        <SubscriptionExpiredView />
      </div>
    </PageContainer>
  );
}

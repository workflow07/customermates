import { Resource } from "@/generated/prisma";

import { EstimatesCard } from "./components/estimates-card";

import { getGetEstimatesInteractor, getRouteGuardService } from "@/core/di";
import { PageContainer } from "@/components/shared/page-container";

export default async function EstimatesPage() {
  await getRouteGuardService().ensureAccessOrRedirect({ resource: Resource.estimates });

  const result = await getGetEstimatesInteractor().invoke();
  const estimates = result.ok ? { items: result.data.items } : { items: [] };

  return (
    <PageContainer padded={false}>
      <EstimatesCard estimates={estimates} />
    </PageContainer>
  );
}

import { Resource } from "@/generated/prisma";

import { DealsCard } from "./components/deals-card";

import { getGetDealsInteractor, getRouteGuardService } from "@/core/di";
import { decodeGetParams } from "@/core/utils/get-params";
import { XPageContainer } from "@/components/x-layout-primitives/x-page-container";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DealsPage({ searchParams }: Props) {
  await getRouteGuardService().ensureAccessOrRedirect({ resource: Resource.deals });

  const params = await searchParams;
  const dealParams = decodeGetParams(params);

  const deals = await getGetDealsInteractor().invoke({ ...dealParams, p13nId: "deals-card-store" });

  return (
    <XPageContainer>
      <DealsCard deals={deals.ok ? deals.data : { items: [] }} />
    </XPageContainer>
  );
}

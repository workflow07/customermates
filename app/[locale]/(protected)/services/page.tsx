import { Resource } from "@/generated/prisma";

import { ServicesCard } from "./components/services-card";

import { getGetServicesInteractor, getRouteGuardService } from "@/core/di";
import { decodeGetParams } from "@/core/utils/get-params";
import { XPageContainer } from "@/components/x-layout-primitives/x-page-container";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ServicesPage({ searchParams }: Props) {
  await getRouteGuardService().ensureAccessOrRedirect({ resource: Resource.services });

  const params = await searchParams;
  const serviceParams = decodeGetParams(params);

  const services = await getGetServicesInteractor().invoke({ ...serviceParams, p13nId: "services-card-store" });

  return (
    <XPageContainer>
      <ServicesCard services={services.ok ? services.data : { items: [] }} />
    </XPageContainer>
  );
}

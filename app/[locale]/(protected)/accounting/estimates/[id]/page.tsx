import { Resource } from "@/generated/prisma";

import { EstimateDetailView } from "../components/estimate-detail-view";
import { PageContainer } from "@/components/shared/page-container";

import {
  getGetEstimateByIdInteractor,
  getGetContactsInteractor,
  getGetDealsInteractor,
  getRouteGuardService,
} from "@/core/di";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EstimateDetailPage({ params }: Props) {
  await getRouteGuardService().ensureAccessOrRedirect({ resource: Resource.estimates });

  const { id } = await params;
  const isNew = id === "new";

  const [estimateResult, contactsResult, dealsResult] = await Promise.all([
    isNew ? Promise.resolve({ ok: true as const, data: null }) : getGetEstimateByIdInteractor().invoke({ id }),
    getGetContactsInteractor().invoke({ pagination: { page: 1, pageSize: 100 } }),
    getGetDealsInteractor().invoke({ pagination: { page: 1, pageSize: 100 } }),
  ]);

  const estimate = estimateResult.ok ? estimateResult.data : null;
  const contacts = contactsResult.ok ? contactsResult.data.items : [];
  const deals = dealsResult.ok ? dealsResult.data.items : [];

  return (
    <PageContainer>
      <EstimateDetailView
        contacts={contacts}
        deals={deals}
        estimate={estimate}
      />
    </PageContainer>
  );
}

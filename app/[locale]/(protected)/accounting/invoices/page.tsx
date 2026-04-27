import { Resource } from "@/generated/prisma";

import { InvoicesCard } from "./components/invoices-card";

import { getGetInvoicesInteractor, getRouteGuardService } from "@/core/di";
import { PageContainer } from "@/components/shared/page-container";

export default async function InvoicesPage() {
  await getRouteGuardService().ensureAccessOrRedirect({ resource: Resource.invoices });

  const result = await getGetInvoicesInteractor().invoke();
  const invoices = result.ok ? { items: result.data.items } : { items: [] };

  return (
    <PageContainer padded={false}>
      <InvoicesCard invoices={invoices} />
    </PageContainer>
  );
}

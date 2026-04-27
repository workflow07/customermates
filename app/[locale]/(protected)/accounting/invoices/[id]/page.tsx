import { Resource } from "@/generated/prisma";

import { InvoiceDetailView } from "../components/invoice-detail-view";
import { PageContainer } from "@/components/shared/page-container";

import {
  getGetInvoiceByIdInteractor,
  getGetContactsInteractor,
  getGetDealsInteractor,
  getRouteGuardService,
} from "@/core/di";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceDetailPage({ params }: Props) {
  await getRouteGuardService().ensureAccessOrRedirect({ resource: Resource.invoices });

  const { id } = await params;
  const isNew = id === "new";

  const [invoiceResult, contactsResult, dealsResult] = await Promise.all([
    isNew ? Promise.resolve({ ok: true as const, data: null }) : getGetInvoiceByIdInteractor().invoke({ id }),
    getGetContactsInteractor().invoke({ pagination: { page: 1, pageSize: 100 } }),
    getGetDealsInteractor().invoke({ pagination: { page: 1, pageSize: 100 } }),
  ]);

  const invoice = invoiceResult.ok ? invoiceResult.data : null;
  const contacts = contactsResult.ok ? contactsResult.data.items : [];
  const deals = dealsResult.ok ? dealsResult.data.items : [];

  return (
    <PageContainer>
      <InvoiceDetailView
        contacts={contacts}
        deals={deals}
        invoice={invoice}
      />
    </PageContainer>
  );
}

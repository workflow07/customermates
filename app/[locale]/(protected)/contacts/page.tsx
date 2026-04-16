import { Resource } from "@/generated/prisma";

import { ContactsCard } from "./components/contacts-card";

import { getGetContactsInteractor, getRouteGuardService } from "@/core/di";
import { decodeGetParams } from "@/core/utils/get-params";
import { XPageContainer } from "@/components/x-layout-primitives/x-page-container";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactsPage({ searchParams }: Props) {
  await getRouteGuardService().ensureAccessOrRedirect({ resource: Resource.contacts });

  const params = await searchParams;
  const contactParams = decodeGetParams(params);

  const contacts = await getGetContactsInteractor().invoke({ ...contactParams, p13nId: "contacts-card-store" });

  return (
    <XPageContainer>
      <ContactsCard contacts={contacts.ok ? contacts.data : { items: [] }} />
    </XPageContainer>
  );
}

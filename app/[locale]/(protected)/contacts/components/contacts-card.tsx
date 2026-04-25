"use client";

import type { ContactDto } from "@/features/contacts/contact.schema";
import type { GetResult } from "@/core/base/base-get.interactor";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { EntityType } from "@/generated/prisma";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppChipStack } from "@/components/chip/app-chip-stack";
import { DataViewContainer, standardTailColumns, useDataViewSync } from "@/components/data-view";
import { useOpenEntity } from "@/components/modal/hooks/use-entity-drawer-stack";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  contacts: GetResult<ContactDto>;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "";
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export const ContactsCard = observer(({ contacts }: Props) => {
  const { contactsStore, organizationsStore, userModalStore, dealsStore, intlStore } = useRootStore();
  const openEntity = useOpenEntity();

  useDataViewSync(contactsStore, contacts, [dealsStore, organizationsStore]);

  const columns = useMemo<ColumnDef<ContactDto>[]>(() => {
    return [
      {
        id: "name",
        cell: ({ row }) => {
          const fullName = `${row.original.firstName} ${row.original.lastName}`.trim();
          return (
            <div className="flex gap-2 items-center justify-start">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
              </Avatar>

              <span className="text-sm truncate">{fullName}</span>
            </div>
          );
        },
      },
      {
        id: "organizations",
        cell: ({ row }) => (
          <AppChipStack
            items={row.original.organizations.map((org) => ({ id: org.id, label: org.name }))}
            size="sm"
            onChipClick={(org) => openEntity(EntityType.organization, org.id)}
          />
        ),
      },
      {
        id: "deals",
        cell: ({ row }) => (
          <AppChipStack
            items={row.original.deals.map((deal) => ({ id: deal.id, label: deal.name }))}
            size="sm"
            onChipClick={(deal) => openEntity(EntityType.deal, deal.id)}
          />
        ),
      },
      ...standardTailColumns({ store: contactsStore, intlStore, userModalStore }),
    ];
  }, [contactsStore, contactsStore.customColumns, openEntity, userModalStore, intlStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={contactsStore}
      onAdd={() => openEntity(EntityType.contact, "new")}
      onRowClick={(item) => openEntity(EntityType.contact, item.id)}
    />
  );
});

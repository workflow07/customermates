"use client";

import type { GetResult } from "@/core/base/base-get.interactor";
import type { OrganizationDto } from "@/features/organizations/organization.schema";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { EntityType } from "@/generated/prisma";

import { AvatarStack } from "@/components/shared/avatar-stack";
import { AppChipStack } from "@/components/chip/app-chip-stack";
import { DataViewContainer, standardTailColumns, useDataViewSync } from "@/components/data-view";
import { useOpenEntity } from "@/components/modal/hooks/use-entity-drawer-stack";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  organizations: GetResult<OrganizationDto>;
};

export const OrganizationsCard = observer(({ organizations }: Props) => {
  const { contactsStore, organizationsStore, userModalStore, dealsStore, intlStore } = useRootStore();
  const openEntity = useOpenEntity();

  useDataViewSync(organizationsStore, organizations, [contactsStore, dealsStore]);

  const columns = useMemo<ColumnDef<OrganizationDto>[]>(() => {
    return [
      {
        id: "name",
        cell: ({ row }) => <span className="text-sm truncate">{row.original.name ?? ""}</span>,
      },
      {
        id: "contacts",
        cell: ({ row }) => (
          <AvatarStack
            items={row.original.contacts || []}
            onAvatarClick={(contact) => openEntity(EntityType.contact, contact.id)}
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
      ...standardTailColumns({ store: organizationsStore, intlStore, userModalStore }),
    ];
  }, [organizationsStore, organizationsStore.customColumns, openEntity, userModalStore, intlStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={organizationsStore}
      onAdd={() => openEntity(EntityType.organization, "new")}
      onRowClick={(item) => openEntity(EntityType.organization, item.id)}
    />
  );
});

"use client";

import type { GetResult } from "@/core/base/base-get.interactor";
import type { OrganizationDto } from "@/features/organizations/organization.schema";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { EntityType } from "@/generated/prisma";

import { AvatarStack } from "@/components/shared/avatar-stack";
import { AppChipStack } from "@/components/chip/app-chip-stack";
import { CustomFieldValue } from "@/components/data-view/custom-columns/custom-field-value";
import { DataViewContainer } from "@/components/data-view";
import { useOpenEntity } from "@/components/modal/hooks/use-entity-drawer-stack";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  organizations: GetResult<OrganizationDto>;
};

export const OrganizationsCard = observer(({ organizations }: Props) => {
  const t = useTranslations("");

  const { contactsStore, organizationsStore, userModalStore, dealsStore, intlStore } = useRootStore();
  const openEntity = useOpenEntity();

  useEffect(() => organizationsStore.setItems(organizations), [organizations]);

  useEffect(() => {
    const cleanupUrlSync = organizationsStore.withUrlSync();
    const unregisterContacts = contactsStore.registerOnChange(() => organizationsStore.refresh());
    const unregisterDeals = dealsStore.registerOnChange(() => organizationsStore.refresh());
    return () => {
      cleanupUrlSync();
      unregisterContacts();
      unregisterDeals();
    };
  }, []);

  const columns = useMemo<ColumnDef<OrganizationDto>[]>(() => {
    return [
      {
        id: "name",
        accessorKey: "name",
        header: t("Common.table.columns.name"),
        cell: ({ row }) => <span className="text-sm truncate">{row.original.name ?? ""}</span>,
      },
      {
        id: "contacts",
        header: t("Common.table.columns.contacts"),
        cell: ({ row }) => (
          <AvatarStack
            items={row.original.contacts || []}
            onAvatarClick={(contact) => openEntity(EntityType.contact, contact.id)}
          />
        ),
      },
      {
        id: "deals",
        header: t("Common.table.columns.deals"),
        cell: ({ row }) => (
          <AppChipStack
            items={row.original.deals.map((deal) => ({ id: deal.id, label: deal.name }))}
            size="sm"
            onChipClick={(deal) => openEntity(EntityType.deal, deal.id)}
          />
        ),
      },
      ...organizationsStore.customColumns.map<ColumnDef<OrganizationDto>>((column) => ({
        id: column.id,
        header: column.label,
        cell: ({ row }) => <CustomFieldValue column={column} item={row.original} store={organizationsStore} />,
      })),
      {
        id: "users",
        header: t("Common.table.columns.users"),
        cell: ({ row }) => (
          <AvatarStack
            items={row.original.users || []}
            onAvatarClick={(user) => void userModalStore.loadById(user.id)}
          />
        ),
      },
      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: t("Common.table.columns.updatedAt"),
        cell: ({ row }) => (
          <span className="text-sm">{intlStore.formatNumericalShortDateTime(row.original.updatedAt)}</span>
        ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: t("Common.table.columns.createdAt"),
        cell: ({ row }) => (
          <span className="text-sm">{intlStore.formatNumericalShortDateTime(row.original.createdAt)}</span>
        ),
      },
    ];
  }, [t, organizationsStore, organizationsStore.customColumns, openEntity, userModalStore, intlStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={organizationsStore}
      onAdd={() => openEntity(EntityType.organization, "new")}
      onRowClick={(item) => openEntity(EntityType.organization, item.id)}
    />
  );
});

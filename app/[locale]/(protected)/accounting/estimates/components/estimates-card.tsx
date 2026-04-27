"use client";

import type { GetResult } from "@/core/base/base-get.interactor";
import type { EstimateDto } from "@/features/estimates/estimate.schema";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Plus } from "lucide-react";

import { useRootStore } from "@/core/stores/root-store.provider";
import { DataViewContainer, useDataViewSync } from "@/components/data-view";
import { DocumentStatusBadge } from "@/app/[locale]/(protected)/accounting/components/document-status-badge";

type Props = {
  estimates: GetResult<EstimateDto>;
};

export const EstimatesCard = observer(({ estimates }: Props) => {
  const { estimatesStore, intlStore } = useRootStore();
  const router = useRouter();
  const t = useTranslations("Accounting");

  useDataViewSync(estimatesStore, estimates);

  const columns = useMemo<ColumnDef<EstimateDto>[]>(() => {
    return [
      {
        id: "number",
        cell: ({ row }) => (
          <span className="text-sm font-medium tabular-nums">EST-{String(row.original.number).padStart(3, "0")}</span>
        ),
      },
      {
        id: "contact",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.contact
              ? `${row.original.contact.firstName} ${row.original.contact.lastName}`
              : "—"}
          </span>
        ),
      },
      {
        id: "deal",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.deal?.name ?? "—"}</span>
        ),
      },
      {
        id: "status",
        cell: ({ row }) => <DocumentStatusBadge status={row.original.status} />,
      },
      {
        id: "grandTotal",
        cell: ({ row }) => (
          <span className="text-sm tabular-nums">{intlStore.formatCurrency(row.original.grandTotal)}</span>
        ),
      },
      {
        id: "dueDate",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.dueDate ? intlStore.formatNumericalShortDate(row.original.dueDate) : "—"}
          </span>
        ),
      },
      {
        id: "createdAt",
        cell: ({ row }) => (
          <span className="text-sm">{intlStore.formatNumericalShortDateTime(row.original.createdAt)}</span>
        ),
      },
    ];
  }, [estimatesStore, intlStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={estimatesStore}
      onAdd={() => router.push("/accounting/estimates/new")}
      onRowClick={(item) => router.push(`/accounting/estimates/${item.id}`)}
    />
  );
});

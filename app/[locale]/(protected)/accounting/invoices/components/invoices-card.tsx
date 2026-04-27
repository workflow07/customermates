"use client";

import type { GetResult } from "@/core/base/base-get.interactor";
import type { InvoiceDto } from "@/features/invoices/invoice.schema";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useRouter } from "@/i18n/navigation";

import { useRootStore } from "@/core/stores/root-store.provider";
import { DataViewContainer, useDataViewSync } from "@/components/data-view";
import { DocumentStatusBadge } from "@/app/[locale]/(protected)/accounting/components/document-status-badge";

type Props = {
  invoices: GetResult<InvoiceDto>;
};

export const InvoicesCard = observer(({ invoices }: Props) => {
  const { invoicesStore, intlStore } = useRootStore();
  const router = useRouter();

  useDataViewSync(invoicesStore, invoices);

  const columns = useMemo<ColumnDef<InvoiceDto>[]>(() => {
    return [
      {
        id: "number",
        cell: ({ row }) => (
          <span className="text-sm font-medium tabular-nums">INV-{String(row.original.number).padStart(3, "0")}</span>
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
  }, [invoicesStore, intlStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={invoicesStore}
      onAdd={() => router.push("/accounting/invoices/new")}
      onRowClick={(item) => router.push(`/accounting/invoices/${item.id}`)}
    />
  );
});

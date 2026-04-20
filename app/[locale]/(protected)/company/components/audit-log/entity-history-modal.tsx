"use client";

import type { AuditLogDto } from "@/ee/audit-log/get/get-audit-logs-by-entity-id.interactor";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { processChanges } from "./entity-history-details.utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppModal } from "@/components/modal";
import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppCardHeader } from "@/components/card/app-card-header";
import { AppChip } from "@/components/chip/app-chip";
import { useRootStore } from "@/core/stores/root-store.provider";

type TableColumnDef = { key: "user" | "event" | "changesCount" | "timestamp"; label: string };

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export const EntityHistoryModal = observer(() => {
  const t = useTranslations("");
  const { entityHistoryModalStore: store, entityHistoryDetailsModalStore, intlStore } = useRootStore();
  const customColumnsById = new Map(store.customColumns.map((c) => [c.id, c]));
  const columns: TableColumnDef[] = [
    { key: "user", label: t("Common.table.columns.user") },
    { key: "event", label: t("Common.table.columns.event") },
    { key: "changesCount", label: t("AuditLogModal.changes") },
    { key: "timestamp", label: t("AuditLogModal.createdAt") },
  ];

  function renderTableCell(item: AuditLogDto, columnKey: TableColumnDef["key"]) {
    switch (columnKey) {
      case "user":
        return (
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="shrink-0" size="sm">
              {item.user.avatarUrl && (
                <AvatarImage alt={`${item.user.firstName} ${item.user.lastName}`.trim()} src={item.user.avatarUrl} />
              )}

              <AvatarFallback>{getInitials(item.user.firstName, item.user.lastName)}</AvatarFallback>
            </Avatar>

            <div className="max-w-full overflow-hidden">
              <span className="block truncate text-x-sm">{`${item.user.firstName} ${item.user.lastName}`.trim()}</span>

              <span className="block truncate text-xs text-subdued">{item.user.email}</span>
            </div>
          </div>
        );
      case "event":
        return <AppChip>{t(`Common.events.${item.event}`)}</AppChip>;
      case "changesCount":
        return <span className="block truncate">{processChanges(item, customColumnsById, t).length}</span>;
      case "timestamp":
        return <span className="block truncate">{intlStore.formatNumericalShortDateTime(item.createdAt)}</span>;
    }
  }

  return (
    <AppModal size="xl" store={store} title={t("AuditLogModal.titleHistory")}>
      <AppCard>
        <AppCardHeader>
          <h2 className="text-x-lg grow">{t("AuditLogModal.titleHistory")}</h2>
        </AppCardHeader>

        <AppCardBody className="p-3">
          {store.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : store.items.length === 0 ? (
            <p className="text-subdued py-8 text-center text-x-sm">{t("AuditLogModal.emptyHistory")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key} className="text-subdued">
                      {column.label.toUpperCase()}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {store.items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted dark:hover:bg-muted/40 cursor-pointer"
                    onClick={() => entityHistoryDetailsModalStore.openWithData(item, store.customColumns)}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key} data-column-uid={column.key}>
                        <div className="max-w-full overflow-hidden">{renderTableCell(item, column.key)}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </AppCardBody>
      </AppCard>
    </AppModal>
  );
});

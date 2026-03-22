import type { Selection, SortDescriptor } from "@heroui/table";
import type { HasId } from "@/core/base/base-data-view.store";

import { useTranslations } from "next-intl";
import { observer } from "mobx-react-lite";
import { useCallback, useRef } from "react";
import { Table, TableBody, TableHeader, TableRow } from "@heroui/table";
import { cn } from "@heroui/theme";

import type { Prisma } from "@/generated/prisma";

import { XCardBody } from "../../x-card/x-card-body";
import { useXDataView } from "../x-data-view-container";

import { useTableResize } from "./hooks/use-table-resize";
import { useRenderTableColumn } from "./hooks/use-render-table-column";
import { useRenderTableCell } from "./hooks/use-render-table-cell";
import { useStickyHeader } from "./hooks/use-sticky-header";

type Props<E extends HasId> = {
  renderCell: (item: E, columnKey: React.Key) => string | number | React.JSX.Element;
  onRowAction?: (item: E) => void;
};

export const XTableView = observer(<E extends HasId>({ renderCell, onRowAction }: Props<E>) => {
  const store = useXDataView<E>();
  const t = useTranslations("Common");
  const effectiveHeaderColumns = store.headerColumns ?? [];

  const tableRef = useRef<HTMLDivElement>(null);

  const { handleResizeStart, getEffectiveColumnWidth, resizingColumn } = useTableResize({ store, tableRef });

  const { isSticky } = useStickyHeader({ resizingColumn, tableRef });

  const renderTableColumn = useRenderTableColumn({
    resizingColumn,
    handleResizeStart,
    getEffectiveColumnWidth,
    translate: t,
  });

  const renderTableCell = useRenderTableCell<E>({
    getEffectiveColumnWidth,
    renderCell,
  });

  const sortDescriptor = store.sortDescriptor
    ? ({
        column: store.sortDescriptor.field,
        direction: store.sortDescriptor.direction === "desc" ? "descending" : "ascending",
      } as SortDescriptor)
    : undefined;

  const enableSelection = Boolean(store.entityType && store.canManage);

  const onSelectionChange = useCallback(
    (keys: Selection) => {
      if (keys === "all") store.setSelectedIds("all");
      else store.setSelectedIds(new Set(Array.from(keys).map(String)));
    },
    [store],
  );

  function onSortChange(sortDescriptor: SortDescriptor) {
    const newSortDescriptor = sortDescriptor.column
      ? {
          field: String(sortDescriptor.column),
          direction: (sortDescriptor.direction === "descending" ? "desc" : "asc") as Prisma.SortOrder,
        }
      : undefined;

    store.setQueryOptions({
      sortDescriptor: newSortDescriptor,
    });
  }

  return (
    <XCardBody className="p-3">
      <Table
        key={`x-table-${resizingColumn ?? "no-resizing"}`}
        ref={tableRef}
        removeWrapper
        classNames={{
          base: "contents",
          th: "bg-transparent",
          tbody: "[&>tr:hover>td]:bg-content2 dark:[&>tr:hover>td]:bg-content4",
          td: "group-data-[first=true]/tr:first:before:rounded-none group-data-[first=true]/tr:last:before:rounded-none group-data-[middle=true]/tr:before:rounded-none group-data-[last=true]/tr:first:before:rounded-none group-data-[last=true]/tr:last:before:rounded-none data-[selected=true]:before:bg-primary/10 data-[selected=true]:text-foreground",
          thead: cn({
            "sticky z-30 [&>:first-child]:shadow-small [&>:first-child]:bg-content1/80 *:first:backdrop-blur-lg *:first:transition-all *:first:duration-300":
              isSticky,
          }),
        }}
        selectedKeys={enableSelection ? new Set(store.selectedIds) : undefined}
        selectionMode={enableSelection ? "multiple" : "none"}
        sortDescriptor={sortDescriptor}
        onRowAction={
          onRowAction
            ? (key) => {
                const item = store.items.find((item) => item.id === key);
                if (item) onRowAction(item);
              }
            : undefined
        }
        onSelectionChange={enableSelection ? onSelectionChange : undefined}
        onSortChange={onSortChange}
      >
        <TableHeader columns={effectiveHeaderColumns}>{renderTableColumn}</TableHeader>

        <TableBody emptyContent={t("table.emptyContent")} items={store.items}>
          {(item) => <TableRow key={item.id}>{(columnKey) => renderTableCell(item, columnKey)}</TableRow>}
        </TableBody>
      </Table>
    </XCardBody>
  );
});

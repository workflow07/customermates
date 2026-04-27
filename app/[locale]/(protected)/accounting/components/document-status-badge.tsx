"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Status = "draft" | "sent" | "paid" | "overdue";

const statusStyles: Record<Status, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function DocumentStatusBadge({ status }: { status: Status }) {
  const t = useTranslations("Accounting.statuses");
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", statusStyles[status])}>
      {t(status)}
    </span>
  );
}

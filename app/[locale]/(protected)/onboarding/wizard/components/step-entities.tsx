"use client";

import { useTranslations } from "next-intl";
import { Contact, Building2, Handshake, Package, ListTodo } from "lucide-react";

const ENTITIES = [
  { key: "contact", icon: Contact, tint: "bg-sky-500/10 text-sky-500 dark:bg-sky-400/10 dark:text-sky-400" },
  {
    key: "organization",
    icon: Building2,
    tint: "bg-violet-500/10 text-violet-500 dark:bg-violet-400/10 dark:text-violet-400",
  },
  {
    key: "deal",
    icon: Handshake,
    tint: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400",
  },
  { key: "service", icon: Package, tint: "bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400" },
  { key: "task", icon: ListTodo, tint: "bg-rose-500/10 text-rose-500 dark:bg-rose-400/10 dark:text-rose-400" },
] as const;

export function StepEntities() {
  const t = useTranslations("OnboardingWizard.entities");

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">{t("intro")}</p>

      {ENTITIES.map(({ key, icon: Icon, tint }) => (
        <div key={key} className="flex gap-3 rounded-lg border bg-card p-3">
          <div className={`flex-shrink-0 size-9 rounded-md flex items-center justify-center ${tint}`}>
            <Icon className="size-4" />
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <div className="text-sm font-medium">{t(`${key}.title`)}</div>

            <div className="text-xs text-muted-foreground">{t(`${key}.purpose`)}</div>

            <div className="text-xs italic text-muted-foreground">{t(`${key}.example`)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

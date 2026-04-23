"use client";

import type { DateDisplayFormat } from "@/constants/date-format";

import { observer } from "mobx-react-lite";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "./form-label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRootStore } from "@/core/stores/root-store.provider";

import { useAppForm } from "./form-context";

type Props = {
  id: string;
  label?: string | null;
  placeholder?: string;
  required?: boolean;
  displayFormat?: DateDisplayFormat;
  dateOnly?: boolean;
  className?: string;
  containerClassName?: string;
};

export const FormIsoDatePicker = observer(
  ({
    id,
    label,
    placeholder = "Pick a date",
    required,
    displayFormat = "descriptiveLong",
    dateOnly = true,
    className,
    containerClassName,
  }: Props) => {
    const t = useTranslations("Common.inputs");
    const store = useAppForm();
    const { intlStore } = useRootStore();

    const raw = store?.getValue(id);
    const isoValue = typeof raw === "string" ? raw : undefined;
    const parsed = parseIso(isoValue);
    const errors = store?.getError(id);
    const hasError = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);

    const resolvedLabel = label === null ? undefined : (label ?? safeTranslate(t, id));

    const formatter = dateOnly ? intlStore.dateFormatMap[displayFormat] : intlStore.dateTimeFormatMap[displayFormat];

    function commit(date: Date | undefined) {
      if (!date) {
        store?.onChange(id, undefined);
        return;
      }
      store?.onChange(id, toIso(date, dateOnly));
    }

    function handleSelect(next: Date | undefined) {
      if (!next) {
        commit(undefined);
        return;
      }

      if (!dateOnly && parsed) next.setHours(parsed.getHours(), parsed.getMinutes(), 0, 0);

      commit(next);
    }

    function handleTimeChange(value: string) {
      const [hh, mm] = value.split(":");
      const hours = Number(hh);
      const minutes = Number(mm);
      if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;
      const base = parsed ?? new Date();
      const next = new Date(base);
      next.setHours(hours, minutes, 0, 0);
      commit(next);
    }

    const timeValue = parsed
      ? `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`
      : "";

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {resolvedLabel && (
          <FormLabel htmlFor={id}>
            {resolvedLabel}

            {required ? <span className="text-destructive"> *</span> : null}
          </FormLabel>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              aria-invalid={hasError}
              className={cn(
                "w-full justify-start text-left font-normal",
                !parsed && "text-muted-foreground",
                className,
              )}
              disabled={store?.isDisabled}
              id={id}
              type="button"
              variant="outline"
            >
              <CalendarIcon className="mr-2 size-4" />

              {parsed ? formatter(parsed) : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-auto p-0">
            <Calendar autoFocus disabled={store?.isDisabled} mode="single" selected={parsed} onSelect={handleSelect} />

            {!dateOnly && (
              <div className="flex items-center gap-2 border-t border-border p-3">
                <span className="text-xs text-muted-foreground">Time</span>

                <Input
                  className="h-8 w-32"
                  disabled={store?.isDisabled}
                  type="time"
                  value={timeValue}
                  onChange={(e) => handleTimeChange(e.target.value)}
                />
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

function parseIso(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toIso(date: Date, dateOnly: boolean): string {
  if (dateOnly) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}T00:00:00Z`;
  }
  return date.toISOString();
}

function safeTranslate(t: (k: string) => string, key: string): string {
  try {
    return t(key);
  } catch {
    return key;
  }
}

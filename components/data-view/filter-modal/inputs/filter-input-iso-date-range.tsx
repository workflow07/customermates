"use client";

import type { DateRange } from "react-day-picker";

import { observer } from "mobx-react-lite";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { useAppForm } from "@/components/forms/form-context";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  isValidFilter: boolean;
  granularity?: "day" | "minute";
};

/**
 * Reads/writes a `[startIso, endIso]` tuple of ISO strings from the enclosing
 * `AppForm` store. Day granularity: `YYYY-MM-DDT00:00:00Z`. Minute: `…THH:mm:00Z`.
 */
export const FilterInputIsoDateRange = observer(({ id, isValidFilter, granularity = "day" }: Props) => {
  const store = useAppForm();
  const raw = store?.getValue(id);
  const tuple = Array.isArray(raw) ? (raw as Array<string | undefined>) : undefined;

  const startDate = parseIso(tuple?.[0]);
  const endDate = parseIso(tuple?.[1]);

  const selected: DateRange | undefined = startDate ? { from: startDate, to: endDate } : undefined;

  function handleSelect(range: DateRange | undefined) {
    if (!range?.from || !range?.to) {
      if (!range?.from) {
        store?.onChange(id, undefined);
        return;
      }
      // partial selection; wait for both endpoints
      return;
    }
    store?.onChange(id, [toIso(range.from, granularity), toIso(range.to, granularity)]);
  }

  const dateFormat = granularity === "minute" ? "PPp" : "PPP";
  const hasBoth = startDate && endDate;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "size-full justify-start text-left font-normal",
            !hasBoth && "text-muted-foreground",
            isValidFilter ? "border-primary bg-primary/10" : "border-input",
          )}
          disabled={store?.isDisabled}
          id={id}
          type="button"
          variant="outline"
        >
          <CalendarIcon className="mr-2 size-4" />

          {hasBoth ? (
            <span className="truncate">{`${format(startDate, dateFormat)} – ${format(endDate, dateFormat)}`}</span>
          ) : (
            <span />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          autoFocus
          disabled={store?.isDisabled}
          mode="range"
          numberOfMonths={2}
          selected={selected}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
});

function parseIso(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toIso(date: Date, granularity: "day" | "minute"): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  if (granularity === "day") return `${y}-${m}-${d}T00:00:00Z`;

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:00Z`;
}

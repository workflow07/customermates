"use client";

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
 * Reads/writes an ISO string from the enclosing `AppForm` store.
 * Day granularity: `YYYY-MM-DDT00:00:00Z`. Minute granularity: `YYYY-MM-DDTHH:mm:00Z`.
 */
export const FilterInputIsoDate = observer(({ id, isValidFilter, granularity = "day" }: Props) => {
  const store = useAppForm();
  const raw = store?.getValue(id);
  const isoValue = typeof raw === "string" ? raw : undefined;
  const parsed = parseIso(isoValue);

  function handleSelect(next: Date | undefined) {
    if (!next) {
      store?.onChange(id, undefined);
      return;
    }
    store?.onChange(id, toIso(next, granularity));
  }

  const dateFormat = granularity === "minute" ? "PPp" : "PPP";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "size-full justify-start text-left font-normal",
            !parsed && "text-muted-foreground",
            isValidFilter ? "border-primary bg-primary/10" : "border-input",
          )}
          disabled={store?.isDisabled}
          id={id}
          type="button"
          variant="outline"
        >
          <CalendarIcon className="mr-2 size-4" />

          {parsed ? format(parsed, dateFormat) : <span />}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar autoFocus disabled={store?.isDisabled} mode="single" selected={parsed} onSelect={handleSelect} />
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

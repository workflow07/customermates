"use client";

import type { ReactNode } from "react";
import type { ChipColor } from "@/constants/chip-colors";

import { observer } from "mobx-react-lite";

import { AppChip } from "@/components/chip/app-chip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabel } from "./form-label";
import { cn } from "@/lib/utils";

import { useAppForm } from "./form-context";

export type FormSelectItem = {
  value: string;
  label: string;
  disabled?: boolean;
  color?: ChipColor;
};

type Props = {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  items?: FormSelectItem[];
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
};

export const FormSelect = observer(
  ({ id, label, placeholder, required, items, children, className, containerClassName }: Props) => {
    const store = useAppForm();
    const raw = store?.getValue(id);
    const value = raw == null ? "" : String(raw);
    const errors = store?.getError(id);
    const hasError = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
    const selectedItem = items?.find((it) => it.value === value);

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <FormLabel htmlFor={id}>
            {label}

            {required ? <span className="text-destructive"> *</span> : null}
          </FormLabel>
        )}

        <Select
          disabled={store?.isDisabled}
          value={value || undefined}
          onValueChange={(next) => store?.onChange(id, next)}
        >
          <SelectTrigger aria-invalid={hasError} className={cn("w-full", className)} id={id}>
            <SelectValue placeholder={placeholder ?? " "}>
              {selectedItem?.color ? (
                <AppChip variant={selectedItem.color}>{selectedItem.label}</AppChip>
              ) : (
                selectedItem?.label
              )}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {items?.map((item) => (
              <SelectItem key={item.value} disabled={item.disabled} textValue={item.label} value={item.value}>
                {item.color ? <AppChip variant={item.color}>{item.label}</AppChip> : item.label}
              </SelectItem>
            ))}

            {children}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

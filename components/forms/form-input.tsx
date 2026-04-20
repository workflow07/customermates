"use client";

import type { ComponentProps, ReactNode } from "react";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { FormLabel } from "./form-label";
import { cn } from "@/lib/utils";

import { useAppForm } from "./form-context";

type Props = Omit<ComponentProps<"input">, "value" | "onChange" | "id"> & {
  id: string;
  label?: string | null;
  description?: ReactNode;
  required?: boolean;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  endContent?: ReactNode;
};

export const FormInput = observer(
  ({ id, label, description, required, className, containerClassName, disabled, endContent, ...props }: Props) => {
    const store = useAppForm();
    const t = useTranslations("Common.inputs");
    const resolvedLabel = label === null ? undefined : (label ?? t(id));
    const value = (store?.getValue(id) as string | number | undefined) ?? "";
    const errors = store?.getError(id);
    const hasError = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
    const isDisabled = disabled ?? store?.isDisabled;

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {resolvedLabel && (
          <FormLabel htmlFor={id}>
            {resolvedLabel}

            {required ? <span className="text-destructive"> *</span> : null}
          </FormLabel>
        )}

        <div className="relative">
          <Input
            aria-invalid={hasError}
            className={cn(endContent && "pr-10", className)}
            disabled={isDisabled}
            id={id}
            required={required}
            value={value}
            onChange={(event) => store?.onChange(id, event.target.value)}
            {...props}
          />

          {endContent && (
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">{endContent}</div>
          )}
        </div>

        {description && !hasError && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    );
  },
);

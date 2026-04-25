"use client";

import type { ComponentProps } from "react";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { Textarea } from "@/components/ui/textarea";
import { FormLabel } from "./form-label";
import { cn } from "@/lib/utils";

import { useAppForm } from "./form-context";

type Props = Omit<ComponentProps<"textarea">, "value" | "onChange" | "id" | "disabled" | "readOnly"> & {
  id: string;
  label?: string | null;
  required?: boolean;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export const FormTextarea = observer(
  ({ id, label, required, className, containerClassName, disabled, readOnly, ...props }: Props) => {
    const store = useAppForm();
    const t = useTranslations("Common.inputs");
    const resolvedLabel = label === null ? undefined : (label ?? t(id));
    const value = (store?.getValue(id) as string | undefined) ?? "";
    const errors = store?.getError(id);
    const hasError = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
    const isDisabled = disabled ?? store?.isLoading;
    const isReadOnly = readOnly ?? store?.isReadOnly;

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {resolvedLabel && (
          <FormLabel htmlFor={id}>
            {resolvedLabel}

            {required ? <span className="text-destructive"> *</span> : null}
          </FormLabel>
        )}

        <Textarea
          aria-invalid={hasError}
          className={className}
          disabled={isDisabled}
          id={id}
          readOnly={isReadOnly}
          required={required}
          value={value}
          onChange={(event) => store?.onChange(id, event.target.value)}
          {...props}
        />
      </div>
    );
  },
);

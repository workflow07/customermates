"use client";

import type { KeyboardEvent } from "react";
import type { InputProps } from "@heroui/input";
import type { ChipColor } from "@/constants/chip-colors";
import type { z } from "zod";

import { useState } from "react";
import { cn } from "@heroui/theme";
import { observer } from "mobx-react-lite";

import { XChip } from "../x-chip/x-chip";

import { XInput } from "./x-input";
import { useXForm } from "./x-form";

import { useZodErrorMap } from "@/core/validation/zod-error-map-client";

export type Props = InputProps & {
  id: string;
  chipColor?: ChipColor;
  allowMultiple?: boolean;
  renderChip?: (value: string) => React.ReactNode;
  schema: z.ZodType<string>;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
};

export const XInputChips = observer(
  ({ id, label, schema, chipColor, allowMultiple, renderChip, value, onValueChange, ...props }: Props) => {
    const { isReady: zodErrorMapReady } = useZodErrorMap();
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [shouldShowValidation, setShouldShowValidation] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const store = useXForm();
    const errorMessage = store?.getError(id);
    const controlledValue = value;
    const storeValue = (store?.getValue(id) ?? undefined) as string | undefined;
    const fieldValue = controlledValue ?? storeValue;
    const isDisabled = store?.isDisabled;

    let chipValues: string[] = [];
    if (fieldValue != null && fieldValue !== "") {
      try {
        chipValues = fieldValue.split(",");
      } catch {
        chipValues = [];
      }
    }

    const invalidFormat = shouldShowValidation && Boolean(inputValue) && validationError !== null;
    const isInvalid = invalidFormat || Boolean(errorMessage);

    const defaultProps: InputProps & { id: string } = {
      id,
      isDisabled,
      isInvalid,
      errorMessage: (
        <ul>
          {[invalidFormat && validationError, errorMessage].flat().map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      ),
      label: label === null ? undefined : label,
      onValueChange: (next) => {
        setInputValue(next.trim());
        if (zodErrorMapReady && next.trim()) {
          const res = schema.safeParse(next.trim());
          setValidationError(res.success ? null : (res.error?.issues[0]?.message ?? null));
        }
      },
      ...props,
    };

    function onChange(next: string[]) {
      const nextValue = allowMultiple ? next.join(",") : next[next.length - 1];
      if (onValueChange) onValueChange(nextValue);
      else store?.onChange(id, nextValue);
      setInputValue("");
      setShouldShowValidation(false);
    }

    function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      const key = event.key;

      if (key === "Enter" || key === ",") {
        validateAndAppendInput();
        event.preventDefault();
      }

      if (key === "Backspace" && inputValue === "") {
        onChange(chipValues.slice(0, -1));
        event.preventDefault();
      }
    }

    function validateAndAppendInput() {
      if (!Boolean(inputValue)) return;

      setShouldShowValidation(true);

      if (zodErrorMapReady) {
        const res = schema.safeParse(inputValue);
        if (res.success && !chipValues.includes(inputValue)) {
          onChange([...chipValues, inputValue]);
          setValidationError(null);
        } else if (res.error) setValidationError(res.error.issues[0]?.message ?? null);
      }
    }

    return (
      <XInput
        {...defaultProps}
        classNames={{
          label: cn("relative translate-y-0!", defaultProps.classNames?.label),
          input: cn(
            "w-inherit pl-0!",
            { "sr-only": !isFocused && chipValues.length > 0 && !inputValue },
            defaultProps.classNames?.input,
          ),
          inputWrapper: cn("h-auto", defaultProps.classNames?.inputWrapper),
          innerWrapper: cn("flex! flex-wrap! gap-1! items-center!", defaultProps.classNames?.innerWrapper),
        }}
        startContent={
          chipValues.length > 0 &&
          chipValues
            .filter((item) => item.trim() !== "")
            .map((item) =>
              renderChip ? (
                <div key={item}>{renderChip(item)}</div>
              ) : (
                <XChip key={item} color={chipColor}>
                  {item}
                </XChip>
              ),
            )
        }
        value={inputValue}
        onBlur={validateAndAppendInput}
        onFocusChange={setIsFocused}
        onKeyDown={onKeyDown}
      />
    );
  },
);

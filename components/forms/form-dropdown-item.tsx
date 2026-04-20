"use client";

import type { ComponentProps } from "react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Props = ComponentProps<typeof DropdownMenuItem>;

export function FormDropdownItem(props: Props) {
  return <DropdownMenuItem {...props} />;
}

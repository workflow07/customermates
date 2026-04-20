"use client";

import { Check, Minus, X } from "lucide-react";

import { Icon } from "@/components/shared/icon";

type Props = {
  label: string;
  status: "available" | "partial" | "unavailable";
};

export function StatusIcon({ label, status }: Props) {
  if (status === "available")
    return <Icon aria-label={label} className="inline-block align-middle text-primary" icon={Check} size="sm" />;

  if (status === "partial") {
    return (
      <Icon aria-label={label} className="inline-block align-middle text-muted-foreground" icon={Minus} size="sm" />
    );
  }

  return <Icon aria-label={label} className="inline-block align-middle text-muted-foreground" icon={X} size="sm" />;
}

export function StatusAvailable() {
  return <StatusIcon label="Available" status="available" />;
}

export function StatusPartial() {
  return <StatusIcon label="Partial" status="partial" />;
}

export function StatusUnavailable() {
  return <StatusIcon label="Unavailable" status="unavailable" />;
}

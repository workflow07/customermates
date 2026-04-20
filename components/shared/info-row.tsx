import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export function InfoRow({ label, children }: Props) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>

      <span className="block truncate font-medium text-xs">{children}</span>
    </div>
  );
}

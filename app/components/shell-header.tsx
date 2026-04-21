"use client";

import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type Props = {
  children?: ReactNode;
  actions?: ReactNode;
};

export function ShellHeader({ children, actions }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background md:rounded-t-xl">
      <div className="flex flex-1 min-w-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />

        {children && (
          <>
            <Separator className="mr-2 bg-border data-[orientation=vertical]:h-4" orientation="vertical" />

            {children}
          </>
        )}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2 px-4">{actions}</div>}
    </header>
  );
}

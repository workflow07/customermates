"use client";

import { Menu as Bars3Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  desktopWidthClassName?: string;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onMobileOpen: () => void;
};

export function SidebarFrame({
  children,
  desktopWidthClassName = "md:w-64",
  isMobileOpen,
  onMobileClose,
  onMobileOpen,
}: Props) {
  return (
    <>
      <Button
        className={cn("md:hidden fixed top-3 left-3 z-50 bg-background", isMobileOpen ? "hidden" : "")}
        size="icon-sm"
        variant="outline"
        onClick={onMobileOpen}
      >
        <Icon icon={Bars3Icon} />
      </Button>

      {isMobileOpen ? (
        <button className="fixed inset-0 bg-black/50 z-40 md:hidden" type="button" onClick={onMobileClose} />
      ) : null}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-60 min-h-0 overflow-hidden flex flex-col z-50 gap-0.5 py-3 bg-background transform transition-transform duration-200 ease-out md:relative md:z-40 md:self-stretch md:h-full md:shrink-0 md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          desktopWidthClassName,
        )}
      >
        {children}
      </aside>
    </>
  );
}

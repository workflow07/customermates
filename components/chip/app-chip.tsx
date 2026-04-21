import type { ComponentProps, ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const chipVariants = cva("", {
  variants: {
    size: {
      sm: "px-1.5 py-0.5 text-[11px] h-[22px] [&>svg]:size-3",
      md: "px-2 py-0.5 text-xs h-[26px] [&>svg]:size-3.5",
      lg: "px-2.5 py-0.5 text-sm h-[30px] [&>svg]:size-4",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

type Props = Omit<ComponentProps<typeof Badge>, "children"> & {
  children: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
} & VariantProps<typeof chipVariants>;

export function AppChip({
  children,
  className,
  variant = "secondary",
  size = "sm",
  startContent,
  endContent,
  ...props
}: Props) {
  return (
    <Badge
      className={cn("rounded-md truncate max-w-full min-w-0 w-auto", chipVariants({ size }), className)}
      variant={variant}
      {...props}
    >
      {startContent}

      <span className="truncate">{children}</span>

      {endContent}
    </Badge>
  );
}

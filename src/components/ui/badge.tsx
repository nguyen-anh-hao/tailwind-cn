import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Box } from "./core/layout";

const badgeVariants = cva(
  "inline-flex items-center rounded-(--radius-sm) font-medium transition-colors duration-(--duration-theme) ease-main border",
  {
    variants: {
      variant: {
        default: "bg-brand/10 text-brand border-brand/20",
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        danger: "bg-red-100 text-red-800 border-red-200",
        outline: "border-border bg-transparent text-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] tracking-widest uppercase",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <Box 
      as="span"
      className={cn(badgeVariants({ variant, size }), className)} 
      style={{ borderStyle: 'solid' }}
      {...props} 
    />
  );
}

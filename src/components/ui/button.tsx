import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "./core/icon";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-bold transition-all duration-(--duration-theme) ease-main",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
    "rounded-(--radius-md) shadow-main",
    "hover:[transform:var(--hover-transform)] active:[transform:var(--active-transform)] hover:shadow-[var(--hover-shadow-extra)]",
  ],
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground hover:opacity-90",
        secondary: "bg-muted text-foreground border-border",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "bg-transparent text-brand border-brand hover:bg-brand/10",
        ghost: "border-transparent text-foreground hover:bg-brand/5 shadow-none",
        link: "text-brand border-transparent shadow-none hover:underline p-0",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-5 text-base",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({ className, variant, size, isLoading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading || disabled}
      style={{
        borderWidth: "var(--border-width-default)",
        borderStyle: "solid",
        ...props.style,
      }}
      {...props}
    >
      {isLoading && <Icon name="Loader2" size="sm" className="animate-spin" />}
      {children}
    </button>
  );
}
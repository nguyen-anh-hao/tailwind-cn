import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "./core/icon";
import { Box, Text } from "./core/layout";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-(--radius-md) p-4 transition-all duration-(--duration-theme) ease-main",
  {
    variants: {
      variant: {
        info: "border-blue-500/30 bg-blue-500/10",
        success: "border-emerald-500/30 bg-emerald-500/10",
        warning: "border-amber-500/30 bg-amber-500/10",
        error: "border-red-500/30 bg-red-500/10",
      },
      hasIcon: {
        true: "pl-12",
        false: "",
      },
    },
    defaultVariants: {
      variant: "info",
      hasIcon: false,
    },
  }
);

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const accentMap: Record<string, string> = {
  info: "text-blue-500",
  success: "text-emerald-500",
  warning: "text-amber-500",
  error: "text-red-500",
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

export function Alert({
  className,
  variant = "info",
  hasIcon,
  title,
  children,
  ...props
}: AlertProps) {
  const IconComponent = iconMap[variant || "info"];
  const accent = accentMap[variant || "info"];

  return (
    <Box
      className={cn(alertVariants({ variant, hasIcon }), className)}
      role="alert"
      style={{ borderWidth: "var(--border-width-default)", borderStyle: "solid" }}
      {...props}
    >
      {hasIcon && (
        <Icon
          icon={IconComponent}
          className={cn("absolute left-4 top-4", accent)}
          size="md"
        />
      )}
      {title && <Text as="h5" className={cn("mb-1 font-bold leading-none tracking-tight", accent)}>{title}</Text>}
      <Box className="text-sm opacity-80">{children}</Box>
    </Box>
  );
}

import * as React from "react";
import * as Icons from "lucide-react";
import { cn } from "../../../lib/utils";

/**
 * ICON PRIMITIVE
 * Centralizes asset management and enforces theme-specific stroke weights.
 */

export type IconName = keyof typeof Icons;

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: IconName;
  icon?: React.ElementType;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export function Icon({ name, icon, size = "md", className, isLoading, ...props }: IconProps) {
  const LucideIcon = icon || (name ? (Icons as any)[name] : null);

  const sizeMap = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  if (isLoading) {
    return (
      <div 
        className={cn(
          "animate-pulse-slow bg-muted rounded-(--radius-sm) shrink-0", 
          sizeMap[size], 
          className
        )} 
        {...props}
      />
    );
  }

  if (!LucideIcon) {
    if (name) console.error(`Icon "${name}" not found.`);
    return null;
  }

  return (
    <LucideIcon
      className={cn(
        sizeMap[size],
        "shrink-0 transition-all",
        className
      )}
      // Enforce design token for stroke weight
      strokeWidth="var(--icon-stroke)"
      {...props}
    />
  );
}

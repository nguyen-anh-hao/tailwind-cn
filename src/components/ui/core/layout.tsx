import * as React from "react";
import { cn } from "../../../lib/utils";

/**
 * LAYOUT PRIMITIVES
 * These components replace raw HTML divs to ensure token consistency.
 */

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  p?: "sm" | "md" | "lg" | "xl" | number;
  m?: "sm" | "md" | "lg" | "xl" | number;
  padding?: number; // Alias or specific value for Figma Auto Layout
  margin?: number;  // Alias for manual spacing
  as?: React.ElementType;
  isLoading?: boolean;
}

/**
 * Generic container component for spacing and layout.
 */
export function Box({ p, m, padding, margin, className, as: Component = "div", isLoading, ...props }: BoxProps) {
  const paddingMap: any = { sm: "p-2", md: "p-4", lg: "p-8", xl: "p-12" };
  const marginMap: any = { sm: "m-2", md: "m-4", lg: "m-8", xl: "m-12" };

  return (
    <Component
      className={cn(
        "transition-all duration-(--duration-theme) ease-main",
        isLoading && "animate-pulse-slow pointer-events-none select-none",
        typeof p === "string" ? paddingMap[p] : "",
        typeof m === "string" ? marginMap[m] : "",
        className
      )}
      style={{
        padding: padding !== undefined ? `calc(${padding} * var(--spacing-base))` : (typeof p === "number" ? `calc(${p} * var(--spacing-base))` : undefined),
        margin: margin !== undefined ? `calc(${margin} * var(--spacing-base))` : (typeof m === "number" ? `calc(${m} * var(--spacing-base))` : undefined),
        ...props.style
      }}
      {...props}
    >
      {props.children}
    </Component>
  );
}

interface StackProps extends BoxProps {
  direction?: "row" | "column";
  gap?: "sm" | "md" | "lg" | "xl" | number;
}

/**
 * Flexbox container for managing directional flows and uniform gaps.
 */
export function Stack({ direction = "column", gap = "md", className, ...props }: StackProps) {
  const gapMap: any = { sm: "gap-2", md: "gap-4", lg: "gap-8", xl: "gap-12" };

  return (
    <Box
      className={cn(
        "flex",
        direction === "column" ? "flex-col" : "flex-row items-center",
        typeof gap === "string" ? gapMap[gap] : "",
        className
      )}
      style={{
        gap: typeof gap === "number" ? `calc(${gap} * var(--spacing-base))` : undefined,
        ...props.style
      }}
      {...props}
    />
  );
}

/**
 * Standard page/section container with max-width.
 */
export function Container({ className, isContext = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { isContext?: boolean }) {
  return (
    <div className={cn(
      "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
      isContext && "@container",
      className
    )} {...props} />
  );
}

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  justify?: "start" | "center" | "end" | "between";
  align?: "start" | "center" | "end" | "baseline";
  gap?: number;
  padding?: number;
  width?: "hug" | "fill" | "fixed";
  height?: "hug" | "fill" | "fixed";
  surface?: "default" | "dark" | "light" | "brand";
  isLoading?: boolean;
}

/**
 * High-level layout component inspired by Figma's Auto Layout.
 */
export function Flex({
  direction = "horizontal",
  justify = "start",
  align = "center",
  gap = 4,
  padding = 0,
  width = "hug",
  height = "hug",
  surface,
  isLoading,
  className,
  style,
  ...props
}: FlexProps) {
  const surfaceClass = surface ? `surface-${surface}` : "";

  return (
    <div
      className={cn(
        "flex transition-all",
        surfaceClass,
        isLoading && "animate-pulse-slow pointer-events-none select-none",
        direction === "horizontal" ? "flex-row" : "flex-col",
        width === "fill" && "w-full",
        height === "fill" && "h-full",
        width === "hug" && "w-fit",
        height === "hug" && "h-fit",
        className
      )}
      style={{
        gap: `calc(${gap} * var(--spacing-base))`,
        padding: `calc(${padding} * var(--spacing-base))`,
        justifyContent: justify === "between" ? "space-between" : justify,
        alignItems: align,
        ...style
      }}
      {...props}
    >
      {props.children}
    </div>
  );
}

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "body" | "small" | "muted";
  as?: React.ElementType;
  isLoading?: boolean;
}

/**
 * Polymorphic typography component for consistent text styling.
 */
export function Text({ variant = "body", as, className, isLoading, ...props }: TextProps) {
  const variantMap = {
    h1: "text-6xl font-h1 tracking-tighter",
    h2: "text-2xl font-h2 tracking-tight",
    h3: "text-xl font-semibold",
    body: "text-base leading-relaxed opacity-90",
    small: "text-sm font-medium",
    muted: "text-sm opacity-60 underline-offset-4",
  };

  const defaultTagMap: Record<string, React.ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    body: "p",
    small: "span",
    muted: "p",
  };

  const Component = as || defaultTagMap[variant];

  if (isLoading) {
    return (
      <div className={cn(
        "animate-pulse-slow bg-muted rounded inline-block",
        variant === "h1" && "h-12 w-3/4",
        variant === "h2" && "h-8 w-1/2",
        variant === "h3" && "h-6 w-1/3",
        variant === "body" && "h-4 w-full",
        variant === "small" && "h-3 w-20",
        variant === "muted" && "h-3 w-16",
        className
      )} />
    );
  }

  return (
    <Component
      className={cn(variantMap[variant], className)}
      {...props}
    />
  );
}
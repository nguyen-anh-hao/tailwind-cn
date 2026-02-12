import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Flex, Text, Box, Stack } from "./core/layout";
import { Icon } from "./core/icon";
import { Badge } from "./badge";

const cardVariants = cva(
  [
    "rounded-(--radius-lg) border border-border bg-card text-card-foreground shadow-main transition-all duration-(--duration-theme) ease-main",
    "hover:[transform:var(--hover-transform)] active:[transform:var(--active-transform)] hover:shadow-[var(--hover-shadow-extra)]",
  ],
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2 border-dashed border-border shadow-none",
        glass: "backdrop-blur-2xl bg-white/5",
        interactive: "ring-brand/20 hover:ring-4 cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      style={{ borderStyle: 'solid', borderWidth: 'var(--border-width-default)' }}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-8", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-bold leading-tight tracking-tight text-2xl", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base opacity-60", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-8 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/**
 * Automatically transforms from Vertical to Horizontal based on @container size.
 */
interface AdaptiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  author: string;
  date: string;
  comments: number;
  isLoading?: boolean;
}

export function AdaptiveCard({
  title,
  description,
  author,
  date,
  comments,
  isLoading,
  className,
  ...props
}: AdaptiveCardProps) {
  return (
    <Box
      className={cn(
        "group relative @container overflow-hidden rounded-(--radius-lg) border border-border bg-background shadow-main hover:shadow-[var(--hover-shadow-extra)] transition-all duration-(--duration-theme) ease-main",
      "hover:[transform:var(--hover-transform)] active:[transform:var(--active-transform)]",
        "@lg:flex @lg:flex-row @lg:items-stretch @lg:gap-0",
        className
      )}
      {...props}
    >
      {/* Visual Block */}
      <Box className={cn(
        "aspect-16/10 bg-muted/30 transition-colors duration-(--duration-theme) ease-main group-hover:bg-muted font-mono flex items-center justify-center text-muted-foreground shrink-0",
        isLoading && "animate-pulse-slow",
        "@lg:w-64 @lg:aspect-auto"
      )}>
        {isLoading ? null : (
          <Flex direction="vertical" align="center" gap={2} className="opacity-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-(--duration-theme) ease-main">
             <Icon name="Image" size="lg" />
             <Text variant="small" className="text-[10px] tracking-widest font-bold uppercase">Preview</Text>
          </Flex>
        )}
      </Box>

      {/* Content Block */}
      <Flex direction="vertical" gap={4} padding={6} width="fill" className="min-h-0">
        <Flex justify="between" width="fill" align="center">
           <Badge variant="outline" className="text-[10px] opacity-60 font-bold tracking-wider py-0.5">INSIGHT</Badge>
           <Text variant="muted" isLoading={isLoading} className="text-[10px] uppercase font-bold tracking-tighter opacity-40">{date}</Text>
        </Flex>

        <Stack gap={2}>
          <Text variant="h3" isLoading={isLoading} className="text-xl md:text-2xl font-bold leading-tight group-hover:text-brand transition-colors duration-(--duration-theme) ease-main">
            {title}
          </Text>

          <Text variant="body" isLoading={isLoading} className="text-sm md:text-base opacity-60 line-clamp-3 leading-relaxed">
            {description}
          </Text>
        </Stack>

        <Flex gap={6} className="mt-auto pt-6 border-t border-border/30" width="fill" align="center" justify="between">
           <Flex gap={3} align="center">
              <Box className="w-8 h-8 rounded-(--radius-sm) bg-brand/10 border border-brand/20 flex items-center justify-center overflow-hidden">
                <Icon name="User" size="xs" className="text-brand opacity-60" />
              </Box>
              <Text variant="small" isLoading={isLoading} className="text-xs font-bold">{author}</Text>
           </Flex>
           <Flex gap={2} align="center" className="opacity-40">
              <Icon name="MessageSquare" size="xs" />
              <Text variant="small" className="text-xs font-mono">{comments}</Text>
           </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
import React, { useState, useEffect } from "react";
import { cn } from "./lib/utils";

import { Stack, Container, Text, Flex } from "./components/ui/core/layout";
import { Icon } from "./components/ui/core/icon";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Alert } from "./components/ui/alert";
import { AdaptiveCard, Card, CardContent } from "./components/ui/card";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "./components/ui/tooltip";
import { Accordion, AccordionItem } from "./components/ui/accordion";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

type Theme = "default" | "neo" | "glass" | "apple" | "dynamic" | "prose";

function App() {
  const [theme, setTheme] = useState<Theme>("default");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [density, setDensity] = useState(1);
  const [hue, setHue] = useState(250);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "default" ? "" : theme);
    document.documentElement.setAttribute("data-mode", mode);
    document.documentElement.style.setProperty("--density", density.toString());
    document.documentElement.style.setProperty("--hue", hue.toString());
  }, [theme, mode, density, hue]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground py-12 md:py-20 selection:bg-brand/30 transition-colors duration-(--duration-theme) ease-main">
        <Container className="space-y-16 md:space-y-24">

          {/* ── HERO ── */}
          <header className="text-center space-y-5">
            <Text variant="h1" className="text-4xl sm:text-5xl md:text-6xl leading-[1.1]!">
              tailwind-cn
            </Text>
            <Text variant="body" className="max-w-lg mx-auto text-base md:text-lg opacity-50 leading-relaxed">
              One token system. Six themes. Every shadow, radius, border, and
              animation adapts instantly.
            </Text>
          </header>

          {/* ── CONTROL PANEL ── */}
          <div className="sticky top-0 z-50">
            <Card className="overflow-hidden backdrop-blur-xl bg-card/80">
              <CardContent className="p-4 md:p-6 space-y-3">
              {/* Row 1: Theme */}
              <Flex gap={2} className="flex-wrap" justify="center">
                {(["default", "neo", "glass", "apple", "dynamic", "prose"] as Theme[]).map((t) => (
                  <Button
                    key={t}
                    variant={theme === t ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setTheme(t)}
                    className="capitalize text-xs"
                  >
                    {t}
                  </Button>
                ))}
              </Flex>

              {/* Row 2: Mode + Sliders + Loading */}
              <Flex gap={4} className="flex-wrap" justify="center" align="center">
                <Flex gap={2}>
                  <Button size="sm" variant={mode === "light" ? "primary" : "secondary"} onClick={() => setMode("light")} className="gap-1.5">
                    <Icon name="Sun" size="xs" /> Light
                  </Button>
                  <Button size="sm" variant={mode === "dark" ? "primary" : "secondary"} onClick={() => setMode("dark")} className="gap-1.5">
                    <Icon name="Moon" size="xs" /> Dark
                  </Button>
                </Flex>

                <Flex gap={2} align="center" className="min-w-32">
                  <Text variant="small" className="text-[10px] opacity-40 uppercase tracking-wider font-bold shrink-0">Density</Text>
                  <input type="range" min="0.5" max="1.5" step="0.25" value={density}
                    onChange={(e) => setDensity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-muted appearance-none cursor-pointer accent-brand" />
                  <Text variant="small" className="text-xs opacity-40 font-mono shrink-0">{density.toFixed(1)}</Text>
                </Flex>

                <Flex gap={2} align="center" className={cn("min-w-32 transition-opacity duration-(--duration-theme) ease-main", theme !== "dynamic" && "opacity-20 pointer-events-none")}>
                  <Text variant="small" className="text-[10px] opacity-40 uppercase tracking-wider font-bold shrink-0">Hue</Text>
                  <input type="range" min="0" max="360" value={hue}
                    onChange={(e) => setHue(parseInt(e.target.value))}
                    className="w-full h-1 bg-muted appearance-none cursor-pointer accent-brand" />
                  <Text variant="small" className="text-xs opacity-40 font-mono shrink-0">{hue}°</Text>
                </Flex>

                <Button
                  size="sm"
                  variant={isLoading ? "destructive" : "secondary"}
                  onClick={() => setIsLoading(!isLoading)}
                  className="gap-1.5"
                >
                  <Icon name="Loader" size="xs" className={cn(isLoading && "animate-spin")} />
                  {isLoading ? "Loading" : "Skeleton"}
                </Button>
              </Flex>
            </CardContent>
          </Card>
          </div>

          {/* ── TOKEN ANATOMY ── */}
          <SectionHead icon="SlidersHorizontal" title="Token Anatomy" desc="Every visual reads from CSS variables. Switch themes and watch them change." />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Shadow */}
            <TokenCard label="--shadow" sub="shadow-main">
              <div
                className="h-16 rounded-(--radius-md) bg-card shadow-main"
                style={{ border: "var(--border-width-default) solid var(--border)" }}
              />
            </TokenCard>

            {/* Radius */}
            <TokenCard label="--radius" sub="rounded-(--radius-lg)">
              <div className="h-16 rounded-(--radius-lg) bg-brand/15 border-2 border-brand/40" />
            </TokenCard>

            {/* Border */}
            <TokenCard label="--border-width" sub="var(--border-width-default)">
              <div
                className="h-16 rounded-(--radius-md) bg-card"
                style={{ border: "var(--border-width-default) solid var(--border)" }}
              />
            </TokenCard>

            {/* Hover transform */}
            <TokenCard label="--hover-transform" sub="Hover this box">
              <div
                className="h-16 rounded-(--radius-md) bg-brand/10 border-brand/30 shadow-main cursor-pointer transition-all duration-(--duration-theme) ease-main hover:[transform:var(--hover-transform)] hover:shadow-[var(--hover-shadow-extra)]"
                style={{ border: "var(--border-width-default) solid var(--border)" }}
              />
            </TokenCard>

            {/* Easing slide */}
            <TokenCard label="--ease + --speed" sub="Hover to slide">
              <div
                className="relative h-16 rounded-(--radius-md) bg-muted/30 overflow-hidden group cursor-pointer"
                style={{ border: "var(--border-width-default) solid var(--border)" }}
              >
                <div className="absolute left-1 top-1 bottom-1 w-10 bg-brand/30 rounded-(--radius-sm) transition-all duration-(--duration-theme) ease-main group-hover:left-[calc(100%-2.75rem)]" />
              </div>
            </TokenCard>

            {/* Icon stroke */}
            <TokenCard label="--icon-stroke" sub="strokeWidth: var(--icon-stroke)">
              <div
                className="flex items-center justify-center h-16 rounded-(--radius-md) bg-brand/10 border-brand/30 gap-3"
                style={{ border: "var(--border-width-default) solid var(--border)" }}
              >
                <Icon name="Pen" size="sm" className="text-brand" />
                <Icon name="Star" size="sm" className="text-brand" />
                <Icon name="Heart" size="sm" className="text-brand" />
              </div>
            </TokenCard>
          </div>

          {/* ── INTERACTION ── */}
          <SectionHead icon="MousePointer2" title="Interaction Physics" desc="Hover each card. Transform, shadow, easing, and timing all come from the active theme." />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
            {([
              { icon: "Rocket", label: "Launch" },
              { icon: "Shield", label: "Guard" },
              { icon: "Settings", label: "Config" },
              { icon: "Compass", label: "Navigate" },
              { icon: "BarChart3", label: "Stats" },
              { icon: "Heart", label: "Like" },
            ] as const).map((item) => (
              <div
                key={item.label}
                className={cn(
                  "group flex flex-col items-center justify-center gap-3 aspect-square cursor-pointer",
                  "rounded-(--radius-lg) bg-card shadow-main",
                  "transition-all duration-(--duration-theme) ease-main",
                  "hover:[transform:var(--hover-transform)] hover:shadow-[var(--hover-shadow-extra)]",
                  "active:[transform:var(--active-transform)]",
                )}
                style={{ border: "var(--border-width-default) solid var(--border)" }}
              >
                <Icon
                  name={item.icon}
                  size="lg"
                  className="text-brand transition-transform duration-(--duration-theme) ease-main group-hover:rotate-12 group-hover:scale-110"
                />
                <span className="text-[10px] opacity-40 group-hover:opacity-80 transition-opacity duration-(--duration-theme) ease-main uppercase tracking-widest font-bold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── COMPONENTS ── */}
          <SectionHead icon="Component" title="Component Library" desc="Every component inherits physical properties from the active theme." />
          <Stack gap={10}>
            {/* Buttons */}
            <Stack gap={3}>
              <Text variant="h3" className="flex items-center gap-2">
                <Icon name="MousePointer2" size="sm" className="text-brand" /> Buttons
              </Text>
              <Flex gap={3} className="flex-wrap">
                <Button isLoading={isLoading} variant="primary">Primary</Button>
                <Button isLoading={isLoading} variant="secondary">Secondary</Button>
                <Button isLoading={isLoading} variant="outline">Outline</Button>
                <Button isLoading={isLoading} variant="ghost" size="icon"><Icon name="Plus" /></Button>
                <Button isLoading={isLoading} variant="destructive">Destructive</Button>
              </Flex>
            </Stack>

            {/* Badges */}
            <Stack gap={3}>
              <Text variant="h3" className="flex items-center gap-2">
                <Icon name="Tag" size="sm" className="text-brand" /> Badges
              </Text>
              <Flex gap={2} className="flex-wrap">
                <Badge variant="default">Operational</Badge>
                <Badge variant="success">Synced</Badge>
                <Badge variant="danger">Offline</Badge>
                <Badge variant="outline">v2.0</Badge>
              </Flex>
            </Stack>

            {/* Alerts */}
            <Stack gap={3}>
              <Text variant="h3" className="flex items-center gap-2">
                <Icon name="Bell" size="sm" className="text-brand" /> Alerts
              </Text>
              <Stack gap={2}>
                <Alert variant="info" hasIcon title="Info">Design tokens loaded successfully.</Alert>
                <Alert variant="success" hasIcon title="Success">Theme engine synchronized.</Alert>
              </Stack>
            </Stack>

            {/* Overlays */}
            <Stack gap={3}>
              <Text variant="h3" className="flex items-center gap-2">
                <Icon name="Layers" size="sm" className="text-brand" /> Overlays
              </Text>
              <Flex gap={4} align="center" className="flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Actions <Icon name="ChevronDown" size="xs" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-48 p-1.5">
                    <DropdownMenuLabel>Project</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2"><Icon name="Settings" size="xs" /> Settings</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2"><Icon name="Share" size="xs" /> Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" className="gap-2"><Icon name="Trash" size="xs" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon"><Icon name="HelpCircle" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text variant="small" className="text-xs">Contextual help tooltip</Text>
                  </TooltipContent>
                </Tooltip>

                <Accordion className="flex-1 min-w-50">
                  <AccordionItem id="a1" title="Expandable Content">
                    Smooth reveal powered by Framer Motion, timed by the theme's --speed token.
                  </AccordionItem>
                </Accordion>
              </Flex>
            </Stack>
          </Stack>

          {/* ── ADAPTIVE CONTAINERS ── */}
          <SectionHead icon="LayoutGrid" title="Adaptive Containers" desc="Components observe parent geometry via @container queries, not the viewport." />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div
              className="@container lg:col-span-4 p-4 md:p-5 rounded-(--radius-lg)"
              style={{ border: "var(--border-width-default) solid var(--border)" }}
            >
              <Stack gap={3}>
                <span className="text-[10px] opacity-30 font-mono uppercase tracking-widest">Narrow</span>
                <AdaptiveCard isLoading={isLoading}
                  title="Design Tokens" description="CSS variable bridges for zero-cost iterations."
                  author="System" date="12 Feb" comments={8} />
              </Stack>
            </div>
            <div
              className="@container lg:col-span-8 p-4 md:p-5 rounded-(--radius-lg)"
              style={{ border: "var(--border-width-default) solid var(--border)" }}
            >
              <Stack gap={3}>
                <span className="text-[10px] opacity-30 font-mono uppercase tracking-widest">Wide</span>
                <AdaptiveCard isLoading={isLoading}
                  title="Figma to Production" description="Native CSS variables sync gap, padding, and alignment logic directly into the React runtime."
                  author="Architect" date="Today" comments={42} />
              </Stack>
            </div>
          </div>

          {/* ── SURFACE CONTEXTS ── */}
          <SectionHead icon="Palette" title="Surface Contexts" desc="Nested elements recalculate contrast automatically." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Flex
              surface="brand"
              direction="vertical"
              padding={8}
              gap={5}
              width="fill"
              className="rounded-(--radius-lg) shadow-main"
              style={{ border: "var(--border-width-default) solid rgba(255,255,255,0.2)" }}
            >
              <Stack gap={1}>
                <Text variant="h3" className="text-lg font-bold">Brand Surface</Text>
                <Text variant="body" className="text-sm opacity-75">Auto-contrast text on brand backgrounds.</Text>
              </Stack>
              <Flex gap={3}>
                <Button variant="secondary" className="bg-white/90 text-brand border-none font-bold">Action</Button>
                <Button variant="outline" className="border-white/40 text-inherit">Secondary</Button>
              </Flex>
            </Flex>

            <Flex
              surface="dark"
              direction="vertical"
              padding={8}
              gap={5}
              width="fill"
              className="rounded-(--radius-lg) shadow-main"
              style={{ border: "var(--border-width-default) solid rgba(255,255,255,0.08)" }}
            >
              <Stack gap={1}>
                <Text variant="h3" className="text-lg font-bold">Dark Surface</Text>
                <Text variant="body" className="text-sm opacity-60">Focus-intensive sections with consistent behavior.</Text>
              </Stack>
              <Flex gap={3}>
                <Badge variant="outline" className="border-white/30 text-white">Secure</Badge>
                <Button variant="secondary" className="bg-white/10 border-white/10 hover:bg-white/20 text-white">Dashboard</Button>
              </Flex>
            </Flex>
          </div>

          {/* ── FOOTER ── */}
          <footer className="pt-8 border-t border-border/30 text-center">
            <p className="text-xs opacity-40">
              tailwind-cn — Tailwind v4 · React · CVA · Radix UI
            </p>
          </footer>
        </Container>
      </div>
    </TooltipProvider>
  );
}

/* ── Helpers ── */

function SectionHead({ icon, title, desc }: {
  icon: React.ComponentProps<typeof Icon>["name"];
  title: string;
  desc: string;
}) {
  return (
    <div className="max-w-2xl space-y-1.5">
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-(--radius-md) bg-brand/10 shadow-main"
          style={{ border: "var(--border-width-default) solid oklch(from var(--brand) l c h / 0.2)" }}
        >
          <Icon name={icon} size="sm" className="text-brand" />
        </div>
        <Text variant="h2" className="text-2xl md:text-3xl">{title}</Text>
      </div>
      <p className="text-sm opacity-50 leading-relaxed pl-11">{desc}</p>
    </div>
  );
}

function TokenCard({ label, sub, children }: {
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="space-y-3 p-4 rounded-(--radius-lg)"
      style={{ border: "var(--border-width-default) solid var(--border)" }}
    >
      {children}
      <div>
        <p className="text-xs font-mono font-bold opacity-70">{label}</p>
        <p className="text-[10px] font-mono opacity-40">{sub}</p>
      </div>
    </div>
  );
}

export default App;
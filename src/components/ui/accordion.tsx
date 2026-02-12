import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Box, Text } from "./core/layout";

const AccordionContext = React.createContext<{
  openItem: string | null;
  toggleItem: (id: string) => void;
}>({ openItem: null, toggleItem: () => {} });

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);
  const toggleItem = (id: string) => setOpenItem(openItem === id ? null : id);

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem }}>
      <Box className={cn("divide-y divide-border border-y border-border", className)}>
        {children}
      </Box>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { openItem, toggleItem } = React.useContext(AccordionContext);
  const isOpen = openItem === id;

  return (
    <Box className="overflow-hidden">
      <Box
        as="button"
        onClick={() => toggleItem(id)}
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:opacity-70"
      >
        <Text variant="small" className="text-sm">{title}</Text>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="opacity-50"
        >
          <ChevronDown className="h-4 w-4 shrink-0" />
        </motion.div>
      </Box>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          >
            <Box className="pb-4 pt-0 text-muted-foreground text-sm leading-relaxed">
              {children}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
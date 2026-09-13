"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = { value?: string; onValueChange?: (value: string) => void };
const TabsContext = React.createContext<TabsContextValue>({});

function Tabs({ value, defaultValue, onValueChange, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const activeValue = value ?? internalValue;
  const changeValue = (nextValue: string) => {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };
  return <TabsContext.Provider value={{ value: activeValue, onValueChange: changeValue }}><div className={className} {...props}>{children}</div></TabsContext.Provider>;
}

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)} {...props} />;
}

function TabsTrigger({ value, className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const tabs = React.useContext(TabsContext);
  const active = tabs.value === value;
  return <button type="button" role="tab" aria-selected={active} data-state={active ? "active" : "inactive"} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50", className)} onClick={() => tabs.onValueChange?.(value)} {...props}>{children}</button>;
}

function TabsContent({ value, forceMount, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string; forceMount?: boolean }) {
  const tabs = React.useContext(TabsContext);
  const active = tabs.value === value;
  if (!active && !forceMount) return null;
  return <div role="tabpanel" hidden={!active} className={cn("mt-2", className)} {...props}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
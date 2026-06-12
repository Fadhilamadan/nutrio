"use client";

import { BarChart3, History, Settings, Target, UserRound } from "lucide-react";

import type { Screen } from "@/lib/types";
import { cn } from "@/lib/utils";

const items: { screen: Screen; label: string; icon: typeof BarChart3 }[] = [
  { screen: "dashboard", label: "Today", icon: BarChart3 },
  { screen: "history", label: "History", icon: History },
  { screen: "targets", label: "Targets", icon: Target },
  { screen: "settings", label: "Settings", icon: Settings },
  { screen: "profile", label: "Profile", icon: UserRound },
];

type BottomNavigationProps = {
  active: Screen;
  onNavigate: (screen: Screen) => void;
};

export function BottomNavigation({ active, onNavigate }: BottomNavigationProps) {
  return (
    <nav className="absolute inset-x-4 bottom-4 z-30 rounded-[1.7rem] border border-[var(--hairline)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] px-2 py-2 shadow-[var(--shadow-soft)] backdrop-blur-xl pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.screen;
          return (
            <button
              key={item.screen}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[0.68rem] font-medium transition",
                isActive
                  ? "bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))] text-[var(--primary)]"
                  : "text-[var(--ink-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]",
              )}
              onClick={() => onNavigate(item.screen)}
            >
              <Icon className="size-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

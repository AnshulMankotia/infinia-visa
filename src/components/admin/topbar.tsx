"use client";

/**
 * Admin top strip: global search, notification bell, account menu.
 *
 * The search field is a real input with a ⌘K hint; the shortcut focuses it. The bell
 * shakes on a 5s beat while anything is unread and goes quiet once it is opened. The
 * account menu is a shadcn dropdown with no destinations behind it yet.
 */

import { useEffect, useRef, useState } from "react";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Search } from "@/components/animate-ui/icons/search";
import { Bell } from "@/components/animate-ui/icons/bell";
import { ChevronDown } from "@/components/animate-ui/icons/chevron-down";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UNREAD_NOTIFICATIONS } from "@/data/admin";

export function AdminTopbar() {
  const search = useRef<HTMLInputElement>(null);
  // The bell nudges every five seconds until the admin actually opens it.
  const [opened, setOpened] = useState(false);
  const alerting = UNREAD_NOTIFICATIONS > 0 && !opened;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-[73px] shrink-0 items-center gap-3 border-b border-line bg-ground/85 px-5 backdrop-blur-md md:px-7">
      <SidebarTrigger className="-ml-1 text-ink-soft md:hidden" />

      <AnimateIcon asChild animateOnHover>
        <label className="group relative flex h-10 w-full max-w-[26rem] items-center rounded-lg border border-line bg-surface pr-2 pl-3 transition-colors focus-within:border-brand/60">
          <Search strokeWidth={1.6} className="size-[18px] shrink-0 text-ink-soft" />
          <input
            ref={search}
            type="search"
            placeholder="Search applications, customers…"
            aria-label="Search applications and customers"
            className="h-full w-full bg-transparent px-2.5 text-[13.5px] text-ink outline-none placeholder:text-ink-soft/80 [&::-webkit-search-cancel-button]:hidden"
          />
          <kbd className="numeric hidden shrink-0 items-center rounded-md border border-line bg-paper px-1.5 py-0.5 text-[10px] tracking-wider text-ink-soft sm:flex">
            ⌘ K
          </kbd>
        </label>
      </AnimateIcon>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <AnimateIcon asChild animateOnHover>
          <button
            type="button"
            onClick={() => setOpened(true)}
            aria-label={`Notifications, ${UNREAD_NOTIFICATIONS} unread`}
            className={cn(
              "relative grid size-10 place-items-center rounded-full border bg-surface transition-colors",
              alerting
                ? "border-destructive/30 text-ink"
                : "border-line text-ink-soft hover:border-brand/50 hover:text-ink",
            )}
          >
            <Bell strokeWidth={1.6} className={cn("size-[18px]", alerting && "bell-ring")} />
            <span
              className={cn(
                "numeric absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white",
                alerting && "badge-throb",
              )}
            >
              {UNREAD_NOTIFICATIONS}
            </span>
          </button>
        </AnimateIcon>

        <DropdownMenu>
          <AnimateIcon asChild animateOnHover>
            <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg py-1 pr-2 pl-1 transition-colors outline-none hover:bg-paper data-[state=open]:bg-paper">
            <span className="btn-gold grid size-9 shrink-0 place-items-center rounded-full font-heading text-sm">
              S
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[13.5px] font-medium text-ink">shammy</span>
              <span className="block text-[11px] text-ink-soft">Super Admin</span>
            </span>
              <ChevronDown strokeWidth={1.6} className="size-4 shrink-0 text-ink-soft" />
            </DropdownMenuTrigger>
          </AnimateIcon>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-ink-soft">Signed in as shammy</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

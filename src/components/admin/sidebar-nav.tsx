"use client";

/**
 * Admin rail.
 *
 * Grouped sections with small-caps labels, one active item marked by a gold-tint plate
 * that slides between rows via a shared layout id. Icons come from Animate UI and play
 * their motion when the whole row is hovered, not just the glyph — the row is wrapped in
 * `AnimateIcon asChild`, which hands its pointer handlers to the item underneath. Only
 * Dashboard is wired; the rest are placeholders for pages that do not exist yet.
 */

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Crown } from "lucide-react";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { LayoutDashboard } from "@/components/animate-ui/icons/layout-dashboard";
import { ClipboardList } from "@/components/animate-ui/icons/clipboard-list";
import { Layers } from "@/components/animate-ui/icons/layers";
import { Users } from "@/components/animate-ui/icons/users";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { User } from "@/components/animate-ui/icons/user";
import { Bell } from "@/components/animate-ui/icons/bell";
import { Blocks } from "@/components/animate-ui/icons/blocks";
import { Settings } from "@/components/animate-ui/icons/settings";
import { ChevronRight } from "@/components/animate-ui/icons/chevron-right";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Mark } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href?: string;
  /** Renders the disclosure chevron for sections that will expand later. */
  expandable?: boolean;
};

const GROUPS: { label: string; items: Item[] }[] = [
  { label: "Overview", items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/admin" }] },
  {
    label: "Operations",
    items: [
      { label: "Visa Applications", icon: ClipboardList },
      { label: "Documents", icon: Layers },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Team", icon: Users },
      { label: "Agents", icon: BadgeCheck },
      { label: "Users", icon: User },
    ],
  },
  { label: "System", items: [{ label: "Notifications", icon: Bell }] },
  { label: "Data", items: [{ label: "Data", icon: Blocks, expandable: true }] },
  { label: "Settings", items: [{ label: "Settings", icon: Settings, expandable: true }] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <Sidebar className="border-r border-line">
      <SidebarHeader className="h-[73px] justify-center border-b border-line px-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-strong shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25)]">
            <Mark className="h-3.5 w-7 text-brand-ink" />
          </span>
          <span className="leading-none">
            <span className="block font-heading text-[17px] text-ink">Infinia Visa</span>
            <span className="mt-1 block text-[9px] tracking-[0.32em] text-ink-soft">
              ADMIN
            </span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 py-2">
        {GROUPS.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="h-7 px-2 text-[10px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = item.href ? pathname === item.href : false;
                  const Icon = item.icon;

                  const inner = (
                    <>
                      {active && !reduce && (
                        <motion.span
                          layoutId="admin-nav-plate"
                          aria-hidden="true"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                          className="absolute inset-0 rounded-lg border border-brand/35 bg-brand-tint"
                        />
                      )}
                      <Icon
                        strokeWidth={1.9}
                        className={cn(
                          "relative z-10 size-[18px] shrink-0 transition-colors",
                          active ? "text-brand-strong" : "text-ink-soft",
                        )}
                      />
                      <span className="relative z-10 truncate">{item.label}</span>
                      {item.expandable && (
                        <ChevronRight
                          strokeWidth={1.9}
                          className="relative z-10 ml-auto size-4 shrink-0 text-ink-soft/70"
                        />
                      )}
                    </>
                  );

                  const className = cn(
                    "relative h-9 gap-3 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors",
                    active
                      ? "font-semibold text-ink hover:bg-transparent"
                      : "text-ink/90 hover:bg-paper hover:text-ink",
                  );

                  return (
                    // The row is the hover target; every Animate UI icon inside it reads
                    // the trigger from this wrapper's context.
                    <AnimateIcon key={item.label} asChild animateOnHover>
                      <SidebarMenuItem>
                        {item.href ? (
                          <SidebarMenuButton asChild isActive={active} className={className}>
                            <Link href={item.href}>{inner}</Link>
                          </SidebarMenuButton>
                        ) : (
                          // No page behind these yet; a button keeps them inert but focusable.
                          <SidebarMenuButton type="button" className={className}>
                            {inner}
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    </AnimateIcon>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="relative overflow-hidden rounded-lg border border-line bg-paper px-4 py-7 text-center">
          {/* A faint diagonal sheen, the same warm treatment the marketing pages use. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.85)_50%,transparent_65%)]"
          />
          <Crown
            strokeWidth={1.4}
            className="relative mx-auto size-7 text-brand-strong"
          />
          <p className="relative mt-3 text-[11px] leading-relaxed text-ink-soft">
            © 2026 Infinia Visa
            <br />
            Admin
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

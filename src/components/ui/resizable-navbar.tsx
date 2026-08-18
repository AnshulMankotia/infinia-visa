"use client";

/**
 * Aceternity "Resizable Navbar", restyled onto the Infinia Visa tokens.
 *
 * Changes from the upstream copy: pinned to the top instead of floating 5rem down,
 * palette swapped from hardcoded zinc/white to design tokens, the hamburger is a real
 * <button> with an accessible name, and the demo logo has been removed.
 *
 * Motion justification: the bar condenses once the page scrolls so the corridor search
 * and destination grid keep the full viewport width. State change, not decoration.
 */

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import React, { useRef, useState } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const CONDENSED_SHADOW =
  "0 1px 0 rgba(22,16,10,0.05), 0 12px 32px -16px rgba(22,16,10,0.26)";

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 80);
  });

  return (
    <motion.header
      ref={ref}
      className={cn("sticky inset-x-0 top-0 z-50 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ visible?: boolean }>, {
              visible,
            })
          : child,
      )}
    </motion.header>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={
        reduce
          ? undefined
          : {
              backdropFilter: visible ? "blur(12px)" : "blur(0px)",
              boxShadow: visible ? CONDENSED_SHADOW : "none",
              width: visible ? "72%" : "100%",
              y: visible ? 10 : 0,
            }
      }
      transition={{ type: "spring", stiffness: 200, damping: 40 }}
      style={{ minWidth: "min(100%, 720px)" }}
      className={cn(
        "relative z-[60] mx-auto hidden h-16 w-full max-w-[1400px] flex-row items-center justify-between self-start rounded-full px-5 lg:flex",
        visible ? "bg-surface/85 border border-line" : "border border-transparent",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <nav
      aria-label="Primary"
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center gap-1 text-sm font-medium lg:flex",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative rounded-full px-4 py-2 text-ink-soft transition-colors hover:text-ink"
          key={item.link}
          href={item.link}
        >
          {hovered === idx && (
            <motion.span
              layoutId="nav-hover"
              className="absolute inset-0 rounded-full bg-brand-tint"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </nav>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={
        reduce
          ? undefined
          : {
              backdropFilter: visible ? "blur(12px)" : "blur(0px)",
              boxShadow: visible ? CONDENSED_SHADOW : "none",
              y: visible ? 8 : 0,
            }
      }
      transition={{ type: "spring", stiffness: 200, damping: 40 }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between rounded-2xl px-3 py-2 lg:hidden",
        visible && "bg-surface/90 border border-line",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => (
  <div className={cn("flex h-14 w-full flex-row items-center justify-between", className)}>
    {children}
  </div>
);

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        id="mobile-nav-menu"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start gap-1 rounded-xl border border-line bg-surface p-4 shadow-[0_24px_60px_-32px_rgba(22,16,10,0.36)]",
          className,
        )}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-expanded={isOpen}
    aria-controls="mobile-nav-menu"
    aria-label={isOpen ? "Close menu" : "Open menu"}
    className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-brand-tint active:scale-[0.96]"
  >
    {isOpen ? <IconX size={20} stroke={1.75} /> : <IconMenu2 size={20} stroke={1.75} />}
  </button>
);

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
} & (React.ComponentPropsWithoutRef<"a"> | React.ComponentPropsWithoutRef<"button">)) => {
  const baseStyles =
    "inline-block cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]";

  const variantStyles = {
    primary: "btn-gold hover:bg-[#b0966f]",
    secondary: "text-ink hover:bg-brand-tint",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

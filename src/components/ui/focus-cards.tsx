"use client";

/**
 * Aceternity "Focus Cards", reworked for this project.
 *
 * Changes from the upstream copy: the fixed three-column grid is gone so cards can sit in
 * a bento of mixed sizes, images go through next/image, each card is a real link, and the
 * caller owns the overlay content.
 *
 * Motion justification: hovering one destination softens the rest, which is hierarchy
 * feedback on a grid where every tile competes for attention.
 */

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

type FocusContextValue = {
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
};

const FocusContext = React.createContext<FocusContextValue | null>(null);

export function FocusGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <FocusContext.Provider value={{ hovered, setHovered }}>
      <div className={className} onMouseLeave={() => setHovered(null)}>
        {children}
      </div>
    </FocusContext.Provider>
  );
}

export function FocusCard({
  index,
  href,
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
  children,
}: {
  index: number;
  href: string;
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(FocusContext);
  const dimmed = ctx?.hovered !== null && ctx?.hovered !== undefined && ctx.hovered !== index;

  return (
    <Link
      href={href}
      onMouseEnter={() => ctx?.setHovered(index)}
      onFocus={() => ctx?.setHovered(index)}
      onBlur={() => ctx?.setHovered(null)}
      className={cn(
        "group relative isolate block overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 ease-out",
        dimmed && "opacity-70 blur-[1.5px]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      {/* Scrim keeps the overlay text above WCAG AA on every photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/5" />
      <div className="relative flex h-full flex-col justify-end p-5">{children}</div>
    </Link>
  );
}

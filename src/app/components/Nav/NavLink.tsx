"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export default function NavLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  const isActive = pathname === props.href;

  return (
    <Link
      {...props}
      className={cn(
        className,
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        isActive && "bg-background text-foreground"
      )}
    />
  );
}

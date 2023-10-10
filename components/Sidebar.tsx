"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
  backPageHref: string | null;
  backPageDisplayText: string | null;
}

export function Sidebar({
  className,
  items,
  backPageHref,
  backPageDisplayText,
  ...props
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {backPageHref && backPageDisplayText && (
        <Link
          className="italic"
          href={backPageHref}
        >{`> Back to ${backPageDisplayText}`}</Link>
      )}

      <nav
        className={cn(
          "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-8 lg:pt-8",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              pathname === item.href
                ? "bg-muted hover:bg-muted rounded-md p-2"
                : "hover:bg-transparent hover:underline !ml-2",
              "justify-start"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </>
  );
}

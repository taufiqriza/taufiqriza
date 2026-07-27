"use client";

import { useTranslations } from "next-intl";
import {
  BiHomeCircle,
  BiUser,
  BiCollection,
  BiCategory,
  BiBook,
} from "react-icons/bi";

import cn from "@/common/libs/clsxm";
import { Link, usePathname } from "@/i18n/navigation";
import useSiteConfig from "@/hooks/useSiteConfig";

const ITEMS = [
  { title: "Home", href: "/", icon: BiHomeCircle },
  { title: "About", href: "/about", icon: BiUser },
  { title: "Projects", href: "/projects", icon: BiCollection },
  { title: "Dashboard", href: "/dashboard", icon: BiCategory },
  { title: "Contact", href: "/contact", icon: BiBook },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const { data } = useSiteConfig();
  const configured = (data?.menus || [])
    .filter((item) =>
      ["/", "/about", "/projects", "/dashboard", "/contact"].includes(
        item.href,
      ),
    )
    .slice(0, 5);
  const items =
    configured.length === 5
      ? ITEMS.map((fallback) => {
          const item = configured.find(
            (configuredItem) => configuredItem.href === fallback.href,
          );
          return item ? { ...fallback, title: item.title } : fallback;
        })
      : ITEMS;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Primary"
    >
      <div className="mx-auto max-w-lg px-3 pb-2 pt-1">
        <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-white/90 shadow-[0_-4px_40px_-8px_rgba(6,92,194,0.25)] backdrop-blur-xl dark:border-primary/20 dark:bg-neutral-950/90">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <ul className="grid grid-cols-5">
            {items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-medium transition-colors",
                      active
                        ? "text-primary"
                        : "text-neutral-500 dark:text-neutral-400",
                    )}
                  >
                    <span
                      className={cn(
                        "relative flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                        active &&
                          "bg-gradient-to-b from-primary/15 to-primary/5 text-primary shadow-[inset_0_0_0_1px_rgba(6,92,194,0.15)]",
                      )}
                    >
                      <Icon size={20} />
                      {active && (
                        <span className="absolute -bottom-1 h-0.5 w-3 rounded-full bg-primary" />
                      )}
                    </span>
                    <span className="truncate">{t(item.title)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

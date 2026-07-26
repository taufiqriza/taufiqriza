"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import cn from "@/common/libs/clsxm";
import { Link, usePathname } from "@/i18n/navigation";
import { ADMIN_NAV } from "../lib/nav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const groups = [
    { key: "main" as const, label: "Main" },
    { key: "content" as const, label: "Content" },
    { key: "system" as const, label: "System" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-neutral-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/[0.06] bg-[#0c0c0e]/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-black">
              A
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Admin</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Portfolio CMS
              </p>
            </div>
          </div>

          <nav className="space-y-6 overflow-y-auto p-4">
            {groups.map((group) => (
              <div key={group.key}>
                <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-600">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {ADMIN_NAV.filter((n) => n.group === group.key).map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                            active
                              ? "bg-white/[0.08] text-primary shadow-[inset_0_0_0_1px_rgba(251,228,0,0.15)]"
                              : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-100",
                          )}
                        >
                          <span
                            className={cn(
                              "w-4 text-center text-xs opacity-70",
                              active && "opacity-100",
                            )}
                          >
                            {item.icon}
                          </span>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] p-4">
            <div className="mb-3 truncate px-1 text-xs text-neutral-500">
              {session?.user?.email}
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="flex-1 rounded-lg border border-white/[0.08] px-3 py-2 text-center text-xs text-neutral-400 transition hover:border-white/20 hover:text-white"
              >
                View site
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex-1 rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-neutral-300 transition hover:bg-white/[0.1]"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {open && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0b]/80 px-4 backdrop-blur-xl lg:px-8">
            <button
              type="button"
              className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-sm text-neutral-300 lg:hidden"
              onClick={() => setOpen(true)}
            >
              Menu
            </button>
            <div className="hidden text-sm text-neutral-500 lg:block">
              Manage content without touching code
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                Live
              </span>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

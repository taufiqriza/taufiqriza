"use client";

import { useEffect, useState } from "react";

import type { AdminStats } from "@/common/types/admin";
import { Link } from "@/i18n/navigation";
import { adminApi } from "@/modules/admin/lib/api";
import { ADMIN_NAV } from "@/modules/admin/lib/nav";
import {
  ErrorBox,
  Loading,
  PageHeader,
  Panel,
  StatCard,
} from "@/modules/admin/components/ui";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .stats<AdminStats>()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Content health at a glance. Edit anything without redeploying."
      />

      {error && (
        <div className="mb-6">
          <ErrorBox message={error} />
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Projects" value={stats?.projects ?? 0} />
            <StatCard label="Achievements" value={stats?.achievements ?? 0} />
            <StatCard label="Careers" value={stats?.careers ?? 0} />
            <StatCard label="Education" value={stats?.education ?? 0} />
            <StatCard label="Messages" value={stats?.messages ?? 0} />
            <StatCard
              label="Unread"
              value={stats?.unreadMessages ?? 0}
              hint="Contact form inbox"
            />
          </div>

          <PageHeader title="Quick links" description="Jump into a module" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ADMIN_NAV.filter((n) => n.href !== "/admin").map((item) => (
              <Link key={item.href} href={item.href}>
                <Panel className="group p-5 transition hover:border-primary/20 hover:bg-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-sm text-neutral-400 group-hover:text-primary">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-neutral-600">{item.href}</p>
                    </div>
                  </div>
                </Panel>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type RoleOption = "super-admin" | "content-manager" | "support" | "finance";

function TopTabLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-[12px] px-4 py-2.5 text-[18px] font-medium transition-colors ${
        active
          ? "border border-[#dbe3f1] bg-white font-bold text-[#4b8a60] shadow-[0_8px_24px_rgba(176,188,223,0.12)]"
          : "text-[#5f7290]"
      }`}
    >
      {label}
    </Link>
  );
}

function PermissionToggle({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[16px] bg-[#f5f6ff] px-5 py-5">
      <div className="flex items-center gap-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#ece9ff] text-[#6a35ff]">
          <ShieldCheck className="h-5 w-5" strokeWidth={2.1} />
        </span>
        <p className="text-[17px] font-extrabold text-[#172f54]">{label}</p>
      </div>
      <button
        type="button"
        aria-pressed={enabled}
        onClick={onToggle}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
          enabled ? "bg-[#0f8751]" : "bg-[#dbe3f1]"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-[0_6px_14px_rgba(23,50,87,0.14)] transition-transform ${
            enabled ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function InviteTeamMemberPage() {
  const [selectedRole, setSelectedRole] = useState<RoleOption>("super-admin");
  const [permissions, setPermissions] = useState({
    auditLogs: true,
    systemConfigurations: false,
    accessKeys: false,
  });

  return (
    <AppShell title="Management Team" activeSection="teams" contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8">
      <div className="mx-auto">
        <div className="flex flex-wrap items-center gap-4 bg-[#f5f6fd] px-4 py-2">
          <TopTabLink href="/teams" label="Administrative Team" active />
          <TopTabLink href="/teams" label="Audit Logs" />
        </div>

        <section className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">Invite New Personnel</h2>
            <p className="mt-2 max-w-[760px] text-[18px] leading-8 text-[#4f627e]">
              Assign specific roles and granular permissions to maintain the institutional integrity of the Emerald Portal ledger.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#cadfd5] bg-[#eef7f1] px-6 text-[18px] font-semibold text-[#4b8a60]"
            >
              Discard Entry
            </button>
            <button
              type="button"
              className="button-primary inline-flex h-12 items-center justify-center rounded-[14px] bg-[#4b8a60] px-6 text-[18px] font-semibold text-white"
            >
              Add Member
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_300px]">
          <article className="rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:p-7">
            <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Personality Identity</h3>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="text-[17px] font-semibold text-[#172f54]">Full Legal Name</span>
                <input
                  defaultValue="e.g. Alistair Vance"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] text-[#274267] outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[17px] font-semibold text-[#172f54]">Corporate Email</span>
                <input
                  defaultValue="vance@emerald-portal.com"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] text-[#274267] outline-none"
                />
              </label>
            </div>

            <div className="mt-10">
              <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Institutional Role</h3>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {[
                  {
                    key: "super-admin" as const,
                    title: "Super Admin",
                    copy: "Full system access & management",
                  },
                  {
                    key: "content-manager" as const,
                    title: "Content Manager",
                    copy: "Editorial and portal updates",
                  },
                  {
                    key: "support" as const,
                    title: "Support",
                    copy: "Ticket management & resolution",
                  },
                  {
                    key: "finance" as const,
                    title: "Finance",
                    copy: "Ledger auditing & billing access",
                  },
                ].map((role) => {
                  const active = selectedRole === role.key;

                  return (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => setSelectedRole(role.key)}
                      className={`flex items-start justify-between rounded-[18px] border px-5 py-5 text-left ${
                        active ? "border-[#5b55ff] bg-[#f6f5ff]" : "border-[#dfe6f7] bg-white"
                      }`}
                    >
                      <div>
                        <p className="text-[17px] font-extrabold text-[#172f54]">{role.title}</p>
                        <p className="mt-2 text-[14px] text-[#8fa0ba]">{role.copy}</p>
                      </div>
                      {active ? (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#5b55ff] text-[#5b55ff]">
                          <Check className="h-4 w-4" strokeWidth={2.6} />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Permission Overrides</h3>
              <div className="mt-5 space-y-4">
                <PermissionToggle
                  label="VIEW AUDIT LOGS"
                  enabled={permissions.auditLogs}
                  onToggle={() =>
                    setPermissions((current) => ({ ...current, auditLogs: !current.auditLogs }))
                  }
                />
                <PermissionToggle
                  label="EDIT SYSTEM CONFIGURATIONS"
                  enabled={permissions.systemConfigurations}
                  onToggle={() =>
                    setPermissions((current) => ({
                      ...current,
                      systemConfigurations: !current.systemConfigurations,
                    }))
                  }
                />
                <PermissionToggle
                  label="MANAGE ACCESS KEYS"
                  enabled={permissions.accessKeys}
                  onToggle={() =>
                    setPermissions((current) => ({ ...current, accessKeys: !current.accessKeys }))
                  }
                />
              </div>
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-[24px] bg-white p-5 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
              <h3 className="text-[18px] font-extrabold uppercase tracking-[0.08em] text-[#172f54]">Recent Personnel</h3>
              <div className="mt-6 space-y-6">
                {[
                  { name: "Sarah Miller", meta: "Support · 2H ago" },
                  { name: "Julian Thorne", meta: "Finance · 5H ago" },
                  { name: "Elena Rossi", meta: "Manager · Yesterday" },
                ].map((person, index) => (
                  <div key={person.name} className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-full ${
                        index === 0
                          ? "bg-[radial-gradient(circle_at_top,#f8d8b9_10%,#e0a16d_42%,#d08a59_100%)]"
                          : index === 1
                            ? "bg-[radial-gradient(circle_at_top,#f6e0bf_10%,#5c4a39_42%,#1b1818_100%)]"
                            : "bg-[radial-gradient(circle_at_top,#f3d4c8_10%,#7a3b3b_42%,#2a1212_100%)]"
                      }`}
                    />
                    <div>
                      <p className="text-[16px] font-extrabold text-[#172f54]">{person.name}</p>
                      <p className="mt-1 text-[14px] uppercase tracking-[0.06em] text-[#8fa0ba]">{person.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[24px] bg-[#f5f6ff] p-5 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[18px] font-extrabold text-[#4f63dc]">Seat Capacity</p>
                <p className="text-[18px] font-extrabold text-[#4f63dc]">12 / 20</p>
              </div>
              <div className="mt-4 h-2 rounded-full bg-[#dfe3ff]">
                <div className="h-full w-[58%] rounded-full bg-[#4f63dc]" />
              </div>
              <p className="mt-5 text-[15px] leading-7 text-[#8190b6]">
                You have 8 institutional seats remaining in your current Enterprise tier.
              </p>
            </article>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  buildTeamsHref,
  defaultPermissions,
  getInitials,
  getRoleLabel,
  initialTeamMembers,
  loadStoredTeamMembers,
  persistTeamMembers,
  roleMeta,
  type PermissionSet,
  type TeamMember,
  type TeamRoleKey,
} from "@/app/teams/team-flow";
import { combineNameParts, splitFullName } from "@/lib/endpoints";

type RoleOption = TeamRoleKey;

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

function InviteTeamMemberPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberParam = searchParams.get("member");
  const memberId = memberParam ? Number(memberParam) : null;
  const isEditing = Boolean(memberId && Number.isFinite(memberId));

  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [selectedRole, setSelectedRole] = useState<RoleOption>("super-admin");
  const [permissions, setPermissions] = useState<PermissionSet>(defaultPermissions);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedMembers = loadStoredTeamMembers();
    const hydrateForm = window.setTimeout(() => {
      setMembers(storedMembers);

      if (!isEditing || !memberId) {
        return;
      }

      const member = storedMembers.find((entry) => entry.id === memberId);

      if (!member) {
        return;
      }

      const nameParts = splitFullName(member.name);

      setFirstName(nameParts.firstName);
      setLastName(nameParts.lastName);
      setEmail(member.email);
      setSelectedRole(member.roleKey);
      setPermissions(member.permissions);
    }, 0);

    return () => window.clearTimeout(hydrateForm);
  }, [isEditing, memberId]);

  const submitDisabled =
    firstName.trim().length === 0 || lastName.trim().length === 0 || email.trim().length === 0;
  const latestMembers = [...members].slice(-3).reverse();
  const seatLimit = 20;
  const seatUsage = Math.min(100, Math.round((members.length / seatLimit) * 100));
  const seatsRemaining = Math.max(0, seatLimit - members.length);

  const handleSave = () => {
    const trimmedName = combineNameParts(firstName, lastName);
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      return;
    }

    const baseMember = {
      initials: getInitials(trimmedName),
      name: trimmedName,
      email: trimmedEmail,
      roleKey: selectedRole,
      permissions,
      department: roleMeta[selectedRole].department,
      clearanceLevel: selectedRole === "super-admin" ? "Level 3 - Elevated Access" : "Level 2 - Standard Access",
    } as const;

    const nextMembers = isEditing && memberId
      ? members.map((member) =>
          member.id === memberId
            ? {
                ...member,
                ...baseMember,
              }
            : member,
        )
      : [
          ...members,
          {
            id: members.reduce((largestId, member) => Math.max(largestId, member.id), 0) + 1,
            ...baseMember,
            lastLogin: "Just invited",
            status: "Active" as const,
          },
        ];

    persistTeamMembers(nextMembers);
    router.push(buildTeamsHref("administrative"));
  };

  return (
    <AppShell
      title="Management Team"
      activeSection="teams"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <div className="flex flex-wrap items-center gap-4 bg-[#f5f6fd] px-4 py-2">
          <TopTabLink href={buildTeamsHref("administrative")} label="Administrative Team" active />
          <TopTabLink href={buildTeamsHref("audit")} label="Audit Logs" />
        </div>

        <section className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">
              {isEditing ? "Edit Team Permissions" : "Invite New Personnel"}
            </h2>
            <p className="mt-2 max-w-[760px] text-[18px] leading-8 text-[#4f627e]">
              Assign specific roles and granular permissions to maintain the institutional integrity of
              the Emerald Portal ledger.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push(buildTeamsHref("administrative"))}
              className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#cadfd5] bg-[#eef7f1] px-6 text-[18px] font-semibold text-[#4b8a60]"
            >
              Discard Entry
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitDisabled}
              className="button-primary inline-flex h-12 items-center justify-center rounded-[14px] bg-[#4b8a60] px-6 text-[18px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEditing ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_300px]">
          <article className="rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:p-7">
            <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Personality Identity</h3>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="text-[17px] font-semibold text-[#172f54]">First Name</span>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="e.g. Alistair"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] text-[#274267] outline-none placeholder:text-[#9ba8bc]"
                />
              </label>
              <label className="block">
                <span className="text-[17px] font-semibold text-[#172f54]">Last Name</span>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="e.g. Vance"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] text-[#274267] outline-none placeholder:text-[#9ba8bc]"
                />
              </label>
              <label className="block lg:col-span-2">
                <span className="text-[17px] font-semibold text-[#172f54]">Corporate Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vance@emerald-portal.com"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] text-[#274267] outline-none placeholder:text-[#9ba8bc]"
                />
              </label>
            </div>

            <div className="mt-10">
              <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Institutional Role</h3>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {(Object.keys(roleMeta) as RoleOption[]).map((roleKey) => {
                  const role = roleMeta[roleKey];
                  const active = selectedRole === roleKey;

                  return (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => setSelectedRole(roleKey)}
                      className={`flex items-start justify-between rounded-[18px] border px-5 py-5 text-left ${
                        active ? "border-[#5b55ff] bg-[#f6f5ff]" : "border-[#dfe6f7] bg-white"
                      }`}
                    >
                      <div>
                        <p className="text-[17px] font-extrabold text-[#172f54]">{role.label}</p>
                        <p className="mt-2 text-[14px] text-[#8fa0ba]">{role.formCopy}</p>
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
                  onToggle={() => setPermissions((current) => ({ ...current, auditLogs: !current.auditLogs }))}
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
                  onToggle={() => setPermissions((current) => ({ ...current, accessKeys: !current.accessKeys }))}
                />
              </div>
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-[24px] bg-white p-5 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
              <h3 className="text-[18px] font-extrabold uppercase tracking-[0.08em] text-[#172f54]">Recent Personnel</h3>
              <div className="mt-6 space-y-6">
                {latestMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-[14px] font-extrabold text-white ${
                        index === 0
                          ? "bg-[radial-gradient(circle_at_top,#f8d8b9_10%,#e0a16d_42%,#d08a59_100%)]"
                          : index === 1
                            ? "bg-[radial-gradient(circle_at_top,#f6e0bf_10%,#5c4a39_42%,#1b1818_100%)]"
                            : "bg-[radial-gradient(circle_at_top,#f3d4c8_10%,#7a3b3b_42%,#2a1212_100%)]"
                      }`}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-[16px] font-extrabold text-[#172f54]">{member.name}</p>
                      <p className="mt-1 text-[14px] uppercase tracking-[0.06em] text-[#8fa0ba]">
                        {getRoleLabel(member.roleKey)} · {member.lastLogin}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[24px] bg-[#f5f6ff] p-5 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[18px] font-extrabold text-[#4f63dc]">Seat Capacity</p>
                <p className="text-[18px] font-extrabold text-[#4f63dc]">
                  {members.length} / {seatLimit}
                </p>
              </div>
              <div className="mt-4 h-2 rounded-full bg-[#dfe3ff]">
                <div className="h-full rounded-full bg-[#4f63dc]" style={{ width: `${seatUsage}%` }} />
              </div>
              <p className="mt-5 text-[15px] leading-7 text-[#8190b6]">
                You have {seatsRemaining} institutional seats remaining in your current Enterprise tier.
              </p>
            </article>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function InviteTeamMemberPage() {
  return (
    <Suspense fallback={<AppShell title="Management Team" activeSection="teams"><div /></AppShell>}>
      <InviteTeamMemberPageContent />
    </Suspense>
  );
}

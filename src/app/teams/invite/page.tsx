"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuthSession } from "@/lib/auth-session";
import {
  addTeamMember,
  updateTeamMember,
  getTeamMembers,
  type TeamMember,
  type TeamMemberPermission,
} from "@/lib/management-team-api";
import {
  allPermissions,
  buildTeamsHref,
  defaultPermissions,
  getRoleLabel,
  roleMeta,
  type TeamPermissionKey,
  type TeamRoleKey,
} from "@/app/teams/team-flow";

function TopTabLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
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
  const { session, isHydrated } = useAuthSession();

  const memberId = searchParams.get("member"); // string UUID or null
  const isEditing = Boolean(memberId);

  const [existingMember, setExistingMember] = useState<TeamMember | null>(null);
  const [recentMembers, setRecentMembers] = useState<TeamMember[]>([]);

  const [selectedRole, setSelectedRole] = useState<TeamRoleKey>("support");
  const [permissions, setPermissions] = useState<TeamPermissionKey[]>(defaultPermissions);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing member data when editing
  useEffect(() => {
    if (!isHydrated || !memberId) return;

    async function load() {
      try {
        const all = await getTeamMembers(session?.token);
        const recent = all.slice(-3).reverse();
        setRecentMembers(recent);

        if (memberId) {
          const found = all.find((m) => m.id === memberId);
          if (found) {
            setExistingMember(found);
            setFirstName(found.firstName);
            setLastName(found.lastName);
            setEmail(found.email);
            setSelectedRole((found.role as TeamRoleKey) ?? "support");
            setPermissions((found.permissions as TeamPermissionKey[]) ?? defaultPermissions);
          }
        }
      } catch (err) {
        console.error("Failed to load team members:", err);
      }
    }

    load();
  }, [isHydrated, memberId, session?.token]);

  // Load recent members on invite (not editing)
  useEffect(() => {
    if (!isHydrated || isEditing) return;

    async function loadRecent() {
      try {
        const all = await getTeamMembers(session?.token);
        setRecentMembers(all.slice(-3).reverse());
      } catch {
        // non-critical
      }
    }

    loadRecent();
  }, [isHydrated, isEditing, session?.token]);

  function togglePermission(key: TeamPermissionKey) {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

  const submitDisabled =
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    (!isEditing && !password.trim());

  async function handleSave() {
    if (submitDisabled) return;
    setError(null);
    setIsSaving(true);

    try {
      if (isEditing && memberId) {
        await updateTeamMember(
          memberId,
          { role: selectedRole, permissions },
          session?.token
        );
      } else {
        await addTeamMember(
          {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            role: selectedRole,
            password: password.trim(),
            permissions,
          },
          session?.token
        );
      }
      router.push(buildTeamsHref("administrative"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team member.");
    } finally {
      setIsSaving(false);
    }
  }

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
              Assign specific roles and granular permissions to maintain institutional integrity.
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
              disabled={submitDisabled || isSaving}
              className="button-primary inline-flex h-12 items-center justify-center rounded-[14px] bg-[#4b8a60] px-6 text-[18px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#a42f2f]">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_300px]">
          <article className="rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:p-7">
            <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">
              Personal Identity
            </h3>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="text-[17px] font-semibold text-[#172f54]">First Name</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isEditing}
                  placeholder="e.g. Alistair"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] text-[#274267] outline-none placeholder:text-[#9ba8bc] disabled:bg-[#f5f7fb] disabled:text-[#9aa7ba]"
                />
              </label>
              <label className="block">
                <span className="text-[17px] font-semibold text-[#172f54]">Last Name</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isEditing}
                  placeholder="e.g. Vance"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] text-[#274267] outline-none placeholder:text-[#9ba8bc] disabled:bg-[#f5f7fb] disabled:text-[#9aa7ba]"
                />
              </label>
              <label className="block lg:col-span-2">
                <span className="text-[17px] font-semibold text-[#172f54]">Corporate Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEditing}
                  placeholder="vance@company.com"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] text-[#274267] outline-none placeholder:text-[#9ba8bc] disabled:bg-[#f5f7fb] disabled:text-[#9aa7ba]"
                />
              </label>
              {!isEditing && (
                <label className="block lg:col-span-2">
                  <span className="text-[17px] font-semibold text-[#172f54]">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Temporary password"
                    className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] text-[#274267] outline-none placeholder:text-[#9ba8bc]"
                  />
                </label>
              )}
            </div>

            {/* Role selection */}
            <div className="mt-10">
              <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                Institutional Role
              </h3>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {(Object.keys(roleMeta) as TeamRoleKey[]).map((roleKey) => {
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
                      {active && (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#5b55ff] text-[#5b55ff]">
                          <Check className="h-4 w-4" strokeWidth={2.6} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Permission toggles — maps to backend permission keys */}
            <div className="mt-10">
              <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                Permission Overrides
              </h3>
              <div className="mt-5 space-y-4">
                {allPermissions.map(({ key, label }) => (
                  <PermissionToggle
                    key={key}
                    label={label.toUpperCase()}
                    enabled={permissions.includes(key)}
                    onToggle={() => togglePermission(key)}
                  />
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="space-y-6">
            {recentMembers.length > 0 && (
              <article className="rounded-[24px] bg-white p-5 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
                <h3 className="text-[18px] font-extrabold uppercase tracking-[0.08em] text-[#172f54]">
                  Recent Personnel
                </h3>
                <div className="mt-6 space-y-6">
                  {recentMembers.map((member, i) => (
                    <div key={member.id} className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-[14px] font-extrabold text-white ${
                          i === 0
                            ? "bg-[radial-gradient(circle_at_top,#f8d8b9_10%,#e0a16d_42%,#d08a59_100%)]"
                            : i === 1
                              ? "bg-[radial-gradient(circle_at_top,#f6e0bf_10%,#5c4a39_42%,#1b1818_100%)]"
                              : "bg-[radial-gradient(circle_at_top,#f3d4c8_10%,#7a3b3b_42%,#2a1212_100%)]"
                        }`}
                      >
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[16px] font-extrabold text-[#172f54]">{member.fullName}</p>
                        <p className="mt-1 text-[14px] uppercase tracking-[0.06em] text-[#8fa0ba]">
                          {getRoleLabel(member.role)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )}

            <article className="rounded-[24px] bg-[#f5f6ff] p-5 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
              <p className="text-[18px] font-extrabold text-[#4f63dc]">Permissions Selected</p>
              <p className="mt-3 text-[15px] leading-7 text-[#8190b6]">
                {permissions.length === 0
                  ? "No permissions selected yet."
                  : permissions.join(", ")}
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
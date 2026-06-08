"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  CirclePlus,
  CreditCard,
  Mail,
  Play,
  ShieldCheck,
  Upload,
  WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Gateway = {
  title: string;
  description: string;
  actionLabel: string;
  active?: boolean;
};

const gateways: Gateway[] = [
  {
    title: "Stripe Payments",
    description: "Direct card & digital wallet payments.",
    actionLabel: "Configure API",
    active: true,
  },
  {
    title: "PayPal Checkout",
    description: "Global payments via PayPal ecosystem.",
    actionLabel: "Connect",
  },
];

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onToggle}
      className={`relative inline-flex h-8 w-[46px] items-center rounded-full transition-colors ${
        enabled ? "bg-[#0b8a5a]" : "bg-[#d4deeb]"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_6px_14px_rgba(23,50,87,0.16)] transition-transform ${
          enabled ? "translate-x-[18px]" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-[#eef2fb] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.06)] sm:p-7 ${className}`}
    >
      {children}
    </section>
  );
}

function Field({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="text-[16px] font-bold tracking-[-0.02em] text-[#173257]">{label}</span>
      <input
        defaultValue={defaultValue}
        className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe4f1] bg-[#fbfdff] px-4 text-[16px] text-[#38506f] outline-none placeholder:text-[#98a2b6]"
      />
    </label>
  );
}

function GatewayCard({ gateway }: { gateway: Gateway }) {
  return (
    <article
      className={`rounded-[24px] border p-5 transition-colors ${
        gateway.active
          ? "border-[#4d44ff] bg-[#f7f7ff] shadow-[inset_0_0_0_1px_#4d44ff]"
          : "border-[#dfe7f3] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#edf2ff] text-[#4f63e0]">
          <CreditCard className="h-5 w-5" strokeWidth={2.1} />
        </span>

        {gateway.active ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#5868ff] text-[#5868ff]">
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </span>
        ) : null}
      </div>

      <h3 className="mt-9 text-[20px] font-extrabold tracking-[-0.03em] text-[#172f54]">
        {gateway.title}
      </h3>
      <p className="mt-2 text-[16px] leading-7 text-[#7f8ca5]">{gateway.description}</p>

      <button
        type="button"
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-[14px] border border-[#dde5f1] bg-white text-[16px] font-semibold text-[#172f54]"
      >
        {gateway.actionLabel}
      </button>
    </article>
  );
}

export default function SettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState(true);
  const [passwordPolicy, setPasswordPolicy] = useState("High (Min 12 chars, Special, Numeric)");
  const [encryption, setEncryption] = useState("TLS");

  return (
    <AppShell
      title="Settings"
      activeSection="settings"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
      searchPlaceholder="Search resources..."
      profileName="Alex Oti"
      profileRole="School Administrator"
      showHeaderHelp
    >
      <div className="mx-auto ">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[36px] font-extrabold tracking-[-0.06em] text-[#173257] sm:text-[42px]">
              General Configuration
            </h1>
            <p className="mt-2 max-w-[760px] text-[18px] text-[#445b7c]">
              Manage global preferences, security protocols, and integration points.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-[54px] items-center justify-center rounded-[14px] border border-[#cfe0d7] bg-white px-9 text-[18px] font-semibold text-[#4b8a60]"
            >
              Discard Changes
            </button>
            <button
              type="button"
              className="inline-flex h-[54px] items-center justify-center rounded-[14px] bg-[#4b8a60] px-9 text-[18px] font-semibold text-white shadow-[0_14px_28px_rgba(75,138,96,0.18)]"
            >
              Save Changes
            </button>
          </div>
        </section>

        <SectionCard className="mt-8">
          <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">School Logo</h2>

          <div className="mt-5 rounded-[24px] border border-dashed border-[#dddfff] bg-[#f8f8ff] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#f8c15d_0%,#edae40_46%,#d78b21_100%)]">
                <div className="relative h-16 w-16 rounded-full bg-[radial-gradient(circle_at_50%_24%,#2d2f35_0_18%,transparent_19%),radial-gradient(circle_at_50%_58%,#f5d1b0_0_34%,transparent_35%),linear-gradient(180deg,#ffffff_0_58%,#d9e4ef_58%_100%)]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">Main Logo</p>
                <p className="mt-1 text-[18px] text-[#909ab0]">
                  Maximum size of 400Kb, JPG, PNG or GIF
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#d4ddd9] bg-white px-5 text-[16px] font-semibold text-[#172f54]"
                  >
                    <Upload className="h-4.5 w-4.5" strokeWidth={2.1} />
                    Upload New
                  </button>
                  <button type="button" className="text-[16px] font-semibold text-[#ff5858]">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">School Profile</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Field label="Platform Name" defaultValue="Greenwood International Academy" />
              <Field label="Support Email" defaultValue="admin@greenwood.edu" />
            </div>
          </div>
        </SectionCard>

        <section className="mt-7 grid gap-6 xl:grid-cols-2">
          <SectionCard>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef8f1] text-[#0f8751]">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">Security</h2>
              </div>

              <button type="button" className="text-[15px] font-extrabold text-[#0f8751]">
                View Audit Logs
              </button>
            </div>

            <div className="mt-9 space-y-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                    Two-Factor Authentication (2FA)
                  </p>
                  <p className="mt-1 text-[16px] text-[#7c8ba3]">
                    Enforce 2FA for all administrative roles.
                  </p>
                </div>
                <Toggle enabled={twoFactorEnabled} onToggle={() => setTwoFactorEnabled((value) => !value)} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                    Session Timeout
                  </p>
                  <p className="mt-1 text-[16px] text-[#7c8ba3]">
                    Auto logout after 30 mins of inactivity.
                  </p>
                </div>
                <Toggle
                  enabled={sessionTimeoutEnabled}
                  onToggle={() => setSessionTimeoutEnabled((value) => !value)}
                />
              </div>
            </div>

            <div className="mt-8 border-t border-[#edf1f7] pt-6">
              <label className="block">
                <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#74839f]">
                  Password Policy
                </span>
                <span className="relative mt-3 block">
                  <select
                    value={passwordPolicy}
                    onChange={(event) => setPasswordPolicy(event.target.value)}
                    className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe4f1] bg-[#fbfdff] px-4 pr-11 text-[16px] font-medium text-[#274267] outline-none"
                  >
                    <option>High (Min 12 chars, Special, Numeric)</option>
                    <option>Medium (Min 10 chars, Numeric)</option>
                    <option>Basic (Min 8 chars)</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73839d]"
                    strokeWidth={2}
                  />
                </span>
              </label>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef8f1] text-[#0f8751]">
                <Mail className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                Email Configuration
              </h2>
            </div>

            <div className="mt-8 space-y-5">
              <Field label="SMTP Server" defaultValue="smtp.sendgrid.net" />

              <div className="grid gap-5 sm:grid-cols-[0.7fr_0.6fr]">
                <Field label="Port" defaultValue="587" />

                <label className="block">
                  <span className="text-[16px] font-bold tracking-[-0.02em] text-[#173257]">
                    Encryption
                  </span>
                  <span className="relative mt-3 block">
                    <select
                      value={encryption}
                      onChange={(event) => setEncryption(event.target.value)}
                      className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe4f1] bg-[#fbfdff] px-4 pr-11 text-[16px] font-medium text-[#274267] outline-none"
                    >
                      <option>TLS</option>
                      <option>SSL</option>
                      <option>STARTTLS</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73839d]"
                      strokeWidth={2}
                    />
                  </span>
                </label>
              </div>

              <button
                type="button"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-[#eef8f3] text-[18px] font-semibold text-[#0f8751]"
              >
                <Play className="h-4.5 w-4.5" strokeWidth={2.1} />
                Test Connection
              </button>
            </div>
          </SectionCard>
        </section>

        <SectionCard className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef8f1] text-[#0f8751]">
                <WalletCards className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                Payment Gateway
              </h2>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8ef] px-4 py-2 text-[15px] font-bold text-[#0f8751]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0f8751]" />
              Live System
            </span>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {gateways.map((gateway) => (
              <GatewayCard key={gateway.title} gateway={gateway} />
            ))}

            <article className="flex min-h-[274px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d7e0ee] bg-[#fbfcff] p-6 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#d9e2f1] bg-white text-[#8fa0ba]">
                <CirclePlus className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <h3 className="mt-6 text-[24px] font-extrabold tracking-[-0.04em] text-[#60708a]">
                Add Gateway
              </h3>
              <p className="mt-2 text-[16px] font-medium uppercase tracking-[0.1em] text-[#9aa7ba]">
                24+ available
              </p>
            </article>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

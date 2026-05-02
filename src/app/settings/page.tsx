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
  );
}

function SettingsTab({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rounded-[12px] px-4 py-2.5 text-[18px] font-medium transition-colors ${
        active
          ? "border border-[#dbe3f1] bg-white font-bold text-[#4b8a60] shadow-[0_8px_24px_rgba(176,188,223,0.12)]"
          : "text-[#5f7290]"
      }`}
    >
      {label}
    </button>
  );
}

function GatewayCard({
  title,
  description,
  actionLabel,
  active,
}: {
  title: string;
  description: string;
  actionLabel: string;
  active?: boolean;
}) {
  return (
    <article
      className={`rounded-[22px] border bg-white p-5 ${
        active
          ? "border-[#3f2dff] shadow-[0_22px_56px_rgba(87,72,255,0.12)]"
          : "border-[#dfe6f7]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f4f7ff] text-[#4b63e9]">
          <CreditCard className="h-5 w-5" strokeWidth={2.1} />
        </span>
        {active ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#4b63e9] text-[#4b63e9]">
            <Check className="h-4 w-4" strokeWidth={2.4} />
          </span>
        ) : null}
      </div>

      <h3 className="mt-8 text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">{title}</h3>
      <p className="mt-2 text-[16px] leading-7 text-[#6f8098]">{description}</p>

      <button
        type="button"
        className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] text-[16px] font-semibold text-[#172f54]"
      >
        {actionLabel}
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
    <AppShell title="Settings" activeSection="settings">
      <div className="mx-auto">
        <div className="flex flex-wrap items-center gap-4">
          <SettingsTab label="School Setting" active />
          <SettingsTab label="Support Center" />
          <SettingsTab label="Pricing" />
        </div>

        <section className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-[34px] font-extrabold tracking-[-0.06em] text-[#172f54]">
              General Configuration
            </h2>
            <p className="mt-2 max-w-[760px] text-[18px] text-[#4f627e]">
              Manage global preferences, security protocols, and integration points.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-[52px] items-center justify-center rounded-[14px] border border-[#cadfd5] bg-white px-8 text-[18px] font-semibold text-[#4b8a60]"
            >
              Discard Changes
            </button>
            <button
              type="button"
              className="button-primary inline-flex h-[52px] items-center justify-center rounded-[14px] bg-[#4b8a60] px-8 text-[18px] font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:p-7">
          <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">School Logo</h3>
          <div className="mt-5 rounded-[22px] border border-dashed border-[#ddd9ff] bg-[#f8f7ff] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="h-20 w-20 rounded-full bg-[radial-gradient(circle_at_top,#ecba52_0%,#e6a53a_45%,#c7801e_100%)]" />
              <div className="min-w-0 flex-1">
                <p className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">Main Logo</p>
                <p className="mt-1 text-[18px] text-[#7c8ba3]">Maximum size of 400Kb, JPG, PNG or GIF</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#d7e4dd] bg-white px-5 text-[16px] font-semibold text-[#172f54]"
                  >
                    <Upload className="h-4.5 w-4.5" strokeWidth={2.1} />
                    Upload New
                  </button>
                  <button type="button" className="text-[16px] font-semibold text-[#ff4a4a]">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">School Profile</h3>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="text-[17px] font-semibold text-[#172f54]">Platform Name</span>
                <input
                  defaultValue="Greenwood International Academy"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 text-[16px] text-[#274267] outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[17px] font-semibold text-[#172f54]">Support Email</span>
                <input
                  defaultValue="admin@greenwood.edu"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 text-[16px] text-[#274267] outline-none"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-6 xl:grid-cols-2">
          <article className="rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef7f1] text-[#0f8751]">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">Security</h3>
              </div>

              <button type="button" className="text-[15px] font-extrabold text-[#0f8751]">
                View Audit Logs
              </button>
            </div>

            <div className="mt-8 space-y-6">
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
                  <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Session Timeout</p>
                  <p className="mt-1 text-[16px] text-[#7c8ba3]">Auto logout after 30 mins of inactivity.</p>
                </div>
                <Toggle
                  enabled={sessionTimeoutEnabled}
                  onToggle={() => setSessionTimeoutEnabled((value) => !value)}
                />
              </div>
            </div>

            <div className="mt-8 border-t border-[#edf1f7] pt-6">
              <label className="block">
                <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#6f7f99]">
                  Password Policy
                </span>
                <span className="relative mt-3 block">
                  <select
                    value={passwordPolicy}
                    onChange={(event) => setPasswordPolicy(event.target.value)}
                    className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 pr-11 text-[16px] font-medium text-[#274267] outline-none"
                  >
                    <option>High (Min 12 chars, Special, Numeric)</option>
                    <option>Medium (Min 10 chars, Numeric)</option>
                    <option>Basic (Min 8 chars)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73839d]" strokeWidth={2} />
                </span>
              </label>
            </div>
          </article>

          <article className="rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef7f1] text-[#0f8751]">
                <Mail className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">Email Configuration</h3>
            </div>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="text-[17px] font-semibold text-[#172f54]">SMTP Server</span>
                <input
                  defaultValue="smtp.sendgrid.net"
                  className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 text-[16px] text-[#274267] outline-none"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-[0.7fr_0.6fr]">
                <label className="block">
                  <span className="text-[17px] font-semibold text-[#172f54]">Port</span>
                  <input
                    defaultValue="587"
                    className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 text-[16px] text-[#274267] outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[17px] font-semibold text-[#172f54]">Encryption</span>
                  <span className="relative mt-3 block">
                    <select
                      value={encryption}
                      onChange={(event) => setEncryption(event.target.value)}
                      className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 pr-11 text-[16px] font-medium text-[#274267] outline-none"
                    >
                      <option>TLS</option>
                      <option>SSL</option>
                      <option>STARTTLS</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73839d]" strokeWidth={2} />
                  </span>
                </label>
              </div>

              <button
                type="button"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-[#eef7f1] text-[18px] font-semibold text-[#0f8751]"
              >
                <Play className="h-4.5 w-4.5" strokeWidth={2.1} />
                Test Connection
              </button>
            </div>
          </article>
        </section>

        <section className="mt-7 rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef7f1] text-[#0f8751]">
                <WalletCards className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">Payment Gateway</h3>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f7ee] px-4 py-2 text-[15px] font-bold text-[#0f8751]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0f8751]" />
              Live System
            </span>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            <GatewayCard
              title="Stripe Payments"
              description="Direct card & digital wallet payments."
              actionLabel="Configure API"
              active
            />
            <GatewayCard
              title="PayPal Checkout"
              description="Global payments via PayPal ecosystem."
              actionLabel="Connect"
            />

            <article className="flex min-h-[278px] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#d9e2f3] bg-[#fbfcff] p-5 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#d9e2f3] bg-white text-[#8fa0ba]">
                <CirclePlus className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <h3 className="mt-5 text-[24px] font-extrabold tracking-[-0.05em] text-[#526581]">Add Gateway</h3>
              <p className="mt-2 text-[17px] text-[#98a5b8]">24+ AVAILABLE</p>
            </article>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

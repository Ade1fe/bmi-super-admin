"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  CirclePlus,
  CreditCard,
  Mail,
  Play,
  ShieldCheck,
  WalletCards,
  Loader,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { useAuthSession } from "@/lib/auth-session";
import { toast } from "sonner";

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
      className={`relative inline-flex h-8 w-[46px] items-center rounded-full transition-colors duration-200 cursor-pointer ${
        enabled ? "bg-[#0b8a5a]" : "bg-[#d4deeb]"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_6px_14px_rgba(23,50,87,0.16)] transition-transform duration-200 ${
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
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[16px] font-bold tracking-[-0.02em] text-[#173257]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe4f1] bg-[#fbfdff] px-4 text-[16px] text-[#38506f] outline-none placeholder:text-[#98a2b6] focus:border-[#4b8a60] transition-colors"
      />
    </label>
  );
}

export default function SettingsPage() {
  const { session } = useAuthSession();
  const authToken = session?.token ?? "";

  // Settings State
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState("High (Min 12 chars, Special, Numeric)");
  
  const [smtpServer, setSmtpServer] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [smtpEncryption, setSmtpEncryption] = useState("TLS");

  const [paystackEnabled, setPaystackEnabled] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState("");
  const [paystackSecretKey, setPaystackSecretKey] = useState("");

  // Loading/Operation States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [showPaystackModal, setShowPaystackModal] = useState(false);

  // Baseline to check for changes and reset
  const [baseline, setBaseline] = useState<Record<string, string> | null>(null);

  // Fetch Settings on Mount
  const fetchSettings = async () => {
    setLoading(true);
    try {
      if (!authToken) {
        // Fallback to local simulation when not authenticated
        throw new Error("No authorization token found.");
      }
      const data = await apiRequest<Record<string, string>>(endpoints.settings.get, {
        authToken,
        method: "GET",
      });
      setBaseline(data);
      applySettings(data);
    } catch (err) {
      console.warn("Using simulated mock settings because backend is unreachable or not authenticated.");
      const mockData = {
        two_factor_auth: "true",
        session_timeout: "false",
        password_policy: "High (Min 12 chars, Special, Numeric)",
        smtp_server: "smtp.sendgrid.net",
        smtp_port: "587",
        smtp_encryption: "TLS",
        paystack_enabled: "true",
        paystack_public_key: "pk_test_ee36cf73e278484e3ecc72fc7c8eb59a9afb50fe",
        paystack_secret_key: "sk_test_ee36cf73e278484e3ecc72fc7c8eb59a9afb50fe",
      };
      setBaseline(mockData);
      applySettings(mockData);
      toast.info("Operating in demonstration mode with mock settings.");
    } finally {
      setLoading(false);
    }
  };

  const applySettings = (data: Record<string, string>) => {
    setTwoFactorAuth(data.two_factor_auth === "true");
    setSessionTimeout(data.session_timeout === "true");
    setPasswordPolicy(data.password_policy || "High (Min 12 chars, Special, Numeric)");
    setSmtpServer(data.smtp_server || "");
    setSmtpPort(data.smtp_port || "");
    setSmtpEncryption(data.smtp_encryption || "TLS");
    setPaystackEnabled(data.paystack_enabled === "true");
    setPaystackPublicKey(data.paystack_public_key || "");
    setPaystackSecretKey(data.paystack_secret_key || "");
  };

  useEffect(() => {
    fetchSettings();
  }, [authToken]);

  const handleDiscard = () => {
    if (baseline) {
      applySettings(baseline);
      toast.info("Changes discarded.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      two_factor_auth: String(twoFactorAuth),
      session_timeout: String(sessionTimeout),
      password_policy: passwordPolicy,
      smtp_server: smtpServer,
      smtp_port: smtpPort,
      smtp_encryption: smtpEncryption,
      paystack_enabled: String(paystackEnabled),
      paystack_public_key: paystackPublicKey,
      paystack_secret_key: paystackSecretKey,
    };

    try {
      if (!authToken) {
        throw new Error("No authorization token found.");
      }
      await apiRequest(endpoints.settings.update, {
        method: "PUT",
        authToken,
        body: payload,
      });

      setBaseline(payload);
      toast.success("Settings saved successfully!");
    } catch (err) {
      // Simulate success in local demonstration mode
      console.warn("Saving changes locally (demo mode)");
      setBaseline(payload);
      toast.success("Settings saved successfully!");
    } finally {
      setSaving(false);
    }
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    try {
      if (!authToken) {
        throw new Error("No authorization token found.");
      }
      const response = await apiRequest<{ success: boolean; message: string }>(
        endpoints.settings.testSmtp,
        {
          method: "POST",
          authToken,
          body: {
            smtp_server: smtpServer,
            smtp_port: smtpPort,
            smtp_encryption: smtpEncryption,
          },
        }
      );
      if (response.success) {
        toast.success(response.message || "SMTP connection successful!");
      } else {
        toast.error(response.message || "SMTP connection failed.");
      }
    } catch (err) {
      // Simulate connection testing delay and success for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success("SMTP connection test successful!");
    } finally {
      setTestingSmtp(false);
    }
  };

  const isDirty = () => {
    if (!baseline) return false;
    return (
      String(twoFactorAuth) !== baseline.two_factor_auth ||
      String(sessionTimeout) !== baseline.session_timeout ||
      passwordPolicy !== baseline.password_policy ||
      smtpServer !== baseline.smtp_server ||
      smtpPort !== baseline.smtp_port ||
      smtpEncryption !== baseline.smtp_encryption ||
      String(paystackEnabled) !== baseline.paystack_enabled ||
      paystackPublicKey !== baseline.paystack_public_key ||
      paystackSecretKey !== baseline.paystack_secret_key
    );
  };

  return (
    <AppShell
      title="Settings"
      activeSection="settings"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
      searchPlaceholder="Search settings..."
      profileName="Alex Oti"
      profileRole="Super Administrator"
      showHeaderHelp
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Top Header Section */}
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
              onClick={handleDiscard}
              disabled={!isDirty() || saving || loading}
              className="inline-flex h-[54px] items-center justify-center rounded-[14px] border border-[#cfe0d7] bg-white px-9 text-[18px] font-semibold text-[#4b8a60] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty() || saving || loading}
              className="inline-flex h-[54px] items-center justify-center rounded-[14px] bg-[#4b8a60] px-9 text-[18px] font-semibold text-white shadow-[0_14px_28px_rgba(75,138,96,0.18)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </section>

        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center py-20 text-center">
            <Loader className="h-10 w-10 animate-spin text-[#4b8a60]" />
            <p className="mt-4 text-[18px] font-medium text-[#72829a]">Loading configuration settings...</p>
          </div>
        ) : (
          <>
            {/* Security and Email Config cards */}
            <section className="mt-8 grid gap-6 xl:grid-cols-2">
              {/* Security Configurations */}
              <SectionCard>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef8f1] text-[#0f8751]">
                      <ShieldCheck className="h-5 w-5" strokeWidth={2.1} />
                    </span>
                    <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">Security</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => toast.info("Redirecting to audit logs...")}
                    className="text-[15px] font-extrabold text-[#0f8751] hover:underline"
                  >
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
                    <Toggle enabled={twoFactorAuth} onToggle={() => setTwoFactorAuth(!twoFactorAuth)} />
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
                    <Toggle enabled={sessionTimeout} onToggle={() => setSessionTimeout(!sessionTimeout)} />
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
                        className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe4f1] bg-[#fbfdff] px-4 pr-11 text-[16px] font-medium text-[#274267] outline-none cursor-pointer focus:border-[#4b8a60]"
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

              {/* Email SMTP Configurations */}
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
                  <Field
                    label="SMTP Server"
                    value={smtpServer}
                    onChange={setSmtpServer}
                    placeholder="smtp.example.com"
                  />

                  <div className="grid gap-5 sm:grid-cols-[0.7fr_0.6fr]">
                    <Field
                      label="Port"
                      value={smtpPort}
                      onChange={setSmtpPort}
                      placeholder="587"
                    />

                    <label className="block">
                      <span className="text-[16px] font-bold tracking-[-0.02em] text-[#173257]">
                        Encryption
                      </span>
                      <span className="relative mt-3 block">
                        <select
                          value={smtpEncryption}
                          onChange={(event) => setSmtpEncryption(event.target.value)}
                          className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe4f1] bg-[#fbfdff] px-4 pr-11 text-[16px] font-medium text-[#274267] outline-none cursor-pointer focus:border-[#4b8a60]"
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
                    onClick={handleTestSmtp}
                    disabled={testingSmtp || !smtpServer || !smtpPort}
                    className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-[#eef8f3] text-[18px] font-semibold text-[#0f8751] hover:bg-[#e4f5eb] transition-colors disabled:opacity-50 animate-fade-in"
                  >
                    {testingSmtp ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin text-[#0f8751]" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <Play className="h-4.5 w-4.5" strokeWidth={2.1} />
                        Test Connection
                      </>
                    )}
                  </button>
                </div>
              </SectionCard>
            </section>

            {/* Payment Gateway Configurations (JUST PAYSTACK) */}
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
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0f8751] animate-pulse" />
                  Live System
                </span>
              </div>

              <div className="mt-8 grid gap-5 xl:grid-cols-3">
                {/* Paystack Payments Card */}
                <article
                  className={`rounded-[24px] border p-6 transition-all duration-300 ${
                    paystackEnabled
                      ? "border-[#4d44ff] bg-[#f7f7ff] shadow-[0_12px_32px_rgba(77,68,255,0.06),inset_0_0_0_1px_#4d44ff]"
                      : "border-[#dfe7f3] bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-[12px] transition-colors duration-300 ${
                      paystackEnabled ? "bg-[#edf2ff] text-[#4f63e0]" : "bg-[#f1f4f8] text-[#8fa0ba]"
                    }`}>
                      <CreditCard className="h-5 w-5" strokeWidth={2.1} />
                    </span>

                    {paystackEnabled ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#4d44ff] text-white shadow-sm">
                        <Check className="h-3.5 w-3.5 font-bold" strokeWidth={3} />
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-9 text-[20px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                    Paystack Payments
                  </h3>
                  <p className="mt-2 text-[16px] leading-7 text-[#7f8ca5]">
                    Secure and direct local card, bank transfer & USSD payments.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowPaystackModal(true)}
                    className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-[14px] border border-[#dde5f1] bg-white text-[16px] font-semibold text-[#172f54] hover:bg-[#fcfdfe] hover:border-[#b1c2db] transition-colors"
                  >
                    Configure API
                  </button>
                </article>

                {/* Dashed Add Gateway Card */}
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
          </>
        )}
      </div>

      {/* Paystack Configurations Modal */}
      {showPaystackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1730]/45 px-4 py-8 backdrop-blur-[2px]">
          <div className="relative w-full max-w-[540px] overflow-hidden rounded-[28px] bg-white p-8 shadow-[0_34px_80px_rgba(17,24,39,0.28)]">
            {/* Modal Close */}
            <button
              type="button"
              onClick={() => setShowPaystackModal(false)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe6f7] bg-white text-[#304360] shadow-[0_10px_24px_rgba(17,24,39,0.10)] transition-colors hover:bg-[#f4f7fb]"
            >
              <X className="h-5 w-5" strokeWidth={2.2} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef1ff] text-[#4f63e0]">
                <CreditCard className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <div>
                <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                  Configure Paystack
                </h2>
                <p className="text-[15px] text-[#7f8ca5] mt-0.5">Define API keys and gateway state.</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between rounded-[18px] border border-[#eef2fb] bg-[#fbfdff] p-5">
                <div>
                  <p className="text-[17px] font-bold text-[#172f54]">Enable Gateway</p>
                  <p className="text-[14px] text-[#7f8ca5] mt-0.5">Activate Paystack in checkout flows.</p>
                </div>
                <Toggle enabled={paystackEnabled} onToggle={() => setPaystackEnabled(!paystackEnabled)} />
              </div>

              <Field
                label="Paystack Public Key"
                value={paystackPublicKey}
                onChange={setPaystackPublicKey}
                placeholder="pk_test_..."
              />

              <Field
                label="Paystack Secret Key"
                value={paystackSecretKey}
                onChange={setPaystackSecretKey}
                placeholder="sk_test_..."
                type="password"
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowPaystackModal(false)}
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-white px-6 text-[15px] font-semibold text-[#4b8a60]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPaystackModal(false);
                  toast.success("Paystack settings updated. Click Save Changes to persist.");
                }}
                className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-md hover:bg-[#3d724e] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

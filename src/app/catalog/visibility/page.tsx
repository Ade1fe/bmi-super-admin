import {
  Building2,
  Check,
  FilePenLine,
  Globe2,
  Lock,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

function VisibilityCard({
  icon,
  title,
  description,
  access,
  active,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  access: string;
  active?: boolean;
}) {
  const Icon = icon;

  return (
    <article className="rounded-[20px] border border-[#dfe8f3] bg-white p-7 shadow-[0_18px_34px_rgba(180,193,229,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#eef1ff] text-[#4d63e1]">
          <Icon className="h-7 w-7" strokeWidth={2.1} />
        </span>

        <span
          className={[
            "flex h-7 w-7 items-center justify-center rounded-full border-2",
            active ? "border-[#4d63e1] bg-[#4d63e1]" : "border-[#4d63e1] bg-white",
          ].join(" ")}
        >
          {active ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
        </span>
      </div>

      <h2 className="mt-7 text-[24px] font-extrabold tracking-[-0.04em] text-[#16345d]">{title}</h2>
      <p className="mt-4 text-[16px] leading-8 text-[#72829a]">{description}</p>

      <div className="mt-8 border-t border-[#e8edf7] pt-6">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#4057d8]">
          {access}
        </p>
      </div>
    </article>
  );
}

export default function VisibilitySettingsPage() {
  return (
    <AppShell title="Catalog Management" activeSection="catalog">
      <div className="mx-auto max-w-[1320px]">
        <section className="mt-12">
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex rounded-[10px] bg-[#eef1ff] px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#4057d8]">
              Visibility Settings
            </span>
            <span className="text-[16px] font-extrabold uppercase tracking-[0.14em] text-[#1f3556]">
              ID: CRS-99201
            </span>
          </div>

          <h1 className="mt-5 text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
            Sustainable Ecosystems 401
          </h1>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <VisibilityCard
            icon={Globe2}
            title="Global Public"
            description="Course is discoverable by search engines and listed on all external portal pages. Open for guest viewing and external registration."
            access="Access Level: Unrestricted"
            active
          />
          <VisibilityCard
            icon={Building2}
            title="Internal Only"
            description="Only authenticated users from affiliated institutions can see and register for this course. Hidden from guest portals."
            access="Access Level: Authenticated"
          />
          <VisibilityCard
            icon={Lock}
            title="Private (Invite Only)"
            description="Course is unlisted. Registration is only possible via a direct secret URL or administrative manual assignment."
            access="Access Level: Direct Link Only"
          />
          <VisibilityCard
            icon={FilePenLine}
            title="Draft"
            description="Course is invisible to all non-admin users. Use this state while curating content or finalizing institutional details."
            access="Access Level: Admin Only"
          />
        </section>

        <section className="mt-10 overflow-hidden rounded-[24px] border border-[#dfe8f3] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
          <div className="bg-[#f6f8fd] px-7 py-6 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
            Institutional Access Matrix
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  <th className="px-7 py-6">Entity Type</th>
                  <th className="px-6 py-6">Public Search</th>
                  <th className="px-6 py-6">Direct Access</th>
                  <th className="px-6 py-6">Admin Override</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Standard Institution", true, true, true],
                  ["Partner Campus", true, false, true],
                  ["External Network", false, false, true],
                ].map(([label, publicSearch, directAccess, adminOverride]) => (
                  <tr key={label as string} className="border-t border-[#eef2f8]">
                    <td className="px-7 py-6 text-[16px] font-bold text-[#203553]">{label}</td>
                    {[publicSearch, directAccess, adminOverride].map((value, index) => (
                      <td key={`${label}-${index}`} className="px-6 py-6">
                        {value ? (
                          <Check className="h-6 w-6 text-[#0f8751]" strokeWidth={2.5} />
                        ) : (
                          <span className="text-[28px] leading-none text-[#c2ccdd]">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

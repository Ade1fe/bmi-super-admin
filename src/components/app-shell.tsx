"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChartBar,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileCheck2,
  Grid2x2,
  House,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  TicketCheck,
  Users,
  X,
} from "lucide-react";

export type AppSection =
  | "dashboard"
  | "schools"
  | "student"
  | "courses"
  | "catalog"
  | "analytics"
  | "subscriptions"
  | "payments"
  | "notification"
  | "certificate"
  | "reports"
  | "teams"
  | "support"
  | "settings";

type NavItem = {
  key: AppSection;
  label: string;
  icon: LucideIcon;
  href?: string;
};

type AppShellProps = {
  title: ReactNode;
  activeSection: AppSection;
  children: ReactNode;
  contentClassName?: string;
};

const primaryNav: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: House, href: "/" },
  { key: "schools", label: "Schools", icon: Building2, href: "/schools" },
  { key: "student", label: "Student", icon: Users },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "catalog", label: "Catalog", icon: Grid2x2 },
  { key: "analytics", label: "Analytics", icon: ChartBar },
  { key: "subscriptions", label: "Subscriptions", icon: TicketCheck },
  { key: "payments", label: "Payments", icon: CreditCard },
];

const adminNav: NavItem[] = [
  { key: "notification", label: "Notification", icon: Bell },
  { key: "certificate", label: "Certificate", icon: ShieldCheck },
  { key: "reports", label: "Reports", icon: FileCheck2 },
  { key: "teams", label: "Teams", icon: BriefcaseBusiness },
  { key: "support", label: "Support", icon: CircleHelp },
  { key: "settings", label: "Settings", icon: Settings },
];

function AvatarIllustration() {
  return (
    <svg viewBox="0 0 56 56" className="h-12 w-12 rounded-full">
      <defs>
        <linearGradient id="avatarBg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fde9c8" />
          <stop offset="100%" stopColor="#efe7ff" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="28" fill="url(#avatarBg)" />
      <circle cx="28" cy="32" r="10.5" fill="#ffdcb5" />
      <path
        d="M16.5 24.5c0-8 5.1-13 11.7-13 7.6 0 12.8 5.7 12.8 14.9v5.5h-3.7v-4.9c0-2.4-1.6-4.2-4.2-4.2H23c-2.7 0-4.6 1.9-4.6 4.7v4.4h-1.9Z"
        fill="#2f3348"
      />
      <circle cx="23.5" cy="31.5" r="4.6" fill="none" stroke="#2a314d" strokeWidth="1.5" />
      <circle cx="32.7" cy="31.5" r="4.6" fill="none" stroke="#2a314d" strokeWidth="1.5" />
      <path d="M28.1 31.6h-1.8" stroke="#2a314d" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M27 35.8c1 .9 2.4.9 3.4 0" stroke="#bc7b67" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M21.3 46.5c2.6-4 6.4-5.9 10.8-5.9 4.2 0 7.3 1.6 10.1 5.2" fill="#7d8ce7" />
    </svg>
  );
}

function SidebarItem({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const className = [
    "group flex h-12 items-center gap-3 rounded-2xl px-4 text-left text-[15px] font-semibold transition-colors",
    active
      ? "bg-[#4b8a60] text-white shadow-[0_14px_28px_rgba(75,138,96,0.16)]"
      : "text-[#5f6576] hover:bg-white hover:text-[#19355d]",
  ].join(" ");

  if (item.href) {
    return (
      <Link href={item.href} onClick={onNavigate} className={className}>
        <Icon
          className={[
            "h-[21px] w-[21px]",
            active ? "text-white [stroke:white]" : "text-current group-hover:text-[#19355d]",
          ].join(" ")}
          strokeWidth={1.9}
        />
        <span className={active ? "text-white" : "text-current"}>{item.label}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onNavigate} className={className}>
      <Icon
        className={[
          "h-[21px] w-[21px]",
          active ? "text-white [stroke:white]" : "text-current group-hover:text-[#19355d]",
        ].join(" ")}
        strokeWidth={1.9}
      />
      <span className={active ? "text-white" : "text-current"}>{item.label}</span>
    </button>
  );
}

export function AppShell({
  title,
  activeSection,
  children,
  contentClassName,
}: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#fafbff] text-[#173257] lg:h-screen lg:overflow-hidden">
      {isMobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-[#12213f]/30 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex min-h-screen flex-col lg:h-screen lg:flex-row">
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-[274px] max-w-[85vw] overflow-y-auto bg-[#f8fbfa] transition-transform duration-300 lg:static lg:h-screen lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:border-r lg:border-[#e7ebf7]",
            isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-[88px] items-center justify-between border-b border-[#e7ebf7] px-6 lg:h-[101px] lg:px-8">
              <Image
                src="/bmi-logo.svg"
                alt="BMI logo"
                width={272}
                height={247}
                className="h-auto w-[112px]"
                priority
              />
              <button
                type="button"
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#5f6676] lg:hidden"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <X className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </div>

            <div className="flex-1 px-5 py-6 lg:px-7 lg:py-7">
              <nav className="space-y-4">
                {primaryNav.map((item) => (
                  <SidebarItem
                    key={item.key}
                    item={item}
                    active={item.key === activeSection}
                    onNavigate={() => setIsMobileNavOpen(false)}
                  />
                ))}
              </nav>

              <div className="mt-10">
                <p className="px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#767f92]">
                  Administration
                </p>
                <nav className="mt-4 space-y-4">
                  {adminNav.map((item) => (
                    <SidebarItem
                      key={item.key}
                      item={item}
                      active={item.key === activeSection}
                      onNavigate={() => setIsMobileNavOpen(false)}
                    />
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col lg:h-screen lg:overflow-hidden">
          <header className="sticky top-0 z-20 border-b border-[#e7ebf7] bg-white px-4 sm:px-6 lg:px-9">
            <div className="flex min-h-[84px] flex-col justify-center gap-4 py-4 lg:min-h-[101px] lg:gap-5 lg:py-0 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Open navigation"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7ebf7] text-[#5f6676] lg:hidden"
                    onClick={() => setIsMobileNavOpen(true)}
                  >
                    <Menu className="h-5 w-5" strokeWidth={2.2} />
                  </button>
                  <div className="text-[26px] font-extrabold tracking-[-0.04em] text-[#16345d] sm:text-[32px]">
                    {title}
                  </div>
                </div>

                <button
                  type="button"
                  className="relative flex h-10 w-10 items-center justify-center text-[#6e7688] xl:hidden"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" strokeWidth={1.9} />
                  <span className="absolute right-[6px] top-[6px] h-2.5 w-2.5 rounded-full bg-[#f17272]" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-4 xl:max-w-[980px] xl:flex-row xl:items-center xl:justify-end">
                <label className="flex h-[52px] w-full max-w-[610px] items-center gap-3 rounded-2xl bg-[#f3f6fb] px-5 sm:px-7 text-[#95a0b4]">
                  <Search className="h-5 w-5" strokeWidth={2} />
                  <input
                    className="w-full bg-transparent text-[15px] font-medium text-[#274267] outline-none placeholder:text-[#98a2b6]"
                    placeholder="Search students, courses or reports..."
                  />
                </label>

                <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
                  <button
                    type="button"
                    className="relative hidden h-10 w-10 items-center justify-center text-[#6e7688] xl:flex"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" strokeWidth={1.9} />
                    <span className="absolute right-[6px] top-[6px] h-2.5 w-2.5 rounded-full bg-[#f17272]" />
                  </button>

                  <button type="button" className="flex items-center gap-3 text-left">
                    <div className="min-w-0 hidden sm:block">
                      <p className="text-[15px] font-bold text-[#16345d]">Naomi Tan</p>
                      <p className="text-[13px] font-medium text-[#787f90]">Super Admin</p>
                    </div>
                    <AvatarIllustration />
                    <ChevronDown className="h-4 w-4 text-[#5f6676]" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div
            className={[
              "flex-1 bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:overflow-y-auto lg:px-11 lg:py-8",
              contentClassName ?? "",
            ].join(" ")}
          >
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

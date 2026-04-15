import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export default function InvoicePage() {
  return (
    <AppShell
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/schools/create-school/subscription" className="text-[#223b61]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <span>Subscription</span>
        </div>
      }
      activeSection="schools"
    >
      <div className="mx-auto max-w-[760px]">
        <section className="text-center">
          <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#17345d] sm:text-[28px]">
            Invoice #INV-2023-001
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[16px] text-[#304a72] sm:text-[18px]">
            <span>Issued on Oct 24, 2023</span>
            <span className="rounded-2xl bg-[#eff2ff] px-4 py-2 text-[14px] font-bold text-[#4d63e9]">
              PAID
            </span>
          </div>
        </section>

        <section className="mt-10 rounded-[24px] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.12)]">
          <div className="rounded-t-[24px] bg-[#f4f6ff] px-6 py-6 text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#4758d5] sm:px-8 sm:text-[16px]">
            Invoice Details
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[16px] font-bold text-[#0f8751]">Billed To</p>
                <p className="mt-5 text-[18px] font-extrabold text-[#182f53]">Greenfield Academy</p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[16px] font-bold text-[#4a8a60]">Payment Details</p>
                <div className="mt-3 flex items-center gap-3 sm:justify-end">
                  <div>
                    <p className="text-[18px] font-medium text-[#182f53]">Visa</p>
                    <p className="mt-1 text-[14px] text-[#90a1bf]">**** **** **** 989</p>
                  </div>
                  <span className="text-[28px] font-extrabold text-[#2449da]">VISA</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-[20px] border border-[#dde5e7] p-6">
                <p className="text-[16px] font-bold text-[#0f8751]">Address</p>
                <p className="mt-3 text-[16px] leading-8 text-[#182f53]">
                  123 Education Way,
                  <br />
                  Springfield, IL 62704,United States
                </p>
              </div>

              <div className="rounded-[20px] border border-[#dde5e7] p-6">
                <p className="text-[16px] font-bold text-[#0f8751]">Description</p>
                <p className="mt-3 text-[18px] font-bold text-[#182f53]">
                  School Premium Plan (Annual)
                </p>
                <p className="mt-1 text-[16px] text-[#90a1bf]">
                  Unlimited students, priority support, and custom branding.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#dde5e7] p-6">
                <p className="text-[16px] font-bold text-[#0f8751]">Period</p>
                <p className="mt-3 text-[18px] font-medium text-[#182f53]">Oct 20, 2023 - Oct 19, 2024</p>
              </div>
            </div>

            <div className="mt-8 space-y-3 text-[18px]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#0f8751]">Amount</span>
                <span className="font-extrabold text-[#182f53]">$249.00</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#0f8751]">Subtotal</span>
                <span className="font-extrabold text-[#182f53]">$249.00</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#0f8751]">Tax (0%)</span>
                <span className="font-extrabold text-[#182f53]">$00</span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-2">
                <span className="text-[#0f8751]">Total Paid</span>
                <span className="text-[24px] font-extrabold text-[#4659d8]">$249.00</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

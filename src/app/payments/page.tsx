"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ReceiptText,
  UserRound,
  WalletCards,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { endpoints, apiRequest } from "@/lib/endpoints";
import { useAuthSession } from "@/lib/auth-session";

type TransactionStatus = "PAID" | "PENDING" | "FAILED";
type PaymentMethod = "Visa" | "PayPal" | "Bank Transfer" | "Mastercard" | "Wire" | string;

type RevenueMetric = {
  label: string;
  value: string;
  note: string;
  tone: "positive" | "negative";
  icon: typeof WalletCards;
  iconBoxClassName: string;
};

type TransactionRow = {
  id: string | number;
  date: string;
  payer: string;
  payerDetail: string;
  avatar: "initials" | "photo";
  avatarText?: string;
  amount: string;
  plan: string;
  method: PaymentMethod;
  status: TransactionStatus;
};

const defaultMetrics: RevenueMetric[] = [
  {
    label: "Total Revenue",
    value: "₦428,500.00",
    note: "₦428,500.00",
    tone: "positive",
    icon: WalletCards,
    iconBoxClassName: "bg-[#edf7f1] text-[#0f8751]",
  },
  {
    label: "Revenue from Schools",
    value: "₦310,200.00",
    note: "+8.2% from last month",
    tone: "positive",
    icon: Building2,
    iconBoxClassName: "bg-[#edf7f1] text-[#0f8751]",
  },
  {
    label: "Revenue from Individuals",
    value: "₦118,300.00",
    note: "+15.3% from last month",
    tone: "positive",
    icon: UserRound,
    iconBoxClassName: "bg-[#edf7f1] text-[#0f8751]",
  },
  {
    label: "Refunds",
    value: "₦2,450.00",
    note: "-2.1% from last month",
    tone: "negative",
    icon: ReceiptText,
    iconBoxClassName: "bg-[#fff1f1] text-[#ff5b5b]",
  },
];

const defaultTrendValues = [
  77, 78, 77, 77.5, 77.5, 78, 78, 79, 78.5, 80, 79, 80, 80.5, 80, 81.5, 83,
  84, 84, 84.5, 84, 83, 81, 80.5, 84, 85, 85.5, 87.5, 88, 88.5, 87.5, 85.5,
  85.5, 87.2, 86, 85.5, 86.5, 87, 89, 91,
];

const defaultTransactions: TransactionRow[] = [
  {
    id: 1,
    date: "Oct 24, 2023",
    payer: "St. Highwood School",
    payerDetail: "School Account",
    avatar: "initials",
    avatarText: "SH",
    amount: "₦12,500.00",
    plan: "Enterprise",
    method: "Visa",
    status: "PAID",
  },
  {
    id: 2,
    date: "Oct 23, 2023",
    payer: "Alex Johnson",
    payerDetail: "Individual",
    avatar: "photo",
    amount: "₦299.00",
    plan: "Premium",
    method: "PayPal",
    status: "PAID",
  },
  {
    id: 3,
    date: "Oct 22, 2023",
    payer: "Tech Academy",
    payerDetail: "Institution",
    avatar: "initials",
    avatarText: "TC",
    amount: "₦4,800.00",
    plan: "Institute",
    method: "Bank Transfer",
    status: "PENDING",
  },
  {
    id: 4,
    date: "Oct 21, 2023",
    payer: "Sara Williams",
    payerDetail: "Individual",
    avatar: "photo",
    amount: "₦99.00",
    plan: "Basic",
    method: "Mastercard",
    status: "FAILED",
  },
  {
    id: 5,
    date: "Oct 20, 2023",
    payer: "Global Learning Corp",
    payerDetail: "Corporate",
    avatar: "initials",
    avatarText: "GL",
    amount: "₦25,000.00",
    plan: "Partner",
    method: "Wire",
    status: "PAID",
  },
];

function statusClassName(status: TransactionStatus) {
  if (status === "PAID") {
    return "bg-[#dff5e7] text-[#16a165]";
  }
  if (status === "PENDING") {
    return "bg-[#fff1d7] text-[#e19218]";
  }
  return "bg-[#ffe1e1] text-[#df4c4c]";
}

function methodIcon(method: PaymentMethod) {
  if (method === "Bank Transfer" || method === "Wire") {
    return <Building2 className="h-5 w-5 text-[#7184a3]" strokeWidth={2} />;
  }
  if (method === "PayPal") {
    return <WalletCards className="h-5 w-5 text-[#7184a3]" strokeWidth={2} />;
  }
  return <CreditCard className="h-5 w-5 text-[#7184a3]" strokeWidth={2} />;
}

function TransactionAvatar({ row }: { row: TransactionRow }) {
  if (row.avatar === "photo") {
    return (
      <div className="h-10 w-10 rounded-full bg-[radial-gradient(circle_at_top,#ffd5a8_10%,#8c5a42_38%,#cfd8ef_70%,#6da5ff_100%)] shadow-[0_8px_18px_rgba(114,137,194,0.2)]" />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f4ef] text-[15px] font-bold text-[#117b54]">
      {row.avatarText || "SH"}
    </div>
  );
}

export default function PaymentsPage() {
  const { session } = useAuthSession();
  const token = session?.token;

  const [period, setPeriod] = useState<string>("last_30_days");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const [metrics, setMetrics] = useState<RevenueMetric[]>(defaultMetrics);
  const [trendValues, setTrendValues] = useState<number[]>(defaultTrendValues);
  const [transactions, setTransactions] = useState<TransactionRow[]>(defaultTransactions);
  const [pagination, setPagination] = useState({ total: 12840, page: 1, limit: 5, totalPages: 2568 });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);

    const fetchPaymentOverview = async () => {
      try {
        const url = endpoints.admin.payments.overview(period);
        const res = await apiRequest<any>(url, { authToken: token });

        if (isSubscribed && res?.data) {
          const apiMetrics = res.data.metrics;
          if (Array.isArray(apiMetrics) && apiMetrics.length >= 4) {
            setMetrics([
              { ...apiMetrics[0], icon: WalletCards },
              { ...apiMetrics[1], icon: Building2 },
              { ...apiMetrics[2], icon: UserRound },
              { ...apiMetrics[3], icon: ReceiptText },
            ]);
          }

          if (Array.isArray(res.data.trendValues)) {
            setTrendValues(res.data.trendValues);
          }

          if (Array.isArray(res.data.transactions)) {
            setTransactions(res.data.transactions);
          }

          if (res.data.pagination) {
            setPagination(res.data.pagination);
          }
        }
      } catch (err) {
        console.error("Failed to fetch payment overview:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    fetchPaymentOverview();
    return () => {
      isSubscribed = false;
    };
  }, [period, token]);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    try {
      const url = endpoints.admin.payments.transactions(newPage, pagination.limit, period);
      const res = await apiRequest<any>(url, { authToken: token });
      if (res?.data?.transactions) {
        setTransactions(res.data.transactions);
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    } catch (err) {
      console.error("Failed to change transaction page:", err);
    }
  };

  // SVG Chart calculations
  const chartWidth = 1180;
  const chartHeight = 340;
  const minTrend = Math.min(...trendValues);
  const maxTrend = Math.max(...trendValues);
  const trendRange = maxTrend - minTrend || 1;
  const linePoints = trendValues
    .map((value, index) => {
      const x = 34 + (index * (chartWidth - 68)) / (trendValues.length - 1);
      const y = 174 - ((value - minTrend) / trendRange) * 68;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `34,238 ${linePoints} ${chartWidth - 34},238`;

  return (
    <AppShell
      title="Payments & Revenue"
      activeSection="payments"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8 bg-[#f8fafc] min-h-screen"
    >
      <div className="mx-auto max-w-7xl">
        {/* Top 4 KPI Cards */}
        <section className="grid gap-4 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.label}
                className="rounded-[18px] border border-[#dfe6f7] bg-white px-6 py-7 shadow-[0_16px_34px_rgba(171,185,223,0.05)] transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[16px] font-medium text-[#223f64]">{metric.label}</p>
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] ${metric.iconBoxClassName}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.1} />
                  </span>
                </div>
                <p className="mt-6 text-[34px] font-extrabold tracking-[-0.05em] text-[#173257]">
                  {metric.value}
                </p>
                <p
                  className={`mt-4 text-[14px] font-semibold ${
                    metric.tone === "negative" ? "text-[#ff4f68]" : "text-[#0f8751]"
                  }`}
                >
                  {metric.note}
                </p>
              </article>
            );
          })}
        </section>

        {/* Middle Section: Revenue Trends Area Chart */}
        <section className="mt-8 rounded-[22px] bg-white p-7 shadow-[0_18px_38px_rgba(180,193,229,0.07)] border border-slate-200/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                Revenue Trends
              </h2>
              <p className="mt-1 text-[15px] text-[#7c8ba3]">
                Monthly overview of subscription and licensing revenue
              </p>
            </div>

            {/* Date Filter Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#dbe3f1] bg-[#f8fbff] px-4 text-[14px] font-semibold text-[#314868] hover:bg-slate-100"
              >
                <CalendarDays className="h-4 w-4" strokeWidth={2} />
                {period === "last_7_days"
                  ? "Last 7 days"
                  : period === "last_90_days"
                    ? "Last 90 days"
                    : period === "last_year"
                      ? "Last 1 year"
                      : "Last 30 days"}
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>

              {showDatePicker && (
                <div className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button
                    type="button"
                    onClick={() => { setPeriod("last_7_days"); setShowDatePicker(false); }}
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Last 7 days
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPeriod("last_30_days"); setShowDatePicker(false); }}
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Last 30 days
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPeriod("last_90_days"); setShowDatePicker(false); }}
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Last 90 days
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPeriod("last_year"); setShowDatePicker(false); }}
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Last 1 year
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-[18px] border border-[#eef2f7] p-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
              {[0, 25, 50, 75, 100].map((level, index) => {
                const y = 36 + (index * 202) / 4;
                return (
                  <g key={level}>
                    <line
                      x1="34"
                      y1={y}
                      x2={chartWidth - 34}
                      y2={y}
                      stroke="#edf1f7"
                      strokeWidth="1"
                    />
                    <text x="0" y={y + 4} fill="#a0aec2" fontSize="12" fontWeight="600">
                      {100 - level}%
                    </text>
                  </g>
                );
              })}
              <defs>
                <linearGradient id="paymentArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4c8d69" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#4c8d69" stopOpacity="0.03" />
                </linearGradient>
              </defs>
              <polygon points={areaPoints} fill="url(#paymentArea)" />
              <polyline
                points={linePoints}
                fill="none"
                stroke="#4b8a60"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="mt-3 grid grid-cols-12 text-center text-[14px] font-medium text-[#73839d]">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
              ].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Section: Recent Transactions Table */}
        <section className="mt-8 overflow-hidden rounded-[22px] border border-[#dfe6f2] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#e8edf7] px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Recent Transactions
            </h2>
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              className="text-[16px] font-bold text-[#0f8751] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#f6f8fd]">
                <tr className="text-left text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  <th className="px-6 py-5">Date</th>
                  <th className="px-4 py-5">Payer</th>
                  <th className="px-4 py-5">Amount</th>
                  <th className="px-4 py-5">Plan</th>
                  <th className="px-4 py-5">Method</th>
                  <th className="px-4 py-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-[#edf1f7] text-[15px] text-[#4f5f7c] hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-5 font-medium">{transaction.date}</td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-4">
                        <TransactionAvatar row={transaction} />
                        <div>
                          <p className="font-bold text-[#1d314f]">{transaction.payer}</p>
                          <p className="text-[14px] text-[#7c8ba3]">{transaction.payerDetail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 font-extrabold text-[#17263f]">
                      {transaction.amount}
                    </td>
                    <td className="px-4 py-5">
                      <span className="rounded-full bg-[#f1f4f9] px-3 py-1.5 text-[14px] font-semibold text-[#2a3952]">
                        {transaction.plan}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        {methodIcon(transaction.method)}
                        <span className="font-medium text-[#263754]">{transaction.method}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-[14px] font-bold ${statusClassName(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex flex-col gap-4 border-t border-[#edf1f7] px-6 py-5 text-[15px] text-[#667892] sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium">
              Showing 1 to {transactions.length} of {pagination.total.toLocaleString()} records
            </p>
            <div className="flex items-center gap-2 text-[#33496b]">
              <button
                type="button"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dbe3f1] bg-white disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
              </button>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#0f8751] text-white font-bold"
              >
                {pagination.page}
              </button>

              {pagination.page < pagination.totalPages && (
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] hover:bg-slate-100"
                >
                  {pagination.page + 1}
                </button>
              )}

              {pagination.page + 1 < pagination.totalPages && <span className="px-1">...</span>}

              {pagination.totalPages > 1 && pagination.page !== pagination.totalPages && (
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] hover:bg-slate-100"
                >
                  {pagination.totalPages}
                </button>
              )}

              <button
                type="button"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dbe3f1] bg-white disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

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
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type RevenueMetric = {
  label: string;
  value: string;
  note: string;
  tone: "positive" | "negative";
  icon: typeof WalletCards;
  iconBoxClassName: string;
};

type TransactionStatus = "PAID" | "PENDING" | "FAILED";

type PaymentMethod = "Visa" | "PayPal" | "Bank Transfer" | "Mastercard" | "Wire";

type TransactionRow = {
  id: number;
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

const metrics: RevenueMetric[] = [
  {
    label: "Total Revenue",
    value: "$428,500.00",
    note: "$428,500.00",
    tone: "positive",
    icon: WalletCards,
    iconBoxClassName: "bg-[#edf7f1] text-[#0f8751]",
  },
  {
    label: "Revenue from Schools",
    value: "$310,200.00",
    note: "+8.2% from last month",
    tone: "positive",
    icon: Building2,
    iconBoxClassName: "bg-[#edf7f1] text-[#0f8751]",
  },
  {
    label: "Revenue from Individuals",
    value: "$118,300.00",
    note: "+15.3% from last month",
    tone: "positive",
    icon: UserRound,
    iconBoxClassName: "bg-[#edf7f1] text-[#0f8751]",
  },
  {
    label: "Refunds",
    value: "$2,450.00",
    note: "-2.1% from last month",
    tone: "negative",
    icon: ReceiptText,
    iconBoxClassName: "bg-[#fff1f1] text-[#ff5b5b]",
  },
];

const trendValues = [
  77, 78, 77, 77.5, 77.5, 78, 78, 79, 78.5, 80, 79, 80, 80.5, 80, 81.5, 83,
  84, 84, 84.5, 84, 83, 81, 80.5, 84, 85, 85.5, 87.5, 88, 88.5, 87.5, 85.5,
  85.5, 87.2, 86, 85.5, 86.5, 87, 89, 91,
];

const transactions: TransactionRow[] = [
  {
    id: 1,
    date: "Oct 24, 2023",
    payer: "St. Highwood School",
    payerDetail: "School Account",
    avatar: "initials",
    avatarText: "SH",
    amount: "$12,500.00",
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
    amount: "$299.00",
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
    amount: "$4,800.00",
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
    amount: "$99.00",
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
    amount: "$25,000.00",
    plan: "Partner",
    method: "Wire",
    status: "PAID",
  },
];

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

function RevenueCard({ metric }: { metric: RevenueMetric }) {
  const Icon = metric.icon;

  return (
    <article className="rounded-[18px] border border-[#dfe6f7] bg-white px-6 py-7 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[16px] font-medium text-[#223f64]">{metric.label}</p>
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] ${metric.iconBoxClassName}`}>
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
}

function TransactionAvatar({ row }: { row: TransactionRow }) {
  if (row.avatar === "photo") {
    return (
      <div className="h-10 w-10 rounded-full bg-[radial-gradient(circle_at_top,#ffd5a8_10%,#8c5a42_38%,#cfd8ef_70%,#6da5ff_100%)] shadow-[0_8px_18px_rgba(114,137,194,0.2)]" />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f4ef] text-[15px] font-bold text-[#117b54]">
      {row.avatarText}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <AppShell
      title="Payments & Revenue"
      activeSection="payments"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <section className="grid gap-4 xl:grid-cols-4">
          {metrics.map((metric) => (
            <RevenueCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="mt-8 rounded-[22px] bg-white p-7 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                Revenue Trends
              </h2>
              <p className="mt-1 text-[15px] text-[#7c8ba3]">
                Monthly overview of subscription and licensing revenue
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#dbe3f1] bg-[#f8fbff] px-4 text-[14px] font-semibold text-[#314868]"
            >
              <CalendarDays className="h-4 w-4" strokeWidth={2} />
              Last 30 days
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </button>
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

        <section className="mt-8 overflow-hidden rounded-[22px] border border-[#dfe6f2] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#e8edf7] px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Recent Transactions
            </h2>
            <button
              type="button"
              className="text-[16px] font-bold text-[#0f8751]"
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
                    className="border-t border-[#edf1f7] text-[15px] text-[#4f5f7c]"
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
                      <span className={`rounded-full px-3 py-1.5 text-[14px] font-bold ${statusClassName(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#edf1f7] px-6 py-5 text-[15px] text-[#667892] sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium">Showing 1 to 5 of 12,840 certificates</p>
            <div className="flex items-center gap-2 text-[#33496b]">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dbe3f1] bg-white"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#0f8751] text-white"
              >
                1
              </button>
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-[8px]">
                2
              </button>
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-[8px]">
                3
              </button>
              <span className="px-1">...</span>
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-[8px]">
                256
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dbe3f1] bg-white"
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

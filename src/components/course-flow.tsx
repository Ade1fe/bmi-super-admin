import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown, X } from "lucide-react";

const steps = [
  { label: "Basic Info & Modules", href: "/courses/create" },
  { label: "Content Upload", href: "/courses/create/content-upload" },
  { label: "Review & Launch", href: "/courses/create/review-launch" },
];

type CoursePageTitleProps = {
  label: string;
  backHref?: string;
};

type CourseFlowStepperProps = {
  currentStep: 1 | 2 | 3;
};

type CourseActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

type CourseFieldProps = {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  fullWidth?: boolean;
  rightIcon?: ReactNode;
};

type CourseTextAreaProps = {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
};

type CourseSelectFieldProps = {
  label: string;
  options: string[];
  defaultValue: string;
};

type CourseModalProps = {
  closeHref: string;
  maxWidthClassName?: string;
  children: ReactNode;
};

export function CoursePageTitle({ label, backHref = "/courses" }: CoursePageTitleProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link href={backHref} className="text-[#223b61]">
        <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
      </Link>
      <span>{label}</span>
    </div>
  );
}

export function CourseFlowStepper({ currentStep }: CourseFlowStepperProps) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e6ebf7] bg-[#eef1fb]">
      <div className="grid gap-3 p-3 md:grid-cols-3 md:gap-4">
        {steps.map((step, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3;
          const isActive = stepNumber === currentStep;
          const isPast = stepNumber < currentStep;

          return (
            <Link
              key={step.label}
              href={step.href}
              className={[
                "flex min-h-[62px] items-center justify-center rounded-2xl px-5 text-center text-[16px] font-semibold transition-colors",
                isActive
                  ? "bg-white text-[#4b8a60] shadow-[0_18px_35px_rgba(140,154,193,0.16)]"
                  : isPast
                    ? "bg-[#f8fafc] text-[#51627f]"
                    : "text-[#687896]",
              ].join(" ")}
            >
              {step.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function CourseActionLink({
  href,
  children,
  variant = "primary",
  className,
}: CourseActionLinkProps) {
  const variantClassName =
    variant === "primary"
      ? "button-primary bg-[#4b8a60] text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
      : variant === "secondary"
        ? "border border-[#cadfd5] bg-[#edf5f1] text-[#4b8a60]"
        : "text-[#4b8a60]";

  return (
    <Link
      href={href}
      className={[
        "inline-flex h-14 items-center justify-center gap-3 rounded-[12px] px-6 text-[16px] font-semibold",
        variantClassName,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Link>
  );
}

export function CourseTextField({
  label,
  placeholder,
  defaultValue,
  fullWidth,
  rightIcon = <ChevronDown className="h-5 w-5 text-[#8c98b1]" strokeWidth={2.1} />,
}: CourseFieldProps) {
  return (
    <label className={fullWidth ? "col-span-full" : ""}>
      <span className="mb-3 block text-[16px] font-bold tracking-[-0.02em] text-[#19355d]">
        {label}
      </span>
      <span className="flex h-[68px] items-center justify-between rounded-[18px] border border-[#d7deee] bg-white px-5">
        <input
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-transparent text-[16px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
        />
        {rightIcon}
      </span>
    </label>
  );
}

export function CourseSelectField({
  label,
  options,
  defaultValue,
}: CourseSelectFieldProps) {
  return (
    <label>
      <span className="mb-3 block text-[16px] font-bold tracking-[-0.02em] text-[#19355d]">
        {label}
      </span>
      <span className="relative flex h-[68px] items-center rounded-[18px] border border-[#d7deee] bg-white px-5">
        <select
          defaultValue={defaultValue}
          className="h-full w-full appearance-none bg-transparent pr-10 text-[16px] text-[#264267] outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8c98b1]" strokeWidth={2.1} />
      </span>
    </label>
  );
}

export function CourseTextArea({
  label,
  placeholder,
  defaultValue,
  rows = 6,
}: CourseTextAreaProps) {
  return (
    <label>
      <span className="mb-3 block text-[16px] font-bold tracking-[-0.02em] text-[#19355d]">
        {label}
      </span>
      <textarea
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-[#d7deee] bg-white px-5 py-4 text-[16px] leading-7 text-[#264267] outline-none placeholder:text-[#8d99b1]"
      />
    </label>
  );
}

export function CourseModal({
  closeHref,
  maxWidthClassName = "max-w-[860px]",
  children,
}: CourseModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1730]/45 px-4 py-8 backdrop-blur-[2px]">
      <Link
        href={closeHref}
        aria-label="Close modal"
        className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white transition-colors hover:bg-white/25 lg:right-16 lg:top-16"
      >
        <X className="h-6 w-6" strokeWidth={2.2} />
      </Link>
      <div
        className={[
          "relative max-h-[calc(100vh-4rem)] w-full overflow-y-auto rounded-[28px] bg-white shadow-[0_34px_80px_rgba(17,24,39,0.28)]",
          maxWidthClassName,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

export function ContinueArrow() {
  return <ArrowRight className="h-5 w-5" strokeWidth={2.2} />;
}

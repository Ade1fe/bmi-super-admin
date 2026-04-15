
import Image from "next/image";
import type { ReactNode } from "react";
import { Check, EyeOff } from "lucide-react";

type OnboardingShellProps = {
  heroTitle: ReactNode;
  heroDescription?: ReactNode;
  panelTitle: ReactNode;
  panelDescription?: ReactNode;
  topAction?: ReactNode;
  children: ReactNode;
  alignPanelCenter?: boolean;
};

type FieldProps = {
  label: string;
  type?: "text" | "email" | "password";
  defaultValue?: string;
  placeholder?: string;
  trailingIcon?: ReactNode;
};

type OtpInputRowProps = {
  values?: string[];
};

export function OnboardingShell({
  heroTitle,
  heroDescription,
  panelTitle,
  panelDescription,
  topAction,
  children,
  alignPanelCenter,
}: OnboardingShellProps) {
  return (
    <main className="min-h-screen bg-white text-[#173257]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,620px)]">
        <section className="order-1 bg-[#f8faf8] lg:order-1">
          <div className="flex min-h-full flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-14">
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/bmi-logo.svg"
                alt="BMI logo"
                width={272}
                height={247}
                className="h-auto w-[112px] sm:w-[138px] lg:w-[164px]"
                priority
              />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 sm:gap-10 sm:py-10 lg:gap-12 xl:flex-row xl:items-center xl:justify-between xl:gap-8 xl:py-16">
              <div className="order-1 w-full max-w-[500px] xl:max-w-[520px]">
                <Image
                  src="/onboarding-img.svg"
                  alt="BMI platform preview"
                  width={498}
                  height={356}
                  className="mx-auto h-auto w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] xl:max-w-[498px]"
                  priority
                />
              </div>

              <div className="order-2 w-full max-w-[520px] text-center xl:text-left">
                <h1 className="text-[22px] font-extrabold leading-[1.08] tracking-[-0.05em] text-[#4d8d63] sm:text-[28px] lg:text-[40px] xl:text-[46px]">
                  {heroTitle}
                </h1>

                {heroDescription ? (
                  <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-6 text-[#243c63] sm:mt-4 sm:text-[16px] sm:leading-7 xl:mx-0 xl:max-w-[540px]">
                    {heroDescription}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Desktop Footer */}
            <div className="mt-4 hidden lg:flex lg:justify-start">
              <Image
                src="/footer-img.svg"
                alt="Joined by educational leaders"
                width={370}
                height={36}
                className="h-auto w-full max-w-[370px]"
              />
            </div>
          </div>
        </section>

        <section className="order-2 flex min-h-fit bg-white lg:order-2 lg:min-h-screen">
          <div className="flex w-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="flex min-h-8 items-center justify-end">{topAction}</div>

            <div
              className={[
                "mx-auto flex w-full max-w-[476px] flex-1 flex-col",
                alignPanelCenter
                  ? "justify-center"
                  : "justify-center lg:justify-start lg:pt-20 xl:pt-24",
              ].join(" ")}
            >
              <div className={alignPanelCenter ? "text-center" : ""}>
                <h2 className="text-[24px] font-extrabold tracking-[-0.05em] text-[#173257] sm:text-[30px] lg:text-[36px]">
                  {panelTitle}
                </h2>

                {panelDescription ? (
                  <div
                    className={[
                      "mt-3 text-[15px] leading-6 text-[#2d4568] sm:text-[16px] sm:leading-7",
                      alignPanelCenter ? "mx-auto max-w-[360px]" : "max-w-[470px]",
                    ].join(" ")}
                  >
                    {panelDescription}
                  </div>
                ) : null}
              </div>

              <div className="mt-6 sm:mt-8 lg:mt-10">{children}</div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Footer - comes LAST */}
      <div className="px-4 pb-6 pt-2 sm:px-6 lg:hidden">
        <div className="flex justify-center">
          <Image
            src="/footer-img.svg"
            alt="Joined by educational leaders"
            width={370}
            height={36}
            className="h-auto w-full max-w-[220px] sm:max-w-[280px]"
          />
        </div>
      </div>
    </main>
  );
}

export function AuthField({
  label,
  type = "text",
  defaultValue,
  placeholder,
  trailingIcon,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-3 block text-[15px] font-bold text-[#173257] sm:text-[16px]">
        {label}
      </span>

      <span className="flex h-[56px] items-center rounded-[16px] border border-[#d8dfed] bg-white px-4 text-[#47668f] shadow-[0_1px_0_rgba(229,234,245,0.8)] sm:h-[62px] sm:rounded-[18px] sm:px-5">
        <input
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#95a4bc] sm:text-[16px]"
        />
        {trailingIcon ??
          (type === "password" ? (
            <EyeOff className="h-5 w-5 text-[#526b96]" strokeWidth={2} />
          ) : null)}
      </span>
    </label>
  );
}

export function OtpInputRow({ values = ["", "", "", ""] }: OtpInputRowProps) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-5">
      {values.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="flex h-[68px] items-center justify-center rounded-[14px] border border-[#d8dfed] bg-white text-[24px] font-medium text-[#4d8d63] shadow-[0_1px_0_rgba(229,234,245,0.8)] sm:h-[92px] sm:rounded-[16px] sm:text-[32px]"
        >
          {value}
          {index === 0 && !value ? <span className="h-8 w-px bg-[#4d8d63]" /> : null}
        </div>
      ))}
    </div>
  );
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="button-primary flex h-[56px] w-full items-center justify-center rounded-[12px] bg-[#4d8d63] px-6 text-[15px] font-semibold text-white shadow-[0_18px_34px_rgba(77,141,99,0.18)] sm:h-[66px] sm:text-[17px]"
    >
      {children}
    </button>
  );
}

export function AuthFooterText({
  text,
  action,
}: {
  text: string;
  action: ReactNode;
}) {
  return (
    <p className="text-center text-[15px] leading-7 text-[#394f73] sm:text-[16px]">
      {text} {action}
    </p>
  );
}

export function RememberRow({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 text-[15px] font-medium text-[#173257] sm:flex-row sm:items-center sm:justify-between sm:text-[16px]">
      {left}
      {right}
    </div>
  );
}

export function RememberCheckLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#2dc17a] text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      {children}
    </span>
  );
}
import { CircleCheckBig } from "lucide-react";

type CreateSchoolStepperProps = {
  currentStep: 1 | 2 | 3;
};

const steps = [
  { key: 1, step: "STEP 1", label: "Details" },
  { key: 2, step: "STEP 2", label: "Subscription" },
  { key: 3, step: "STEP 3", label: "Activation" },
] as const;

export function CreateSchoolStepper({ currentStep }: CreateSchoolStepperProps) {
  return (
    <section className="mx-auto grid max-w-[980px] gap-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
      {steps.map((item, index) => {
        const done = item.key < currentStep;
        const active = item.key === currentStep;

        return (
          <div key={item.key} className="flex flex-1 items-center gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4 rounded-[22px] border border-[#e4e8f4] bg-white px-4 py-4 sm:flex-col sm:justify-center sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
              <div
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[15px] font-bold sm:h-14 sm:w-14 sm:text-[16px]",
                  done || active ? "bg-[#0f8751] text-white" : "bg-[#eef2f8] text-[#6c7c97]",
                ].join(" ")}
              >
                {done ? <CircleCheckBig className="h-6 w-6" strokeWidth={2.3} /> : item.key}
              </div>
              <div className="min-w-0 sm:text-center">
                <p
                  className={[
                    "text-[12px] font-bold tracking-[0.14em] sm:mt-3 sm:text-[13px]",
                    done || active ? "text-[#0f8751]" : "text-[#c1c8d8]",
                  ].join(" ")}
                >
                  {item.step}
                </p>
                <p
                  className={[
                    "text-[16px] font-extrabold sm:text-[18px]",
                    active || done ? "text-[#182f53]" : "text-[#7887a1]",
                  ].join(" ")}
                >
                  {item.label}
                </p>
              </div>
            </div>

            {index < steps.length - 1 ? (
              <div className="mb-10 hidden h-px flex-1 bg-[#dfe9e6] sm:block" />
            ) : null}
          </div>
        );
      })}
    </section>
  );
}

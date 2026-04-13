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
    <section className="mx-auto flex max-w-[980px] items-center justify-between gap-6">
      {steps.map((item, index) => {
        const done = item.key < currentStep;
        const active = item.key === currentStep;

        return (
          <div key={item.key} className="flex flex-1 items-center gap-4">
            <div className="flex flex-col items-center text-center">
              <div
                className={[
                  "flex h-14 w-14 items-center justify-center rounded-full text-[16px] font-bold",
                  done || active ? "bg-[#0f8751] text-white" : "bg-[#eef2f8] text-[#6c7c97]",
                ].join(" ")}
              >
                {done ? <CircleCheckBig className="h-6 w-6" strokeWidth={2.3} /> : item.key}
              </div>
              <p
                className={[
                  "mt-3 text-[13px] font-bold tracking-[0.14em]",
                  done || active ? "text-[#0f8751]" : "text-[#c1c8d8]",
                ].join(" ")}
              >
                {item.step}
              </p>
              <p
                className={[
                  "text-[18px] font-extrabold",
                  active || done ? "text-[#182f53]" : "text-[#7887a1]",
                ].join(" ")}
              >
                {item.label}
              </p>
            </div>

            {index < steps.length - 1 ? <div className="mb-10 h-px flex-1 bg-[#dfe9e6]" /> : null}
          </div>
        );
      })}
    </section>
  );
}

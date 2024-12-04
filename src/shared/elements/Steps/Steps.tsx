import React from "react";

export interface Step {
  label: string;
  isClickable: boolean;
  id: string;
  icon?: React.ReactNode;
  isPassed?: boolean;
}

interface StepsProps {
  steps: Step[];
  currentStep: string;
  onStepChange: (step: string) => void;
  showSteps?: boolean;
}

const Steps: React.FC<StepsProps> = ({
  steps,
  currentStep,
  onStepChange,
  showSteps = false,
}) => {
  const getTextColor = (step: Step) => {
    if (step.isPassed) {
      return "text-[#00FF11]";
    }
    if (step.id === currentStep) {
      return "text-white";
    }
    return "text-[#919191]";
  };

  return (
    <div className="text-sm font-medium text-center text-white border-b border-[#161724]">
      <ul className="flex flex-wrap -mb-px px-7 items-center gap-3">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            <li className="flex items-center">
              <div
                className={`inline-block p-4 border-b-2 ${
                  step.id === currentStep
                    ? "border-[#00FF11] text-white"
                    : "border-transparent hover:border-[#515ACA] text-gray-400"
                } rounded-t-lg ${
                  step.isClickable ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={
                  step.isClickable ? () => onStepChange(step.id) : undefined
                }
              >
                <div className="flex gap-2.5 uppercase">
                  {step.icon}
                  <div className={getTextColor(step)}>{step.label}</div>
                </div>
              </div>
            </li>
            {showSteps && index < steps.length - 1 && (
              <li className="flex items-center">
                <div className="text-[#919191] text-lg">{" > "}</div>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Steps;

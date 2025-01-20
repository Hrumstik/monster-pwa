import { Step } from "@shared/elements/Steps/Steps";
import { scrollToTop } from "@shared/helpers/common";
import { notification } from "antd";
import { useEffect } from "react";

const useSteps = (steps: Step[]) => {
  useEffect(() => {
    const allStepsPassed = steps.every((step) => step.isPassed);
    if (allStepsPassed) {
      scrollToTop(".overflow-auto");
      notification.success({
        message: "Успешно",
        description: "Вы можете сохранить PWA",
      });
    }
  }, [steps]);
};

export default useSteps;

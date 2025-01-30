import { Step } from "@shared/elements/Steps/Steps";
import { scrollToTop } from "@shared/helpers/common";
import { notification } from "antd";
import { useEffect, useState } from "react";

const useSteps = (steps: Step[], isFinished: boolean) => {
  const [notificationIsShowed, setNotificationIsShowed] = useState(false);

  useEffect(() => {
    const allStepsPassed = steps.every((step) => step.isPassed);
    if (allStepsPassed && !isFinished && !notificationIsShowed) {
      scrollToTop(".overflow-auto");
      notification.success({
        message: "Успешно",
        description: "Вы можете сохранить PWA",
      });
      setNotificationIsShowed(true);
    }
  }, [steps, isFinished, notificationIsShowed]);
};

export default useSteps;

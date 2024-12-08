import { StatusData } from "@models/pwa";
import { useLazyGetPwaContentStatusQuery } from "@store/slices/pwaApi";
import { notification } from "antd";

const useCheckBuildStatus = () => {
  const [checkStatus] = useLazyGetPwaContentStatusQuery();

  const startPolling = ({
    jobId,
    completedStatusCallback,
    finallyCallback,
  }: {
    jobId: string;
    completedStatusCallback: () => void;
    finallyCallback?: () => void;
  }) => {
    const interval = setInterval(async () => {
      try {
        const statusData = await checkStatus(jobId).unwrap();
        if (statusData?.status === StatusData.Completed) {
          clearInterval(interval);
          completedStatusCallback();
        } else if (statusData?.status === StatusData.Failed) {
          notification.error({
            message: "Error",
            description: statusData?.body,
            placement: "topRight",
            duration: 60,
          });
        }
      } catch (e) {
        console.log(e);
        clearInterval(interval);
        notification.error({
          message: "Ошибка",
          description: "Ошибка проверки статуса сборки",
        });
      } finally {
        if (finallyCallback) finallyCallback();
      }
    }, 15000);
  };

  return { startPolling };
};

export default useCheckBuildStatus;

import { StatusData } from "@models/pwa";
import {
  useGetMyUserQuery,
  useLazyGetPwaContentStatusQuery,
} from "@store/slices/pwaApi";
import { notification } from "antd";

const useCheckBuildStatus = () => {
  const [checkStatus] = useLazyGetPwaContentStatusQuery();
  const { refetch: refetchStatus } = useGetMyUserQuery();

  const startPolling = ({
    jobId,
    completedStatusCallback,
    catchCallback,
  }: {
    jobId: string;
    completedStatusCallback?: () => void;
    catchCallback?: () => void;
  }) => {
    const interval = setInterval(async () => {
      try {
        const statusData = await checkStatus(jobId).unwrap();
        if (statusData?.status === StatusData.Completed) {
          clearInterval(interval);
          refetchStatus();
          completedStatusCallback?.();
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
        if (catchCallback) catchCallback();
        notification.error({
          message: "Ошибка",
          description: "Ошибка проверки статуса сборки",
        });
      }
    }, 15000);
  };

  return { startPolling };
};

export default useCheckBuildStatus;

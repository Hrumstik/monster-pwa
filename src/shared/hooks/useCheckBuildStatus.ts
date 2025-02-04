import { StatusData } from "@models/pwa";
import {
  useGetMyUserQuery,
  useLazyGetPwaContentStatusQuery,
} from "@store/apis/pwaApi";
import { notification } from "antd";
import { useUnmount } from "react-use";

const useCheckBuildStatus = () => {
  const [checkStatus] = useLazyGetPwaContentStatusQuery();
  const { refetch: refetchStatus } = useGetMyUserQuery();

  let interval: NodeJS.Timeout;

  const startPolling = ({
    pwaContentId,
    completedStatusCallback,
    failedStatusCallback,
    catchCallback,
  }: {
    pwaContentId: string;
    completedStatusCallback?: () => void;
    failedStatusCallback?: () => void;
    catchCallback?: () => void;
  }) => {
    interval = setInterval(async () => {
      try {
        const statusData = await checkStatus(pwaContentId).unwrap();
        if (statusData?.status === StatusData.Completed) {
          refetchStatus();
          completedStatusCallback?.();
          clearInterval(interval);
        } else if (
          statusData?.status === StatusData.Failed ||
          statusData?.status === StatusData.Error
        ) {
          clearInterval(interval);
          refetchStatus();
          failedStatusCallback?.();
        }
      } catch (e) {
        console.log(e);
        clearInterval(interval);
        catchCallback?.();
        notification.error({
          message: "Ошибка",
          description: "Ошибка проверки статуса сборки",
        });
      }
    }, 5000);
  };

  useUnmount(() => clearInterval(interval));

  return { startPolling };
};

export default useCheckBuildStatus;

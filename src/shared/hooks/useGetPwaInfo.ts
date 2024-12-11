import {
  useGetAllPwaContentQuery,
  useGetMyUserQuery,
} from "@store/slices/pwaApi";

const useGetPwaInfo = () => {
  const allPwaInfo = useGetAllPwaContentQuery();
  const userInfo = useGetMyUserQuery();

  const getPwaInfo = (pwaId: string) => {
    const pwaContent = allPwaInfo.data?.find((pwa) => pwa._id === pwaId);
    const user = userInfo.data;
    const domain = user?.pwas.find(
      (pwa) => pwa.pwaContentId === pwaId
    )?.domainName;
    const nsRecords = user?.pwas.find(
      (pwa) => pwa.pwaContentId === pwaId
    )?.nsRecords;
    const status = user?.pwas.find((pwa) => pwa.pwaContentId === pwaId)?.status;

    return {
      domain,
      appName: pwaContent?.appName,
      pwaName: pwaContent?.pwaName,
      createdAt: pwaContent?.createdAt,
      nsRecords,
      status: status,
    };
  };

  return { getPwaInfo };
};

export default useGetPwaInfo;

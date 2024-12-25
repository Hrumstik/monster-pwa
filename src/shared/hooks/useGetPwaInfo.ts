import {
  useGetAllPwaContentQuery,
  useGetMyUserQuery,
} from "@store/apis/pwaApi";

const useGetPwaInfo = () => {
  const allPwaInfo = useGetAllPwaContentQuery();
  const userInfo = useGetMyUserQuery();

  const getPwaInfo = (pwaId: string) => {
    const pwaContent = allPwaInfo.data?.find((pwa) => pwa._id === pwaId);
    const user = userInfo.data;
    const userPwa = user?.pwas.find((pwa) => pwa.pwaContentId === pwaId);

    return {
      domain: userPwa?.domainName,
      appName: pwaContent?.appName,
      pwaName: pwaContent?.pwaName,
      createdAt: pwaContent?.createdAt,
      nsRecords: userPwa?.nsRecords,
      status: userPwa?.status,
      readyDomainId: userPwa?.readyDomainId,
      pwaTags: pwaContent?.pwaTags,
    };
  };

  return { getPwaInfo };
};

export default useGetPwaInfo;

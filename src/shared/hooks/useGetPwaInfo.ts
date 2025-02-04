import { useState, useEffect } from "react";
import {
  useGetAllPwaContentQuery,
  useGetMyUserQuery,
} from "@store/apis/pwaApi";
import { PwaStatus } from "@models/domain";

type PwaInfo = {
  domain?: string;
  appName?: string;
  pwaName?: string;
  createdAt?: string;
  nsRecords?: {
    name: string;
  }[];
  status?: PwaStatus;
  readyDomainId?: string;
  pwaTags?: string[];
} | null;

const useGetPwaInfo = (pwaId?: string) => {
  const { data: allPwaInfo } = useGetAllPwaContentQuery();
  const { data: userInfo } = useGetMyUserQuery();
  const [pwaInfo, setPwaInfo] = useState<PwaInfo>(null);

  useEffect(() => {
    if (!allPwaInfo || !userInfo || !pwaId) return;

    const pwaContent = allPwaInfo.find((pwa) => pwa._id === pwaId);
    const userPwa = userInfo?.pwas.find((pwa) => pwa.pwaContentId === pwaId);

    setPwaInfo({
      domain: userPwa?.domainName,
      appName: pwaContent?.appName,
      pwaName: pwaContent?.pwaName,
      createdAt: pwaContent?.createdAt,
      nsRecords: userPwa?.nsRecords,
      status: userPwa?.status,
      readyDomainId: userPwa?.readyDomainId,
      pwaTags: pwaContent?.pwaTags,
    });
  }, [allPwaInfo, userInfo, pwaId]);

  const getPwaInfo = (pwaId: string) => {
    if (!allPwaInfo || !userInfo) return null;

    const pwaContent = allPwaInfo.find((pwa) => pwa._id === pwaId);
    const userPwa = userInfo?.pwas.find((pwa) => pwa.pwaContentId === pwaId);

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

  return { pwaInfo, getPwaInfo };
};

export default useGetPwaInfo;

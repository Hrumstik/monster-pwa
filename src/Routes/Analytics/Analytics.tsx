import MonsterSelect from "@shared/elements/Select/MonsterSelect";
import { Spin, Table } from "antd";
import { periodOptions } from "./analyticsHelpers";
import { useEffect, useState } from "react";
import {
  useGetMyUserQuery,
  useLazyGetDomainAnalyticsQuery,
} from "@store/apis/pwaApi";

const Analytics = () => {
  const { data: userInfo, isLoading: userInfoIsLoading } = useGetMyUserQuery();
  const [period, setPeriod] = useState<number | undefined>();
  const [getDomainAnalytic] = useLazyGetDomainAnalyticsQuery();
  const [domainAnalytics, setDomainAnalytics] = useState<
    | {
        pwaContentId: string;
        opens: number;
        installs: number;
        registrations: number;
        deposits: number;
      }[]
    | undefined
  >();

  useEffect(() => {
    if (!userInfo) return;

    const fetchData = async () => {
      const analyticsData = await Promise.all(
        userInfo.pwas.map(async (pwa) => {
          const data = await getDomainAnalytic({
            pwaContentId: pwa.pwaContentId,
            since: period?.toString(),
          }).unwrap();
          return {
            pwaContentId: pwa.pwaContentId,
            opens: data.opens,
            installs: data.installs,
            registrations: data.registrations,
            deposits: data.deposits,
          };
        })
      );
      setDomainAnalytics(analyticsData);
    };

    fetchData();
  }, [period, userInfo]);

  const dataSource =
    userInfo?.pwas.map((pwa) => {
      const data = domainAnalytics?.find(
        (item) => item.pwaContentId === pwa.pwaContentId
      );
      return {
        key: pwa.pwaContentId,
        domain: pwa.domainName,
        opens: data?.opens,
        installs: data?.installs,
        registrations: data?.registrations,
        deposits: data?.deposits,
      };
    }) || [];

  const columns = [
    {
      title: "Домен",
      dataIndex: "domain",
      key: "domain",
      align: "center" as const,
    },
    {
      title: "Открытия",
      dataIndex: "opens",
      key: "opens",
      align: "center" as const,
    },
    {
      title: "Установки",
      dataIndex: "installs",
      key: "installs",
      align: "center" as const,
    },
    {
      title: "Регистрации",
      dataIndex: "registrations",
      key: "registrations",
      align: "center" as const,
    },
    {
      title: "Депозиты",
      dataIndex: "deposits",
      key: "deposits",
      align: "center" as const,
    },
  ];

  const shouldShowSpinner = userInfoIsLoading || domainAnalytics === undefined;

  return shouldShowSpinner ? (
    <Spin fullscreen />
  ) : (
    <div className="px-[50px] pt-[110px] pb-[40px]">
      <div className="flex justify-between items-center mb-[30px]">
        <h1 className="font-bold text-[28px] leading-8 text-white mb-7">
          Аналитика
        </h1>
        <MonsterSelect
          className="h-10 w-[350px]"
          placeholder="Выберите период"
          options={periodOptions}
          value={period}
          onChange={(value) => setPeriod(value)}
        />
      </div>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  );
};

export default Analytics;

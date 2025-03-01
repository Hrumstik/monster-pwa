import { DatePicker, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import {
  useGetMyUserQuery,
  useLazyGetDomainAnalyticsQuery,
} from "@store/apis/pwaApi";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const Analytics = () => {
  const { data: userInfo, isLoading: userInfoIsLoading } = useGetMyUserQuery();
  const [startDate, setStartDate] = useState<undefined | string>();
  const [endDate, setEndDate] = useState<undefined | string>();
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
            startDate,
            endDate,
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
  }, [userInfo, startDate, endDate]);

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
        <RangePicker
          showTime
          size="large"
          format="DD.MM.YYYY HH:mm"
          allowClear={false}
          value={
            startDate && endDate
              ? [dayjs(startDate), dayjs(endDate)]
              : undefined
          }
          onChange={(dates) => {
            if (dates && dates.length === 2 && dates[0] && dates[1]) {
              setStartDate(dates[0].toISOString());
              setEndDate(dates[1].toISOString());
            }
          }}
        />
      </div>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  );
};

export default Analytics;

import { DatePicker, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import {
  useGetMyUserQuery,
  useLazyGetDomainAnalyticsQuery,
} from "@store/apis/pwaApi";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";

interface AnalyticsRow {
  key: string;
  domain: string;
  opens: number;
  installs: number;
  registrations: number;
  deposits: number;
  baseOpens: number;
  baseInstalls: number;
  baseRegistrations: number;
}

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
        userInfo.pwas
          .filter((pwa) => pwa.pwaContentId)
          .map(async (pwa) => {
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

  const dataSource: AnalyticsRow[] =
    userInfo?.pwas
      .filter((pwa) => pwa.pwaContentId)
      .map((pwa) => {
        const data = domainAnalytics?.find(
          (item) => item.pwaContentId === pwa.pwaContentId
        );

        const opens = data?.opens ?? 0;
        const installs = data?.installs ?? 0;
        const registrations = data?.registrations ?? 0;
        const deposits = data?.deposits ?? 0;

        return {
          key: pwa.pwaContentId,
          domain: pwa.domainName || "",
          opens,
          installs,
          registrations,
          deposits,
          baseOpens: opens,
          baseInstalls: installs,
          baseRegistrations: registrations,
        };
      }) || [];

  const formatValue = (value: number, base: number) =>
    base > 0 ? (
      <div className="flex gap-2 items-center justify-center">
        <div>{value}</div>
        <div style={{ fontSize: 12, color: "#999" }}>
          {((value / base) * 100).toFixed(1)}%
        </div>
      </div>
    ) : (
      <div>{value}</div>
    );

  const columns: ColumnsType<AnalyticsRow> = [
    {
      title: "Домен",
      dataIndex: "domain",
      key: "domain",
      align: "center",
    },
    {
      title: "Открытия",
      dataIndex: "opens",
      key: "opens",
      align: "center",
      render: (value: number) => <div>{value}</div>,
    },
    {
      title: "Установки",
      dataIndex: "installs",
      key: "installs",
      align: "center",
      render: (_: number, row: AnalyticsRow) =>
        formatValue(row.installs, row.baseOpens),
    },
    {
      title: "Регистрации",
      dataIndex: "registrations",
      key: "registrations",
      align: "center",
      render: (_: number, row: AnalyticsRow) =>
        formatValue(row.registrations, row.baseInstalls),
    },
    {
      title: "Депозиты",
      dataIndex: "deposits",
      key: "deposits",
      align: "center",
      render: (_: number, row: AnalyticsRow) =>
        formatValue(row.deposits, row.baseRegistrations),
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
      <Table<AnalyticsRow>
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </div>
  );
};

export default Analytics;

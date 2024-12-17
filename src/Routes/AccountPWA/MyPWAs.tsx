import { useEffect, useState } from "react";
import { getPwaStatus, getTabText, MyPWAsTabs } from "./MyPWAsHelpers.tsx";
import MonsterInput from "../../shared/elements/MonsterInput/MonsterInput.tsx";

import { Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetAllPwaContentQuery } from "@store/slices/pwaApi";
import { PreparedPWADataItem } from "@models/pwa.ts";
import Steps from "@shared/elements/Steps/Steps.tsx";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo.ts";
import PwaItem from "./PwaItem/PwaItem.tsx";
import { PwaStatus } from "@models/domain.ts";

const MyPWAs = () => {
  const { data, isLoading, isFetching } = useGetAllPwaContentQuery();

  const { getPwaInfo } = useGetPwaInfo();

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(MyPWAsTabs.All);
  const [availablePWAs, setAvailablePWAs] = useState<
    PreparedPWADataItem[] | null
  >(null);

  const preparePwaData = () =>
    data?.map(({ _id }) => {
      const pwaInfo = getPwaInfo(_id!);
      return {
        pwaName: pwaInfo.pwaName,
        appName: pwaInfo.appName,
        domain: pwaInfo.domain,
        geo: "–",
        createdAt: new Date(pwaInfo.createdAt!),
        status: getPwaStatus(pwaInfo.status!),
        id: _id,
      };
    }) ?? [];

  useEffect(() => {
    if (!data) return;
    switch (currentTab) {
      case MyPWAsTabs.All:
        setAvailablePWAs(preparePwaData());
        break;
      case MyPWAsTabs.Active:
        setAvailablePWAs(
          preparePwaData().filter((pwa) => {
            const actualStatus = getPwaInfo(pwa.id!).status;
            return actualStatus === PwaStatus.ACTIVE;
          }),
        );
        break;
      case MyPWAsTabs.Built:
        setAvailablePWAs(
          preparePwaData().filter((pwa) => {
            const actualStatus = getPwaInfo(pwa.id!).status;
            return actualStatus === PwaStatus.BUILDED;
          }),
        );
        break;
      case MyPWAsTabs.BuildFailed:
        setAvailablePWAs(
          preparePwaData().filter((pwa) => {
            const actualStatus = getPwaInfo(pwa.id!).status;
            return actualStatus === PwaStatus.BUILD_FAILED;
          }),
        );
        break;
      case MyPWAsTabs.WaitingNS:
        setAvailablePWAs(
          preparePwaData().filter((pwa) => {
            const actualStatus = getPwaInfo(pwa.id!).status;
            return actualStatus === PwaStatus.WAITING_NS;
          }),
        );
        break;
      default:
        setAvailablePWAs(preparePwaData());
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.trimEnd()) {
      setAvailablePWAs(preparePwaData);

      return;
    }

    const filteredPWAs = preparePwaData().filter(
      (pwa) =>
        pwa.pwaName?.toLowerCase().includes(e.target.value.toLowerCase()),
    );

    setAvailablePWAs(filteredPWAs);
  };

  const shouldShowLoader = isLoading || isFetching;

  return (
    <div className="px-[50px] pt-[110px] pb-[40px]">
      <div className="flex justify-between items-center mb-7">
        <span className="text-xl font-bold leading-8 text-white">Мои PWA</span>
        <button
          onClick={() => navigate("/create-PWA")}
          className="bg-[#02E314] text-[#FFFFFF] flex items-center justify-center px-3 rounded box-border h-[42px] hover:opacity-80 hover:shadow-sm"
        >
          + Создать PWA
        </button>
      </div>
      <div className="rounded-lg w-full min-h-[62vh] bg-[#20223B]">
        <Steps
          steps={Object.values(MyPWAsTabs).map((tab) => ({
            label: getTabText(tab),
            isClickable: true,
            id: tab,
          }))}
          currentStep={currentTab}
          onStepChange={(step: string) => setCurrentTab(step as MyPWAsTabs)}
        />
        <div className="p-3 flex justify-start">
          <MonsterInput
            onChange={handleSearch}
            className="w-[338px] h-10"
            placeholder="Поиск по названию"
          />
        </div>

        {shouldShowLoader ? (
          <Spin fullscreen />
        ) : (
          <>
            {availablePWAs && availablePWAs?.length > 0 && (
              <table className="table-fixed bg-transparent border-collapse w-full">
                <thead>
                  <tr>
                    <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white truncate ...">
                      Название
                    </th>
                    <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white truncate ...">
                      Домен
                    </th>
                    <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white truncate ...">
                      ГЕО
                    </th>
                    <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white truncate ...">
                      Дата создания
                    </th>
                    <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white truncate ...">
                      Статус
                    </th>
                    <th className="bg-[#515ACA] px-8 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {!!availablePWAs.length &&
                    availablePWAs.map((pwa) => (
                      <PwaItem key={pwa.id} pwa={pwa} />
                    ))}
                </tbody>
              </table>
            )}
            {availablePWAs?.length === 0 && (
              <Empty
                description={<span style={{ color: "white" }}>Нет PWA</span>}
                className="p-[40px]"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPWAs;

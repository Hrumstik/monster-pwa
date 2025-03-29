import { useEffect, useState } from "react";
import { getTabText, MyPWAsTabs } from "./MyPWAsHelpers.tsx";
import MonsterInput from "../../shared/elements/MonsterInput/MonsterInput.tsx";

import { Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import {
  useGetMyUserQuery,
  useGetPwaForDashboardQuery,
  useLazyGetPwaForDashboardQuery,
} from "@store/apis/pwaApi.ts";
import Steps from "@shared/elements/Steps/Steps.tsx";
import PwaItem from "./PwaItem/PwaItem.tsx";
import { useDispatch } from "react-redux";
import {
  addActiveTag,
  getActiveTags,
  getPwaTags,
  removeActiveTag,
  setPwaTags,
} from "@store/slices/pwaTagsSlice.ts";
import { useAppSelector } from "@store/hooks.ts";
import { PwaDashboardItem } from "@models/pwa.ts";
import { PwaStatus } from "@models/domain.ts";

const MyPWAs = () => {
  const dispatch = useDispatch();
  const allPwaTags = useAppSelector(getPwaTags);
  const activePwaTags = useAppSelector(getActiveTags);
  const { data: pwasDashboardData, isLoading: isLoadingPwaDashboardData } =
    useGetPwaForDashboardQuery();
  const { refetch } = useGetMyUserQuery();
  const [getPwaDashboardData] = useLazyGetPwaForDashboardQuery();

  useEffect(() => {
    if (!pwasDashboardData) return;
    setAvailablePwas(pwasDashboardData);
  }, [pwasDashboardData]);

  useEffect(() => {
    const somePwaIsLoading = pwasDashboardData?.some(
      (pwa) => pwa.loading === true
    );
    let intervalId: NodeJS.Timeout | null = null;
    const checkStatus = async () => {
      intervalId = setInterval(async () => {
        if (somePwaIsLoading) {
          const data = await getPwaDashboardData().unwrap();
          setAvailablePwas(data);
          refetch().unwrap();
        }
      }, 30000);
    };
    checkStatus();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [pwasDashboardData, getPwaDashboardData]);

  useEffect(() => {
    if (!pwasDashboardData) return;

    const allPwaTags = pwasDashboardData
      .map((pwa) => pwa.pwaContent.pwaTags)
      .filter((tags) => Array.isArray(tags))
      .flat();

    const uniquePwaTags = Array.from(new Set(allPwaTags));

    dispatch(setPwaTags(uniquePwaTags));
  }, [pwasDashboardData, dispatch]);

  useEffect(() => {
    if (!pwasDashboardData) return;

    const filteredPwas = pwasDashboardData.filter((pwa) =>
      activePwaTags.every((tag) => pwa.pwaContent.pwaTags?.includes(tag))
    );

    setAvailablePwas(filteredPwas);
  }, [activePwaTags]);

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(MyPWAsTabs.All);

  useEffect(() => {
    if (!pwasDashboardData) return;
    switch (currentTab) {
      case MyPWAsTabs.All:
        setAvailablePwas(pwasDashboardData);
        break;
      case MyPWAsTabs.Active:
        setAvailablePwas(
          pwasDashboardData?.filter((pwa) => pwa.status === PwaStatus.ACTIVE)
        );
        break;
      case MyPWAsTabs.Built:
        setAvailablePwas(
          pwasDashboardData?.filter((pwa) => pwa.status === PwaStatus.BUILDED)
        );
        break;
      case MyPWAsTabs.WaitingNS:
        setAvailablePwas(
          pwasDashboardData?.filter(
            (pwa) => pwa.status === PwaStatus.WAITING_NS
          )
        );
        break;
      case MyPWAsTabs.BuildFailed:
        setAvailablePwas(
          pwasDashboardData?.filter(
            (pwa) => pwa.status === PwaStatus.BUILD_FAILED
          )
        );
        break;
    }
  }, [currentTab]);

  const shouldShowLoader = isLoadingPwaDashboardData;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!pwasDashboardData) return;
    const searchValue = e.target.value.toLowerCase();
    const filteredPwas = pwasDashboardData.filter(
      (pwa) =>
        pwa.pwaContent.pwaName?.toLowerCase().includes(searchValue) ||
        pwa.pwaContent.appName?.toLowerCase().includes(searchValue)
    );
    setAvailablePwas(filteredPwas);
  };

  const [availablePwas, setAvailablePwas] = useState<PwaDashboardItem[] | null>(
    null
  );

  return (
    <div className="px-[50px] pt-[110px] pb-[40px]">
      <div className="flex justify-between items-center mb-7">
        <span className="text-xl font-bold leading-8 text-white">Мои PWA</span>
        <button
          onClick={() => navigate("/create-PWA")}
          className="bg-[#02E314] text-[#161724] flex items-center justify-center px-3 rounded box-border h-[42px] hover:opacity-80 hover:shadow-sm"
        >
          + Создать PWA
        </button>
      </div>
      <div className="rounded-lg w-full bg-[#20223B]">
        <Steps
          steps={Object.values(MyPWAsTabs).map((tab) => ({
            label: getTabText(tab),
            isClickable: true,
            id: tab,
          }))}
          currentStep={currentTab}
          onStepChange={(step: string) => setCurrentTab(step as MyPWAsTabs)}
        />
        {pwasDashboardData && pwasDashboardData?.length > 0 && (
          <div className="p-3 flex justify-start gap-5">
            <MonsterInput
              className="w-[338px] h-10"
              placeholder="Поиск по названию"
              onChange={handleSearch}
            />
            <div
              className={`flex-1 rounded-[56px] flex gap-2 flex-wrap  p-[9px]
              
              ${
                allPwaTags.length > 0
                  ? "border border-solid border-[#161724] hover:border-[#515ACA]"
                  : ""
              }
              `}
            >
              {allPwaTags.map((tag) => {
                const isActive = activePwaTags.includes(tag);
                return (
                  <div
                    onClick={() =>
                      dispatch(
                        isActive ? removeActiveTag(tag) : addActiveTag(tag)
                      )
                    }
                    key={tag}
                    className={`h-[22px] text-white select-none hover:scale-110 rounded-[3333px] text-xs cursor-pointer px-2 py-1 flex items-center gap-1
                    ${isActive ? "bg-[#515aca]" : "bg-[#383B66]"}
                    `}
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {shouldShowLoader ? (
          <Spin fullscreen />
        ) : (
          <>
            {pwasDashboardData !== null && (
              <table className="table-fixed bg-transparent border-collapse w-full">
                <thead>
                  <tr className="">
                    <th className="bg-[#515ACA] text-center pl-8 py-3 leading-5 text-sm font-bold text-white truncate ...">
                      Название
                    </th>
                    <th className="bg-[#515ACA] text-center  py-3 leading-5 text-sm font-bold text-white truncate ...">
                      Домен
                    </th>

                    <th className="bg-[#515ACA] text-center py-3 leading-5 text-sm font-bold text-white truncate ...">
                      Дата создания
                    </th>
                    <th className="bg-[#515ACA] text-center py-3 leading-5 text-sm font-bold text-white truncate ...">
                      Статус
                    </th>
                    <th className="bg-[#515ACA] py-3 text-center leading-5 text-sm font-bold text-white truncate ...">
                      #Tags
                    </th>
                    <th className="bg-[#515ACA] py-3 w-28"></th>
                  </tr>
                </thead>
                <tbody>
                  {availablePwas !== null &&
                    availablePwas.map((pwa) => (
                      <PwaItem key={pwa.pwaContent._id} pwa={pwa} />
                    ))}
                </tbody>
              </table>
            )}

            {!availablePwas?.length && availablePwas !== null && (
              <div className="flex items-center justify-center h-full flex-grow">
                <Empty
                  description={<span className="text-white">Нет PWA</span>}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPWAs;

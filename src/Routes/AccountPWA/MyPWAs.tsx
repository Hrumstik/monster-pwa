import { useEffect, useState } from "react";
import { getPwaStatus, getTabText, MyPWAsTabs } from "./MyPWAsHelpers.tsx";
import MonsterInput from "../../shared/elements/MonsterInput/MonsterInput.tsx";

import { Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import {
  useGetAllPwaContentQuery,
  useGetMyUserQuery,
} from "@store/apis/pwaApi.ts";
import { PreparedPWADataItem } from "@models/pwa.ts";
import Steps from "@shared/elements/Steps/Steps.tsx";
import PwaItem from "./PwaItem/PwaItem.tsx";
import { PwaStatus } from "@models/domain.ts";
import { useDispatch } from "react-redux";
import {
  addActiveTag,
  getActiveTags,
  getPwaTags,
  removeActiveTag,
  setPwaTags,
} from "@store/slices/pwaTagsSlice.ts";
import { useAppSelector } from "@store/hooks.ts";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo.ts";

const MyPWAs = () => {
  const { data: allPwas, isLoading } = useGetAllPwaContentQuery();
  const { data: userInfo } = useGetMyUserQuery();
  const dispatch = useDispatch();
  const allPwaTags = useAppSelector(getPwaTags);
  const activePwaTags = useAppSelector(getActiveTags);

  useEffect(() => {
    if (!allPwas) return;

    if (activePwaTags.length === 0) {
      setAvailablePWAs(preparePwaData());
      return;
    }

    setAvailablePWAs(
      preparePwaData().filter((pwa) =>
        activePwaTags.some((tag) => pwa.pwaTags?.includes(tag))
      )
    );
  }, [activePwaTags, allPwas]);

  useEffect(() => {
    if (!allPwas) return;

    const allPwaTags = allPwas
      .filter((pwa) => pwa.pwaTags)
      .map((pwa) => pwa.pwaTags!)
      .flat();

    const uniquePwaTags = Array.from(new Set(allPwaTags));

    dispatch(setPwaTags(uniquePwaTags));
  }, [allPwas, dispatch]);

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(MyPWAsTabs.All);
  const [availablePWAs, setAvailablePWAs] = useState<
    PreparedPWADataItem[] | null
  >(null);

  const preparePwaData = () =>
    allPwas?.map(({ _id }) => {
      const pwaInfo = allPwas.find((pwa) => pwa._id === _id);
      const userInfoPwa = userInfo?.pwas.find(
        (pwa) => pwa.pwaContentId === _id
      );
      return {
        pwaName: pwaInfo?.pwaName,
        appName: pwaInfo?.appName,
        domain: userInfoPwa?.domainName,
        geo: "–",
        createdAt: pwaInfo?.createdAt ? new Date(pwaInfo?.createdAt) : "-",
        status: userInfoPwa?.status
          ? getPwaStatus(userInfoPwa.status)
          : undefined,
        id: _id,
        pwaTags: pwaInfo?.pwaTags,
      };
    }) ?? [];

  const { getPwaInfo } = useGetPwaInfo();

  useEffect(() => {
    if (!allPwas) return;
    switch (currentTab) {
      case MyPWAsTabs.All:
        setAvailablePWAs(preparePwaData());
        break;
      case MyPWAsTabs.Active:
        setAvailablePWAs(
          preparePwaData().filter((pwa) => {
            const actualStatus = getPwaInfo(pwa.id!)?.status;
            return actualStatus === PwaStatus.ACTIVE;
          })
        );
        break;
      case MyPWAsTabs.Built:
        setAvailablePWAs(
          preparePwaData().filter((pwa) => {
            const actualStatus = getPwaInfo(pwa.id!)?.status;
            return actualStatus === PwaStatus.BUILDED;
          })
        );
        break;
      case MyPWAsTabs.BuildFailed:
        setAvailablePWAs(
          preparePwaData().filter((pwa) => {
            const actualStatus = getPwaInfo(pwa.id!)?.status;
            return actualStatus === PwaStatus.BUILD_FAILED;
          })
        );
        break;
      case MyPWAsTabs.WaitingNS:
        setAvailablePWAs(
          preparePwaData().filter((pwa) => {
            const actualStatus = getPwaInfo(pwa.id!)?.status;
            return actualStatus === PwaStatus.WAITING_NS;
          })
        );
        break;
      default:
        setAvailablePWAs(preparePwaData());
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, allPwas, userInfo]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.trimEnd()) {
      setAvailablePWAs(preparePwaData);

      return;
    }

    const filteredPWAs = preparePwaData().filter((pwa) =>
      pwa.pwaName?.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setAvailablePWAs(filteredPWAs);
  };

  const shouldShowLoader = isLoading || !availablePWAs;

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
        {availablePWAs && availablePWAs?.length > 0 && (
          <div className="p-3 flex justify-start gap-5">
            <MonsterInput
              onChange={handleSearch}
              className="w-[338px] h-10"
              placeholder="Поиск по названию"
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
            {availablePWAs && availablePWAs?.length > 0 && (
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
                  {!!availablePWAs.length &&
                    availablePWAs.map((pwa) => (
                      <PwaItem key={pwa.id} pwa={pwa} />
                    ))}
                </tbody>
              </table>
            )}

            {!availablePWAs?.length && (
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

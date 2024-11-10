import { useEffect, useState } from "react";
import { getTabText, MyPWAsTabs } from "./MyPWAsHelpers";
import MonsterInput from "../../shared/elements/MonsterInput/MonsterInput";
import { MoreOutlined } from "@ant-design/icons";
import moment from "moment";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import { VscPreview } from "react-icons/vsc";

import { Button, Modal, Spin, Tooltip } from "antd";
import MonsterDropdown from "../../shared/elements/Dropdown/Dropdown";
import { useNavigate } from "react-router-dom";
import {
  useGetAllPwaContentQuery,
  useDeletePwaContentMutation,
  useCopyPwaContentMutation,
} from "@store/slices/pwaApi";
import Preview from "../EditorPWA/DesignOption/Preview/Preview.tsx";
import { PreparedPWADataItem, PwaContent } from "@models/pwa.ts";
import { PreviewPwaContent } from "Routes/EditorPWA/DesignOption/Preview/models.ts";

const MyPWAs = () => {
  const { data, refetch, isLoading, isFetching } = useGetAllPwaContentQuery();
  const [deletePwaContent, { isLoading: deletePwaLoading }] =
    useDeletePwaContentMutation();
  const [copyPwaContent, { isLoading: copyPwaLoading }] =
    useCopyPwaContentMutation();

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(MyPWAsTabs.All);
  const [availablePWAs, setAvailablePWAs] = useState<PreparedPWADataItem[]>([]);
  const [previewPwa, setPreviewPwa] = useState<PwaContent | null>();

  const handleDelete = async (id: string) => {
    try {
      await deletePwaContent(id).then(refetch);
    } catch (error) {
      console.error("Failed to delete PWA content:", error);
    }
  };

  const handleCopy = async (id: string) => {
    try {
      await copyPwaContent(id).then(refetch);
    } catch (error) {
      console.error("Failed to delete PWA content:", error);
    }
  };

  const preparePwaData = () =>
    data?.map(({ appName, _id, createdAt }) => ({
      name: appName,
      domain: "–",
      geo: "–",
      createdAt: new Date(createdAt as string),
      status: "–",
      id: _id,
    })) || [];

  useEffect(() => {
    switch (currentTab) {
      case MyPWAsTabs.All:
        setAvailablePWAs(preparePwaData);
        break;
      case MyPWAsTabs.Active:
        setAvailablePWAs([]);
        break;
      case MyPWAsTabs.Draft:
        setAvailablePWAs([]);
        break;
      case MyPWAsTabs.Stopped:
        setAvailablePWAs([]);
        break;
      case MyPWAsTabs.CreatedAt:
        setAvailablePWAs([]);
        break;
      case MyPWAsTabs.Status:
        setAvailablePWAs([]);
        break;
      default:
        setAvailablePWAs(preparePwaData);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, data]);

  const generateDropDownItems = (pwa: PreparedPWADataItem) => {
    return [
      // {
      //   label: <span className="text-xs text-white">Запустить</span>,
      //   key: "start",
      //   icon: <MdOutlineRocketLaunch style={{ color: "white" }} />,
      // },
      {
        label: <span className="text-xs text-white">Редактировать</span>,
        key: "edit",
        icon: <MdOutlineEdit style={{ color: "white" }} />,
        onClick: () => navigate(`/edit-PWA/${pwa.id}`),
      },
      {
        label: <span className="text-xs text-white">Дублировать</span>,
        key: "copy",
        icon: <FiCopy style={{ color: "white" }} />,
        onClick: () => handleCopy(pwa.id as string),
      },
      {
        label: <span className="text-xs text-white">Предпросмотр</span>,
        key: "preview",
        icon: <VscPreview style={{ color: "white" }} />,
        onClick: () => {
          const preview = (data || []).find(({ _id }) => _id === pwa.id);

          setPreviewPwa(preview);
        },
      },
      // {
      //   label: <span className="text-xs text-white">Статистика</span>,
      //   key: "statistics",
      //   icon: <BsGraphUpArrow style={{ color: "white" }} />,
      // },
      {
        label: <span className="text-xs text-red">Удалить</span>,
        key: "delete",
        icon: <MdDelete />,
        danger: true,
        onClick: () => handleDelete(pwa.id as string),
      },
    ];
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.trimEnd()) {
      setAvailablePWAs(preparePwaData);

      return;
    }

    const filteredPWAs = preparePwaData().filter((pwa) =>
      pwa.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setAvailablePWAs(filteredPWAs);
  };

  return (
    <div className="px-[50px] pt-[110px] pb-[40px]">
      <div className="flex justify-between items-center mb-7">
        <span className="text-xl font-bold leading-8 text-white">Мои PWA</span>
        <span
          onClick={() => navigate("/create-PWA")}
          className="text-[#00FF11] hover:underline text-base font-normal cursor-pointer"
        >
          + Создать PWA
        </span>
      </div>
      <div className="rounded-lg w-full min-h-40 bg-[#20223B]">
        <div className="text-sm font-medium text-center text-white border-b border-[#161724]">
          <ul className="flex flex-wrap -mb-px px-7">
            {Object.values(MyPWAsTabs).map((tab, index) => (
              <li key={tab} className="me-12">
                <div
                  className={`inline-block p-4 border-b-2 ${
                    tab === currentTab
                      ? "border-[#00FF11]"
                      : "border-transparent hover:border-[#515ACA]"
                  } rounded-t-lg ${
                    index
                      ? "text-gray-500 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={index ? undefined : () => setCurrentTab(tab)}
                >
                  {getTabText(tab)}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3 flex justify-start">
          <MonsterInput
            onChange={handleSearch}
            className="w-[338px] h-10"
            placeholder="Поиск по названию, id или домену "
          />
        </div>

        {isLoading || deletePwaLoading || copyPwaLoading || isFetching ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Spin />
          </div>
        ) : (
          <table className="table-fixed bg-transparent border-collapse w-full">
            <thead>
              <tr>
                <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                  Название
                </th>
                <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                  Домен
                </th>
                <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                  ГЕО
                </th>
                <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                  Дата создания
                </th>
                <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                  Статус
                </th>
                <th className="bg-[#515ACA] px-8 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {availablePWAs.length ? (
                availablePWAs.map((pwa) => (
                  <tr
                    key={pwa.id}
                    className="hover:bg-[#383B66] h-14 focus:bg-gray-300 w-full text-white cursor-pointer"
                  >
                    <Tooltip color="grey" placement="topRight" title={pwa.name}>
                      <td className="px-8 py-3 truncate overflow-hidden whitespace-nowrap">
                        {pwa.name}
                      </td>
                    </Tooltip>
                    <td className="px-8 py-3">{pwa.domain}</td>
                    <td className="px-8 py-3">{pwa.geo}</td>
                    <td className="px-8 py-3">
                      {moment(pwa.createdAt).format("DD.MM.YYYY")}
                    </td>
                    <td className="px-8 py-3">{pwa.status}</td>
                    <td className="px-8 py-3 flex gap-[10px]">
                      {/*<Button*/}
                      {/*  icon={*/}
                      {/*    <SettingFilled*/}
                      {/*      style={{ color: "white", fontSize: "15px" }}*/}
                      {/*    />*/}
                      {/*  }*/}
                      {/*  className="bg-transparent border-none hover:!bg-[#5f6280]"*/}
                      {/*/>*/}
                      <MonsterDropdown
                        trigger={["click"]}
                        menu={{ items: generateDropDownItems(pwa) }}
                      >
                        <Button
                          icon={
                            <MoreOutlined
                              style={{ color: "white", fontSize: "15px" }}
                            />
                          }
                          className="bg-transparent border-none hover:!bg-[#5f6280]"
                        />
                      </MonsterDropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    color: "#FFFFFF",
                  }}
                >
                  <td>; (</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={!!previewPwa}
        footer={[]}
        className="w-[360px] h-[671px] rounded-[32px] box-border border-[9px] border-solid border-[#515ACA] bg-white overflow-auto"
        style={{
          overflow: "scroll",
          maxHeight: "80vh",
          maxWidth: "360px",
          paddingBottom: 0,
          padding: 0,
        }}
        onCancel={() => setPreviewPwa(null)}
      >
        {previewPwa && (
          <Preview
            myPWAsPage
            sliders={previewPwa.sliders}
            previewPwaContent={
              {
                appName: previewPwa.appName,
                developerName: previewPwa.developerName,
                countOfDownloads: previewPwa.countOfDownloads,
                countOfReviews: previewPwa.countOfReviews,
                verified: previewPwa.verified,
                rating: previewPwa.rating,
                countOfReviewsFull: previewPwa.countOfReviewsFull,
                description: previewPwa.description,
              } as PreviewPwaContent
            }
            appIcon={{ url: previewPwa.appIcon, preview: null }}
            screens={previewPwa.images?.map(({ url }) => ({
              url,
              preview: null,
            }))}
            tags={previewPwa.tags}
            reviews={previewPwa.reviews}
          />
        )}
      </Modal>
    </div>
  );
};

export default MyPWAs;

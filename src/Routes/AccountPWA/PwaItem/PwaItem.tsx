import { LoadingOutlined, MoreOutlined } from "@ant-design/icons";
import {
  DomainCheckStatus,
  PreparedPWADataItem,
  PwaContent,
} from "@models/pwa";
import MonsterDropdown from "@shared/elements/Dropdown/Dropdown";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import {
  useDeletePwaContentForcedMutation,
  useGetAllPwaContentQuery,
  useLazyCheckDomainStatusQuery,
  useUpdatePwaNameMutation,
} from "@store/apis/pwaApi.ts";
import { Modal, notification, Spin, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo";
import { PwaStatus } from "@models/domain";
import { getPwaStatus } from "../MyPWAsHelpers.tsx";
import type { MenuInfo } from "rc-menu/lib/interface";
import { useNavigate } from "react-router-dom";
import DomainCell from "@shared/elements/DomainCell/DomainCell.tsx";
import { useUpdateEffect } from "react-use";
import PwaTags from "./TagItem/PwaTags.tsx";
import useCheckBuildStatus from "@shared/hooks/useCheckBuildStatus.ts";
import { IoDuplicate } from "react-icons/io5";

const PwaItem = ({ pwa }: { pwa: PreparedPWADataItem }) => {
  const { data } = useGetAllPwaContentQuery();
  const [renamePwa, setRenamePwa] = useState<PwaContent | null>();
  const [deletePwaContent, { isLoading: deletePwaLoading }] =
    useDeletePwaContentForcedMutation();
  const [updatePwaContent, { isLoading: updatePwaLoading }] =
    useUpdatePwaNameMutation();
  const [checkDomainStatus] = useLazyCheckDomainStatusQuery();
  const { pwaInfo } = useGetPwaInfo(pwa.id);

  const navigate = useNavigate();
  const { startPolling } = useCheckBuildStatus();

  useEffect(() => {
    if (pwaInfo === null) return;
    if (!pwaInfo?.status && pwa.id) {
      console.log("start polling");
      startPolling({
        pwaContentId: pwa.id,
        completedStatusCallback: () => {
          notification.success({
            message: `PWA успешно развернут`,
          });
        },
      });
    }
  }, [pwaInfo, pwa.id]);

  useUpdateEffect(() => {
    if (!pwaInfo?.status || pwaInfo?.status !== PwaStatus.WAITING_NS) return;
    let interval: NodeJS.Timeout;
    const getDomainStatus = async (pwaContentID: string) => {
      const status = await checkDomainStatus(pwaContentID).unwrap();

      if (status === DomainCheckStatus.Pending) {
        interval = setInterval(async () => {
          const status = await checkDomainStatus(pwaContentID).unwrap();
          if (status === DomainCheckStatus.Active) {
            clearInterval(interval);
          }
        }, 20000);
      }
    };

    getDomainStatus(pwa.id!);

    return () => clearInterval(interval);
  }, [pwaInfo?.status]);

  const handleDelete = async (id: string) => {
    try {
      await deletePwaContent(id);
    } catch {
      notification.error({
        message: "Ошибка",
        description: "Не удалось удалить PWA",
      });
    }
  };

  const generateDropDownItems = (pwa: PreparedPWADataItem) => {
    return [
      {
        label: <span className={`text-xs text-white`}>Переименовать</span>,
        key: "rename",
        icon: <FiFileText style={{ color: "white" }} />,
        onClick: (e: MenuInfo) => {
          e.domEvent.stopPropagation();
          e.domEvent.nativeEvent.stopImmediatePropagation();
          const renamePwa = (data || []).find(({ _id }) => _id === pwa.id);
          setRenamePwa({
            ...renamePwa,
            pwaName: renamePwa?.pwaName ?? renamePwa?.appName,
          } as PwaContent);
        },
      },
      {
        label: (
          <span
            className={`text-xs text-white  ${
              pwaInfo?.status !== PwaStatus.ACTIVE
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            Перейти на сайт с PWA
          </span>
        ),
        key: "preview",
        icon: <VscPreview style={{ color: "white" }} />,

        onClick: (e: MenuInfo) => {
          e.domEvent.stopPropagation();
          e.domEvent.nativeEvent.stopImmediatePropagation();
          if (pwaInfo?.status !== PwaStatus.ACTIVE) return;
          window.open(`https://${pwa.domain}`, "_blank");
        },
      },
      {
        label: (
          <span className={`text-xs text-white  cursor-pointer`}>
            Клонировать PWA
          </span>
        ),
        key: "clone",
        onClick: (e: MenuInfo) => {
          e.domEvent.stopPropagation();
          e.domEvent.nativeEvent.stopImmediatePropagation();
          navigate(`/clone-PWA/${pwa.id}`);
        },
        icon: <IoDuplicate style={{ color: "white" }} />,
      },
      {
        label: <span className="text-xs text-red">Удалить</span>,
        key: "delete",
        icon: <MdDelete />,
        danger: true,
        onClick: (e: MenuInfo) => {
          e.domEvent.stopPropagation();
          e.domEvent.nativeEvent.stopImmediatePropagation();
          handleDelete(pwa.id as string);
        },
      },
    ];
  };

  const handleSubmitRenamePwa = async () =>
    updatePwaContent({
      id: renamePwa!._id!,
      pwaName: renamePwa!.pwaName!,
    }).then(() => {
      setRenamePwa(undefined);
    });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRenamePwa(
      (prev) =>
        ({
          ...prev,
          pwaName: e.target.value,
        } as PwaContent)
    );
  };

  if (!pwaInfo) return null;

  return (
    <>
      <tr
        key={pwa.id}
        className="hover:bg-[#383B66] group text-xs focus:bg-gray-300 w-full text-white"
      >
        <Tooltip
          color="grey"
          placement="topRight"
          title={pwa.pwaName ?? pwa.appName}
        >
          <td className="px-8 py-3 truncate overflow-hidden whitespace-nowrap">
            <Spin spinning={deletePwaLoading || updatePwaLoading} fullscreen />
            <div className="flex justify-center">
              {pwa.pwaName ?? pwa.appName}
            </div>
          </td>
        </Tooltip>
        <DomainCell domain={pwa.domain} />
        <td className="text-center py-3 truncate ... ">
          {moment(pwa.createdAt).format("DD.MM.YYYY")}
        </td>
        <td className="py-3 truncate ... text-center flex justify-center items-center ">
          {pwaInfo.status ? (
            getPwaStatus(pwaInfo.status)
          ) : (
            <>
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      color: "#00FF11",
                    }}
                    spin
                  />
                }
              />
            </>
          )}
        </td>
        <td className="py-3">
          <PwaTags pwaTags={pwaInfo.pwaTags ?? []} pwaId={pwa.id!} />
        </td>
        <td className="py-3  text-center flex justify-center items-center gap-2">
          <button
            onClick={() => pwaInfo.status && navigate(`/edit-PWA/${pwa.id}`)}
            className="details hover:bg-[#20223B] rounded flex items-center justify-center w-[30px] h-[30px] border-none bg-[#383B66] group-hover:bg-[#20223B]"
          >
            <MdModeEdit className="text-white text-base" />
          </button>
          <MonsterDropdown
            trigger={["click"]}
            disabled={!pwaInfo.status}
            menu={{ items: generateDropDownItems(pwa) }}
          >
            <button
              onClick={(e) => e.stopPropagation()}
              className="rounded flex items-center justify-center w-[30px] h-[30px] border-none bg-[#383B66] group-hover:bg-[#20223B]"
            >
              <MoreOutlined style={{ color: "white", fontSize: "15px" }} />
            </button>
          </MonsterDropdown>
        </td>
      </tr>

      <Modal
        className="rename-pwa-modal"
        title={<div className="mb-5 text-white">Переименовать PWA</div>}
        open={!!renamePwa}
        footer={
          <div
            className="mt-5 flex justify-end"
            onClick={handleSubmitRenamePwa}
          >
            <button className="leading-5 box-border h-[42px] flex justify-center items-center bg-white text-[#121320] rounded-lg p-5">
              Сохранить
            </button>
          </div>
        }
        onCancel={() => setRenamePwa(undefined)}
      >
        <MonsterInput
          placeholder="Название"
          type="text"
          className="h-[42px] bg-[#161724]"
          value={renamePwa?.pwaName}
          onChange={handleNameChange}
        />
      </Modal>
    </>
  );
};

export default PwaItem;

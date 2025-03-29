import { LoadingOutlined, MoreOutlined } from "@ant-design/icons";
import { PreparedPWADataItem, PwaContent } from "@models/pwa";
import MonsterDropdown from "@shared/elements/Dropdown/Dropdown";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import {
  useDeletePwaContentForcedMutation,
  useGetAllPwaContentQuery,
  useUpdatePwaNameMutation,
} from "@store/apis/pwaApi.ts";
import { Modal, notification, Spin, Tooltip } from "antd";
import moment from "moment";
import { useState } from "react";
import { FiFileText } from "react-icons/fi";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { PwaStatus } from "@models/domain";
import { getPwaStatus } from "../MyPWAsHelpers.tsx";
import type { MenuInfo } from "rc-menu/lib/interface";
import { useNavigate } from "react-router-dom";
import DomainCell from "@shared/elements/DomainCell/DomainCell.tsx";
import PwaTags from "./TagItem/PwaTags.tsx";
import { IoDuplicate } from "react-icons/io5";

const PwaItem = ({ pwa }: { pwa: PreparedPWADataItem }) => {
  const { data } = useGetAllPwaContentQuery();
  const [renamePwa, setRenamePwa] = useState<PwaContent | null>();
  const [deletePwaContent, { isLoading: deletePwaLoading }] =
    useDeletePwaContentForcedMutation();
  const [updatePwaContent, { isLoading: updatePwaLoading }] =
    useUpdatePwaNameMutation();

  const navigate = useNavigate();

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
          const renamePwa = (data || []).find(
            ({ _id }) => _id === pwa.pwaContent._id
          );
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
              pwa?.status !== PwaStatus.ACTIVE
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
          if (pwa?.status !== PwaStatus.ACTIVE) return;
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
          navigate(`/clone-PWA/${pwa.pwaContent._id}/`);
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
          handleDelete(pwa.pwaContent._id as string);
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

  return (
    <>
      <tr
        key={pwa.pwaContent._id}
        className="hover:bg-[#383B66] group text-xs focus:bg-gray-300 w-full text-white"
      >
        <Tooltip
          color="grey"
          placement="topRight"
          title={pwa.pwaContent.pwaName ?? pwa.pwaContent.appName}
        >
          <td className="px-8 py-3 truncate overflow-hidden whitespace-nowrap">
            <Spin spinning={deletePwaLoading || updatePwaLoading} fullscreen />
            <div className="flex justify-center">
              {pwa.pwaContent.pwaName ?? pwa.pwaContent.appName}
            </div>
          </td>
        </Tooltip>
        <DomainCell domain={pwa.domain} />
        <td className="text-center py-3 truncate ... ">
          {moment(pwa.pwaContent.createdAt).format("DD.MM.YYYY")}
        </td>
        <td className="py-3 truncate ... text-center flex justify-center items-center ">
          {!pwa.loading ? (
            getPwaStatus(pwa.status)
          ) : (
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
          )}
        </td>
        <td className="py-3">
          <PwaTags
            pwaTags={pwa.pwaContent.pwaTags ?? []}
            pwaId={pwa.pwaContent._id!}
          />
        </td>
        <td className="py-3  text-center flex justify-center items-center gap-2">
          <button
            onClick={() =>
              pwa.status &&
              navigate(`/edit-PWA/${pwa.pwaContent._id}/${pwa.domain}`)
            }
            className="details hover:bg-[#20223B] rounded flex items-center justify-center w-[30px] h-[30px] border-none bg-[#383B66] group-hover:bg-[#20223B]"
          >
            <MdModeEdit className="text-white text-base" />
          </button>
          <MonsterDropdown menu={{ items: generateDropDownItems(pwa) }}>
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

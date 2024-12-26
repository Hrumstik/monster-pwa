import { MoreOutlined } from "@ant-design/icons";
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
  useGetMyUserQuery,
  useLazyCheckDomainStatusQuery,
  useUpdatePwaNameMutation,
} from "@store/apis/pwaApi.ts";
import { Modal, notification, Spin, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { PreviewPwaContent } from "../../EditorPWA/DesignOption/Preview/models.ts";
import Preview from "../../EditorPWA/DesignOption/Preview/Preview.tsx";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo";
import { PwaStatus } from "@models/domain";
import { getPwaStatus } from "../MyPWAsHelpers.tsx";
import type { MenuInfo } from "rc-menu/lib/interface";
import { useNavigate } from "react-router-dom";
import DomainCell from "@shared/elements/DomainCell/DomainCell.tsx";
import { useUpdateEffect } from "react-use";
import PwaTags from "./TagItem/PwaTags.tsx";

const PwaItem = ({ pwa }: { pwa: PreparedPWADataItem }) => {
  const { data } = useGetAllPwaContentQuery();

  const [renamePwa, setRenamePwa] = useState<PwaContent | null>();
  const [previewPwa, setPreviewPwa] = useState<PwaContent | null>();
  const { data: userData } = useGetMyUserQuery();
  const [deletePwaContent, { isLoading: deletePwaLoading }] =
    useDeletePwaContentForcedMutation();
  const [updatePwaContent, { isLoading: updatePwaLoading }] =
    useUpdatePwaNameMutation();
  const [checkDomainStatus] = useLazyCheckDomainStatusQuery();
  const [pwaStatus, setPwaStatus] = useState<PwaStatus>();
  const { getPwaInfo } = useGetPwaInfo();

  useEffect(() => {
    const actualStatus = getPwaInfo(pwa.id!).status!;
    setPwaStatus(actualStatus);
  }, [userData, getPwaInfo, pwa.id]);

  const navigate = useNavigate();

  useUpdateEffect(() => {
    if (pwaStatus === PwaStatus.ACTIVE) return;
    let interval: NodeJS.Timeout;
    const getDomainStatus = async (pwaContentID: string) => {
      const status = await checkDomainStatus(pwaContentID).unwrap();
      if (status === DomainCheckStatus.Pending) {
        interval = setInterval(async () => {
          const status = await checkDomainStatus(pwaContentID).unwrap();
          if (status === DomainCheckStatus.Active) {
            clearInterval(interval);
            setPwaStatus(PwaStatus.ACTIVE);
          }
        }, 300000);
      }
    };

    getDomainStatus(pwa.id!);

    return () => clearInterval(interval);
  }, [pwaStatus]);

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
        label: <span className="text-xs text-white">Переименовать</span>,
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
        label: <span className="text-xs text-white">Предпросмотр</span>,
        key: "preview",
        icon: <VscPreview style={{ color: "white" }} />,
        onClick: (e: MenuInfo) => {
          e.domEvent.stopPropagation();
          e.domEvent.nativeEvent.stopImmediatePropagation();
          const preview = (data || []).find(({ _id }) => _id === pwa.id);
          setPreviewPwa(preview);
        },
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

  return (
    <>
      <tr
        key={pwa.id}
        onClick={() => navigate(`/edit-PWA/${pwa.id}`)}
        className="hover:bg-[#383B66] group text-xs focus:bg-gray-300 w-full text-white cursor-pointer"
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
        <td className="py-3 truncate ... text-center">
          {getPwaStatus(pwaStatus!)}
        </td>
        <td className="py-3">
          <PwaTags
            pwaTags={getPwaInfo(pwa.id!).pwaTags ?? []}
            pwaId={pwa.id!}
          />
        </td>
        <td className="py-3 text-center">
          <MonsterDropdown
            trigger={["click"]}
            menu={{ items: generateDropDownItems(pwa) }}
          >
            <button
              onClick={(e) => e.stopPropagation()}
              className="details mx-auto hover:bg-[#20223B] rounded flex items-center justify-center w-[30px] h-[30px] border-none bg-[#383B66] group-hover:bg-[#20223B]"
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
      <Modal
        open={!!previewPwa}
        footer={[]}
        className="w-[360px] h-[671px] rounded-[32px] box-border border-[9px] border-solid border-[#515ACA] bg-white overflow-auto scrollbar-hidden"
        style={{
          overflow: "scroll",
          maxHeight: "80vh",
          maxWidth: "360px",
          paddingBottom: 0,
          padding: 0,
        }}
        closeIcon={null}
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
                countOfDownloads: previewPwa.countOfDownloads.originalLanguage,
                countOfReviews: previewPwa.countOfReviews,
                verified: previewPwa.verified,
                rating: previewPwa.rating,
                shortDescription: previewPwa.shortDescription.originalLanguage,
                fullDescription: previewPwa.fullDescription.originalLanguage,
              } as PreviewPwaContent
            }
            appIcon={{ url: previewPwa.appIcon, preview: null }}
            screens={previewPwa.images?.map(({ url }) => ({
              url,
              preview: null,
            }))}
            tags={previewPwa.tags}
            reviews={previewPwa.reviews.map((review) => {
              return {
                ...review,
                reviewText: review.reviewText.originalLanguage,
                devResponse: review.devResponse?.originalLanguage,
              };
            })}
          />
        )}
      </Modal>
    </>
  );
};

export default PwaItem;

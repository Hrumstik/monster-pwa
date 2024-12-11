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
  useLazyCheckDomainStatusQuery,
  useUpdatePwaContentMutation,
} from "@store/slices/pwaApi";
import { Modal, Spin, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { PreviewPwaContent } from "../../EditorPWA/DesignOption/Preview/models.tsx";
import Preview from "../../EditorPWA/DesignOption/Preview/Preview.tsx";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo";
import { PwaStatus } from "@models/domain";

const PwaItem = ({ pwa }: { pwa: PreparedPWADataItem }) => {
  const { data } = useGetAllPwaContentQuery();
  const navigate = useNavigate();
  const [renamePwa, setRenamePwa] = useState<PwaContent | null>();
  const [previewPwa, setPreviewPwa] = useState<PwaContent | null>();
  const [deletePwaContent, { isLoading: deletePwaLoading }] =
    useDeletePwaContentForcedMutation();
  const [updatePwaContent, { isLoading: updatePwaLoading }] =
    useUpdatePwaContentMutation();
  const [checkDomainStatus] = useLazyCheckDomainStatusQuery();

  const { getPwaInfo } = useGetPwaInfo();

  useEffect(() => {
    const actualStaus = getPwaInfo(pwa.id!).status!;
    if (actualStaus === PwaStatus.ACTIVE) return;
    let interval: NodeJS.Timeout;
    const getDomainStatus = async (pwaContentID: string) => {
      const status = await checkDomainStatus(pwaContentID).unwrap();
      if (status === DomainCheckStatus.Pending) {
        interval = setInterval(async () => {
          const status = await checkDomainStatus(pwaContentID).unwrap();
          if (status === DomainCheckStatus.Active) {
            clearInterval(interval);
          }
        }, 300000);
      }
    };

    getDomainStatus(pwa.id!);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deletePwaContent(id);
    } catch (error) {
      console.error("Failed to delete PWA content:", error);
    }
  };

  const generateDropDownItems = (pwa: PreparedPWADataItem) => {
    return [
      {
        label: <span className="text-xs text-white">Редактировать</span>,
        key: "edit",
        icon: <MdOutlineEdit style={{ color: "white" }} />,
        onClick: () => navigate(`/edit-PWA/${pwa.id}`),
      },
      {
        label: <span className="text-xs text-white">Переименовать</span>,
        key: "rename",
        icon: <FiFileText style={{ color: "white" }} />,
        onClick: () => {
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
        onClick: () => {
          const preview = (data || []).find(({ _id }) => _id === pwa.id);

          setPreviewPwa(preview);
        },
      },
      {
        label: <span className="text-xs text-red">Удалить</span>,
        key: "delete",
        icon: <MdDelete />,
        danger: true,
        onClick: () => handleDelete(pwa.id as string),
      },
    ];
  };

  const handleSubmitRenamePwa = async () =>
    updatePwaContent({
      pwaName: renamePwa?.pwaName,
      id: renamePwa?._id,
    } as PwaContent).then(() => {
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
        className="hover:bg-[#383B66] group h-14 focus:bg-gray-300 w-full text-white cursor-pointer"
      >
        <Tooltip
          color="grey"
          placement="topRight"
          title={pwa.pwaName ?? pwa.appName}
        >
          <td className="px-8 py-3 truncate overflow-hidden whitespace-nowrap">
            {pwa.pwaName ?? pwa.appName}
          </td>
        </Tooltip>
        <td className="px-8 py-3 truncate ...">{pwa.domain}</td>
        <td className="px-8 py-3 truncate ...">{pwa.geo}</td>
        <td className="px-8 py-3 truncate ...">
          {moment(pwa.createdAt).format("DD.MM.YYYY")}
        </td>
        <td className="px-8 py-3 truncate ...">{pwa.status}</td>
        <td className="px-8 py-3 flex gap-[10px]">
          <MonsterDropdown
            trigger={["click"]}
            menu={{ items: generateDropDownItems(pwa) }}
          >
            <button className="hover:bg-[#20223B] rounded flex items-center justify-center w-[30px] h-[30px] border-none bg-[#383B66] group-hover:bg-[#20223B]">
              <MoreOutlined style={{ color: "white", fontSize: "15px" }} />
            </button>
          </MonsterDropdown>
        </td>
      </tr>
      <Spin spinning={deletePwaLoading || updatePwaLoading} fullscreen />
      <Modal
        className="rename-pwa-modal"
        title={<div className="mb-5">Переименовать PWA</div>}
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
                countOfReviewsFull: previewPwa.countOfReviewsFull,
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

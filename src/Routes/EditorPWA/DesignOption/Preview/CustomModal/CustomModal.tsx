import { Modal } from "antd";
import GooglePlayDark from "@icons/GooglePlayDark";
import GooglePlayLogo from "@icons/GooglePlayLogo";
import { PreviewPwaContent } from "../models";
import { Picture } from "@models/pwa";

const ModalMenu = ({
  previewPwaContent,
  dark,
  appIcon,
  setPreviewContent,
}: {
  previewPwaContent: PreviewPwaContent;
  dark: boolean;
  appIcon: Picture;
  setPreviewContent: (content: PreviewPwaContent) => void;
  mainThemeColor?: string;
}) => {
  return (
    <Modal
      open={previewPwaContent.showModal}
      onCancel={() =>
        setPreviewContent({ ...previewPwaContent, showModal: false })
      }
      closable
      footer={null}
      width={304}
      className={`preview-modal
        ${dark ? "dark-theme" : "white-theme"}`}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // @ts-expect-error: Modal getContainer expects a function returning HTMLElement, but we return false to disable the portal
      getContainer={() => {
        return false;
      }}
    >
      <div className={`${dark ? "bg-[#303030]" : "bg-white"}`}>
        <div className={`flex justify-center mb-3 `}>
          {dark ? <GooglePlayDark /> : <GooglePlayLogo />}
        </div>
        <div
          className={`${
            dark ? "text-[#DFDFDF]" : "text-[#5F6368]"
          } flex justify-center mb-3`}
        >
          Рекомендованно &nbsp;
          <span className="text-[#34A853] font-medium">Google Play</span>
        </div>
        {previewPwaContent.showAppHeader && (
          <div
            style={{ boxShadow: "0px 2px 2px 0px #0000003D" }}
            className={`p-4 flex gap-4 items-center rounded-xl mb-4 ${
              dark ? "bg-[#131313]" : "bg-white"
            }`}
          >
            {appIcon.url ? (
              <img
                src={appIcon.url}
                alt="app icon"
                width={70}
                height={70}
                className="rounded-xl w-[70px] h-[70px] object-fill"
              />
            ) : (
              <div className="rounded-xl bg-[#727272] w-[70px] h-[70px]" />
            )}
            <div>
              <div
                className={`font-bold text-base leading-[19px] mb-1 ${
                  dark ? "text-[#DFDFDF]" : "text-[#020202]"
                }`}
              >
                {previewPwaContent.appName ?? "Plinko ASMR"}
              </div>
              <div
                className={`font-bold text-xs ${
                  dark ? "text-[#A8C8FB]" : "text-[#1357CD]"
                } leading-[14px] mb-2`}
              >
                {previewPwaContent.developerName ?? "Supercent, Inc."}
              </div>
              {previewPwaContent.hasPaidContentTitle && (
                <div
                  className={`text-[8px] ${
                    dark ? "text-[#DFDFDF]" : "text-[#444444]"
                  } whitespace-nowrap`}
                >
                  Нет рекламы &nbsp; Нет платного контента
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className={`${
            dark ? "text-[#DFDFDF]" : "text-[#49454F]"
          } text-sm font-bold text-center leading-[14px] mb-2`}
        >
          {previewPwaContent.title}
        </div>
        <div
          className={`${
            dark ? "text-[#DFDFDF]" : "text-[#49454F]"
          } mb-5 text-center text-[12px] leading-4  tracking-[0.1px] `}
        >
          {previewPwaContent.content}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setPreviewContent({ ...previewPwaContent, showModal: false });
          }}
          style={dark ? { background: "#A8C8FB", color: "rgb(6, 41, 97)" } : {}}
          className="bg-[#1357CD] rounded-[60px] h-9 w-full text-white"
        >
          {previewPwaContent.buttonText ?? "Установить"}
        </button>
      </div>
    </Modal>
  );
};

export default ModalMenu;

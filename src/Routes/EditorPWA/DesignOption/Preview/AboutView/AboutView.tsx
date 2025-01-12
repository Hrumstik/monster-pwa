import { Dispatch, SetStateAction } from "react";
import ViewHeader from "../ViewHeader/ViewHeader";
import moment from "moment";
import { motion } from "framer-motion";
import { PreviewPwaContent, PwaViews } from "../models";

interface Props {
  setView: Dispatch<SetStateAction<PwaViews>>;
  previewPwaContent: PreviewPwaContent;
  appIcon: string | null;
  dark: boolean;
}

const AboutView: React.FC<Props> = ({
  setView,
  previewPwaContent,
  appIcon,
  dark,
}) => {
  const slideVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={slideVariants}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <ViewHeader
        dark={dark}
        appIcon={appIcon}
        developerName={previewPwaContent.developerName}
        setView={setView}
        appName={previewPwaContent.appName}
      />
      <section className="pt-4 mx-6 pb-4">
        <div
          style={dark ? { color: "#DFDFDF" } : {}}
          className="text-base text-main font-sans pt-4 pb-3 flex items-center"
        >
          Описание
        </div>
        <div
          style={dark ? { color: "#DFDFDF" } : {}}
          className="text-sm whitespace-pre-wrap relative text-left text-[#605D64]"
        >
          {previewPwaContent.fullDescription}
        </div>
      </section>
      <div
        style={dark ? { background: "#434343" } : {}}
        className="bg-[#C6C6C6] h-[1px] w-full"
      />
      <div className="px-6 py-4">
        <div className="flex flex-col gap-9 text-sm leading-5 text-[#605D64]">
          <div
            style={dark ? { color: "#DFDFDF" } : {}}
            className="text-base text-black"
          >
            Об игре
          </div>
          <div className="flex flex-row justify-between items-center">
            <span style={dark ? { color: "#DFDFDF" } : {}}>Версия</span>
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              {previewPwaContent.version}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              Последнее обновление
            </span>
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              {moment(previewPwaContent.lastUpdate).format("DD.MM.YYYY")}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              Кол-во скачиваний
            </span>
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              {previewPwaContent.countOfDownloads}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span style={dark ? { color: "#DFDFDF" } : {}}>Размер файла</span>
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              {previewPwaContent.size}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span style={dark ? { color: "#DFDFDF" } : {}}>Разработчик</span>
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              {previewPwaContent.developerName}
            </span>
          </div>
        </div>
      </div>
      <div
        style={dark ? { background: "#434343" } : {}}
        className="bg-[#C6C6C6] h-[1px] w-full"
      />
      <div className="px-6 py-4">
        <div className="flex flex-col gap-9 text-sm leading-5 text-[#605D64]">
          <div
            style={dark ? { color: "#DFDFDF" } : {}}
            className="text-base text-black"
          >
            Совместимость с вашим устройством
          </div>
          <div className="flex flex-row justify-between items-center">
            <span style={dark ? { color: "#DFDFDF" } : {}}>Версия</span>
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              {previewPwaContent.version}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              Размер загрузки
            </span>
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              {previewPwaContent.size}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span style={dark ? { color: "#DFDFDF" } : {}}>Требуемая ОС</span>
            <span style={dark ? { color: "#DFDFDF" } : {}}>
              Android 5.0 и выше
            </span>
          </div>
        </div>
      </div>
      <div
        style={dark ? { background: "#434343" } : {}}
        className="bg-[#C6C6C6] h-[1px] w-full"
      />
    </motion.div>
  );
};

export default AboutView;

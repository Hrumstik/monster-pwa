import IconButton from "../../shared/elements/IconButton/IconButton";
import { FaSave } from "react-icons/fa";
import { VscPreview } from "react-icons/vsc";
import { MdOutlineNotStarted } from "react-icons/md";
import { useState } from "react";
import { EditorPWATabs, getTabIcon, getTabText } from "./EditorPWAHelpers";
import DomainOption from "./DomainOption.tsx/DomainOption";

const EditorPWA = () => {
  const [currentTab, setCurrentTab] = useState(EditorPWATabs.Domain);

  return (
    <div className="px-[50px] pt-[110px] w-full">
      <h1 className="font-bold text-[28px] leading-8 text-white mb-[14px]">
        Редактирование PWA
      </h1>
      <div className="h-[42px] flex justify-between mb-12">
        <div className="flex items-center">
          <span className="font-bold text-xs leading-[14px] mr-[5px] text-white">
            ID:
          </span>
          <div className="rounded bg-[#20223B] text-white font-normal px-2 py-[6px]">
            6XvFLyKYJOwCjQspP1Nu
          </div>
        </div>
        <div className="flex gap-5">
          <IconButton
            icon={<MdOutlineNotStarted color="white" />}
            text="Запустить"
            onclick={() => {}}
          />
          <IconButton
            icon={<VscPreview color="white" />}
            text="Предпросмотр"
            onclick={() => {}}
          />
          <IconButton
            icon={<FaSave color="white" />}
            text="Сохранить"
            onclick={() => {}}
          />
        </div>
      </div>
      <div className="text-sm font-medium text-center text-white border-b border-[#161724] mb-5">
        <ul className="flex ">
          {Object.values(EditorPWATabs).map((tab, i) => (
            <li key={tab} className="me-1 flex gap-[10px]">
              <div
                className={`cursor-pointer inline-block p-4 border-b-2 ${
                  tab === currentTab
                    ? "border-green"
                    : "border-transparent hover:border-[#515ACA]"
                } rounded-t-lg flex items-center gap-[10px]`}
                onClick={() => setCurrentTab(tab)}
              >
                {getTabIcon(tab)}
                {getTabText(tab)}
              </div>
              {i !== Object.values(EditorPWATabs).length - 1 ? (
                <span className="flex items-center">&gt;</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      {currentTab === EditorPWATabs.Domain && <DomainOption />}
    </div>
  );
};

export default EditorPWA;

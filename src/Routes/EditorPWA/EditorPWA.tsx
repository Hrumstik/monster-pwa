import IconButton from "@shared/elements/IconButton/IconButton";
import DesignOption from "./DesignOption/DesignOption";
import { MdOutlineNotStarted } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  EditorPWATabs,
  getTabIcon,
  stepsInitialState,
} from "./EditorPWAHelpers";
import { useState } from "react";
import Steps from "@shared/elements/Steps/Steps";
import DomainOption from "./DomainOption.tsx/DomainOption";

const EditorPWA = () => {
  const { pwaId } = useParams();
  const [currentTab, setCurrentTab] = useState<EditorPWATabs>(
    EditorPWATabs.Design
  );
  const [steps, setSteps] = useState(stepsInitialState);

  const handleStepChange = (step: EditorPWATabs) => {
    const updatedSteps = steps.map((s) => ({
      ...s,
      icon: getTabIcon(
        s.id as EditorPWATabs,
        s.isPassed ?? false,
        s.id === step
      ),
    }));

    setSteps(updatedSteps);
    setCurrentTab(step);
  };

  const getCurrentTab = () => {
    switch (currentTab) {
      case EditorPWATabs.Domain:
        return <DomainOption />;
      case EditorPWATabs.Design:
        return <DesignOption />;
      default:
        return null;
    }
  };

  return (
    <div className="px-[50px] pt-[110px] w-full min-w-[1050px]">
      <h1 className="font-bold text-[28px] leading-8 text-white mb-7">
        Создание PWA
      </h1>
      <div className="h-[42px] flex justify-between mb-12">
        <div className="flex items-center">
          {pwaId && <div className="flex"></div>}
        </div>
        <div className="flex gap-5">
          <IconButton
            disabled
            icon={<MdOutlineNotStarted color="white" />}
            text="Запустить"
            onclick={() => {}}
          />
          <IconButton
            disabled
            icon={<VscPreview color="white" />}
            text="Предпросмотр"
            onclick={() => {}}
          />
          <IconButton
            disabled
            icon={<FaSave color="white" />}
            text="Сохранить"
            onclick={() => {}}
          />
        </div>
      </div>
      <div className="mb-10">
        <Steps
          steps={steps}
          currentStep={currentTab}
          onStepChange={(step) => handleStepChange(step as EditorPWATabs)}
          showSteps
        />
      </div>
      {getCurrentTab()}
    </div>
  );
};

export default EditorPWA;

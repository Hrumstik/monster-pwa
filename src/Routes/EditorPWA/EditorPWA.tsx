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
} from "./EditorPWAHelpers.tsx";
import { useEffect, useState } from "react";
import Steps, { Step } from "@shared/elements/Steps/Steps";
import DomainOption from "./DomainOption.tsx/DomainOption.tsx";
import { PwaContent } from "@models/pwa";
import { CloudflareData } from "@models/user";
import {
  useAddDomainMutation,
  useCreatePwaContentMutation,
  useDeletePwaContentMutation,
  useLazyBuildPwaContentQuery,
} from "@store/slices/pwaApi";
import useCheckBuildStatus from "@shared/hooks/useCheckBuildStatus";
import { notification } from "antd";
import { Hourglass } from "react-loader-spinner";

const EditorPWA = () => {
  const { pwaId } = useParams();
  const [currentTab, setCurrentTab] = useState<EditorPWATabs>(
    EditorPWATabs.Design
  );

  const { id } = useParams();

  const [steps, setSteps] = useState<Step[]>(stepsInitialState);
  const [pwaContent, setPwaContent] = useState<PwaContent>();
  const [domainsData, setDomainsData] = useState<CloudflareData>();
  const [availableToSave, setAvailableToSave] = useState(false);
  const [createPwaContent] = useCreatePwaContentMutation();
  const [buildPwaContent] = useLazyBuildPwaContentQuery();
  const [addDomain] = useAddDomainMutation();
  const { startPolling } = useCheckBuildStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [nsRecords, setNsRecords] = useState<
    {
      name: string;
    }[]
  >();
  const [deletePwaContent] = useDeletePwaContentMutation();

  useEffect(() => {
    if (id) {
      setAvailableToSave(true);
      return;
    }
    setAvailableToSave(!!pwaContent && !!domainsData);
  }, [domainsData, pwaContent]);

  const createNewPwa = async () => {
    if (!domainsData || !pwaContent) return;
    try {
      const response = await addDomain({
        ...domainsData,
        pwaId: pwaContent._id!,
      }).unwrap();
      setNsRecords(response.nsRecords);
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description:
          "Ошибка добавления домена, обратитесь в техническую поддержку",
      });
      deletePwaContent(pwaContent._id!);
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsFinished(true);
    }
  };

  const addDomainData = async (pwaContent: PwaContent) => {
    if (!domainsData || !pwaContent) return;
    try {
      const response = await addDomain({
        ...domainsData,
        pwaId: pwaContent._id!,
      }).unwrap();
      setNsRecords(response.nsRecords);
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description:
          "Ошибка добавления домена, обратитесь в техническую поддержку",
      });
      deletePwaContent(pwaContent._id!);
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsFinished(true);
    }
  };

  const savePwa = async () => {
    if (!pwaContent || !domainsData) return;
    try {
      setIsLoading(true);
      const pwaContentResponse = await createPwaContent(pwaContent).unwrap();
      const buildResponse = await buildPwaContent({
        id: pwaContentResponse._id!,
      }).unwrap();
      setTimeout(
        () =>
          startPolling({
            jobId: buildResponse.jobId,
            completedStatusCallback: () => {
              addDomainData(pwaContentResponse);
            },
          }),
        10000
      );
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: "Ошибка сохранения PWA",
      });
      console.log(error);
      setIsLoading(false);
    }
  };

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
        return (
          <DomainOption
            setDomainsData={setDomainsData}
            steps={steps}
            setSteps={setSteps}
            nsRecords={nsRecords}
          />
        );
      case EditorPWATabs.Design:
        return (
          <DesignOption
            pwaContent={pwaContent}
            setPwaContent={setPwaContent}
            setCurrentTab={setCurrentTab}
            steps={steps}
            setSteps={setSteps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="px-[50px] pt-[110px] w-full">
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
            />
            {!isFinished && (
              <IconButton
                icon={<FaSave color="white" />}
                disabled={!availableToSave}
                onclick={savePwa}
                text="Сохранить"
                customClass={
                  availableToSave
                    ? "animate-pulse group hover:animate-none"
                    : "animate-none"
                }
              />
            )}
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
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 w-full h-full z-[100] flex flex-col items-center justify-center gap-10 text-[#00FF11] font-bold text-[28px] text-center tracking-[1.1px] transform -translate-x-1/2 -translate-y-1/2 p-5 backdrop-blur-[40px]">
          <Hourglass
            visible
            height="140"
            width="140"
            colors={["#515ACA", "#E3CC02"]}
          />
          Ваше PWA-приложение создается. Пожалуйста, подождите.
        </div>
      )}
    </>
  );
};

export default EditorPWA;

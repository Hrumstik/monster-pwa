import IconButton from "@shared/elements/IconButton/IconButton";
import DesignOption from "./DesignOption/DesignOption.tsx";
import { MdOutlineNotStarted } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
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
  useAttachReadyDomainMutation,
  useCreatePwaContentMutation,
  useDeletePwaContentMutation,
  useGetMyUserQuery,
  useGetReadyDomainsQuery,
  useLazyBuildPwaContentQuery,
} from "@store/slices/pwaApi";
import useCheckBuildStatus from "@shared/hooks/useCheckBuildStatus";
import { notification } from "antd";
import { Hourglass } from "react-loader-spinner";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo.ts";

const EditorPWA = () => {
  const { pwaId } = useParams();
  const [currentTab, setCurrentTab] = useState<EditorPWATabs>(
    EditorPWATabs.Design
  );

  const { id } = useParams();
  const { data: userData, refetch } = useGetMyUserQuery();
  const [steps, setSteps] = useState<Step[]>(stepsInitialState);
  const [pwaContent, setPwaContent] = useState<PwaContent>();
  const [domainsData, setDomainsData] = useState<CloudflareData>();
  const [availableToSave, setAvailableToSave] = useState(false);
  const [createPwaContent] = useCreatePwaContentMutation();
  const [buildPwaContent] = useLazyBuildPwaContentQuery();
  const { data: readyDomainsData } = useGetReadyDomainsQuery();
  const [addDomain] = useAddDomainMutation();
  const [addReadyDomain] = useAttachReadyDomainMutation();
  const { startPolling } = useCheckBuildStatus();
  const [isLoading, setIsLoading] = useState(false);
  const { getPwaInfo } = useGetPwaInfo();
  const navigate = useNavigate();
  const [pwaContentId, setPwaContentId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const [deletePwaContent] = useDeletePwaContentMutation();

  useEffect(() => {
    if (id) {
      setPwaContentId(id);
      setSteps(
        steps.map((step) => {
          if (step.id === EditorPWATabs.Domain) {
            return {
              ...step,
              isPassed: true,
              icon: getTabIcon(EditorPWATabs.Domain, true, false),
            };
          }
          return step;
        })
      );
    }
  }, [id]);

  useEffect(() => {
    if (pwaContent && (id || domainsData)) {
      setAvailableToSave(true);
    }
  }, [domainsData, id, pwaContent]);

  const finishEditingPwa = () => {
    notification.success({
      message: "Успешно",
      description: "PWA успешно изменено",
    });
    setIsFinished(true);
    setTimeout(async () => {
      navigate(`/`);
      await refetch();
      setIsLoading(false);
    }, 1000);
  };

  const addDomainData = async (pwaContent: PwaContent) => {
    if (!domainsData || !pwaContent) return;
    try {
      if (domainsData.gApiKey) {
        await addDomain({
          ...domainsData,
          pwaId: pwaContent._id!,
        }).unwrap();
      } else {
        const domainId = readyDomainsData?.find(
          (domain) => domain.domain === domainsData.domain
        )?._id;

        await addReadyDomain({
          id: domainId!,
          pwaId: pwaContent._id!,
          userId: userData!._id,
        }).unwrap();
        notification.success({
          message: "Успешно",
          description: "Ваше PWA успешно создано",
        });
        setIsFinished(true);
        setTimeout(async () => {
          navigate(`/`);
          await refetch();
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description:
          "Ошибка добавления домена, обратитесь в техническую поддержку",
      });
      setTimeout(() => {
        navigate(`/edit-PWA/${pwaContent._id}`);
      }, 1000);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePwa = async () => {
    if (!pwaContent) return;
    try {
      setIsLoading(true);
      let domain;
      if (id) {
        domain = getPwaInfo(id).domain;
      }
      if (id) deletePwaContent(id);
      const pwaContentResponse = await createPwaContent(pwaContent).unwrap();

      setPwaContentId(pwaContentResponse._id!);
      const buildPayload = !id
        ? { id: pwaContentResponse._id! }
        : {
            id: pwaContentResponse._id!,
            body: {
              domain,
            },
          };
      const buildResponse = await buildPwaContent(buildPayload).unwrap();
      setTimeout(
        () =>
          startPolling({
            jobId: buildResponse.jobId,
            completedStatusCallback: id
              ? () => finishEditingPwa()
              : () => addDomainData(pwaContentResponse),
            catchCallback: id
              ? () => setIsLoading(false)
              : () => addDomainData(pwaContentResponse),
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
            domainsData={domainsData}
            steps={steps}
            setSteps={setSteps}
            pwaContentId={pwaContentId}
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
          {id
            ? "  Ваше PWA-приложение обновляется, это займет некоторое время"
            : " Ваше PWA-приложение создается. Пожалуйста, подождите."}
        </div>
      )}
    </>
  );
};

export default EditorPWA;

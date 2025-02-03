import IconButton from "@shared/elements/IconButton/IconButton";
import DesignOption, {
  DesignOptionFormValues,
} from "./DesignOption/DesignOption.tsx";
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
} from "@store/apis/pwaApi.ts";
import useCheckBuildStatus from "@shared/hooks/useCheckBuildStatus";
import { Form, notification } from "antd";
import { Hourglass } from "react-loader-spinner";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo.ts";
import AnalyticOption from "./AnalyticOption/AnalyticOption.tsx";
import { DomainOptions } from "@models/domain.ts";
import useSteps from "@shared/hooks/useSteps.ts";

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
  const [buildAndDeployPwaContent] = useLazyBuildPwaContentQuery();
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
  const [designOptionForm] = Form.useForm<DesignOptionFormValues>();
  const [formForOwnDomain] = Form.useForm<CloudflareData>();
  const [analyticOptionForm] = Form.useForm();
  const [formForReadyDomain] = Form.useForm<{ readyDomain: string }>();
  const [currentDomainTab, setCurrentDomainTab] =
    useState<DomainOptions | null>(null);

  useSteps(steps, isFinished);

  useEffect(() => {
    if (id) {
      setPwaContentId(id);
      setSteps(
        steps.map((step) => ({
          ...step,
          isPassed: true,
        }))
      );
    }
  }, [id]);

  useEffect(() => {
    const isAvailableToSave = Object.values(steps).every(
      (step) => step.isPassed
    );
    setAvailableToSave(isAvailableToSave);
  }, [steps]);

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

  const getDomainData = (pwaContent: PwaContent) => {
    if (!domainsData || !pwaContent) return;

    if (domainsData.gApiKey) {
      return {
        ...domainsData,
      };
    } else {
      const domain = readyDomainsData?.find(
        (domain) => domain.domain === domainsData.domain
      );

      return {
        readyDomainId: domain?._id!,
        domain: domain?.domain,
      };
    }
  };

  const savePwa = async () => {
    if (!pwaContent) return;

    try {
      await handleNextStep(currentTab);
      setIsLoading(true);
      let domain = undefined;
      if (id) {
        domain = getPwaInfo(id).domain;
      }

      const pwaContentResponse = await createPwaContent(pwaContent).unwrap();
      if (id) deletePwaContent(id);

      setPwaContentId(pwaContentResponse._id!);

      const buildPayload = {
        id: pwaContentResponse._id!,
        body: {
          deploy: !domain,
          ...(domain ? { domain } : getDomainData(pwaContentResponse)),
        },
      } as {
        id: string;
        body?: {
          deploy: boolean;
          domain: string;
          email?: string;
          gApiKey?: string;
          readyDomainId?: string;
        };
      };

      const buildResponse = await buildAndDeployPwaContent(
        buildPayload
      ).unwrap();
      setIsLoading(false);
      navigate("/");
      await refetch();
      setTimeout(
        () =>
          startPolling({
            jobId: buildResponse.jobId,
            completedStatusCallback: () => navigate("/"),
            catchCallback: () => navigate("/"),
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

  const markStepAsPassed = (stepId: EditorPWATabs) => {
    setSteps(
      steps.map((s) =>
        s.id === stepId
          ? { ...s, isPassed: true, icon: getTabIcon(stepId, true, false) }
          : s
      )
    );
  };

  const handleNextStep = async (selectedStep: EditorPWATabs) => {
    try {
      switch (currentTab) {
        case EditorPWATabs.Domain:
          if (currentDomainTab === DomainOptions.OwnDomain) {
            await formForOwnDomain.validateFields();
            formForOwnDomain.submit();
          }

          if (currentDomainTab === DomainOptions.BuyDomain) {
            await formForReadyDomain.validateFields();
            formForReadyDomain.submit();
          }
          markStepAsPassed(EditorPWATabs.Domain);
          setCurrentTab(selectedStep);
          break;
        case EditorPWATabs.Design:
          await designOptionForm.validateFields();
          designOptionForm.submit();
          markStepAsPassed(EditorPWATabs.Design);
          setCurrentTab(selectedStep);
          break;
        case EditorPWATabs.Analytics:
          await analyticOptionForm.validateFields();
          analyticOptionForm.submit();
          markStepAsPassed(EditorPWATabs.Analytics);
          setCurrentTab(selectedStep);
          break;
      }
    } catch {
      notification.error({
        message: "Ошибка",
        description: "Пожалуйста, заполните все поля",
      });
    }
  };

  const getCurrentTab = () => {
    switch (currentTab) {
      case EditorPWATabs.Domain:
        return (
          <DomainOption
            cfAccounts={userData?.cfAccounts}
            setDomainsData={setDomainsData}
            domainsData={domainsData}
            steps={steps}
            setSteps={setSteps}
            pwaContentId={pwaContentId}
            setCurrentTab={setCurrentTab}
            formForOwnDomain={formForOwnDomain}
            formForReadyDomain={formForReadyDomain}
            setCurrentDomainTab={setCurrentDomainTab}
            currentDomainTab={currentDomainTab}
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
            form={designOptionForm}
          />
        );
      case EditorPWATabs.Analytics:
        return (
          <AnalyticOption
            pwaContent={pwaContent}
            setPwaContent={setPwaContent}
            setCurrentTab={setCurrentTab}
            steps={steps}
            setSteps={setSteps}
            form={analyticOptionForm}
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
          {id ? "Редактирование PWA" : "Создание PWA"}
        </h1>
        <div className="h-[42px] flex justify-between mb-12">
          <div className="flex items-center">
            {pwaId && <div className="flex"></div>}
          </div>
          <div className="flex gap-5">
            {!isFinished && (
              <IconButton
                icon={<FaSave color={availableToSave ? "#20223B" : "white"} />}
                disabled={!availableToSave}
                onclick={savePwa}
                text="Сохранить"
                customClass={
                  availableToSave
                    ? "animate-pulse group hover:animate-none bg-[#00FF22] hover:bg-lime-300"
                    : "animate-none"
                }
                textCustomClass={
                  availableToSave ? "text-[#20223B]" : "text-white"
                }
              />
            )}
          </div>
        </div>
        <div className="mb-10">
          <Steps
            steps={steps}
            currentStep={currentTab}
            onStepChange={(step) => handleNextStep(step as EditorPWATabs)}
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

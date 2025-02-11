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
  useCreatePwaContentMutation,
  useDeletePwaContentMutation,
  useGetMyUserQuery,
  useGetReadyDomainsQuery,
  useBuildPwaContentMutation,
  useGetAllPwaContentQuery,
  useGetPwaContentByIdQuery,
} from "@store/apis/pwaApi.ts";
import { Form, notification } from "antd";
import { Hourglass } from "react-loader-spinner";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo.ts";
import AnalyticOption from "./AnalyticOption/AnalyticOption.tsx";
import { DomainOptions } from "@models/domain.ts";
import useSteps from "@shared/hooks/useSteps.ts";
import { omit } from "lodash";

const EditorPWA = () => {
  const [currentTab, setCurrentTab] = useState<EditorPWATabs>(
    EditorPWATabs.Design
  );

  const { id } = useParams();
  const { cloneId } = useParams();

  const { data: userData } = useGetMyUserQuery();
  const [steps, setSteps] = useState<Step[]>(stepsInitialState);
  const [pwaContent, setPwaContent] = useState<PwaContent>();
  const [domainsData, setDomainsData] = useState<CloudflareData>();
  const [availableToSave, setAvailableToSave] = useState(false);
  const [createPwaContent] = useCreatePwaContentMutation();
  const [buildAndDeployPwaContent] = useBuildPwaContentMutation();
  const { data: readyDomainsData } = useGetReadyDomainsQuery();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [pwaContentId, setPwaContentId] = useState<string | null>(null);
  const { refetch: downloadAllPwa } = useGetAllPwaContentQuery();
  const { refetch: downloadUserInfo } = useGetMyUserQuery();

  const [deletePwaContent] = useDeletePwaContentMutation();
  const [designOptionForm] = Form.useForm<DesignOptionFormValues>();
  const [formForOwnDomain] = Form.useForm<CloudflareData>();
  const [analyticOptionForm] = Form.useForm();
  const [formForReadyDomain] = Form.useForm<{ readyDomain: string }>();
  const [currentDomainTab, setCurrentDomainTab] =
    useState<DomainOptions | null>(null);

  const { data: fetchedPwaContent } = useGetPwaContentByIdQuery(
    id ?? cloneId!,
    {
      skip: !id && !cloneId,
    }
  );

  useSteps(steps);

  const { getPwaInfo } = useGetPwaInfo(id);

  useEffect(() => {
    if (id && fetchedPwaContent) {
      setPwaContentId(id);
      setSteps(
        steps.map((step) => ({
          ...step,
          isPassed: step.id !== EditorPWATabs.Design,
          icon: getTabIcon(
            step.id as EditorPWATabs,
            step.id !== EditorPWATabs.Design,
            false
          ),
        }))
      );
      const customModal = omit(fetchedPwaContent.customModal, ["_id"]);

      const images = fetchedPwaContent.images.map((image) => ({
        type: image.type,
        url: image.url,
      }));
      const reviews = fetchedPwaContent.reviews.map((review) =>
        omit(review, ["_id"])
      );
      const updatedPwaContent = {
        ...fetchedPwaContent,
        images,
        reviews,
        customModal,
      };
      const theme = omit(updatedPwaContent.theme, ["_id"]);

      const pwaContent = omit(updatedPwaContent, [
        "_id",
        "createdAt",
        "updatedAt",
        "__v",
        "user",
      ]);
      pwaContent.theme = theme;

      setPwaContent(pwaContent as PwaContent);
    } else if (cloneId && fetchedPwaContent) {
      setCurrentTab(EditorPWATabs.Design);

      setSteps(
        steps.map((step) => ({
          ...step,
          isPassed: step.id !== EditorPWATabs.Domain,
          icon: getTabIcon(
            step.id as EditorPWATabs,
            step.id !== EditorPWATabs.Domain,
            false
          ),
        }))
      );
      const customModal = omit(fetchedPwaContent.customModal, ["_id"]);

      const images = fetchedPwaContent.images.map((image) => ({
        type: image.type,
        url: image.url,
      }));
      const reviews = fetchedPwaContent.reviews.map((review) =>
        omit(review, ["_id"])
      );
      const updatedPwaContent = {
        ...fetchedPwaContent,
        images,
        reviews,
        customModal,
      };
      const theme = omit(updatedPwaContent.theme, ["_id"]);

      const pwaContent = omit(updatedPwaContent, [
        "_id",
        "createdAt",
        "updatedAt",
        "__v",
        "user",
      ]);
      pwaContent.theme = theme;

      setPwaContent(pwaContent as PwaContent);
    }
  }, [id, cloneId, fetchedPwaContent]);

  useEffect(() => {
    const isAvailableToSave = Object.values(steps).every(
      (step) => step.isPassed
    );
    setAvailableToSave(isAvailableToSave);
  }, [steps]);

  const getDomainData = (pwaContent: PwaContent) => {
    if (!domainsData || !pwaContent || !readyDomainsData) return null;
    if (domainsData.gApiKey) {
      return {
        ...domainsData,
      };
    } else {
      const domain = readyDomainsData.find(
        (domain) => domain.domain === domainsData.domain
      )!;

      return {
        readyDomainId: domain ? domain._id : undefined,
        domain: domain.domain,
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
        domain = getPwaInfo(id)?.domain;
      }

      const pwaContentResponse = await createPwaContent(pwaContent).unwrap();
      if (id) deletePwaContent(id);

      setPwaContentId(pwaContentResponse._id!);

      const buildPayload = {
        id: pwaContentResponse._id!,
        body: {
          deploy: !domain,
          ...(domain ? { domain } : getDomainData(pwaContentResponse)!),
        },
      };

      await buildAndDeployPwaContent(buildPayload).unwrap();
      await downloadAllPwa().unwrap();
      await downloadUserInfo().unwrap();
      setIsLoading(false);
      navigate("/");
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
          <div className="flex items-center"></div>
          <div className="flex gap-5">
            <IconButton
              icon={<FaSave color={"white"} />}
              disabled={!availableToSave}
              onclick={savePwa}
              text="Сохранить"
              customClass={
                availableToSave
                  ? "animate-pulse group hover:animate-none"
                  : "animate-none"
              }
              textCustomClass={
                availableToSave ? "text-[#20223B]" : "text-white"
              }
            />
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

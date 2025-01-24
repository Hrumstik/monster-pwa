import { useEffect, useState } from "react";
import MonsterSelect from "../../../shared/elements/Select/MonsterSelect";
import { Form, notification, Result, Spin } from "antd";
import MonsterInput from "../../../shared/elements/MonsterInput/MonsterInput";
import { Step } from "@shared/elements/Steps/Steps";
import { CloudflareData } from "@models/user";
import axios from "axios";
import { DomainOptions } from "@models/domain";
import { useMount } from "react-use";
import { extractDomain } from "@shared/helpers/formate-data";
import { useNavigate } from "react-router-dom";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo";
import { EditorPWATabs, getTabIcon } from "../EditorPWAHelpers";
import { useGetReadyDomainsQuery } from "@store/apis/pwaApi";
import { DefaultOptionType } from "antd/es/select";
import ClassicButton from "@shared/elements/ClassicButton/ClassibButton";
import useSteps from "@shared/hooks/useSteps";

interface DomainOptionProps {
  setDomainsData: (domainData?: CloudflareData) => void;
  domainsData?: CloudflareData;
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  pwaContentId: string | null;
  cfAccounts?: { email: string; gApiKey: string }[];
  setCurrentTab: (tab: EditorPWATabs) => void;
  isFinished: boolean;
}

const DomainOption: React.FC<DomainOptionProps> = ({
  cfAccounts,
  setDomainsData,
  steps,
  setSteps,
  domainsData,
  pwaContentId,
  setCurrentTab,
  isFinished,
}) => {
  const [currentDomainTab, setCurrentDomainTab] =
    useState<DomainOptions | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const { data: readyDomainsData } = useGetReadyDomainsQuery();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { getPwaInfo } = useGetPwaInfo();
  const [readyDomains, setReadyDomains] = useState<DefaultOptionType[]>([]);
  const [selectedReadyDomain, setSelectedReadyDomain] = useState<string | null>(
    null
  );
  let savedNsRecords:
    | {
        name: string;
        _id: string;
      }[]
    | undefined;
  let domain;
  let readyDomainId;

  if (pwaContentId) {
    const userPwa = getPwaInfo(pwaContentId);

    savedNsRecords = userPwa.nsRecords;
    domain = userPwa.domain;
    readyDomainId = userPwa.readyDomainId;
  }

  useEffect(() => {
    if (readyDomainsData) {
      const domains = readyDomainsData.map((domain) => ({
        label: domain.domain,
        value: domain.domain,
      }));
      setReadyDomains(domains);
    }
  }, [readyDomainsData]);

  useSteps(steps, isFinished);

  useMount(() => {
    if (domainsData?.gApiKey) {
      setCurrentDomainTab(DomainOptions.OwnDomain);
      form.setFieldsValue(domainsData);
    } else {
      setCurrentDomainTab(DomainOptions.BuyDomain);
      selectedDomainForm.setFieldsValue({
        domain: domainsData?.domain,
      });
    }
  });

  const handleSelectReadyDomain = () => {
    if (domainsData) {
      setDomainsData(undefined);
      selectedDomainForm.resetFields();
      setSteps(
        steps.map((step) => {
          if (step.id === EditorPWATabs.Domain) {
            return {
              ...step,
              isPassed: false,
              icon: getTabIcon(EditorPWATabs.Domain, false, false),
            };
          }
          return step;
        })
      );
      return;
    }
    selectedDomainForm
      .validateFields()
      .then(() => {
        setDomainsData({
          domain: selectedReadyDomain!,
        });
        const newSteps = steps.map((step) => {
          if (step.id === EditorPWATabs.Domain) {
            return {
              ...step,
              isPassed: true,
              icon: getTabIcon(EditorPWATabs.Domain, true, false),
            };
          }
          return step;
        });
        setSteps(newSteps);
        const nextStep = newSteps.find((step) => !step.isPassed)
          ?.id as EditorPWATabs;
        if (nextStep) {
          setCurrentTab(nextStep);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const validateDomainData = async () => {
    try {
      const domainValidation = await axios.post(
        "https://pwac.world/domains/check-addition",
        {
          domain: extractDomain(form.getFieldValue("domain")),
          email: cfAccounts?.length
            ? cfAccounts[0].email
            : form.getFieldValue("email"),
          gApiKey: cfAccounts?.length
            ? cfAccounts[0].gApiKey
            : form.getFieldValue("gApiKey"),
        }
      );

      if (domainValidation.data.canBeAdded) {
        return Promise.resolve(true);
      } else {
        api.error({
          message: "Ошибка",
          description: "Домен не может быть добавлен",
        });
        return Promise.reject("Домен не может быть добавлен");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const [form] = Form.useForm<CloudflareData>();
  const [selectedDomainForm] = Form.useForm<{ domain: string }>();

  const onFinish = async () => {
    if (domainsData) {
      setDomainsData(undefined);
      form.resetFields();
      setSteps(
        steps.map((step) => {
          if (step.id === EditorPWATabs.Domain) {
            return {
              ...step,
              isPassed: false,
              icon: getTabIcon(EditorPWATabs.Domain, false, false),
            };
          }
          return step;
        })
      );
      return;
    }
    try {
      await form.validateFields();
      setIsLoading(true);
      const domainIsValid = await validateDomainData();
      if (domainIsValid) {
        const values = form.getFieldsValue();
        const domain = extractDomain(values.domain);
        if (!domain) {
          throw new Error("Invalid domain");
        }
        setDomainsData({
          ...values,
          ...(cfAccounts?.length
            ? { gApiKey: cfAccounts[0].gApiKey, email: cfAccounts[0].email }
            : {}),
          domain: extractDomain(values.domain)!,
        });

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
        api.success({
          message: "Успешно",
          description: "Приложение PWA можно сохранить",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        api.error({
          message: "Ошибка",
          description: "Пожалуйста проверьте введенные данные",
        });
      }
      setDomainsData(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={isLoading} fullscreen />
      {savedNsRecords && savedNsRecords.length > 0 ? (
        <Result
          status="success"
          title={
            <h1 className="font-bold text-base leading-5 text-[#00FF11] cursor-default mb-4">
              Домен <span className="underline cursor-auto">{domain}</span>{" "}
              успешно добавлен!
            </h1>
          }
          subTitle={
            <>
              <p className="text-xs leading-4 text-[#8F919D] mb-2 cursor-default">
                Пожалуйста, обновите записи NS у вашего <br /> провайдера,
                указав следующие серверы:
              </p>
              <ul className="text-white text-xs">
                {savedNsRecords?.map((record, i) => (
                  <li className="cursor-default" key={record.name}>
                    {`NS-сервер ${i + 1}:`}{" "}
                    <span className="cursor-auto">{record.name}</span>
                  </li>
                ))}
              </ul>
            </>
          }
          extra={
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-white hover:bg-[#00FF11] text-[#121320] rounded-lg text-base py-3 px-[38px] whitespace-nowrap flex item"
              >
                Вернуться на страницу с моими PWA
              </button>
            </div>
          }
        />
      ) : (
        <div className="bg-[#20223B] min-h-[587px] rounded-lg px-[50px] pt-[62px] mb-4">
          <h2 className="text-[22px] leading-[26px] text-white mb-[30px]">
            Домен
          </h2>
          <div className="text-[18px] text-white leading-4 mb-[30px]">
            Для работы PWA необходим домен. Вы можете купить домен у нас или
            использовать свой.
          </div>
          <div className="flex gap-[30px] mb-[50px]">
            <div
              onClick={() => {
                if (!domainsData) setCurrentDomainTab(DomainOptions.BuyDomain);
              }}
              className={`flex-1 h-[178px] ${
                currentDomainTab === DomainOptions.BuyDomain
                  ? "bg-[#515ACA]"
                  : "bg-[#20223B]"
              } border border-[#121320] rounded-lg  cursor-pointer p-[40px] ${
                currentDomainTab !== DomainOptions.BuyDomain
                  ? "hover:border-white"
                  : ""
              }
              `}
            >
              <div className="text-white text-[16px] leading-[18px] mb-2">
                Использовать готовый домен
              </div>
            </div>
            <div
              onClick={() =>
                !domainsData && setCurrentDomainTab(DomainOptions.OwnDomain)
              }
              className={`flex-1 h-[178px] ${
                currentDomainTab === DomainOptions.OwnDomain
                  ? "bg-[#515ACA]"
                  : "bg-[#20223B]"
              } border border-[#121320] rounded-lg  cursor-pointer p-[40px] ${
                currentDomainTab !== DomainOptions.OwnDomain
                  ? "hover:border-white"
                  : ""
              }`}
            >
              <div className="text-white text-[16px] leading-[18px] mb-2">
                Использовать свой
              </div>
              <div className="font-bold text-white text-[22px]">Бесплатно</div>
            </div>
          </div>
          {currentDomainTab === DomainOptions.BuyDomain && (
            <div>
              <div className="text-white font-bold text-[16px] leading-[18px] mb-[10px]">
                Выберите понравившийся домен
              </div>
              <div className="text-gray-400 text-[16px] leading-[18px] mb-[20px]">
                Все домены уже настроены и работают. Ничего дополнительно
                настраивать не нужно.
              </div>
              <div className="flex gap-[30px]">
                <div className="flex-1">
                  <Form form={selectedDomainForm}>
                    <Form.Item
                      name="domain"
                      rules={[
                        {
                          required: true,
                          message: "Выберите домен",
                        },
                      ]}
                      initialValue={
                        readyDomainId
                          ? {
                              label: domain,
                              value: readyDomainId,
                            }
                          : undefined
                      }
                    >
                      <MonsterSelect
                        disabled={!!readyDomainId}
                        options={readyDomains}
                        className="w-full"
                        placeholder="Домен"
                        onChange={setSelectedReadyDomain}
                      />
                    </Form.Item>
                  </Form>
                </div>
                {!domain && (
                  <div className="flex-1">
                    <ClassicButton
                      htmlType="submit"
                      text={domainsData ? "Очистить" : "Продолжить"}
                      onClick={handleSelectReadyDomain}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {currentDomainTab === DomainOptions.OwnDomain && (
            <div className="flex gap-[30px]">
              <div className="flex-1">
                <div className="font-bold text-white text-base mb-[15px]">
                  (1) Подключение своего домена
                </div>
                <div className="font-normal text-gray-400 mb-[30px]">
                  Для того, чтобы использовать собственный домен, нужно передать
                  управление DNS записями в Cloudflare. Инструкция{" "}
                  <span
                    onClick={() =>
                      window.open(
                        "https://vibegamesteam.notion.site/86ca016f4984469db74d7c2eca83c16f",
                        "_blank"
                      )
                    }
                    className="text-[#02E314] hover:underline hover:text-[#02E314] cursor-pointer"
                  >
                    здесь
                  </span>
                  .
                </div>
                <Form
                  form={form}
                  className="mb-[57px]"
                  validateTrigger={["onBlur", "onSubmit"]}
                >
                  <Form.Item
                    name="domain"
                    className="mb-[25px]"
                    rules={[
                      {
                        required: true,
                        message: "Введите домен",
                      },
                    ]}
                  >
                    <MonsterInput
                      disabled={!!domain}
                      placeholder="Домен"
                      className="!bg-[#161724]"
                      autoComplete="off"
                    />
                  </Form.Item>
                  {!cfAccounts?.length && (
                    <Form.Item
                      name="email"
                      className="mb-[25px]"
                      rules={[
                        {
                          required: true,
                          message: "Введите Email",
                        },
                        {
                          type: "email",
                          message: "Введите корректный Email",
                        },
                      ]}
                    >
                      <MonsterInput
                        disabled={!!domain}
                        placeholder="Cloudflare Email"
                        className="!bg-[#161724]"
                        autoComplete="off"
                      />
                    </Form.Item>
                  )}
                  {!cfAccounts?.length && (
                    <Form.Item
                      name="gApiKey"
                      className="mb-[25px]"
                      rules={[
                        {
                          required: true,
                          message: "Введите API ключ",
                        },
                      ]}
                    >
                      <MonsterInput
                        disabled={!!domain}
                        placeholder="Cloudflare API Key"
                        className="!bg-[#161724]"
                        autoComplete="off"
                      />
                    </Form.Item>
                  )}
                </Form>
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-base mb-[15px]">
                  (2) Автонастрйока
                </div>
                <div className="font-normal text-gray-400  mb-[40px]">
                  Чтобы все заработало, в Cloudflare будет выполнен ряд
                  автоматических настроек для вашего домена. Для продолжения
                  нажмите кнопку ниже. Посмотреть API ключ можно{" "}
                  <a
                    href="https://dash.cloudflare.com/profile/api-tokens"
                    className="underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    в вашем ЛК Cloudflare
                  </a>
                  . Вам будет нужен Global API key.
                </div>
                {!domain && (
                  <ClassicButton
                    onClick={onFinish}
                    text={domainsData ? "Очистить" : "Продолжить"}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DomainOption;

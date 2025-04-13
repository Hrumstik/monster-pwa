import { TriggerEvent } from "@models/push";
import IconButton from "@shared/elements/IconButton/IconButton";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import MonsterSelect from "@shared/elements/Select/MonsterSelect";
import MonsterSwitch from "@shared/elements/Switch/MonsterSwitch";
import { requiredValidator } from "@shared/form/validators/validators";
import { useGetAllPwaContentQuery } from "@store/apis/pwaApi";
import {
  Radio,
  RadioChangeEvent,
  Form,
  Input,
  Upload,
  message,
  Spin,
} from "antd";

import { useEffect, useState } from "react";

import { FaSave } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  depositFiltersOptions,
  generateDaysOptions,
  generateHoursOptions,
  generateMinutesOptions,
  generateSecondsOptions,
  registrationFiltersOptions,
} from "../../shared/helpers/pushEditorHelpers";
import UploadImageIcon from "@icons/UploadImageIcon";
import {
  allowedExtensions,
  allowedExtensionsErrorMessage,
  languages,
} from "../../Routes/EditorPWA/DesignOption/DesignOptionHelpers";
import { useUploadImagesMutation } from "@store/apis/filesApi";
import { useWatch } from "antd/es/form/Form";
import ClassicButton from "@shared/elements/ClassicButton/ClassibButton";
import {
  useCreatePushMutation,
  useEditPushMutation,
  useGetPushQuery,
  useTestPushMutation,
} from "@store/apis/pushApi";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo";
import ring from "@icons/ring.svg";
import { GrTest } from "react-icons/gr";

export interface PushEvent {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  systemName: string;
  active: boolean;
  triggerEvent: TriggerEvent;
  delay: number;
  schedules: string[];
  recordedSchedules: string[];
  color: string;
  timeZone?: string;
  content: {
    languages: string[];
    title: Record<string, string>;
    description: Record<string, string>;
    badge: string;
    icon: string;
    picture: string;
    url: string;
  };
  recipients: {
    pwas: {
      id: string;
      domain: string;
    }[];
    filters: {
      event: TriggerEvent;
      sendTo: "all" | "with" | "without";
    }[];
  }[];
}

const triggerEventsOptions = [
  {
    label: "Установка",
    value: TriggerEvent.OpenPwa,
  },
  {
    label: "Регистрация",
    value: TriggerEvent.Registration,
  },
  {
    label: "Депозит",
    value: TriggerEvent.Deposit,
  },
];

const { TextArea } = Input;

const PushEditor = () => {
  const { id } = useParams();
  const [pwasChoice, setPwasChoice] = useState<"allPwa" | "specificPwa">(
    "specificPwa"
  );
  const [createPush, { isLoading: isPushCreating }] = useCreatePushMutation();
  const [editPush, { isLoading: isPushEditing }] = useEditPushMutation();
  const navigate = useNavigate();
  const [uploadImages, { isLoading: areImagesLoading }] =
    useUploadImagesMutation();
  const { data: allPwas, isLoading: arePwasLoading } =
    useGetAllPwaContentQuery();
  const daysOptions = generateDaysOptions(29);
  const hoursOptions = generateHoursOptions(23);
  const minutesOptions = generateMinutesOptions(59);
  const secondsOptions = generateSecondsOptions(59);
  const { getPwaInfo } = useGetPwaInfo();
  const { data: pushData, isLoading: isPushLoading } = useGetPushQuery(id!, {
    skip: !id,
  });
  const [sendTestPush, { isLoading: sendTestPushIsLoading }] =
    useTestPushMutation();

  useEffect(() => {
    if (pushData && allPwas) {
      form.setFieldsValue(pushData);
      const delay = pushData.delay;

      const days = Math.floor(delay / 86400);
      const hours = Math.floor((delay % 86400) / 3600);
      const minutes = Math.floor((delay % 3600) / 60);
      const seconds = delay % 60;

      setTimeOptions([
        {
          label: "Дней",
          value: days * 86400,
        },
        {
          label: "Часов",
          value: hours * 3600,
        },
        {
          label: "Минут",
          value: minutes * 60,
        },
        {
          label: "Секунд",
          value: seconds,
        },
      ]);

      setSelectedPwas(pushData.recipients[0].pwas.map((pwa) => pwa.id));
      if (pushData.recipients[0].pwas.length === allPwas?.length) {
        setPwasChoice("allPwa");
      } else {
        setPwasChoice("specificPwa");
      }
    }
  }, [pushData, allPwas]);

  const [timeOptions, setTimeOptions] = useState<
    [
      {
        label: "Дней";
        value: number;
      },
      {
        label: "Часов";
        value: number;
      },
      {
        label: "Минут";
        value: number;
      },
      {
        label: "Секунд";
        value: number;
      }
    ]
  >([
    {
      label: "Дней",
      value: 0,
    },
    {
      label: "Часов",
      value: 0,
    },
    {
      label: "Минут",
      value: 0,
    },
    {
      label: "Секунд",
      value: 0,
    },
  ]);

  const pwaOptions =
    allPwas?.map((pwa) => ({
      label: pwa.pwaName || pwa.appName,
      value: pwa._id,
    })) || [];

  const [selectedPwas, setSelectedPwas] = useState<string[]>([]);

  const handlePwaChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setSelectedPwas(value);
    }
  };

  const handlePwaChoiceChange = (e: RadioChangeEvent) => {
    if (!allPwas) return;
    const value = e.target.value;
    setPwasChoice(value);

    if (value === "allPwa" && allPwas) {
      const allPwasIds = allPwas.map((pwa) => pwa._id!);
      setSelectedPwas(allPwasIds);
    }
  };

  const [form] = Form.useForm<PushEvent>();

  const handleBeforeScreensUpload = (
    file: File,
    key: "badge" | "icon" | "picture"
  ) => {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(extension) && key !== "badge") {
      message.error(allowedExtensionsErrorMessage);
      return false;
    }

    if (key === "badge" && extension !== ".png") {
      message.error(
        "Бейдж должен быть в формате PNG. Пожалуйста, загрузите файл с расширением .png"
      );
      return false;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const response = await uploadImages([file]).unwrap();
      const imageUrl = response.imageUrls[0];
      form.setFieldsValue({
        content: {
          ...form.getFieldValue("content"),
          [key]: imageUrl,
        },
      });
    };

    reader.readAsDataURL(file);

    return false;
  };

  const content = useWatch("content", form);
  const removeImage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    key: "badge" | "icon" | "picture"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    form.setFieldsValue({
      content: {
        ...form.getFieldValue("content"),
        [key]: "",
      },
    });
  };

  const onFinishFailed = (errorInfo: {
    errorFields: { name: (string | number)[] }[];
  }) => {
    console.log("Failed:");
    form.scrollToField(errorInfo.errorFields[0].name, {
      behavior: "smooth",
      block: "center",
    });
  };

  const handleFinish = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const delay = timeOptions.reduce((acc, curr) => acc + curr.value, 0);
      const payload = {
        ...values,
        delay,
      };

      const pwas = selectedPwas
        .map((pwaId) => {
          const pwaInfo = getPwaInfo(pwaId);
          return {
            id: pwaId,
            domain: pwaInfo?.domain || "",
          };
        })
        .filter((pwa) => pwa.domain);

      payload.recipients[0].pwas = pwas;

      if (id) {
        await editPush({ id, data: payload }).unwrap();
        message.success("Пуш успешно отредактирован");
        navigate("/push-dashboard");
        return;
      }

      await createPush(payload).unwrap();
      message.success("Пуш успешно создан");
      navigate("/push-dashboard");
    } catch (error) {
      console.log("Failed:", error);
      if (error && typeof error === "object" && "errorFields" in error) {
        onFinishFailed(
          error as { errorFields: { name: (string | number)[] }[] }
        );
      }
    }
  };

  const sendTestPushHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!id) return;
    try {
      await sendTestPush({ id }).unwrap();
      message.success("Тестовый пуш отправлен");
    } catch {
      message.error("Ошибка при отправке тестового пуша");
    }
  };

  return (
    <div className="px-[50px] ">
      <Spin
        spinning={
          areImagesLoading ||
          arePwasLoading ||
          isPushCreating ||
          isPushLoading ||
          isPushEditing ||
          sendTestPushIsLoading
        }
        fullscreen
      />
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{
          content: {
            languages: [],
            title: "",
            description: "",
            badge: "",
            icon: "",
            picture: "",
            url: "",
          },
          active: true,
          recipients: [
            {
              pwas: [],
              filters: [
                {
                  event: TriggerEvent.Registration,
                  sendTo: "all",
                },
                {
                  event: TriggerEvent.Deposit,
                  sendTo: "all",
                },
              ],
            },
          ],
        }}
      >
        <div className="pb-10 w-full">
          <h1 className="font-bold text-[28px] leading-8 text-white mb-7">
            {id ? "Редактирование пуша" : "Создание пуша"}
          </h1>
          <div className="h-[42px] flex justify-between mb-12">
            <div className="flex items-center"></div>
            <div className="flex gap-5">
              <IconButton icon={<FaSave color={"white"} />} text="Сохранить" />
            </div>
          </div>

          <div className="flex relative gap-[30px] mb-[30px]">
            <div className="flex-grow flex flex-col gap-[50px]">
              <div className="bg-cardColor p-[50px] rounded-lg">
                <h2 className="text-yellowTitle text-base leading-[18px] font-bold mb-4">
                  PWA для работы PUSH
                </h2>
                <Radio.Group
                  size="large"
                  value={pwasChoice}
                  onChange={(e) => handlePwaChoiceChange(e)}
                  className="flex gap-5 mb-4"
                  options={[
                    {
                      label: "Отправлять по всем PWA",
                      value: "allPwa",
                    },
                    {
                      label: "Отправлять по определенным PWA",
                      value: "specificPwa",
                    },
                  ]}
                />
                <div className="flex justify-between gap-5">
                  <MonsterSelect
                    mode="multiple"
                    placeholder="Выберите PWA"
                    options={pwaOptions}
                    className="min-h-[42px] min-w-[460px]"
                    value={selectedPwas}
                    onChange={handlePwaChange}
                    disabled={pwasChoice === "allPwa"}
                  />
                  {id && (
                    <IconButton
                      icon={<GrTest color="white" />}
                      customClass="bg-[#0602E3] hover:bg-red"
                      text="Тестовый PUSH "
                      onclick={sendTestPushHandler}
                    />
                  )}
                </div>
              </div>
              <div className="bg-cardColor p-[50px] rounded-lg">
                <h2 className="text-yellowTitle text-base leading-[18px] font-bold mb-4">
                  Основные настройки
                </h2>
                <p className="text-white text-sm mb-4">
                  Название PUSH (которое будет отображаться в интерфейсе)
                </p>
                <Form.Item
                  name={["systemName"]}
                  className="mb-7"
                  rules={[requiredValidator("Введите название PUSH")]}
                >
                  <MonsterInput
                    placeholder="Название PUSH"
                    className="w-[460px] h-[42px]"
                  />
                </Form.Item>
                <p className="text-base font-normal text-white mb-4">Языки</p>
                <Form.Item
                  name={["content", "languages"]}
                  className="mb-7 w-[460px]"
                  rules={[
                    {
                      required: true,
                      type: "array",
                      message: "Выберите хотя бы один язык",
                    },
                  ]}
                >
                  <MonsterSelect
                    mode="multiple"
                    options={languages}
                    onChange={(value) => {
                      form.setFieldsValue({
                        content: {
                          ...form.getFieldValue("content"),
                          languages: value,
                        },
                      });
                    }}
                    className="h-[42px]"
                    placeholder="Выберите язык"
                  />
                </Form.Item>
                <p className="text-base font-normal text-white mb-4">
                  PUSH включен
                </p>
                <div className="flex items-center gap-5 mb-7">
                  <p className="text-white text-sm">
                    После включения, для новых событий будут запланированы пуши.
                  </p>
                  <Form.Item
                    name={["active"]}
                    className="mb-0"
                    valuePropName="checked"
                  >
                    <MonsterSwitch />
                  </Form.Item>
                </div>
                <div className="text-base text-white mb-3">
                  Триггер отправки
                </div>
                <Form.Item
                  name={"triggerEvent"}
                  className="mb-7 w-[460px]"
                  rules={[requiredValidator("Выберите триггер отправки")]}
                >
                  <MonsterSelect
                    options={triggerEventsOptions}
                    className="h-[42px]"
                    placeholder="Выберите триггер отправки"
                  />
                </Form.Item>
                <div className="text-white text-base mb-3">
                  Задержка отправки
                </div>
                <div className="flex gap-5">
                  <div className="flex flex-col gap-[9px] flex-1">
                    <div className="text-white text-xs">Дней</div>
                    <MonsterSelect
                      options={daysOptions}
                      value={timeOptions[0].value}
                      onChange={(value) => {
                        setTimeOptions((prev) => [
                          { ...prev[0], value },
                          prev[1],
                          prev[2],
                          prev[3],
                        ]);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-[9px] flex-1">
                    <div className="text-white text-xs">Часов</div>
                    <MonsterSelect
                      options={hoursOptions}
                      value={timeOptions[1].value}
                      onChange={(value) => {
                        setTimeOptions((prev) => [
                          prev[0],
                          { ...prev[1], value },
                          prev[2],
                          prev[3],
                        ]);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-[9px] flex-1">
                    <div className="text-white text-xs">Минут</div>
                    <MonsterSelect
                      options={minutesOptions}
                      value={timeOptions[2].value}
                      onChange={(value) => {
                        setTimeOptions((prev) => [
                          prev[0],
                          prev[1],
                          { ...prev[2], value },
                          prev[3],
                        ]);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-[9px] flex-1">
                    <div className="text-white text-xs">Секунд</div>
                    <MonsterSelect
                      options={secondsOptions}
                      value={timeOptions[3].value}
                      onChange={(value) => {
                        setTimeOptions((prev) => [
                          prev[0],
                          prev[1],
                          prev[2],
                          { ...prev[3], value },
                        ]);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-cardColor p-[50px] rounded-lg">
                <h2 className="text-yellowTitle text-base leading-[18px] font-bold mb-5">
                  Контент
                </h2>
                <p className="text-xs text-white mb-2.5">Заголовок</p>
                <Form.Item
                  name={["content", "title", "originalLanguage"]}
                  className="mb-5"
                  rules={[requiredValidator("Введите заголовок")]}
                >
                  <MonsterInput
                    placeholder="Укажите заголовок пуша"
                    className="w-[460px] h-[42px]"
                  />
                </Form.Item>
                <p className="text-xs text-white mb-2.5">Текст пуша</p>
                <Form.Item
                  name={["content", "description", "originalLanguage"]}
                  className="mb-5"
                  rules={[requiredValidator("Введите текст пуша")]}
                >
                  <TextArea
                    placeholder="Укажите текст пуша"
                    rows={6}
                    className="resize-none scrollbar-hidden w-[460px]"
                  />
                </Form.Item>
              </div>
              <div className="bg-cardColor p-[50px] rounded-lg">
                <h2 className="text-yellowTitle text-base leading-[18px] font-bold mb-5">
                  Бейдж, иконка и изображение
                </h2>
                <p className="text-[#8F919D] text-xs mb-9">
                  Иконка будет обрезана до соотношения сторон 1:1. Рекомендуемый
                  размер изображения - 2:1, например 512х256. Если иконка не
                  установлена, то будет использоваться иконка PWA. Бейдж -
                  монохромная иконка значка уведомления на Android.
                </p>
                <div className="flex gap-7">
                  <div className="flex flex-col gap-4">
                    <p className="text-white text-xs leading-4">Бейдж</p>
                    <Form.Item name={["content", "badge"]} className="mb-5">
                      <Upload
                        beforeUpload={(file) =>
                          handleBeforeScreensUpload(file, "badge")
                        }
                        showUploadList={false}
                      >
                        {content?.badge ? (
                          <div className="relative w-[100px] h-[100px] group rounded-xl">
                            <img
                              src={content.badge}
                              alt="Uploaded"
                              className="w-[100px] h-[100px] object-fill rounded-xl"
                            />
                            <button
                              className="absolute  opacity-0 -top-3 -right-3 group-hover:opacity-100  text-white rounded-full w-4 h-4 flex justify-center items-center"
                              onClick={(e) => {
                                removeImage(e, "badge");
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="w-[100px] h-[100px] bg-[#161724] rounded-lg hover:border-[#36395a] hover:border hover:border-solid cursor-pointer flex items-center justify-center"
                          >
                            <UploadImageIcon />
                          </button>
                        )}
                      </Upload>
                    </Form.Item>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="text-white text-xs leading-4">Иконка</p>
                    <Form.Item name={["content", "icon"]} className="mb-5">
                      <Upload
                        beforeUpload={(file) =>
                          handleBeforeScreensUpload(file, "icon")
                        }
                        showUploadList={false}
                      >
                        {content?.icon ? (
                          <div className="relative w-[150px] h-[100px] group rounded-xl">
                            <img
                              src={content.icon}
                              alt="Uploaded"
                              className="w-[150px] h-[100px] object-fill rounded-xl"
                            />
                            <button
                              className="absolute  opacity-0 -top-3 -right-3 group-hover:opacity-100  text-white rounded-full w-4 h-4 flex justify-center items-center"
                              onClick={(e) => {
                                removeImage(e, "icon");
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="w-[150px] h-[100px] bg-[#161724] rounded-lg hover:border-[#36395a] hover:border hover:border-solid cursor-pointer flex items-center justify-center"
                          >
                            <UploadImageIcon />
                          </button>
                        )}
                      </Upload>
                    </Form.Item>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="text-white text-xs leading-4">Изображение</p>
                    <Form.Item name={["content", "picture"]} className="mb-5">
                      <Upload
                        beforeUpload={(file) =>
                          handleBeforeScreensUpload(file, "picture")
                        }
                        showUploadList={false}
                      >
                        {content?.picture ? (
                          <div className="relative w-[200px] h-[100px] group rounded-xl">
                            <img
                              src={content.picture}
                              alt="Uploaded"
                              className="w-[200px] h-[100px] object-fill rounded-xl"
                            />
                            <button
                              className="absolute  opacity-0 -top-3 -right-3 group-hover:opacity-100  text-white rounded-full w-4 h-4 flex justify-center items-center"
                              onClick={(e) => {
                                removeImage(e, "picture");
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="w-[200px] h-[100px] bg-[#161724] rounded-lg hover:border-[#36395a] hover:border hover:border-solid cursor-pointer flex items-center justify-center"
                          >
                            <UploadImageIcon />
                          </button>
                        )}
                      </Upload>
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="bg-cardColor p-[50px] rounded-lg">
                <h2 className="text-yellowTitle text-base leading-[18px] font-bold mb-5">
                  URL
                </h2>
                <p className="text-[#888A97] text-sm leading-4 mb-4">
                  Введите ссылку, на которую попадет юзер, кликнув на пуш. Если
                  не будет заполнено, то будет использована ссылка на оффер из
                  настроек PWA.{" "}
                </p>
                <Form.Item name={["content", "url"]} className="mb-5">
                  <MonsterInput
                    placeholder="Введите URL"
                    className="w-[460px] h-[42px]"
                  />
                </Form.Item>
              </div>
              <div className="bg-cardColor p-[50px] rounded-lg">
                <h2 className="text-yellowTitle text-base leading-[18px] font-bold mb-5">
                  Фильтры отправки PUSH
                </h2>
                <p className="text-[#888A97] mb-5 text-s">
                  При необходимости, установите фильтрацию получателей этого
                  пуша.
                </p>
                <div className="text-white text-base leading-[18px] mb-3">
                  По регистрациям
                </div>
                <Form.Item
                  name={["recipients", 0, "filters", 0, "sendTo"]}
                  className="mb-5 w-[460px]"
                  rules={[requiredValidator("Выберите событие")]}
                >
                  <MonsterSelect
                    options={registrationFiltersOptions}
                    className="min-h-[42px]"
                    placeholder="Выберите событие"
                  />
                </Form.Item>
                <div className="text-white text-base mb-3">По депозитам</div>
                <Form.Item
                  name={["recipients", 0, "filters", 1, "sendTo"]}
                  className="mb-5 w-[460px]"
                  rules={[requiredValidator("Выберите событие")]}
                >
                  <MonsterSelect
                    options={depositFiltersOptions}
                    className="min-h-[42px]"
                    placeholder="Выберите событие"
                  />
                </Form.Item>
                <Form.Item
                  name={["recipients", 0, "filters", 1, "event"]}
                  hidden
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["recipients", 0, "filters", 0, "event"]}
                  hidden
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className="sticky flex-shrink-0 w-[250px] flex top-4 right-0 h-[471px] rounded-[32px] box-border border-[5px] border-solid border-[#515ACA] bg-[#20223B] overflow-hidden scrollbar-hidden">
              <div className="flex justify-center w-full p-[68px]">
                <div className="min-w-[200px] h-fit p-2 rounded-lg bg-white">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center mb-2">
                      <div className="rounded-full bg-[#515ACA] h-[23px] w-[23px] flex items-center justify-center overflow-hidden">
                        {
                          content?.badge ? (
                            <img
                              src={content.badge}
                              alt="badge"
                              className="object-fill w-full h-full"
                            />
                          ) : (
                            <img
                              src={ring}
                              alt="badge"
                              className="object-fill"
                            />
                          ) // default image
                        }
                      </div>
                      <div className="text-[10px] font-inter text-[#20223B]">
                        PWA * now
                      </div>
                    </div>
                    {content?.icon && (
                      <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                        <img
                          src={content.icon}
                          alt="badge"
                          className="object-fill"
                        />
                      </div>
                    )}
                  </div>
                  <div className="font-inter text-xs font-bold mb-3">
                    {content?.title.originalLanguage || "Заголовок пуша"}
                  </div>
                  <div className="font-inter text-xs text-[#20223B] mb-[35px]">
                    {content?.description.originalLanguage ||
                      "That looks like a Jira Cloud link. Would you like to install the Jira Cloud app from the"}
                  </div>
                  {content?.picture && (
                    <img
                      src={content.picture}
                      className="w-full h-[119px] object-fill rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <ClassicButton onClick={handleFinish} text="Сохранить" />
        </div>
      </Form>
    </div>
  );
};

export default PushEditor;

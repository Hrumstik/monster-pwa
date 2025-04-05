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
  DatePicker,
  Checkbox,
} from "antd";

import { useEffect, useState } from "react";

import { FaSave } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  depositFiltersOptions,
  registrationFiltersOptions,
} from "@shared/helpers/pushEditorHelpers";
import UploadImageIcon from "@icons/UploadImageIcon";
import {
  allowedExtensions,
  allowedExtensionsErrorMessage,
  languages,
} from "../EditorPWA/DesignOption/DesignOptionHelpers";
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
import MonsterRadio from "@shared/elements/Radio/MonsterRadio";
import {
  defaultTimezone,
  generateDates,
  timezones,
} from "./scheduledPushEditorHelpers";
import dayjs from "dayjs";
import MonsterCheckbox from "@shared/elements/MonsterCheckbox/MonsterCheckbox";
import { TimePosition } from "@models/time";
import { PushEvent } from "@Routes/PushEditor/PushEditor";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { TextArea } = Input;

const ScheduledPushEditor = () => {
  const { id, date } = useParams();
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
  const { getPwaInfo } = useGetPwaInfo();
  const { data: pushData, isLoading: isPushLoading } = useGetPushQuery(id!, {
    skip: !id,
  });
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    defaultTimezone?.value
  );
  const [scheduleOption, setScheduleOption] = useState<"once" | "regular">(
    "once"
  );
  const [sendTestPush, { isLoading: sendTestPushIsLoading }] =
    useTestPushMutation();
  const [schedules, setSchedules] = useState<string[]>([dayjs().toISOString()]);
  const [regularOptions, setRegularOptions] = useState({
    hours: 0,
    minutes: 0,
    days: [1, 3, 0],
    start: dayjs().toISOString(),
    end: dayjs().toISOString(),
  });

  useEffect(() => {
    if (!date) return;
    setRegularOptions({
      ...regularOptions,
      start: dayjs(date).toISOString(),
      end: dayjs(date).toISOString(),
    });
    setSchedules([dayjs(date).toISOString()]);
  }, [date]);

  useEffect(() => {
    if (pushData) {
      form.setFieldsValue({
        systemName: pushData.systemName,
        color: pushData.color,
        active: pushData.active,
        content: {
          languages: pushData.content.languages,
          title: pushData.content.title,
          description: pushData.content.description,
          badge: pushData.content.badge,
          icon: pushData.content.icon,
          picture: pushData.content.picture,
          url: pushData.content.url,
        },
        recipients: pushData.recipients,
      });
      setSelectedTimeZone(pushData.timeZone ?? defaultTimezone?.value);
      setSelectedPwas(pushData.recipients[0].pwas.map((pwa) => pwa.id));
      if (pushData.recipients[0].pwas.length === allPwas?.length) {
        setPwasChoice("allPwa");
      } else {
        setPwasChoice("specificPwa");
      }
      if (pushData.schedules.length === 1) {
        setScheduleOption("once");
        const tzDate = dayjs(pushData.recordedSchedules[0])
          .tz(pushData.timeZone)
          .format("YYYY-MM-DDTHH:mm:ss");
        setSchedules([tzDate]);
      } else {
        setScheduleOption("regular");
        const startDate = pushData.recordedSchedules[0];
        const endDate =
          pushData.recordedSchedules[pushData.recordedSchedules.length - 1];
        const hours = dayjs(startDate).tz(pushData.timeZone).hour();
        const minutes = dayjs(startDate).tz(pushData.timeZone).minute();
        const days = pushData.recordedSchedules.map((schedule) =>
          dayjs(schedule).day()
        );
        setRegularOptions({
          hours,
          minutes,
          days,
          start: dayjs(startDate)
            .tz(pushData.timeZone)
            .format("YYYY-MM-DDTHH:mm:ss"),
          end: dayjs(endDate)
            .tz(pushData.timeZone)
            .format("YYYY-MM-DDTHH:mm:ss"),
        });
      }
    }
  }, [pushData]);

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

    if (!allowedExtensions.includes(extension)) {
      message.error(allowedExtensionsErrorMessage);
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

      const payload = {
        ...values,
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
      payload.timeZone = selectedTimeZone;

      if (scheduleOption === "once") {
        const dateWithZone = dayjs(schedules[0]).tz(selectedTimeZone, true);
        payload.schedules = [dateWithZone.toISOString()];
        payload.recordedSchedules = [dateWithZone.toISOString()];
      } else if (scheduleOption === "regular" && selectedTimeZone) {
        const dates = generateDates({
          hours: regularOptions.hours,
          minutes: regularOptions.minutes,
          days: regularOptions.days,
          start: regularOptions.start,
          end: regularOptions.end,
          timeZone: selectedTimeZone,
        });

        payload.schedules = dates;
        payload.recordedSchedules = dates;
      }

      if (id) {
        await editPush({ id, data: payload }).unwrap();
        message.success("Пуш успешно отредактирован");
        navigate("/push-calendar");
        return;
      }

      await createPush(payload).unwrap();
      message.success("Пуш успешно создан");
      navigate("/push-calendar");
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

  const handleDatePickerChange = (pickedDate: dayjs.Dayjs) => {
    if (!pickedDate) return;

    const localDateTime = pickedDate.format("YYYY-MM-DDTHH:mm:ss");
    setSchedules([localDateTime]);
  };

  const handleRegularPickerChange = (
    pickedDate: dayjs.Dayjs,
    timePosition: TimePosition
  ) => {
    if (!pickedDate) return;

    const localDateTime = pickedDate.format("YYYY-MM-DDTHH:mm:ss");
    setRegularOptions({
      ...regularOptions,
      [timePosition]: localDateTime,
    });
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
          color: "#00A76F",
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
                <div className="text-base leading-5 mb-2 text-white">
                  Цвет события:
                </div>
                <div className="text-sm text-white mb-4 leading-5">
                  Цвет ни на что не влияет. Это просто для удобного отображения
                  в календаре.
                </div>
                <Form.Item name={["color"]} className="mb-0">
                  <Radio.Group>
                    <MonsterRadio className="green" value={"#00A76F"} />
                    <MonsterRadio className="purple" value={"#8E33FF"} />
                    <MonsterRadio className="blue" value={"#00B8D9"} />
                    <MonsterRadio className="orange" value={"#FFAB00"} />
                    <MonsterRadio className="red" value={"#FF5630"} />
                    <MonsterRadio className="lime" value={"#D0FF00"} />
                  </Radio.Group>
                </Form.Item>
              </div>
              <div className="bg-cardColor p-[50px] rounded-lg">
                <div className="text-base font-bold text-[#E3CC02] leading-5 mb-4">
                  Расписание
                </div>
                <div className="text-sm text-white mb-7">
                  Когда будет отправляться этот пуш
                </div>
                <div className="text-base text-white leading-5 mb-2">
                  Выбор часового пояса
                </div>
                <div className="text-white text-sm leading-5 mb-5">
                  По какому часовому поясу будем отправлять пуши в выбранное
                  время
                </div>
                <MonsterSelect
                  value={selectedTimeZone}
                  onChange={(value) => setSelectedTimeZone(value)}
                  className="w-[460px] mb-[50px]"
                  options={timezones}
                />
                <div>
                  <Radio.Group
                    value={scheduleOption}
                    onChange={(e) => setScheduleOption(e.target.value)}
                    className="mb-7"
                    options={[
                      {
                        label: "Однократно",
                        value: "once",
                      },
                      {
                        label: "Регулярно",
                        value: "regular",
                      },
                    ]}
                  ></Radio.Group>
                  {scheduleOption === "once" ? (
                    <div>
                      <DatePicker
                        showTime
                        format="DD.MM.YYYY HH:mm"
                        className="bg-[#161724] hover:border-[#383B66] h-[42px] w-[460px] hover:!bg-[#161724] focus-within:!bg-[#161724]"
                        value={schedules[0] ? dayjs(schedules[0]) : undefined}
                        onChange={handleDatePickerChange}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="text-white text-base leading-5 mb-4">
                        Во сколько отправляем
                      </div>
                      <div className="flex gap-[50px] mb-[30px]">
                        <div className="flex flex-col gap-4">
                          <div className="text-white text-sm leading-4">
                            Часов
                          </div>
                          <MonsterSelect
                            options={Array.from({ length: 24 }, (_, i) => ({
                              label: i.toString().length === 1 ? `0${i}` : i,
                              value: i,
                            }))}
                            className="w-[211px]"
                            value={regularOptions.hours}
                            onChange={(value) =>
                              setRegularOptions({
                                ...regularOptions,
                                hours: value,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="text-white text-sm leading-4">
                            Минут
                          </div>
                          <MonsterSelect
                            options={Array.from({ length: 60 }, (_, i) => ({
                              label: i.toString().length === 1 ? `0${i}` : i,
                              value: i,
                            }))}
                            className="w-[211px]"
                            value={regularOptions.minutes}
                            onChange={(value) =>
                              setRegularOptions({
                                ...regularOptions,
                                minutes: value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="text-white text-base leading-4 mb-4">
                        По каким дням{" "}
                      </div>
                      <Checkbox.Group
                        className="flex gap-5 mb-7"
                        value={regularOptions.days}
                        onChange={(value) =>
                          setRegularOptions({
                            ...regularOptions,
                            days: value,
                          })
                        }
                      >
                        <MonsterCheckbox value={1}>
                          <span className="text-white text-sm">Пн</span>
                        </MonsterCheckbox>
                        <MonsterCheckbox value={2}>
                          <span className="text-white text-sm">Вт</span>
                        </MonsterCheckbox>
                        <MonsterCheckbox value={3}>
                          <span className="text-white text-sm">Ср</span>
                        </MonsterCheckbox>
                        <MonsterCheckbox value={4}>
                          <span className="text-white text-sm">Чт</span>
                        </MonsterCheckbox>
                        <MonsterCheckbox value={5}>
                          <span className="text-white text-sm">Пт</span>
                        </MonsterCheckbox>
                        <MonsterCheckbox value={6}>
                          <span className="text-white text-sm">Сб</span>
                        </MonsterCheckbox>
                        <MonsterCheckbox value={0}>
                          <span className="text-white text-sm">Вс</span>
                        </MonsterCheckbox>
                      </Checkbox.Group>
                      <div className="text-white text-base leading-4 mb-4">
                        Период отправки
                      </div>
                      <div className="flex gap-[50px]">
                        <div className="flex flex-col gap-4">
                          <div className="text-white text-sm leading-4">
                            Начало повторения
                          </div>

                          <DatePicker
                            showTime
                            format="DD.MM.YYYY HH:mm"
                            className="bg-[#161724] hover:border-[#383B66] h-[42px] w-[211px] hover:!bg-[#161724] focus-within:!bg-[#161724]"
                            value={dayjs(regularOptions.start)}
                            onChange={(value) =>
                              handleRegularPickerChange(
                                value,
                                TimePosition.Start
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="text-white text-sm leading-4">
                            Конец повторения
                          </div>

                          <DatePicker
                            showTime
                            format="DD.MM.YYYY HH:mm"
                            value={dayjs(regularOptions.end)}
                            onChange={(value) =>
                              handleRegularPickerChange(value, TimePosition.End)
                            }
                            className="bg-[#161724] hover:border-[#383B66] h-[42px] w-[211px] hover:!bg-[#161724] focus-within:!bg-[#161724]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
                    className="h-[42px]"
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
                    className="h-[42px]"
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

export default ScheduledPushEditor;

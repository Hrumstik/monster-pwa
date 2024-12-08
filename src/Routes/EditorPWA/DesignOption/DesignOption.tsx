import { Form, Input, Spin, Upload, notification } from "antd";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import DropdownIcon from "@shared/icons/DropdownIcon";
import MonsterSelect from "@shared/elements/Select/MonsterSelect";
import { categories, languages } from "./DesignOptionHelpers";
import UploadImageIcon from "@shared/icons/UploadImageIcon";
import { IoAddOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import MonsterSwitch from "@shared/elements/Switch/MonsterSwitch";
import MonsterSlider from "@shared/elements/Slider/MonsterSlider";
import GptIcon from "@shared/icons/GptIcon";
import { Review } from "@models/review";
import SimpleButton from "@shared/elements/SimpleButton/SimpleButton";
import { Picture, PwaContent } from "@models/pwa";
import ReviewItem from "./ReviewItem/ReviewItem";
import { useWatch } from "antd/es/form/Form";
import { v4 as uuidv4 } from "uuid";
import { requiredValidator } from "@shared/form/validators/validators";
import { useUploadImagesMutation } from "@store/slices/filesApi";
import {
  useLazyBuildPwaContentQuery,
  useCreatePwaContentMutation,
  useDeletePwaContentMutation,
  useGetPwaContentByIdQuery,
} from "@store/slices/pwaApi";
import { PreviewPwaContent } from "./Preview/models";
import Preview from "./Preview/Preview";
import { Hourglass } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { EditorPWATabs, getTabIcon } from "../EditorPWAHelpers";
import { Step } from "@shared/elements/Steps/Steps";
import useGetPwaInfo from "@shared/hooks/useGetPwaInfo";
import { useMount } from "react-use";
import useCheckBuildStatus from "@shared/hooks/useCheckBuildStatus";
import InfoIcon from "@icons/InfoIcon";
import VerifiedIcon from "@icons/VerifiedIcon";
import GenerateIcon from "@icons/GenerateIcon";
import MonsterRate from "@shared/elements/Rate/MonsterRate";

interface DesignOptionFormValues {
  languages: string[];
  appName: string;
  developerName: string;
  countOfDownloads: string;
  countOfReviews: string;
  hasPaidContentTitle: boolean;
  size: string;
  verified: boolean;
  tags: string[];
  securityUI: boolean;
  lastUpdate: string;
  pwaLink: string;
  rating: string;
  description: string;
  countOfReviewsFull: string;
  countOfStars: number;
  fullDescription: string;
  shortDescription: string;
  version: string;
  appIcon: string;
}

interface DesignOptionProps {
  setPwaContent: (pwaContent: PwaContent) => void;
  setCurrentTab: (tab: EditorPWATabs) => void;
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  pwaContent?: PwaContent;
}

const { TextArea } = Input;

const DesignOption: React.FC<DesignOptionProps> = ({
  setPwaContent,
  setCurrentTab,
  setSteps,
  steps,
  pwaContent,
}) => {
  const { getPwaInfo } = useGetPwaInfo();
  const navigate = useNavigate();
  const [createPwaContent] = useCreatePwaContentMutation();
  const [buildPwaContent] = useLazyBuildPwaContentQuery();
  const [api, contextHolder] = notification.useNotification();
  const { id } = useParams();
  const { data: fetchedPwaContent, isLoading: pwaContentIsLoading } =
    useGetPwaContentByIdQuery(id!, {
      skip: !id,
    });
  const [deletePwaContent] = useDeletePwaContentMutation();
  const { startPolling } = useCheckBuildStatus();

  const setFormValues = (content: PwaContent) => {
    const updatedReviews = content.reviews.map((review) => ({
      ...review,
      reviewText: review.reviewText.originalLanguage,
      devResponse: review.devResponse?.originalLanguage,
      id: uuidv4(),
    }));

    form.setFieldsValue({
      languages: content.languages,
      appName: content.appName,
      developerName: content.developerName,
      countOfDownloads: content.countOfDownloads.originalLanguage,
      countOfReviews: content.countOfReviews,
      size: content.size,
      verified: content.verified,
      tags: content.tags,
      securityUI: content.securityUI,
      lastUpdate: content.lastUpdate,
      pwaLink: content.pwaLink,
      rating: content.rating,
      countOfReviewsFull: content.countOfReviewsFull,
      countOfStars: content.countOfStars,
      version: content.version,
      fullDescription: content.fullDescription.originalLanguage,
      appIcon: content.appIcon,
      shortDescription: content.shortDescription.originalLanguage,
    });

    updatedReviews.forEach((review) => {
      form.setFieldsValue({
        [`reviewAuthorName${review.id}`]: review.reviewAuthorName,
        [`reviewAuthorRating${review.id}`]: review.reviewAuthorRating,
        [`reviewText${review.id}`]: review.reviewText,
        [`reviewDate${review.id}`]: dayjs(review.reviewDate),
        [`reviewAuthorIcon${review.id}`]: review.reviewAuthorIcon,
        [`reviewIconColor${review.id}`]: review.devResponse,
        [`devResponse${review.id}`]: review.devResponse,
      });
    });

    setAppIcon({
      url: content.appIcon,
      preview: content.appIcon,
    });

    setTags(content.tags);
    setReviews(updatedReviews);
    setSliders(content.sliders);
    setScreens(
      content.images.map((image) => ({
        url: image.url,
        preview: image.url,
      }))
    );
  };

  useEffect(() => {
    if (!id || !fetchedPwaContent) return;
    setFormValues(fetchedPwaContent);
  }, [fetchedPwaContent]);

  useMount(() => {
    if (!pwaContent) return;
    setFormValues(pwaContent);
  });

  const [form] = Form.useForm<DesignOptionFormValues>();
  const [uploadImages, { isLoading: areImagesLoading }] =
    useUploadImagesMutation();
  useWatch("countOfStars", form);
  const [appIcon, setAppIcon] = useState<Picture>({
    url: null,
    preview: null,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sliders, setSliders] = useState<number[]>([4.5, 0, 0, 0, 0]);
  const [previewContent, setPreviewContent] = useState<PreviewPwaContent>({
    appName: "Plinko ASMR",
    developerName: "Supercent, Inc.",
    countOfDownloads: "10 000 +",
    countOfReviews: "3 тыс.",
    verified: true,
    rating: "5",
    countOfReviewsFull: "30,301",
    version: "1.63.1",
    shortDescription:
      "Обновление и опыт быть самым богатым! Не сдавайся до конца, ты можешь стать победителем",
    lastUpdate: "07.11.2024",
    size: "15 МБ",
    fullDescription:
      "Обновление и опыт быть самым богатым! Не сдавайся до конца, ты можешь стать победителем",
    securityUI: true,
    hasPaidContentTitle: true,
  });

  const handleValuesChange = () => {
    setPreviewContent({
      appName: form.getFieldValue("appName"),
      developerName: form.getFieldValue("developerName"),
      countOfDownloads: form.getFieldValue("countOfDownloads"),
      countOfReviews: form.getFieldValue("countOfReviews"),
      verified: form.getFieldValue("verified"),
      rating: form.getFieldValue("countOfStars").toString(),
      shortDescription: form.getFieldValue("shortDescription"),
      fullDescription: form.getFieldValue("fullDescription"),
      countOfReviewsFull: form.getFieldValue("countOfReviews"),
      version: form.getFieldValue("version"),
      lastUpdate: form.getFieldValue("lastUpdate"),
      size: form.getFieldValue("size"),
      securityUI: form.getFieldValue("securityUI"),
      hasPaidContentTitle: form.getFieldValue("hasPaidContentTitle"),
    });
  };

  const addEmptyReview = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setReviews((prev) => [
      ...prev,
      {
        reviewAuthorName: "Без имени",
        reviewAuthorIcon: "",
        reviewAuthorRating: 5,
        reviewIconColor: "",
        avatarTitle: "",
        reviewText:
          "Комментарий пока не сохранен. Введите данные и сохраните его.",
        reviewDate: new Date().toISOString(),
        isActive: true,
        id: uuidv4(),
      },
    ]);
  };

  const handleTagEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.innerText.trim();
      setTags((prev) => [...prev, value]);
      form.setFieldsValue({ tags: [...tags, value] });
      e.currentTarget.innerText = "";
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
    form.setFieldsValue({ tags: tags.filter((t) => t !== tag) });
  };

  const [screens, setScreens] = useState<Picture[]>(
    Array.from({ length: 4 }, () => ({ url: null, preview: null }))
  );

  const removeAppIcon = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setAppIcon({ url: null, preview: null });
  };

  const beforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const response = await uploadImages([file]).unwrap();
      setAppIcon({
        url: response.imageUrls[0],
        preview: reader.result as string,
      });
      form.setFieldValue("appIcon", response.imageUrls[0]);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleBeforeScreensUpload = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const response = await uploadImages([file]).unwrap();
      setScreens((prev) => {
        const newScreens = [...prev];
        newScreens[index] = {
          url: response.imageUrls[0],
          preview: reader.result as string,
        };
        return newScreens;
      });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const generateScreen = (index: number) => {
    const screen = screens[index];

    const handleRemoveScreen = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      setScreens((prev) => {
        const newScreens = [...prev];
        newScreens[index] = { url: null, preview: null };
        return newScreens;
      });
    };

    return (
      <Upload
        showUploadList={false}
        beforeUpload={(file) => handleBeforeScreensUpload(file, index)}
      >
        {screen.preview ? (
          <div className="relative w-[100px] h-[160px] group">
            <img
              src={screen.preview}
              alt={`Uploaded ${index}`}
              className="w-[100px] h-[160px] object-fill rounded-lg"
            />
            <button
              className="absolute opacity-0 top-0 right-0 group-hover:opacity-100 text-white rounded-full w-6 h-6 flex justify-center items-center"
              onClick={handleRemoveScreen}
            >
              &times;
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => e.preventDefault()}
            className="border-none hover:border-[#36395a] hover:border hover:border-solid bg-[#161724] h-[166px] rounded-lg w-[100px]  flex justify-center items-center cursor-pointer relative"
          >
            <UploadImageIcon />
          </button>
        )}
      </Upload>
    );
  };

  const [isLoading, setIsLoading] = useState(false);

  const addEmptyScreen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setScreens((prev) => [
      ...prev,
      {
        url: null,
        preview: null,
      },
    ]);
  };

  const onFinish = async () => {
    try {
      await form.validateFields();

      const payload = {
        appName: form.getFieldValue("appName"),
        developerName: form.getFieldValue("developerName"),
        countOfDownloads: {
          originalLanguage: form.getFieldValue("countOfDownloads"),
        },
        countOfReviews: form.getFieldValue("countOfReviews"),
        size: form.getFieldValue("size"),
        verified: true,
        tags,
        securityUI: form.getFieldValue("securityUI"),
        lastUpdate: new Date().toISOString(),
        pwaLink: form.getFieldValue("pwaLink"),
        hasPaidContentTitle: form.getFieldValue("hasPaidContentTitle"),
        rating: "4.9",
        countOfReviewsFull: form.getFieldValue("countOfReviews"),
        appIcon: appIcon.url!,
        countOfStars: form.getFieldValue("countOfStars"),
        images: screens
          .filter((screen) => screen.url !== null)
          .map((screen) => ({
            url: screen.url as string,
            type: "image",
          })),
        reviews: reviews.map((review) => ({
          reviewAuthorName: review.reviewAuthorName,
          reviewAuthorIcon: review.reviewAuthorIcon,
          reviewAuthorRating: review.reviewAuthorRating,
          reviewText: {
            originalLanguage: review.reviewText,
          },
          reviewDate: review.reviewDate,
          devResponse: review.devResponse
            ? {
                originalLanguage: review.devResponse,
              }
            : undefined,
        })),
        shortDescription: {
          originalLanguage: form.getFieldValue("shortDescription"),
        },
        fullDescription: {
          originalLanguage: form.getFieldValue("fullDescription"),
        },
        version: "1.0",
        sliders,
        languages: form.getFieldValue("languages"),
      };
      setPwaContent(payload);
      if (!id) {
        await form.validateFields();
        setCurrentTab(EditorPWATabs.Domain);
        setSteps(
          steps.map((step) => {
            if (step.id === EditorPWATabs.Design) {
              return {
                ...step,
                isPassed: true,
                icon: getTabIcon(EditorPWATabs.Design, true, false),
              };
            }
            return step;
          })
        );
      } else if (id && fetchedPwaContent) {
        setIsLoading(true);
        const domain = getPwaInfo(fetchedPwaContent._id!).domain;
        const pwaContent = await createPwaContent(payload).unwrap();
        if (id) deletePwaContent(id);
        const buildResponse = await buildPwaContent({
          id: pwaContent._id!,
          body: {
            domain,
          },
        }).unwrap();
        const jobId = buildResponse.jobId;
        setTimeout(
          () =>
            startPolling({
              jobId,
              completedStatusCallback: () => {
                api.success({
                  message: "Успешно",
                  description: "PWA успешно изменено, ожидайте обновления",
                });
                setTimeout(() => {
                  navigate(`/`);
                }, 5000);
              },
            }),
          10000
        );
      }
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) {
        onFinishFailed(
          error as { errorFields: { name: (string | number)[] }[] }
        );
      } else {
        console.error(error);
        setIsLoading(false);
      }
    }
  };

  const onFinishFailed = (errorInfo: {
    errorFields: { name: (string | number)[] }[];
  }) => {
    form.scrollToField(errorInfo.errorFields[0].name, {
      behavior: "smooth",
      block: "center",
    });
  };

  const generateTags = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setTags(["Casino", "Slots", "Online", "Offline"]);
  };

  const handleSliderChange = (index: number, value: number) => {
    const maxTotal = 5;
    const updatedSliders = [...sliders];
    updatedSliders[index] = value;

    const remaining =
      maxTotal -
      updatedSliders.slice(0, index + 1).reduce((sum, val) => sum + val, 0);

    if (remaining < 0) {
      updatedSliders[index] += remaining;
      setSliders(updatedSliders);
      return;
    }

    const lowerSliders = updatedSliders.slice(index + 1);
    const totalWeight = lowerSliders.reduce(
      (acc, _, i) => acc + (lowerSliders.length - i),
      0
    );

    for (let i = 0; i < lowerSliders.length; i++) {
      const weight = lowerSliders.length - i;
      const allocated = (remaining / totalWeight) * weight;
      updatedSliders[index + 1 + i] = allocated;
    }
    setSliders(updatedSliders);
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          verified: false,
          countOfStars: 5,
          countOfDownloads: "1,000+",
          countOfReviews: "100",
          securityUI: true,
          size: "4 mb",
          hasPaidContentTitle: true,
        }}
        onValuesChange={handleValuesChange}
        onFinishFailed={onFinishFailed}
        validateTrigger={["onSubmit", "onBlur"]}
      >
        <div className="flex flex-col gap-[30px] mb-[134px]">
          <div className="bg-cardColor rounded-lg p-[50px] pb-[30px]">
            <div className="flex gap-[30px]">
              <div className="flex-1 flex flex-col gap-[30px]">
                <div className="text-base-lg leading-[25px] text-white">
                  Настройки оформления
                </div>
                <div className="text-white text-sm leading-4  ">
                  Вы можете сделать все самостоятельно или же <br /> скопировать
                  дизайн существующего приложения.
                </div>
                <button
                  className="rounded-lg border border-solid border-cardBorder text-white text-base p-5 flex items-center h-15  leading-5 cursor-not-allowed"
                  onClick={(e) => e.preventDefault()}
                >
                  Cкопировать из Google Play
                </button>
              </div>
              <div className="flex-1">
                <div className="flex-1 flex flex-col">
                  <div className="text-base-lg leading-[25px] text-white mb-[22px]">
                    Ссылка на оффер
                  </div>
                  <Form.Item
                    name="pwaLink"
                    className="mb-7"
                    rules={[requiredValidator("Укажите ссылку на оффер")]}
                  >
                    <MonsterInput
                      placeholder="Ссылка на оффер с параметрами"
                      className="!bg-[#161724] !h-[42px]"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <button
                    className="btn bg-[#515ACA] text-white rounded-lg text-base p-5 flex items-center h-15 leading-5 transition duration-300 transform active:scale-95"
                    onClick={(e) => e.preventDefault()}
                  >
                    Сделать вручную
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-7">
            <div className="flex-1 bg-cardColor rounded-lg p-[50px] min-h-[203px]">
              <div className="text-base text-white font-bold leading-5 mb-5 ">
                Шаблон PWA
              </div>
              <div className="rounded-lg bg-[#515ACA] pl-3 pr-[14px] py-[14px] flex justify-between text-xs cursor-not-allowed h-[42px] text-white items-center">
                PlayMarket
                <DropdownIcon />
              </div>
            </div>
            <div className="flex-1 bg-cardColor rounded-lg px-[50px] py-[30px] min-h-[203px] flex flex-col">
              <div className="flex gap-2 mb-5">
                <div className="text-[#E3CC02] text-base font-bold leading-[19px]">
                  Язык и категория PWA
                </div>
                <div>
                  <InfoIcon />
                </div>
              </div>
              <Form.Item
                name="languages"
                rules={[
                  {
                    required: true,
                    type: "array",
                    message: "Выберите хотя бы один язык",
                  },
                ]}
                validateTrigger="onChange"
              >
                <MonsterSelect
                  mode="multiple"
                  className="w-full"
                  options={languages}
                  onChange={(value) =>
                    form.setFieldsValue({ languages: value })
                  }
                  placeholder="Язык"
                  notFoundContent={
                    <span className="text-base text-white">
                      Языка не найдено
                    </span>
                  }
                />
              </Form.Item>
              <MonsterSelect
                mode="multiple"
                className="w-full"
                options={categories}
                placeholder="Категория"
                notFoundContent={
                  <span className="text-base text-white">
                    Категории не найдено
                  </span>
                }
              />
            </div>
          </div>
          <div className="flex gap-[30px]">
            <div className="bg-cardColor rounded-lg px-[50px] py-[30px] flex-1">
              <div className="font-bold text-base leading-[18px] text-orangeSubtitle mb-4">
                Оформление
              </div>
              <div className="text-white text-xs leading-4 mb-6">
                Шапка приложения
              </div>
              <div className="flex">
                <Form.Item
                  name="appIcon"
                  className="mb-0 max-w-[100px]"
                  valuePropName="appIcon"
                  validateTrigger="onChange"
                  rules={[
                    {
                      required: true,
                      message: "Загрузите иконку",
                    },
                  ]}
                >
                  <Upload showUploadList={false} beforeUpload={beforeUpload}>
                    {appIcon.preview ? (
                      <div className="relative w-[100px] h-[100px] group rounded-xl overflow-hidden">
                        <img
                          src={appIcon.preview}
                          alt="Uploaded"
                          className="w-[100px] h-[100px] object-fill "
                        />
                        <button
                          className="absolute  opacity-0 top-0 right-0 group-hover:opacity-100  text-white rounded-full w-4 h-4 flex justify-center items-center"
                          onClick={removeAppIcon}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="border-none hover:border-[#36395a] hover:border hover:border-solid bg-[#161724] rounded-lg w-[100px] h-[100px] flex justify-center items-center cursor-pointer relative"
                      >
                        <UploadImageIcon />
                      </button>
                    )}
                  </Upload>
                </Form.Item>
                <div className="ml-[19px] w-full flex flex-col gap-[19px] mr-[30px]">
                  <Form.Item
                    name="appName"
                    className="mb-0"
                    rules={[requiredValidator("Укажите название приложения")]}
                  >
                    <MonsterInput
                      placeholder="Название приложения"
                      className="!bg-[#161724] !h-[42px] w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    name="developerName"
                    className="mb-0"
                    rules={[
                      requiredValidator("Укажите разработчика приложения"),
                    ]}
                  >
                    <MonsterInput
                      placeholder="Разработчик"
                      className="!bg-[#161724] !h-[42px]"
                      suffix={<GenerateIcon />}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="bg-cardColor rounded-lg px-[50px] pt-[54px] pb-[30px] flex-1">
              <div className="flex gap-[50px]">
                <div className="flex flex-1 flex-col gap-9">
                  <div className="relative">
                    <div className="text-[#8F919D] text-xs absolute top-[-24px]">
                      Размер
                    </div>
                    <Form.Item name="size" className="mb-0">
                      <MonsterInput
                        className="!bg-[#161724] !h-[42px]"
                        defaultValue={"4 mb"}
                        placeholder="Размер"
                        suffix={<GenerateIcon />}
                      />
                    </Form.Item>
                  </div>
                  <div className="relative">
                    <div className="text-[#8F919D] text-xs absolute top-[-24px]">
                      Скачиваний
                    </div>
                    <Form.Item
                      name="countOfDownloads"
                      className="mb-0"
                      rules={[
                        requiredValidator("Укажите количество скачиваний"),
                      ]}
                    >
                      <MonsterInput
                        className="!bg-[#161724] !h-[42px]"
                        placeholder="Количество скачиваний"
                        suffix={<GenerateIcon />}
                      />
                    </Form.Item>
                  </div>

                  <div className="flex flex-col relative">
                    <div className="text-[#8F919D] text-xs absolute top-[-24px]">
                      Возраст
                    </div>
                    <MonsterInput
                      className="!bg-[#161724] !h-[42px]"
                      defaultValue={"18+"}
                      placeholder="Возраст"
                      suffix={<GenerateIcon />}
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-9">
                  <div className="flex relative">
                    <div className="text-[#8F919D] text-xs absolute top-[-24px] whitespace-nowrap">
                      Рейтинг приложения
                    </div>
                    <Form.Item name="countOfStars" className="mb-0">
                      <MonsterRate className="flex whitespace-nowrap" />
                    </Form.Item>
                  </div>
                  <div className="flex gap-5 items-center">
                    <div className="flex gap-1">
                      <div className="text-sm text-white leading-4 items-center flex gap-[10px] justify-start">
                        Verified?
                      </div>
                      <VerifiedIcon />
                    </div>

                    <Form.Item name="verified" noStyle>
                      <MonsterSwitch />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-cardColor rounded-lg py-[30px] px-[50px]">
            <div className="text-base text-orangeSubtitle font-bold mb-5">
              Изображения и видео
            </div>
            <div className="text-white text-xs leading-4 mb-5">
              Загрузите изображения и видео для отображения на странице
              установки
            </div>
            <div className="max-w-[460px] mb-[13px]">
              <MonsterInput
                placeholder="YouTube video URL"
                className="!bg-[#161724] !h-[42px]"
                autoComplete="off"
                disabled
              />
            </div>
            <div className="text-[#8F919D] italic text-xs leading-[14px] mb-[18px]">
              *Видео всегда будет отображаться первым в скриншотах приложения
              <br />
              вы также можете добовлять широкоформатные скрины!
            </div>
            {
              <div className="flex gap-5">
                {screens.map((_, index) => (
                  <div key={index}>{generateScreen(index)}</div>
                ))}
                {!screens.some((screen) => screen.url === null) ? (
                  <button
                    onClick={addEmptyScreen}
                    className="border-none hover:border-[#36395a] hover:border hover:border-solid bg-[#161724] h-[166px] rounded-lg w-[100px]  flex justify-center items-center cursor-pointer relative"
                  >
                    <IoAddOutline color="white" />
                  </button>
                ) : null}
              </div>
            }
          </div>
          <div className="flex gap-[30px]">
            <div className="bg-cardColor rounded-lg px-[50px] py-[30px] flex-1">
              <div className="font-bold text-orangeSubtitle text-base leading-[18px] mb-5">
                Описание
              </div>
              <div className="text-white text-sm leading-4 mb-[30px]">
                Хорошее описание и наличие тегов повышает конверсию.
              </div>

              <div className="flex-1">
                <div className="text-sm leading-[14px] text-white mb-[10px]">
                  Заголовок (превью описания)
                </div>
                <Form.Item
                  name="shortDescription"
                  className="mb-4"
                  rules={[requiredValidator("Укажите превью")]}
                >
                  <MonsterInput
                    placeholder="Введите заголовок"
                    className="h-10"
                    suffix={<GenerateIcon />}
                  />
                </Form.Item>
                <Form.Item
                  name="fullDescription"
                  className="mb-[25px]"
                  rules={[requiredValidator("Укажите описание приложения")]}
                >
                  <TextArea
                    rows={6}
                    className="resize-none scrollbar-hidden"
                    placeholder="Введите описание приложения:"
                  />
                </Form.Item>
                <button
                  disabled
                  className="text-white underline leading-[18px] text-base"
                >
                  Сгенерить описание при помощи ChatGPT
                </button>
              </div>
            </div>
            <div className="bg-cardColor rounded-lg px-[50px] py-[30px] flex-1">
              <div className="font-bold text-orangeSubtitle text-base leading-[18px] mb-5">
                Теги
              </div>
              <div className="text-sm text-white leading-[14px] mb-[10px]">
                Теги к описанию: (напишите тег и нажмите Enter)
              </div>
              <div className="border-[rgb(22,23,36)] h-[173px] bg-[#161724] border border-solid hover:border-[#383B66] rounded-lg cursor-text p-3 mb-[30px]">
                <div className="flex flex-wrap gap-y-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-[#E3CC02] inline-flex items-center h-[22px] pl-2 pr-0.5 py-0.5 rounded-lg mr-2.5 mb-2 cursor-pointer"
                    >
                      <span className="text-[#161724] text-xs mr-2">{tag}</span>
                      <span
                        className="bg-[#FFFBD8] text-[#161724] rounded-full w-[18px] h-[18px] flex justify-center items-center"
                        onClick={() => removeTag(tag)}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                  <div
                    className="border-none h-[22px] w-full text-white p-1 mt-2"
                    style={{ outline: "none" }}
                    onKeyDown={handleTagEnter}
                    contentEditable
                  />
                </div>
              </div>
              <button
                className="flex gap-3 items-center"
                onClick={generateTags}
              >
                <GenerateIcon />
                <span className="text-white text-xs font-bold underline">
                  Выбрать случайные теги
                </span>
              </button>
            </div>
          </div>
          <div className="flex gap-[30px] mb-[30px] relative ">
            <div className="bg-cardColor rounded-lg h-fit px-[50px] pt-7 pb-[35px] flex-1 flex flex-col gap-5">
              <div className="flex">
                <div className="flex-1">
                  <div className="Оценки и отзывы font-bold text-base leading-[18px] text-orangeSubtitle mb-[25px]">
                    Оценки и отзывы
                  </div>
                  <div className="text-[#8F919D] text-sm leading-[14px] mb-[9px]">
                    Количество отзывов
                  </div>
                  <Form.Item
                    name="countOfReviews"
                    className="mb-0"
                    validateTrigger="onChange"
                    rules={[requiredValidator("Укажите количество отзывов")]}
                  >
                    <MonsterInput className="!bg-[#161724] !h-[42px] mb-5 max-w-[130px]" />
                  </Form.Item>

                  <div>
                    {sliders.map((_, index) => (
                      <div className="flex gap-3 items-center" key={index}>
                        <span className="text-white font-bold text-xs">
                          {index + 1}
                        </span>
                        <MonsterSlider
                          className="flex-1"
                          value={sliders[index]}
                          onChange={(newValue) =>
                            handleSliderChange(index, newValue)
                          }
                          step={0.1}
                          min={0}
                          max={5}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex-col flex gap-4">
                  <div className="font-bold text-end text-white text-base leading-[18px]">
                    Дополнительные блоки:
                  </div>
                  <div className="flex gap-4 justify-end items-center">
                    <Form.Item name="securityUI" noStyle>
                      <MonsterSwitch />
                    </Form.Item>
                    <div className="text-white text-base leading-5">
                      Безопасность и <br /> передача данных
                    </div>
                  </div>
                  <div className="flex gap-4 justify-end items-center">
                    <Form.Item name="hasPaidContentTitle" noStyle>
                      <MonsterSwitch />
                    </Form.Item>
                    <div className="text-white text-base leading-5">
                      Реклама и <br /> платный контент
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div className="text-white font-bold text-base leading-[18px] mb-5">
                    Комментарии
                  </div>
                </div>
                {reviews.map((review, index) => (
                  <ReviewItem
                    key={index}
                    reviewContent={review}
                    allReviews={reviews}
                    setAllReviews={setReviews}
                    form={form}
                  />
                ))}
                <div className="flex justify-between gap-[52px]">
                  <div className="flex gap-[30px]">
                    {reviews.some((review) => review.isActive) ? null : (
                      <button
                        className="text-sm uppercase hover:underline text-[#02E314] flex gap-2 leading-4 items-center font-bold"
                        onClick={addEmptyReview}
                      >
                        + добавить
                      </button>
                    )}
                    <SimpleButton
                      disabled
                      icon={<GptIcon />}
                      text="Сгенерить с ChatGPT"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[360px] sticky top-4 right-0 h-[671px] rounded-[32px] box-border border-[9px] border-solid border-[#515ACA] bg-white overflow-auto scrollbar-hidden">
              <Preview
                sliders={sliders}
                previewPwaContent={previewContent}
                appIcon={appIcon}
                screens={screens}
                tags={tags}
                reviews={reviews}
              />
            </div>
          </div>
          <div>
            <SimpleButton
              onClick={onFinish}
              text="Сохранить и продолжить"
              color="bg-[white]"
              textColor="text-[#121320]"
            />
          </div>
        </div>
      </Form>
      <Spin spinning={pwaContentIsLoading || areImagesLoading} fullscreen />
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

export default DesignOption;

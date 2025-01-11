import {
  Form,
  Input,
  message,
  notification,
  Spin,
  Tooltip,
  Upload,
} from "antd";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import DropdownIcon from "@shared/icons/DropdownIcon";
import MonsterSelect from "@shared/elements/Select/MonsterSelect";
import {
  ageValues,
  allowedExtensions,
  allowedExtensionsErrorMessage,
  casinoKeywords,
  casinoMessages,
  categories,
  countOfDownloadsValues,
  countOfReviews,
  developerValue,
  generateRandomValue,
  languages,
  sizeValues,
} from "./DesignOptionHelpers";
import UploadImageIcon from "@shared/icons/UploadImageIcon";
import { IoAddOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import MonsterSwitch from "@shared/elements/Switch/MonsterSwitch";
import MonsterSlider from "@shared/elements/Slider/MonsterSlider";
import { Review } from "@models/review";
import { Picture, PwaContent } from "@models/pwa";
import ReviewItem from "./ReviewItem/ReviewItem";
import { useWatch } from "antd/es/form/Form";
import { v4 as uuidv4 } from "uuid";
import { requiredValidator } from "@shared/form/validators/validators";
import { useUploadImagesMutation } from "@store/apis/filesApi.ts";
import {
  useGetPwaContentByIdQuery,
  useLazyGenerateAppDescriptionQuery,
} from "@store/apis/pwaApi.ts";
import { PreviewPwaContent } from "./Preview/models.ts";
import Preview from "./Preview/Preview.tsx";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { EditorPWATabs, getTabIcon } from "../EditorPWAHelpers";
import { Step } from "@shared/elements/Steps/Steps";
import InfoIcon from "@icons/InfoIcon";
import VerifiedIcon from "@icons/VerifiedIcon";
import GenerateIcon from "@icons/GenerateIcon";
import ClassicButton from "@shared/elements/ClassicButton/ClassibButton.tsx";
import { scrollToTop } from "@shared/helpers/common.ts";
import PwaMenu from "../DesignOption/Preview/Menu/Menu.tsx";
import StarIcon from "@icons/StarIcon.tsx";
import ArrowDownIcon from "@icons/ArrowDownIcon.tsx";
import { motion } from "framer-motion";
import { useMount } from "react-use";

export interface DesignOptionFormValues {
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
  countOfStars: number | string;
  fullDescription: string;
  shortDescription: string;
  version: string;
  appIcon: string;
  age: string;
  hasLoadingScreen: boolean;
  hasMenu: boolean;
  wideScreens: boolean;
}

export interface PwaContentOptionProps {
  setPwaContent: (pwaContent: PwaContent) => void;
  setCurrentTab: (tab: EditorPWATabs) => void;
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  pwaContent?: PwaContent;
}

const { TextArea } = Input;

const DesignOption: React.FC<PwaContentOptionProps> = ({
  setPwaContent,
  setCurrentTab,
  setSteps,
  steps,
  pwaContent,
}) => {
  const { id } = useParams();
  const { data: fetchedPwaContent, isLoading: pwaContentIsLoading } =
    useGetPwaContentByIdQuery(id!, {
      skip: !id,
    });

  const [
    generateAppDescription,
    {
      isLoading: isGeneratingDescription,
      isFetching: isGeneratingDescriptionFetching,
    },
  ] = useLazyGenerateAppDescriptionQuery();

  const setFormValues = (content: PwaContent) => {
    const updatedReviews = content?.reviews?.map((review) => ({
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
      countOfStars: content.countOfStars.toString(),
      version: content.version,
      fullDescription: content.fullDescription.originalLanguage,
      appIcon: content.appIcon,
      shortDescription: content.shortDescription.originalLanguage,
      hasLoadingScreen: content.hasLoadingScreen,
      hasMenu: content.hasMenu,
      age: content.age,
      wideScreens: content.wideScreens,
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

    setPreviewContent({
      appName: content.appName,
      developerName: content.developerName,
      countOfDownloads: content.countOfDownloads.originalLanguage,
      countOfReviews: content.countOfReviews,
      verified: content.verified,
      rating: content.rating,
      shortDescription: content.shortDescription.originalLanguage,
      fullDescription: content.fullDescription.originalLanguage,
      version: content.version,
      lastUpdate: content.lastUpdate,
      size: content.size,
      securityUI: content.securityUI,
      hasPaidContentTitle: content.hasPaidContentTitle,
      wideScreens: content.wideScreens,
      hasMenu: content.hasMenu,
      age: content.age,
    });
  };

  useEffect(() => {
    if (id && fetchedPwaContent) setFormValues(fetchedPwaContent);
  }, [fetchedPwaContent, id]);

  useMount(() => {
    if (pwaContent?.appName) {
      setFormValues(pwaContent);
    }
  });

  const [form] = Form.useForm<DesignOptionFormValues>();
  const [uploadImages, { isLoading: areImagesLoading }] =
    useUploadImagesMutation();
  useWatch("countOfStars", form);
  const wideScreensIsActive = useWatch("wideScreens", form);
  const [appIcon, setAppIcon] = useState<Picture>({
    url: null,
    preview: null,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sliders, setSliders] = useState<number[]>([3.4, 0.8, 0.3, 0.3, 0.2]);
  const [previewContent, setPreviewContent] = useState<PreviewPwaContent>({
    appName: "Plinko ASMR",
    developerName: "Supercent, Inc.",
    countOfDownloads: "10 000 +",
    countOfReviews: "3",
    verified: true,
    rating: "4.3",
    version: "1.63.1",
    shortDescription:
      "Обновление и опыт быть самым богатым! Не сдавайся до конца, ты можешь стать победителем",
    lastUpdate: "07.11.2024",
    size: "15 МБ",
    fullDescription:
      "Обновление и опыт быть самым богатым! Не сдавайся до конца, ты можешь стать победителем",
    securityUI: true,
    hasPaidContentTitle: true,
    wideScreens: false,
    hasMenu: true,
    age: "18+",
  });

  const handleValuesChange = () => {
    setPreviewContent({
      appName: form.getFieldValue("appName"),
      developerName: form.getFieldValue("developerName"),
      countOfDownloads: form.getFieldValue("countOfDownloads"),
      countOfReviews: form.getFieldValue("countOfReviews"),
      verified: form.getFieldValue("verified"),
      rating: form.getFieldValue("countOfStars"),
      shortDescription: form.getFieldValue("shortDescription"),
      fullDescription: form.getFieldValue("fullDescription"),
      version: form.getFieldValue("version"),
      lastUpdate: form.getFieldValue("lastUpdate"),
      size: form.getFieldValue("size"),
      securityUI: form.getFieldValue("securityUI"),
      hasPaidContentTitle: form.getFieldValue("hasPaidContentTitle"),
      wideScreens: form.getFieldValue("wideScreens"),
      hasMenu: form.getFieldValue("hasMenu"),
      age: form.getFieldValue("age"),
    });
  };

  const generateDescriptionViaAi = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { text } = await generateAppDescription().unwrap();
    form.setFieldValue("fullDescription", text);
  };

  const addEmptyReview = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setShowReviews(true);
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
      if (!value) return;
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
  const [showReviews, setShowReviews] = useState(true);

  const removeAppIcon = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setAppIcon({ url: null, preview: null });
  };

  const beforeUpload = (file: File) => {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      message.error(allowedExtensionsErrorMessage);

      return false;
    }

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
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      message.error(allowedExtensionsErrorMessage);
      return false;
    }

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
          <div
            className={`relative ${
              wideScreensIsActive ? "w-[220px]" : " w-[100px]"
            } h-[160px] group `}
          >
            <img
              src={screen.preview}
              alt={`Uploaded ${index}`}
              className={`${
                wideScreensIsActive ? "w-[220px]" : " w-[100px]"
              } h-[160px] object-fill transition-all duration-300 ease-in-out rounded-lg`}
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
            className={`border-none bg-[#161724] h-[166px] rounded-lg 
            ${wideScreensIsActive ? "w-[220px]" : "w-[100px]"} 
            flex justify-center items-center cursor-pointer relative 
            transition-[width,height] duration-300 ease-in-out 
            hover:border-[#36395a] hover:border hover:border-solid`}
          >
            <UploadImageIcon />
          </button>
        )}
      </Upload>
    );
  };

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
        pwaLink: form.getFieldValue("pwaLink").includes("https://")
          ? form.getFieldValue("pwaLink")
          : `https://${form.getFieldValue("pwaLink")}`,
        hasPaidContentTitle: form.getFieldValue("hasPaidContentTitle"),
        rating: "4.9",
        countOfReviewsFull: form.getFieldValue("countOfReviews"),
        appIcon: appIcon.url!,
        countOfStars: Number(form.getFieldValue("countOfStars")) || 4.8,
        age: form.getFieldValue("age"),
        images: screens
          .filter((screen) => screen.url !== null)
          .map((screen) => ({
            url: screen.url as string,
            type: "image",
          })),
        reviews: reviews
          .filter((review) => !review.isActive)
          .map((review) => ({
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
        hasLoadingScreen: form.getFieldValue("hasLoadingScreen"),
        hasMenu: form.getFieldValue("hasMenu"),
        languages: form.getFieldValue("languages"),
        wideScreens: form.getFieldValue("wideScreens"),
      };
      setPwaContent({
        ...pwaContent,
        ...payload,
      });
      await form.validateFields();

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
      if (!id) {
        setCurrentTab(EditorPWATabs.Analytics);
      } else {
        notification.success({
          message: "Успешно",
          description: "Вы можете сохранить PWA",
        });
        scrollToTop(".overflow-auto");
      }
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) {
        onFinishFailed(
          error as { errorFields: { name: (string | number)[] }[] }
        );
      } else {
        console.error(error);
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

    const shuffled = [...casinoKeywords].sort(() => Math.random() - 0.5);
    const randomTags = shuffled.slice(0, 5);
    setTags(randomTags);
  };

  const handleSliderChange = (index: number, value: number) => {
    const maxTotal = 5;
    const weights = [1, 0.8, 0.6, 0.4, 0.2];
    const updatedSliders = [...sliders];
    const oldValue = updatedSliders[index];
    const difference = value - oldValue;

    updatedSliders[index] = value;

    if (difference !== 0) {
      const remainingIndexes = updatedSliders
        .map((_, i) => i)
        .filter((i) => i !== index);

      const totalRemaining = remainingIndexes.reduce(
        (sum, i) => sum + updatedSliders[i],
        0
      );

      remainingIndexes.forEach((i) => {
        const proportionalAdjustment =
          totalRemaining > 0
            ? (updatedSliders[i] / totalRemaining) * difference
            : 0;

        updatedSliders[i] = Math.max(
          0,
          Math.min(maxTotal, updatedSliders[i] - proportionalAdjustment * 0.9)
        );
      });
    }

    const newCountOfStars = updatedSliders.reduce(
      (sum, sliderValue, i) => sum + sliderValue * weights[i],
      0
    );

    setSliders(updatedSliders);

    form.setFieldsValue({
      countOfStars: Math.min(
        maxTotal,
        Number(newCountOfStars.toFixed(1))
      ).toString(),
    });
    setPreviewContent({
      ...previewContent,
      rating: Math.min(maxTotal, Number(newCountOfStars.toFixed(1))).toString(),
    });
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          verified: false,
          countOfStars: "4.3",
          countOfDownloads: "1,000+",
          countOfReviews: "3",
          securityUI: true,
          size: "4 mb",
          hasPaidContentTitle: true,
          age: "18+",
          hasMenu: true,
          wideScreens: false,
          hasLoadingScreen: true,
        }}
        onValuesChange={handleValuesChange}
        onFinishFailed={onFinishFailed}
        validateTrigger={["onSubmit"]}
      >
        <div className="flex flex-col gap-[30px] mb-[134px]">
          <div className="bg-cardColor rounded-lg p-[50px] pb-[30px]">
            <div className="flex gap-[30px] sm:flex-col lg:flex-row sm:items-center">
              <div className="flex-1 flex flex-col gap-[30px]">
                <div className="text-base-lg leading-[25px] text-white">
                  Настройки оформления
                </div>
                <p className="text-white text-sm leading-4 truncate ...">
                  Вы можете сделать все самостоятельно или же <br /> скопировать
                  дизайн существующего приложения.
                </p>
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
          <div className="flex lg:flex-row sm:flex-col gap-7">
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
              <div className="flex  gap-2 mb-5">
                <div className="text-[#E3CC02] text-base font-bold leading-[19px]">
                  Язык и категория PWA
                </div>

                <div>
                  <Tooltip
                    color="grey"
                    placement="topRight"
                    title="Выберите все языки на которые будет переводиться pwa и все системные надписи на странице установки PWA. Выбранная категория будет влиять на некоторые надписи на странице установки, а также на стиль и тематику при генерации описания и комментариев."
                  >
                    <div>
                      <InfoIcon />
                    </div>
                  </Tooltip>
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
          <div className="flex lg:flex-row sm:flex-col gap-[30px]">
            <div className="bg-cardColor rounded-lg px-[50px] py-[30px] flex-1">
              <div className="font-bold text-base leading-[18px] text-orangeSubtitle mb-4">
                Оформление
              </div>
              <div className="text-white text-xs leading-4 mb-6">
                Шапка приложения
              </div>
              <div className="flex xl:flex-row sm:flex-col gap-[30px]">
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
                <div className="w-full flex flex-col gap-[19px]">
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
                      suffix={
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            generateRandomValue(
                              form,
                              "developerName",
                              developerValue,
                              previewContent,
                              setPreviewContent
                            )
                          }
                        >
                          <GenerateIcon />
                        </div>
                      }
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="bg-cardColor rounded-lg px-[50px] pt-[54px] pb-[30px] flex-1">
              <div className="flex xl:flex-row sm:flex-col xl:gap-[50px] sm:gap-9">
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
                        suffix={
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              generateRandomValue(
                                form,
                                "size",
                                sizeValues,
                                previewContent,
                                setPreviewContent
                              )
                            }
                          >
                            <GenerateIcon />
                          </div>
                        }
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
                        suffix={
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              generateRandomValue(
                                form,
                                "countOfDownloads",
                                countOfDownloadsValues,
                                previewContent,
                                setPreviewContent
                              )
                            }
                          >
                            <GenerateIcon />
                          </div>
                        }
                      />
                    </Form.Item>
                  </div>

                  <div className="flex flex-col relative">
                    <div className="text-[#8F919D] text-xs absolute top-[-24px]">
                      Возраст
                    </div>
                    <Form.Item name="age" className="mb-0">
                      <MonsterInput
                        className="!bg-[#161724] !h-[42px]"
                        placeholder="Возраст"
                        suffix={
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              generateRandomValue(
                                form,
                                "age",
                                ageValues,
                                previewContent,
                                setPreviewContent
                              )
                            }
                          >
                            <GenerateIcon />
                          </div>
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-9">
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
            <div className="flex flex-row gap-[60px]">
              <div className="mb-[13px] w-[460px]">
                <MonsterInput
                  placeholder="YouTube video URL"
                  className="!bg-[#161724] !h-[42px]"
                  autoComplete="off"
                  disabled
                />
              </div>
              <div className="flex gap-4 justify-start">
                <div className="text-white text-base leading-5 truncate ...">
                  Широкоформатные
                </div>
                <Form.Item name="wideScreens" noStyle>
                  <MonsterSwitch />
                </Form.Item>
              </div>
            </div>
            <div className="text-[#8F919D] italic text-xs leading-[14px] mb-[18px]">
              *Видео всегда будет отображаться первым в скриншотах приложения
              <br />
              вы также можете добовлять широкоформатные скрины!
            </div>
            {
              <div className="w-full overflow-x-auto flex gap-5">
                {screens.map((_, index) => (
                  <div key={index}>{generateScreen(index)}</div>
                ))}
                {!screens.some((screen) => screen.url === null) ? (
                  <button
                    onClick={addEmptyScreen}
                    style={{
                      minWidth: wideScreensIsActive ? "220px" : "100px",
                    }}
                    className="border-none hover:border-[#36395a] hover:border hover:border-solid bg-[#161724] h-[166px] rounded-lg w-[100px]  flex justify-center items-center cursor-pointer relative"
                  >
                    <IoAddOutline color="white" />
                  </button>
                ) : null}
              </div>
            }
          </div>
          <div className="flex lg:flex-row sm:flex-col gap-[30px]">
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
                    suffix={
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          generateRandomValue(
                            form,
                            "shortDescription",
                            casinoMessages,
                            previewContent,
                            setPreviewContent
                          )
                        }
                      >
                        <GenerateIcon />
                      </div>
                    }
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
                  onClick={generateDescriptionViaAi}
                  className="text-white text-base hover:underline"
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
          <div className="flex lg:flex-row sm:flex-col gap-[30px]">
            <div className="bg-cardColor flex-1  rounded-lg px-[50px] py-[30px] gap-5">
              <div className="Оценки и отзывы font-bold text-base leading-[18px] text-orangeSubtitle mb-[25px]">
                Оценки и отзывы
              </div>
              <div className="flex gap-[30px]">
                <div className="max-w-1/3">
                  <div className="text-xs text-[#8F919D] mb-2">
                    Рейтинг приложения:
                  </div>
                  <div className="gap-1.5 flex justify-center items-center mb-5">
                    <div className="font-bold text-white text-[32px]">
                      {form.getFieldValue("countOfStars")}
                    </div>
                    <StarIcon />
                  </div>
                  <div className="text-xs text-[#8F919D] mb-[9px]">
                    Количество тыс. отзывов
                  </div>
                  <Form.Item
                    name="countOfReviews"
                    className="mb-0"
                    rules={[requiredValidator("Укажите количество отзывов")]}
                  >
                    <MonsterInput
                      className="!bg-[#161724] !h-[42px] mb-5 max-w-[130px]"
                      suffix={
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            generateRandomValue(
                              form,
                              "countOfReviews",
                              countOfReviews,
                              previewContent,
                              setPreviewContent
                            )
                          }
                        >
                          <GenerateIcon />
                        </div>
                      }
                    />
                  </Form.Item>
                </div>

                <div className="flex-1">
                  {sliders.map((_, index) => (
                    <div className="flex gap-3 items-center" key={index}>
                      <span className="text-white font-bold text-xs">
                        {sliders.length - index}
                      </span>
                      <MonsterSlider
                        className="flex-1"
                        value={sliders[index]}
                        onChange={(newValue) =>
                          handleSliderChange(index, newValue)
                        }
                        tooltip={{ open: false }}
                        step={0.1}
                        min={0}
                        max={5}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-cardColor flex-1 rounded-lg px-[50px] py-[30px] flex flex-col gap-[30px]">
              <div className="font-bold text-base text-[#E3CC02]">
                Дополнительный кастом
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 justify-start items-center">
                  <Form.Item name="securityUI" noStyle>
                    <MonsterSwitch />
                  </Form.Item>
                  <div className="text-white text-base leading-5">
                    Безопасность и <br /> передача данных
                  </div>
                </div>
                <div className="flex gap-4 justify-start items-center">
                  <Form.Item name="hasPaidContentTitle" noStyle>
                    <MonsterSwitch />
                  </Form.Item>
                  <div className="text-white text-base leading-5">
                    Реклама и <br /> платный контент
                  </div>
                </div>
                <div className="flex gap-4 justify-start items-center">
                  <Form.Item name="hasLoadingScreen" noStyle>
                    <MonsterSwitch />
                  </Form.Item>
                  <div className="text-white text-base leading-5">
                    Прелоадер
                  </div>
                </div>
                <div className="flex gap-4 justify-start items-center">
                  <Form.Item name="hasMenu" noStyle>
                    <MonsterSwitch />
                  </Form.Item>
                  <div className="text-white text-base leading-5">
                    Меню внизу экрана
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex xl:flex-row sm:flex-col  gap-[30px] mb-[30px] relative">
            <div className="flex flex-col gap-[30px] flex-1">
              <div className="overflow-y-auto bg-cardColor flex flex-col gap-5 rounded-lg py-[30px] px-[50px]">
                <div className="flex justify-between items-center">
                  <div className="text-[#E3CC02] font-bold text-base leading-[18px] ">
                    Комментарии
                  </div>
                </div>

                <div className={`flex flex-col gap-5 `}>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: showReviews ? 1 : 0,
                      height: showReviews ? "auto" : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    {reviews.map((review, index) => (
                      <ReviewItem
                        key={index}
                        reviewContent={review}
                        allReviews={reviews}
                        setAllReviews={setReviews}
                        form={form}
                      />
                    ))}
                  </motion.div>
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
                    </div>
                  </div>
                  {reviews.length > 0 && (
                    <div
                      className="uppercase hover:underline cursor-pointer text-[#8F919D] text-xs flex justify-center leading-[14px]"
                      onClick={() => setShowReviews(!showReviews)}
                    >
                      {!showReviews ? (
                        <div className="flex justify-center items-center flex-col gap-1.5">
                          Все Комментарии
                          <ArrowDownIcon />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center flex-col gap-1.5">
                          СКРЫТЬ КОММЕНТАРИИ
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <ClassicButton onClick={onFinish} text="Продолжить" />
              </div>
            </div>
            <div
              style={{ zIndex: 80 }}
              // tailwind почему-то не работает для zindex ^^
              className="w-[360px] relative flex top-4 right-0 h-[671px] rounded-[32px] box-border border-[5px] border-solid border-[#515ACA] bg-white overflow-hidden scrollbar-hidden"
            >
              <Preview
                sliders={sliders}
                previewPwaContent={previewContent}
                appIcon={appIcon}
                screens={screens}
                tags={tags}
                reviews={reviews}
              />
              {previewContent.hasMenu && <PwaMenu />}
            </div>
          </div>
        </div>
      </Form>
      <Spin
        spinning={
          pwaContentIsLoading ||
          areImagesLoading ||
          isGeneratingDescription ||
          isGeneratingDescriptionFetching
        }
        fullscreen
      />
    </>
  );
};

export default DesignOption;

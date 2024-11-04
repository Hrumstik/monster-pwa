import { Form, Input, Upload } from "antd";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import DropdownIcon from "@shared/icons/DropdownIcon";
import MonsterSelect from "@shared/elements/Select/MonsterSelect";
import { categories, languages } from "./DesignOptionHelpers";
import UploadImageIcon from "@shared/icons/UploadImageIcon";
import { useState } from "react";
import MonsterSwitch from "@shared/elements/Switch/MonsterSwitch";
import MonsterRate from "@shared/elements/Rate/MonsterRate";
import RestoreIcon from "@shared/icons/RestoreIcon";
import MonsterSlider from "@shared/elements/Slider/MonsterSlider";
import PlusIcon from "@shared/icons/PlusIcon";
import GptIcon from "@shared/icons/GptIcon";
import ArrowIcon from "@shared/icons/ArrowIcon";
import { Review } from "@models/review";
import SimpleButton from "@shared/elements/SimpleButton/SimpleButton";
import { Picture } from "@models/pwa";
import ReviewItem from "./ReviewItem/ReviewItem";
import { useWatch } from "antd/es/form/Form";
import { v4 as uuidv4 } from "uuid";
import { requiredValidator } from "@shared/form/validators/validators";
import { useUploadImagesMutation } from "@store/slices/filesApi";
import { useCreatePwaContentMutation } from "@store/slices/pwaApi";
import { PreviewPwaContent } from "./Preview/models";
import Preview from "./Preview/Preview";

interface DesignOptionFormValues {
  appName: string;
  developerName: string;
  countOfDownloads: string;
  countOfReviews: string;
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
  version: string;
}

const { TextArea } = Input;

const DesignOption = () => {
  const [createPwaContent] = useCreatePwaContentMutation();
  const [form] = Form.useForm<DesignOptionFormValues>();
  const [uploadImages] = useUploadImagesMutation();
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
    rating: "4.8",
    countOfReviewsFull: "30,301",
    description:
      "Обновление и опыт быть самым богатым! Не сдавайся до конца, ты можешь стать победителем",
  });

  const handleValuesChange = () => {
    setPreviewContent({
      appName: form.getFieldValue("appName"),
      developerName: form.getFieldValue("developerName"),
      countOfDownloads: form.getFieldValue("countOfDownloads"),
      countOfReviews: form.getFieldValue("countOfReviews"),
      verified: form.getFieldValue("verified"),
      rating: form.getFieldValue("countOfStars").toString(),
      description: form.getFieldValue("fullDescription"),
      countOfReviewsFull: form.getFieldValue("countOfReviews"),
    });
  };

  const addEmptyReview = () => {
    setReviews((prev) => [
      ...prev,
      {
        reviewAuthorName: "",
        reviewAuthorIcon: "",
        reviewAuthorRating: 2,
        reviewIconColor: "blue",
        avatarTitle: "PL",
        reviewText: "",
        reviewDate: "",
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
          <div className="relative w-[100px] h-[100px] group">
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
            className="border-none hover:border-[#36395a] hover:border hover:border-solid bg-[#161724] rounded-lg w-[100px] h-[160px] flex justify-center items-center cursor-pointer relative"
          >
            <UploadImageIcon />
          </button>
        )}
      </Upload>
    );
  };

  const onFinish = async () => {
    try {
      await form.validateFields();

      const payload = {
        appName: form.getFieldValue("appName"),
        developerName: form.getFieldValue("developerName"),
        countOfDownloads: form.getFieldValue("countOfDownloads"),
        countOfReviews: form.getFieldValue("countOfReviews"),
        size: form.getFieldValue("size"),
        verified: true,
        tags,
        securityUI: form.getFieldValue("securityUI"),
        lastUpdate: new Date().toISOString(),
        pwaLink: form.getFieldValue("pwaLink"),
        rating: "4.9",
        description: form.getFieldValue("fullDescription"),
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
          reviewText: review.reviewText,
          reviewDate: review.reviewDate,
        })),
        version: "1.0",
        sliders,
      };

      await createPwaContent(payload);
    } catch (error) {
      console.error("Ошибка при сохранении формы:", error);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{
        verified: false,
        countOfStars: 2,
        countOfDownloads: "1,000+",
        countOfReviews: "100",
        securityUI: false,
        size: "4 mb",
      }}
      validateTrigger="onSubmit"
      onValuesChange={handleValuesChange}
    >
      <div className="flex flex-col gap-[30px] mb-[134px]">
        <div className="bg-cardColor rounded-lg p-[50px] mb-4">
          <div className="flex gap-[30px] mb-[30px]">
            <div className="flex-1 flex flex-col gap-[30px]">
              <div className="text-base-lg leading-[25px] text-white">
                Настройки оформления
              </div>
              <div className="text-white text-sm leading-4  ">
                Вы можете сделать все самостоятельно или же <br /> скопировать
                дизайн существующего приложения.
              </div>
              <button className="rounded-lg border border-solid border-cardBorder text-white text-base p-5 flex items-center h-15  leading-5 cursor-not-allowed">
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
                  className="mb-0"
                  rules={[requiredValidator("Укажите ссылку на оффер")]}
                >
                  <MonsterInput
                    placeholder="Ссылка на оффер с параметрами"
                    className="!bg-[#161724] !h-[42px] mb-[28px]"
                    autoComplete="off"
                  />
                </Form.Item>
                <button className="btn bg-[#515ACA] text-white rounded-lg text-base p-5 flex items-center h-15 leading-5 transition duration-300 transform active:scale-95">
                  Сделать вручную
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-7 mb-[21px]">
            <div>
              <div className="text-base text-orangeSubtitle leading-[18px] font-bold mb-[15px]">
                Язык и категория PWA
              </div>
              <div className="text-xs italic text-[#8F919D] leading-[14px]">
                Выберите основной язык, на котором будут отображаться все
                системные надписи на странице установки PWA. Выбранная категория
                будет влиять на некоторые надписи на странице установки, а также
                на стиль и тематику при генерации описания и комментариев.
              </div>
            </div>
            <div>
              <div className="text-orangeSubtitle text-xs leading-[14px] font-bold mb-[17px]">
                Шаблон PWA
              </div>
              <div className="rounded-lg bg-[#383B66] pl-3 pr-[14px] py-[14px] flex justify-between text-xs cursor-not-allowed w-[341px] h-[42px] text-white items-center">
                PlayMarket
                <DropdownIcon />
              </div>
            </div>
          </div>
          <div className="flex gap-[30px]">
            <div className="flex-1">
              <Form.Item className="languages">
                <MonsterSelect
                  mode="multiple"
                  className="w-full"
                  options={languages}
                  placeholder="Язык"
                  notFoundContent={
                    <span className="text-base text-white">
                      Языка не найдено
                    </span>
                  }
                />
              </Form.Item>
            </div>
            <div className="flex-1">
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
        </div>
        <div className="bg-cardColor rounded-lg px-[50px] py-[30px] mb-4">
          <div className="font-bold text-base leading-[18px] text-orangeSubtitle mb-5">
            Оформление
          </div>
          <div className="text-white text-xs leading-4 mb-5">
            Шапка приложения
          </div>
          <div className="flex">
            <Form.Item
              name="appIcon"
              className="mb-0"
              valuePropName="fileList"
              rules={[
                {
                  required: true,
                  message: "Загрузите иконку приложения",
                },
              ]}
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : e && e.fileList
              }
            >
              <Upload showUploadList={false} beforeUpload={beforeUpload}>
                {appIcon.preview ? (
                  <div className="relative w-[100px] h-[100px] group">
                    <img
                      src={appIcon.preview}
                      alt="Uploaded"
                      className="w-[100px] h-[100px] object-contain rounded-lg"
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
            <div className="ml-[19px] flex flex-col gap-[19px] w-[341px] mr-[30px]">
              <Form.Item
                name="appName"
                className="mb-0"
                rules={[requiredValidator("Укажите название приложения")]}
              >
                <MonsterInput
                  placeholder="Название приложения"
                  className="!bg-[#161724] !h-[42px]"
                />
              </Form.Item>

              <Form.Item
                name="developerName"
                className="mb-0"
                rules={[requiredValidator("Укажите разработчика приложения")]}
              >
                <MonsterInput
                  placeholder="Разработчик"
                  className="!bg-[#161724] !h-[42px]"
                />
              </Form.Item>
            </div>
            <div className="flex flex-col relative mr-[35px]">
              <div className="text-[#8F919D] text-xs absolute top-[-24px]">
                Размер
              </div>
              <Form.Item name="size" noStyle>
                <MonsterInput
                  className="!bg-[#161724] !h-[42px] max-w-[130px] mb-6"
                  defaultValue={"4 mb"}
                  placeholder="Размер"
                />
              </Form.Item>
              <div className="text-sm text-white leading-4 items-center flex gap-[10px] justify-start">
                Verified
                <Form.Item name="verified" noStyle>
                  <MonsterSwitch />
                </Form.Item>
              </div>
            </div>
            <div className="flex flex-col relative mr-6">
              <div className="text-[#8F919D] text-xs absolute top-[-24px]">
                Возраст
              </div>
              <MonsterInput
                className="!bg-[#161724] !h-[42px] max-w-[130px]"
                defaultValue={"18+"}
                disabled
                placeholder="Возраст"
              />
              <div className="mt-4">
                <div className="text-[#8F919D] text-xs lading-[14px] mb-1.5">
                  Рейтинг
                </div>
                <div className="flex gap-2.5 items-center">
                  <Form.Item name="countOfStars" className="mb-0">
                    <MonsterRate className="min-w-36" />
                  </Form.Item>
                  <div className="font-bold text-xs text-white leading-4">
                    {form.getFieldValue("countOfStars")}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="text-[#8F919D] text-xs absolute top-[-24px]">
                Скачиваний
              </div>
              <Form.Item
                name="countOfDownloads"
                rules={[requiredValidator("Укажите количество скачиваний")]}
                className="mb-0"
              >
                <MonsterInput
                  className="!bg-[#161724] !h-[42px] max-w-[130px]"
                  placeholder="Количество скачиваний"
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="bg-cardColor rounded-lg py-[30px] px-[50px]">
          <div className="text-base text-orangeSubtitle font-bold mb-5">
            Изображения и видео
          </div>
          <div className="text-white text-xs leading-4 mb-5">
            Загрузите изображения и видео для отображения на странице установки
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
            </div>
          }
        </div>
        <div className="bg-cardColor rounded-lg px-[50px] pt-7 pb-[35px]">
          <div className="font-bold text-orangeSubtitle text-base leading-[18px] mb-5">
            Описание и теги
          </div>
          <div className="text-white text-sm leading-4 mb-[30px]">
            Хорошее описание и наличие тегов повышает конверсию.
          </div>
          <div className="flex gap-[30px]">
            <div className="flex-1">
              <div className="text-sm leading-[14px] text-white mb-[10px]">
                Описание:
              </div>
              <Form.Item
                name="fullDescription"
                className="mb-0"
                rules={[requiredValidator("Укажите описание приложения")]}
              >
                <TextArea rows={6} className="mb-[25px] resize-none" />
              </Form.Item>
              <button className="text-white underline leading-[18px] text-base">
                Сгенерить описание при помощи ChatGPT
              </button>
            </div>
            <div className="flex-1">
              <div className="text-sm text-white leading-[14px] mb-[10px]">
                Теги к описанию: (напишите тег и нажмите Enter)
              </div>
              <div className="border-[rgb(22,23,36)] bg-[#161724] border border-solid hover:border-[#383B66] rounded-lg cursor-text p-3 mb-[30px]">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-[#E3CC02] inline-flex items-center h-[22px] pl-2 pr-0.5 py-0.5 rounded-lg mx-2.5 cursor-pointer"
                  >
                    <span className="text-[#161724] text-xs leading-[14px] mr-2">
                      {tag}
                    </span>
                    <span
                      className="bg-[#FFFBD8] text-[#161724] rounded-full w-[18px] h-[18px] flex justify-center items-center"
                      onClick={() => removeTag(tag)}
                    >
                      &times;
                    </span>
                  </div>
                ))}
                <div
                  className="border-none h-full w-full text-white p-3"
                  style={{ outline: "none" }}
                  onKeyDown={handleTagEnter}
                  contentEditable
                />
              </div>
              <SimpleButton
                text="Выбрать случайные теги"
                icon={<RestoreIcon />}
                disabled
              />
            </div>
          </div>
        </div>
        <div className="flex gap-[30px] mb-[30px]">
          <div className="bg-cardColor h-fit rounded-lg px-[50px] pt-7 pb-[35px] flex-1">
            <div className="flex mb-[44px]">
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
                        onChange={(value) => {
                          setSliders((prev) => {
                            const newSliders = [...prev];
                            newSliders[index] = value;
                            return newSliders;
                          });
                        }}
                        step={0.1}
                        min={0}
                        max={5}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-end text-white text-base leading-[18px] mb-4">
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
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-white font-bold text-base leading-[18px] mb-5">
                Комментарии
              </div>
              <div className="flex flex-col">
                <div className="text-[#D9D9D9] font-bold text-base italic">
                  Справа превью
                </div>
                <div className="flex justify-end">
                  <ArrowIcon />
                </div>
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
                  <SimpleButton
                    icon={<PlusIcon />}
                    text="Добавить комментарий"
                    onClick={addEmptyReview}
                  />
                )}
                <SimpleButton icon={<GptIcon />} text="Сгенерить с ChatGPT" />
              </div>
            </div>
          </div>
          <div className="w-[360px] h-[671px] rounded-[32px] box-border border-[9px] border-solid border-[#515ACA] bg-white overflow-auto ">
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
            htmlType="submit"
            text="Сохранить и продолжить"
            color="bg-[white]"
            textColor="text-[#121320]"
          />
        </div>
      </div>
    </Form>
  );
};

export default DesignOption;

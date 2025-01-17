import { useEffect, useState } from "react";
import { Button, Form, FormInstance, Input, message, Spin, Upload } from "antd";
import { Review } from "@models/review";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import MonsterDatePicker from "@shared/elements/DatePicker/MonsterDatePicker";
import dayjs from "dayjs";
import MonsterRate from "@shared/elements/Rate/MonsterRate";
import { useUploadImagesMutation } from "@store/apis/filesApi.ts";
import { useWatch } from "antd/es/form/Form";
import { requiredValidator } from "@shared/form/validators/validators";
import {
  allowedExtensions,
  allowedExtensionsErrorMessage,
  gerRandomImageUrl,
} from "../DesignOptionHelpers.ts";
import EditIcon from "@icons/EditIcon.tsx";

import OutlineGptIcon from "@icons/GptIcon.tsx";
import FilledGptIcon from "@icons/FilledGptIcon.tsx";
import IconButton from "@shared/elements/IconButton/IconButton.tsx";
import {
  useGenerateResponseTextMutation,
  useLazyGenerateReviewDateQuery,
  useLazyGenerateReviewTextQuery,
} from "@store/apis/pwaApi.ts";
import MonsterPopover from "@shared/elements/Popover/MonsterPopover.tsx";
import { FaMale } from "react-icons/fa";
import MonsterButton from "@shared/elements/MonsterButton/MonsterButton.tsx";
import { FaFemale } from "react-icons/fa";
import { DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ReviewItem = ({
  reviewContent,
  allReviews,
  setAllReviews,
  form,
  actualDateOfReviewsIsActive,
}: {
  reviewContent: Review;
  allReviews: Review[];
  setAllReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  form: FormInstance;
  actualDateOfReviewsIsActive: boolean;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [uploadIcon, { isLoading: isIconUploading }] =
    useUploadImagesMutation();
  useWatch(`reviewAuthorRating${reviewContent.id}`, form);
  const [
    generateReview,
    { isLoading: isGeneratingReview, isFetching: isGeneratingReviewFetching },
  ] = useLazyGenerateReviewDateQuery();
  const [
    generateReviewText,
    {
      isLoading: isGeneratingReviewText,
      isFetching: isGeneratingReviewTextFetching,
    },
  ] = useLazyGenerateReviewTextQuery();
  const [generateResponseText, { isLoading: isGeneratingResponseText }] =
    useGenerateResponseTextMutation();

  const generateReviewTextHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { text } = await generateReviewText().unwrap();
    form.setFieldsValue({ [`reviewText${reviewContent.id}`]: text });
  };

  const generateResponseTextHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const reviewText =
      form.getFieldValue(`reviewText${reviewContent.id}`) ??
      "Хорошее приложение";

    const { text } = await generateResponseText({ text: reviewText }).unwrap();
    form.setFieldsValue({ [`devResponse${reviewContent.id}`]: text });
  };

  const editReview = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setAllReviews(
      allReviews.map((review) => {
        if (review.id === reviewContent.id) {
          return {
            ...review,
            isActive: true,
          };
        } else return review;
      })
    );
  };

  const saveReview = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await form.validateFields([
        `reviewText${reviewContent.id}`,
        `reviewAuthorName${reviewContent.id}`,
      ]);
      const uploadIconResponse = reviewAuthorIcon.file
        ? await uploadIcon([reviewAuthorIcon.file]).unwrap()
        : { imageUrls: [reviewAuthorIcon.preview] };
      const updatedReviews = allReviews.map((review) => {
        if (review.id === reviewContent?.id) {
          return {
            ...review,
            isActive: false,
            reviewAuthorName: form.getFieldValue(
              `reviewAuthorName${reviewContent.id}`
            ),
            reviewAuthorIcon: uploadIconResponse.imageUrls[0],
            reviewAuthorRating: form.getFieldValue(
              `reviewAuthorRating${reviewContent.id}`
            ),
            reviewText: form.getFieldValue(`reviewText${reviewContent.id}`),
            devResponse: form.getFieldValue(`devResponse${reviewContent.id}`),
            reviewDate: form.getFieldValue(`reviewDate${reviewContent.id}`)
              ? form
                  .getFieldValue(`reviewDate${reviewContent.id}`)
                  .toISOString()
              : dayjs().toISOString(),
          };
        } else return review;
      });
      setAllReviews(updatedReviews);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const [reviewAuthorIcon, setReviewAuthorIcon] = useState<{
    file: File | null;
    preview: string | undefined;
  }>({
    file: null,
    preview: undefined,
  });

  useEffect(() => {
    if (!reviewContent?.reviewAuthorIcon) return;
    setReviewAuthorIcon({
      file: null,
      preview: reviewContent.reviewAuthorIcon,
    });
  }, [reviewContent]);

  const beforeUpload = (file: File) => {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      message.error(allowedExtensionsErrorMessage);

      return false;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setReviewAuthorIcon({
        file,
        preview: reader.result as string,
      });
    };

    reader.readAsDataURL(file);

    return false;
  };

  const removeReviewIcon = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (!reviewContent.isActive) return;
    setReviewAuthorIcon({ file: null, preview: undefined });
  };

  const removeReview = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setAllReviews(allReviews.filter((review) => review !== reviewContent));
  };

  const generateReviewDate = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { reviewAuthor, reviewResponse, reviewText } =
      await generateReview().unwrap();
    form.setFieldsValue({
      [`reviewAuthorName${reviewContent.id}`]: reviewAuthor,
      [`reviewText${reviewContent.id}`]: reviewText,
      [`devResponse${reviewContent.id}`]: reviewResponse,
    });
  };

  const addRandomIcon = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    male: "male" | "female"
  ) => {
    e.preventDefault();
    const url = gerRandomImageUrl(male);
    setReviewAuthorIcon({ file: null, preview: url });
  };

  const popoverContent = (
    <div className="flex gap-2.5">
      <MonsterButton
        onClick={(e) => {
          addRandomIcon(e, "male");
        }}
        type="primary"
        icon={<FaMale />}
      >
        Мужской аватар
      </MonsterButton>
      <MonsterButton
        onClick={(e) => {
          addRandomIcon(e, "female");
        }}
        type="primary"
        icon={<FaFemale />}
      >
        Женский аватар
      </MonsterButton>
      {reviewAuthorIcon.preview && (
        <Button
          onClick={removeReviewIcon}
          type="primary"
          danger
          shape="circle"
          icon={<DeleteOutlined />}
        />
      )}
    </div>
  );

  return (
    <>
      <Spin
        spinning={
          isIconUploading ||
          isGeneratingReview ||
          isGeneratingReviewFetching ||
          isGeneratingReviewFetching ||
          isGeneratingReviewText ||
          isGeneratingReviewTextFetching ||
          isGeneratingResponseText
        }
        fullscreen
      />
      <div
        className={`mb-2 box-border pb-7 ${
          reviewContent.isActive
            ? ""
            : " border-0 border-b border-solid border-[#383B66]"
        }`}
      >
        <div className="flex justify-between items-center mb-[30px]">
          <div className="flex flex-wrap">
            <MonsterPopover
              content={popoverContent}
              placement="top"
              open={isPopoverOpen}
              onOpenChange={(open) => {
                if (!reviewContent.isActive) return;
                setIsPopoverOpen(open);
              }}
              mouseLeaveDelay={0.4}
              trigger="hover"
            >
              <div className="flex items-center mr-[19px] cursor-pointer">
                <Upload
                  disabled={!reviewContent.isActive}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                >
                  {reviewAuthorIcon.preview ? (
                    <div className="relative w-[50px] h-[50px]  group">
                      <img
                        src={reviewAuthorIcon.preview}
                        alt="Uploaded"
                        className="w-[50px] h-[50px] object-fill rounded-full"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => e.preventDefault()}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="border border-[#161724] box-border hover:border-[#36395a] hover:border-solid bg-[#161724] rounded-full w-[50px] h-[50px] cursor-pointer"
                    >
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 25 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.42578 0H18.895C19.5615 0 20.1675 0.280451 20.6055 0.726488L20.646 0.771739C21.0625 1.21628 21.3203 1.81846 21.3203 2.47086V9.5622C20.645 9.36529 19.9321 9.25887 19.1948 9.25887C18.8408 9.25887 18.4927 9.28374 18.1514 9.33098L20.0151 7.56473V2.47086C20.0151 2.17499 19.8999 1.89951 19.7124 1.69415L19.6831 1.6663C19.48 1.45944 19.2002 1.32866 18.895 1.32866H2.42578C2.13037 1.32866 1.86182 1.44552 1.66309 1.63398L1.63477 1.66481C1.43164 1.87167 1.30469 2.15759 1.30469 2.47086V11.3185C2.74902 9.99232 5.06103 8.13856 6.52051 6.88896C6.75879 6.67912 7.11328 6.68359 7.34717 6.88697C7.39453 6.92725 7.42969 6.97598 7.46924 7.02372L10.8696 12.2757L12.085 8.50852C12.1821 7.98242 12.7925 7.80789 13.1621 8.15746L15.3599 10.3006C14.98 10.5234 14.6216 10.779 14.2861 11.0624L13.1548 9.95652L11.9146 13.8739C11.8364 14.4283 11.1606 14.6387 10.7954 14.211L6.87598 8.32652L1.30469 13.0843V17.0464C1.30469 17.3577 1.43311 17.6426 1.63623 17.8494C1.84082 18.0583 2.12256 18.1886 2.42578 18.1886H11.583C11.646 18.645 11.7476 19.0891 11.8848 19.5172H2.42578C1.7627 19.5172 1.1543 19.2378 0.713379 18.7892C0.275391 18.3427 0 17.7251 0 17.0464V2.47086C0 1.79111 0.272949 1.17253 0.711914 0.724997L0.756836 0.683725C1.19385 0.261058 1.78174 0 2.42578 0ZM19.1948 11.1758C20.7979 11.1758 22.2495 11.8376 23.2993 12.9072C24.3501 13.9773 25 15.4552 25 17.0876C25 18.7201 24.3501 20.199 23.2998 21.2681C22.2495 22.3382 20.7979 23 19.1948 23C17.5923 23 16.1406 22.3382 15.0898 21.2681C14.0396 20.199 13.3896 18.7201 13.3896 17.0876C13.3896 15.4567 14.0396 13.9798 15.0898 12.9097C16.1431 11.8376 17.5933 11.1758 19.1948 11.1758ZM18.7764 14.4626H19.6143C19.8125 14.4626 19.9751 14.6302 19.9751 14.8296V16.2945H21.4126C21.6108 16.2945 21.7734 16.4636 21.7734 16.662V17.5148C21.7734 17.7147 21.6089 17.8828 21.4126 17.8828H19.9751V19.3467C19.9751 19.5466 19.8105 19.7141 19.6143 19.7141H18.7764C18.5801 19.7141 18.4155 19.5491 18.4155 19.3467V17.8828H16.9766C16.7803 17.8828 16.6157 17.7172 16.6157 17.5148V16.662C16.6157 16.4596 16.7778 16.2945 16.9766 16.2945H18.4155V14.8296C18.4155 14.6277 18.5776 14.4626 18.7764 14.4626ZM22.5068 13.7143C21.6602 12.852 20.4883 12.3175 19.1948 12.3175C17.9009 12.3175 16.729 12.851 15.8813 13.7133C15.0347 14.576 14.5107 15.7699 14.5107 17.0876C14.5107 18.4049 15.0356 19.5988 15.8823 20.461C16.73 21.3243 17.9019 21.8583 19.1948 21.8583C20.4883 21.8583 21.6602 21.3243 22.5073 20.461C23.3545 19.5988 23.8789 18.4049 23.8789 17.0876C23.8789 15.7709 23.3545 14.5775 22.5068 13.7143ZM13.0811 3.04021C13.6201 3.04021 14.1094 3.26298 14.4634 3.62349C14.8174 3.984 15.0361 4.48175 15.0361 5.03122C15.0361 5.57969 14.8174 6.07844 14.4634 6.43895C14.1094 6.79945 13.6201 7.02222 13.0811 7.02222C12.5415 7.02222 12.0527 6.79945 11.6987 6.43895C11.3447 6.07844 11.126 5.57969 11.126 5.03122C11.126 4.48175 11.3447 3.984 11.6987 3.62349C12.0527 3.26298 12.5415 3.04021 13.0811 3.04021ZM13.6777 4.42357C13.5194 4.26263 13.3048 4.1723 13.0811 4.17246C12.8481 4.17246 12.6367 4.26893 12.4844 4.42357C12.3265 4.58488 12.2379 4.80345 12.2383 5.03122C12.2383 5.26841 12.3325 5.48372 12.4844 5.63886C12.6367 5.79351 12.8481 5.88998 13.0811 5.88998C13.314 5.88998 13.5254 5.79351 13.6777 5.63886C13.8296 5.48372 13.9243 5.26841 13.9243 5.03122C13.9243 4.79403 13.8296 4.57872 13.6777 4.42357Z"
                          fill="white"
                        ></path>
                      </svg>
                    </button>
                  )}
                </Upload>
              </div>
            </MonsterPopover>
            <div className="flex flex-col gap-2.5 mr-[21px]">
              <div className="text-sm leading-[14px] text-[#8F919D]">Автор</div>
              <Form.Item
                name={`reviewAuthorName${reviewContent.id}`}
                rules={[requiredValidator("Укажите автора")]}
                validateTrigger={["onChange"]}
              >
                <MonsterInput
                  className="max-w-[240px] !h-[42px]"
                  placeholder="Название автора"
                  readOnly={!reviewContent.isActive}
                  disabled={!reviewContent.isActive}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col gap-[10px] mr-[30px]">
              <div className="text-sm leading-[14px] text-[#8F919D]">Дата</div>
              {actualDateOfReviewsIsActive ? (
                <div className="bg-[#161724] flex items-center justify-center h-[42px] rounded-md text-[#00FF11]  w-[130px] text-sm">
                  Актуальная дата
                </div>
              ) : (
                <Form.Item name={`reviewDate${reviewContent.id}`}>
                  <MonsterDatePicker
                    defaultValue={dayjs()}
                    className="w-[130px] !h-[42px]"
                    allowClear={false}
                    readOnly={!reviewContent.isActive}
                    disabled={!reviewContent.isActive}
                    style={{ backgroundColor: "#161724", color: "white" }}
                  />
                </Form.Item>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="text-[#8F919D] text-sm leading-[14px]">
                Рейтинг
              </div>
              <div className="flex gap-2.5 ">
                <Form.Item
                  name={`reviewAuthorRating${reviewContent.id}`}
                  initialValue={5}
                >
                  <MonsterRate
                    disabled={!reviewContent.isActive}
                    style={{ height: "42px" }}
                  />
                </Form.Item>
                <span className="font-bold text-white text-sm">
                  {form.getFieldValue(`reviewAuthorRating${reviewContent.id}`)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-[30px]">
          <div className="flex-1">
            <div className="mb-[9px] text-[#8F919D] text-xs leading-[14px]">
              Коммментарий
            </div>
            <div className="mb-5">
              <Form.Item
                rules={[requiredValidator("Укажите комментарий")]}
                validateTrigger={["onChange"]}
                name={`reviewText${reviewContent.id}`}
              >
                <TextArea
                  rows={6}
                  className="scrollbar-hidden"
                  style={{ resize: "none" }}
                  disabled={!reviewContent.isActive}
                />
              </Form.Item>
              {reviewContent.isActive && (
                <button
                  className="flex gap-2.5 items-center"
                  onClick={generateReviewTextHandler}
                >
                  <FilledGptIcon />
                  <span className="text-sm text-white uppercase hover:underline truncate ...">
                    Сгенерировать коммментарий
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-[9px] text-[#8F919D] text-xs leading-[14px] truncate ...">
              Ответ разразработчика
            </div>
            <div className="mb-5">
              <Form.Item name={`devResponse${reviewContent.id}`}>
                <TextArea
                  style={{ resize: "none" }}
                  className="scrollbar-hidden"
                  rows={6}
                  disabled={!reviewContent.isActive}
                />
              </Form.Item>
              {reviewContent.isActive && (
                <button
                  className="flex gap-2.5 items-center"
                  onClick={generateResponseTextHandler}
                >
                  <FilledGptIcon />
                  <span className="text-sm text-white uppercase hover:underline truncate ...">
                    Сгенерировать ответ
                  </span>
                </button>
              )}
            </div>
            <div className={`flex justify-end items-center gap-5`}>
              {reviewContent?.isActive && (
                <div className="flex gap-5">
                  <button
                    onClick={saveReview}
                    className="bg-[#02E314] text-[#161724] flex items-center justify-center px-3 rounded box-border h-[42px] hover:opacity-80 hover:shadow-sm"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={removeReview}
                    className="w-[42px] bg-[#F56060] h-[42px] flex items-center justify-center rounded cursor-pointer hover:opacity-80 hover:shadow-sm"
                  >
                    <DeleteOutlined
                      style={{ fontSize: "20px", color: "white" }}
                    />
                  </button>
                </div>
              )}
              {!reviewContent.isActive && (
                <button
                  onClick={editReview}
                  className="text-[#E3CC02] text-sm items-center font-bold 
                  cursor-pointer flex gap-3 leading-4
                  hover:opacity-80"
                >
                  Edit
                  <EditIcon />
                </button>
              )}
            </div>
          </div>
        </div>
        {reviewContent.isActive && (
          <IconButton
            icon={<OutlineGptIcon />}
            text="Сгенерить все  с ChatGPT"
            onclick={generateReviewDate}
          />
        )}
      </div>
    </>
  );
};

export default ReviewItem;

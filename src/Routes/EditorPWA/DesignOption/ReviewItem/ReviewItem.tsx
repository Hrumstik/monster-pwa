import { useEffect, useState } from "react";
import { Form, FormInstance, Input, Upload } from "antd";
import { Review } from "@models/review";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import MonsterDatePicker from "@shared/elements/DatePicker/MonsterDatePicker";
import dayjs from "dayjs";
import MonsterRate from "@shared/elements/Rate/MonsterRate";
import GptIcon from "@icons/GptIcon";
import { useUploadImagesMutation } from "@store/slices/filesApi";
import { useWatch } from "antd/es/form/Form";
import { requiredValidator } from "@shared/form/validators/validators";

const { TextArea } = Input;

const ReviewItem = ({
  reviewContent,
  allReviews,
  setAllReviews,
  form,
}: {
  reviewContent: Review;
  allReviews: Review[];
  setAllReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  form: FormInstance;
}) => {
  const [uploadIcon] = useUploadImagesMutation();
  useWatch(`reviewAuthorRating${reviewContent.id}`, form);

  const editReview = () => {
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
      if (!reviewAuthorIcon.file) return;
      const uploadIconResponse = await uploadIcon([
        reviewAuthorIcon.file,
      ]).unwrap();
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
            reviewDate:
              form.getFieldValue(`reviewDate${reviewContent.id}`) ??
              dayjs().format("DD.MM.YYYY"),
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
    preview: string | null;
  }>({
    file: null,
    preview: null,
  });

  useEffect(() => {
    if (!reviewContent?.reviewAuthorIcon) return;
    setReviewAuthorIcon({
      file: null,
      preview: reviewContent.reviewAuthorIcon,
    });
  }, [reviewContent]);

  const beforeUpload = (file: File) => {
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
    if (!reviewContent.isActive) return;
    setReviewAuthorIcon({ file: null, preview: null });
  };

  const removeReview = () => {
    setAllReviews(allReviews.filter((review) => review !== reviewContent));
  };

  return (
    <div className="pt-5 mb-[35px]">
      <div className="flex justify-between items-center mb-[30px]">
        <div className="flex">
          <div className="pt-[20px] mr-[19px]">
            <Upload
              disabled={!reviewContent.isActive}
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              {reviewAuthorIcon.preview || reviewContent?.reviewAuthorIcon ? (
                <div className="relative w-[50px] h-[50px] group">
                  <img
                    src={
                      reviewContent?.reviewAuthorIcon
                        ? reviewContent?.reviewAuthorIcon
                        : reviewAuthorIcon.preview!
                    }
                    alt="Uploaded"
                    className="w-[50px] h-[50px] object-contain rounded-lg"
                  />
                  <button
                    className={`absolute  opacity-0 top-0 right-0 group-hover:opacity-100  text-white rounded-full w-4 h-4 flex justify-center items-center ${
                      reviewContent.isActive ? "" : "hidden"
                    }`}
                    onClick={removeReviewIcon}
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => e.preventDefault()}
                  className="border border-[#161724] box-border hover:border-[#36395a] hover:border-solid bg-[#161724] rounded-full w-[50px] h-[50px] cursor-pointer"
                />
              )}
            </Upload>
          </div>
          <div className="flex flex-col gap-2.5 mr-[21px]">
            <div className="text-sm leading-[14px] text-[#8F919D]">Автор</div>
            <Form.Item
              name={`reviewAuthorName${reviewContent.id}`}
              rules={[requiredValidator("Укажите автора")]}
              validateTrigger={["onBlur", "onSubmit"]}
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
            <Form.Item name={`reviewDate${reviewContent.id}`}>
              <MonsterDatePicker
                defaultValue={dayjs()}
                className="w-[130px] !h-[42px]"
                readOnly={!reviewContent.isActive}
                disabled={!reviewContent.isActive}
              />
            </Form.Item>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="text-[#8F919D] text-sm leading-[14px]">Рейтинг</div>
            <div className="flex gap-2.5 ">
              <Form.Item
                name={`reviewAuthorRating${reviewContent.id}`}
                initialValue={2}
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
        {reviewContent?.isActive && (
          <button
            onClick={removeReview}
            className="text-[#F56060] text-base leading-[18px] cursor-pointer hover:underline"
          >
            Удалить этот комментарий
          </button>
        )}
      </div>
      <div className="flex gap-[30px]">
        <div className="flex-1">
          <div className="mb-[9px] text-[#8F919D] text-xs leading-[14px]">
            Коммментарий
          </div>
          <div className="mb-5">
            <Form.Item
              rules={[requiredValidator("Укажите комментарий")]}
              name={`reviewText${reviewContent.id}`}
            >
              <TextArea
                rows={6}
                style={{ resize: "none" }}
                disabled={!reviewContent.isActive}
              />
            </Form.Item>
          </div>
          <button className="flex items-center gap-2.5 cursor-not-allowed group">
            <GptIcon />
            <span className="group-hover:underline text-white text-base leading-[18px] font-bold">
              Сгенерировать комментарий
            </span>
          </button>
        </div>
        <div className="flex-1">
          <div className="mb-[9px] text-[#8F919D] text-xs leading-[14px]">
            Ответ разразработчика
          </div>
          <div className="mb-5">
            <Form.Item name={`developerResponse${reviewContent.id}`}>
              <TextArea
                style={{ resize: "none" }}
                rows={6}
                disabled={!reviewContent.isActive}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center gap-2.5 cursor-not-allowed group">
              <GptIcon />
              <span className="group-hover:underline text-white text-base leading-[18px] font-bold ">
                Сгенерировать ответ
              </span>
            </div>
            {reviewContent.isActive ? (
              <button
                onClick={saveReview}
                className={`text-[#02E314] font-bold hover:underline text-base ${
                  reviewContent.isActive
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                } `}
              >
                Сохранить комментарий
              </button>
            ) : (
              <button
                onClick={editReview}
                className="text-[#E3CC02] font-bold hover:underline text-base cursor-pointer"
              >
                Редактировать
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;

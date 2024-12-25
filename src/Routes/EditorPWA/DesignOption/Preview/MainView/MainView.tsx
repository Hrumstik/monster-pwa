import { Picture } from "@models/pwa";
import { PreviewPwaContent, PwaViews } from "../models";
import VerifiedIcon from "@icons/VerifiedIcon";
import StarIcon from "@icons/StarIcon";
import ScreensSlider from "./ScreensSlider/ScreensSlider";
import { ArrowRightOutlined } from "@ant-design/icons";
import TagsSlider from "./TagsSlider/TagsSlider";
import { Rate } from "antd";
import { Review } from "@models/review";
import ReviewItem from "./Review/ReviewItem";
import thirdPartyIcon from "@shared/images/thirdParties.png";
import dataCollecting from "@shared/images/dataCollecting.png";
import stopIcon from "@shared/images/stop.png";
import DownloadIcon from "@shared/icons/DownloadIcon.tsx";
import SmallInfoIcon from "@shared/icons/SmallInfoIcon.tsx";

const MainView = ({
  previewPwaContent,
  screens,
  appIcon,
  setView,
  tags,
  sliders,
  reviews,
}: {
  previewPwaContent: PreviewPwaContent;
  setView: (view: PwaViews) => void;
  appIcon: Picture;
  screens: Picture[];
  tags: string[];
  sliders: number[];
  reviews: Review[];
  myPWAsPage?: boolean;
}) => {
  const defaultReview: Review[] = [
    {
      reviewAuthorIcon: "",
      reviewAuthorName: "Jacob Smith",
      reviewAuthorRating: 5,
      reviewText:
        "A wonderful application. I love all games,  especially this one",
      reviewDate: "09/04/24",
    },
    {
      reviewAuthorIcon: "",
      reviewAuthorName: "Анастасия Андреева",
      reviewAuthorRating: 5,
      reviewText:
        "A wonderful application. I love all games,  especially this one",
      reviewDate: "09/04/24",
      reviewIconColor: "",
    },
  ];
  const actualReviews =
    reviews.length > 0
      ? reviews.length > 3
        ? reviews.slice(0, 3)
        : reviews
      : defaultReview;

  return (
    <div className="p-[20px] pt-[20px] pb-[20px] pl-[14px] pr-[14px]">
      <div className="flex mb-4">
        <div className="relative block overflow-hidden w-[70px] h-[70px] rounded-lg mr-5">
          {appIcon.url ? (
            <img
              src={appIcon.url}
              alt="App logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300"></div>
          )}
        </div>

        <div className="flex flex-col text-[#00875F]">
          <div className="text-black text-[22px] leading-7 font-medium mb-1">
            {previewPwaContent.appName
              ? previewPwaContent.appName
              : "Plinko ASMR"}
          </div>
          <div className="flex gap-1 items-center mb-2">
            <div className="font-medium text-[#1357CD] leading-4 text-[14px]">
              {previewPwaContent.developerName
                ? previewPwaContent.developerName
                : "Supercent, Inc."}
            </div>
            {previewPwaContent.verified && <VerifiedIcon />}
          </div>
          {previewPwaContent.hasPaidContentTitle && (
            <div className="flex gap-1 text-[10px] text-[#444444] items-center">
              <div className="text-[10px]">Нет рекламы</div>
              <div className="rounded-full w-0.5 h-0.5 bg-[#444444]" />
              <div className="text-[10px]">Нет платного контента</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center mb-5 no-scrollbar overflow-x-auto">
        <div className="flex-1 flex flex-col justify-center items-center h-10 min-w-[126px] w-full mx-2">
          <div className="font-medium text-sm text-[#020202] flex gap-0.5 items-center justify-center">
            {previewPwaContent.rating}
            <StarIcon />
          </div>
          <div className="text-xs text-[#605D64] w-full flex justify-center items-center font-medium">
            {previewPwaContent.countOfReviews}
            тыс отзывов&nbsp;
            <SmallInfoIcon />
          </div>
        </div>
        <div className="h-[22px] bg-[#C4C4C4] w-px min-w-[1px]" />
        <div className="flex-1 flex flex-col justify-center items-center h-[44px] min-w-[126px] mx-2">
          <DownloadIcon />
          <div className="text-xs text-[#605D64] font-medium">
            {previewPwaContent.size.toUpperCase()}
          </div>
        </div>
        <div className="h-[22px] bg-[#C4C4C4] w-px min-w-[1px] min-w-[126px] mx-2" />
        <div className="flex-1 flex flex-col justify-center items-center h-[44px] min-w-[126px] mx-2">
          <div className="font-medium text-sm text-[#030303] items-center justify-center">
            {previewPwaContent.countOfDownloads}
          </div>
          <div className="text-xs text-[#605D64] font-medium">Скачивания</div>
        </div>
        <div className="h-[22px] bg-[#C4C4C4] w-px min-w-[1px]" />
        <div className="flex-1 flex flex-col justify-center items-center h-[44px] min-w-[126px] mx-2">
          <div className="font-medium text-[13px] text-[#030303] flex gap-[2px] items-center justify-center mb-[5px]">
            <div className="h-4 mb-0. border border-solid border-black flex items-center justify-center text-xs font-bold">
              18+
            </div>
          </div>
          <div className="text-xs text-[#605D64] flex items-center font-medium">
            18+&nbsp;
            <SmallInfoIcon />
          </div>
        </div>
      </div>

      <button
        onClick={(e) => e.preventDefault()}
        className="bg-[#1357CD] rounded-[60px] h-9 w-full text-white mb-5"
      >
        Установить
      </button>
      <ScreensSlider
        screens={screens}
        wideScreens={previewPwaContent.wideScreens}
      />
      <div className="flex flex-col gap-3 mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => {
            setView(PwaViews.About);
          }}
        >
          <span className="text-[#1D1D1D] leading-6 font-medium text-base">
            Описание
          </span>
          <ArrowRightOutlined style={{ color: "#1D1D1D" }} />
        </div>
        <div className="text-[#605D64] text-[14px] leading-5 text-left">
          {previewPwaContent.shortDescription}
        </div>
      </div>
      <TagsSlider tags={tags} />
      <div
        className="flex justify-between items-center cursor-pointer mb-5"
        onClick={() => {
          setView(PwaViews.Reviews);
        }}
      >
        <span className="text-[#1D1D1D] leading-6 font-medium text-base">
          Оценки и отзывы
        </span>
        <ArrowRightOutlined style={{ color: "#1D1D1D" }} />
      </div>
      <div className="text-[#605D64] text-xs leading-4 mb-4">
        Оценки и отзывы подтверждены. Их оставили пользователи с таким же типом
        устройства как у вас.
      </div>
      <div
        className="grid pb-6 gap-x-[2em]"
        style={{
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: "auto auto auto",
          gridTemplateAreas: `
      "rating-big rating-right"
      "rating-stars rating-right"
      "rating-count rating-right"
    `,
        }}
      >
        <div className="text-[45px]" style={{ gridArea: "rating-big" }}>
          {previewPwaContent.rating}
        </div>
        <div className="flex mb-2" style={{ gridArea: "rating-stars" }}>
          <Rate
            value={Number(previewPwaContent.rating)}
            allowHalf
            style={{ color: "#1357CD", fontSize: "14px" }}
            disabled
          />
        </div>
        <div
          className="font-medium text-[0.8em]"
          style={{ gridArea: "rating-count" }}
        >
          {previewPwaContent.countOfReviewsFull}
        </div>
        <div
          className="flex flex-col gap-[0.25em]"
          style={{ gridArea: "rating-right" }}
        >
          {sliders.map((data, index) => (
            <div
              className="flex gap-[0.75em] justify-center items-center"
              key={index}
            >
              <div className="font-medium text-[0.8em] w-[0.5em]">
                {5 - index}
              </div>
              <div className="relative h-[0.5em] w-full bg-[#d9d9d9] rounded-[0.5em]">
                <div
                  className="absolute h-[0.5em] min-w-[0.1em] bg-[#1357CD] rounded-[0.5em]"
                  style={{ width: `${(data * 100) / 5 || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 pb-5">
        {actualReviews.map((review) => {
          return (
            <ReviewItem
              src={review.reviewAuthorIcon}
              key={review.reviewAuthorName}
              name={review.reviewAuthorName}
              stars={review.reviewAuthorRating}
              text={review.reviewText}
              date={review.reviewDate}
              iconColor={review.reviewIconColor}
              devResponse={review.devResponse}
              developerName={previewPwaContent.developerName}
            />
          );
        })}
      </div>
      <div className="text-[#1357CD] leading-5 text-[14px] font-medium hover:underline cursor-pointer pb-[30px]">
        Все отзывы
      </div>
      {previewPwaContent.securityUI && (
        <>
          <div className="flex justify-between items-center cursor-pointer mb-3">
            <span className="text-[#605D64] leading-6 font-medium text-base">
              Безопасность данных
            </span>
          </div>
          <div className="text-[#605D64] text-[13px] leading-4 mb-[14px]">
            Чтобы контролировать безопасность, нужно знать, как разработчики
            собирают ваши данные и передают их третьим лицам. Методы обеспечения
            безопасности и конфиденциальности могут зависеть от того, как вы
            используете приложение, а также от вашего региона и возраста.
            Информация ниже предоставлена разработчиком и в будущем может
            измениться.
          </div>
          <div className="rounded-lg border border-solid border-[#E6E0E9] pt-5 pl-5 pr-3 pb-5">
            <div className="flex flex-col gap-4 mb-[23px]">
              <div className="flex gap-4">
                <img
                  className="w-5 h-5"
                  src={thirdPartyIcon}
                  alt="third party icon"
                />
                <div className="text-[#605D64] text-[13px] leading-4">
                  Это приложение может передавать указанные типы данных третьим
                  лицам
                  <span className="text-[11px]">
                    {" "}
                    Местоположение, Сведения о приложении и его
                    производительности и Идентификаторы устройства или другие
                    идентификаторы
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <img
                  className="w-5 h-5"
                  src={dataCollecting}
                  alt="third party icon"
                />
                <div className="text-[#605D64] text-[13px] leading-4">
                  <div>Данные не собираются</div>
                  <div className="text-[11px]">
                    Подробнее о том,{" "}
                    <span className="underline cursor-pointer">
                      как разработчики заявляют о сборе данных...
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <img
                  className="w-5 h-5"
                  src={stopIcon}
                  alt="third party icon"
                />
                <div className="text-[#605D64] text-[13px] leading-4">
                  Данные не шифруются.
                </div>
              </div>
              <div className="flex gap-4">
                <img
                  className="w-5 h-5"
                  src={stopIcon}
                  alt="third party icon"
                />
                <div className="text-[#605D64] text-[13px] leading-4">
                  Удалить данные невозможно.
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {previewPwaContent.hasMenu ? (
        <div className="h-[80px]"></div>
      ) : (
        <div className="h-[30px]"></div>
      )}
    </div>
  );
};

export default MainView;

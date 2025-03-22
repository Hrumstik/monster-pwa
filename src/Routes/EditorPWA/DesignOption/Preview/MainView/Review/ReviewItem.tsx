import { Avatar, Rate } from "antd";
import moment from "moment";

interface ReviewProps {
  name: string;
  stars: number;
  text: string;
  date: string;
  src?: string;
  iconColor?: string;
  devResponse?: string;
  developerName?: string;
  dark: boolean;
  keepActualDateOfReviews?: boolean;
  mainThemeColor?: string;
}

const ReviewItem: React.FC<ReviewProps> = ({
  name,
  stars,
  text,
  date,
  src,
  iconColor,
  devResponse,
  developerName,
  dark,
  keepActualDateOfReviews,
  mainThemeColor,
}) => {
  const avatarName = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const dateToUse = keepActualDateOfReviews ? new Date().toISOString() : date;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-[0.8em] w-full">
        <div className="flex gap-[1em] items-center">
          <div className="rounded-full w-10 h-10 bg-gray-300">
            {!src ? (
              <Avatar
                style={{
                  backgroundColor: iconColor,
                }}
                className="w-10 h-10"
              >
                {avatarName}
              </Avatar>
            ) : (
              <img
                src={src}
                alt={name}
                className="rounded-full w-full h-full"
              />
            )}
          </div>
          <div
            style={dark ? { color: "#DFDFDF" } : {}}
            className="font-roboto font-normal text-main text-[0.875rem] leading-[1.25rem]"
          >
            {name}
          </div>
        </div>
        <div className="flex gap-[0.5em] items-center">
          <Rate
            value={stars}
            disabled
            style={{
              color: mainThemeColor || (dark ? "#A8C8FB" : "#1357CD"),
              fontSize: "14px",
            }}
          />
          <div
            style={dark ? { color: "#DFDFDF" } : {}}
            className="leading-4 text-xs"
          >
            {moment(dateToUse).format("DD.MM.YYYY")}
          </div>
        </div>
        <div
          className="font-roboto font-normal text-secondary text-sm leading-5"
          style={{
            textOverflow: "ellipsis",
            letterSpacing: "0.0142857143em",
            overflowWrap: "anywhere",
            ...(dark && { color: "#DFDFDF" }),
          }}
        >
          {text}
        </div>
      </div>
      {devResponse && developerName && (
        <div
          style={dark ? { background: "rgb(48, 48, 48)" } : {}}
          className="rounded bg-[#EBEBEB] px-3 py-3 flex flex-col gap-4 text-sm leading-5"
        >
          <div className="flex justify-between">
            <div style={dark ? { color: "#DFDFDF" } : {}}>{developerName}</div>
            <div style={dark ? { color: "#DFDFDF" } : {}}>
              {moment(dateToUse).format("DD.MM.YYYY")}
            </div>
          </div>
          <div style={dark ? { color: "#DFDFDF" } : {}}>{devResponse}</div>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Picture } from "@models/pwa";
import YouTube from "react-youtube";

interface ScreensSliderProps {
  screens: Picture[];
  wideScreens: boolean;
  videoUrl?: string;
}

const ScreensSlider: React.FC<ScreensSliderProps> = ({
  screens,
  wideScreens,
  videoUrl,
}) => {
  const hasScreens = screens.some((screen) => screen.url);
  const actualScreens = hasScreens
    ? screens.filter((screen) => screen.url)
    : screens;

  const videoId = React.useMemo(() => {
    if (!videoUrl) return null;
    try {
      const parsedUrl = new URL(videoUrl);
      return parsedUrl.searchParams.get("v");
    } catch {
      return null;
    }
  }, [videoUrl]);

  return (
    <Swiper
      spaceBetween={16}
      freeMode
      centerInsufficientSlides
      slidesPerView="auto"
      grabCursor
      className="mb-6 overflow-x-auto scroll-smooth no-scrollbar"
    >
      {videoId && (
        <SwiperSlide className="w-[250px] h-[167px] rounded-lg overflow-hidden">
          <div className="bg-gray-300 rounded-lg flex-shrink-0 w-full h-full">
            <YouTube
              videoId={videoId}
              opts={{
                width: "250",
                height: "167",
                playerVars: {
                  autoplay: 0,
                  controls: 1,
                },
              }}
            />
          </div>
        </SwiperSlide>
      )}

      {actualScreens.map((screen, index) => (
        <SwiperSlide
          key={index}
          className={`flex-shrink-0 ${
            wideScreens ? "w-[250px]" : "w-[94px]"
          } h-[167px]`}
        >
          <div className="bg-gray-300 rounded-lg w-full h-full">
            {screen.url && (
              <img
                src={screen.url}
                alt={`Screen-${index}`}
                className="object-fill w-full h-full rounded-lg"
              />
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ScreensSlider;

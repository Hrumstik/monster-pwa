import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Picture } from "@models/pwa";

interface ScreensSliderProps {
  screens: Picture[];
  wideScreens: boolean;
}

const ScreensSlider: React.FC<ScreensSliderProps> = ({
  screens,
  wideScreens,
}) => {
  const hasScreens = screens.some((screen) => screen.url);

  const actualScreens = hasScreens
    ? screens.filter((screen) => screen.url)
    : screens;

  return (
    <Swiper
      spaceBetween={16}
      freeMode={true}
      centerInsufficientSlides={true}
      className="mb-6"
      slidesPerView="auto"
      grabCursor={true}
    >
      {actualScreens.map((screen, index) => (
        <SwiperSlide
          key={index}
          style={{ width: wideScreens ? "250px" : "94px", height: "167px" }}
        >
          <div className="bg-gray-300 rounded-lg flex-shrink-0 w-full h-full">
            {screen.url && (
              <img
                src={screen.url}
                alt="Screen"
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

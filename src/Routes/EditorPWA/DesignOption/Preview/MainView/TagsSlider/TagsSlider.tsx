import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

interface TagsSliderProps {
  tags: string[];
}

const TagsSlider: React.FC<TagsSliderProps> = ({ tags }) => {
  const actualTags =
    tags.length > 0 ? tags : ["Casino", "Slots", "Online", "Offline", "Game"];

  return (
    <Swiper
      spaceBetween={12}
      freeMode={true}
      grabCursor={true}
      className="mb-7 flex"
      slidesPerView="auto"
    >
      {actualTags.map((tag, index) => (
        <SwiperSlide key={index} className="!w-auto">
          {" "}
          <div className="rounded-lg border border-solid border-[#49454F] flex items-center justify-center px-3 py-1.5 h-8 whitespace-nowrap">
            {tag}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TagsSlider;

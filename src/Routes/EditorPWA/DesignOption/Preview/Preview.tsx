import { useState, useRef } from "react";
import { PreviewPwaContent, PwaViews } from "./models";
import MainView from "./MainView/MainView";
import AboutView from "./AboutView/AboutView";
import ReviewsView from "./ReviewsView/ReviewsView";
import { Picture } from "@models/pwa";
import { Review } from "@models/review";
import ModalMenu from "./CustomModal/CustomModal";

const Preview = ({
  previewPwaContent,
  appIcon,
  screens,
  tags,
  sliders,
  reviews,
  myPWAsPage,
  dark,
  setPreviewContent,
}: {
  previewPwaContent: PreviewPwaContent;
  appIcon: Picture;
  screens: Picture[];
  tags: string[];
  sliders: number[];
  reviews: Review[];
  myPWAsPage?: boolean;
  dark: boolean;
  setPreviewContent: (content: PreviewPwaContent) => void;
}) => {
  const [view, setView] = useState<PwaViews>(PwaViews.Main);
  const containerRef = useRef<HTMLDivElement | null>(null);

  let currentView;

  switch (view) {
    case PwaViews.Main:
      currentView = (
        <MainView
          dark={dark}
          myPWAsPage={myPWAsPage}
          appIcon={appIcon}
          screens={screens}
          previewPwaContent={previewPwaContent}
          setView={setView}
          tags={tags}
          sliders={sliders}
          reviews={reviews}
        />
      );
      break;
    case PwaViews.About:
      currentView = (
        <AboutView
          dark={dark}
          setView={setView}
          previewPwaContent={previewPwaContent}
          appIcon={appIcon.url}
        />
      );
      break;
    case PwaViews.Reviews:
      currentView = (
        <ReviewsView
          dark={dark}
          previewPwaContent={previewPwaContent}
          setView={setView}
          appIcon={appIcon.url}
          reviews={reviews}
        />
      );
      break;
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full ${dark && "bg-[#131313]"} w-full ${
        previewPwaContent.showModal ? "overflow-hidden" : "overflow-y-auto "
      } pb-[30px]`}
    >
      <div
        className={`w-full h-full ${
          dark ? "bg-[#131313]" : "bg-white"
        } rounded-3xl`}
      >
        {currentView}
        <div id="custom-modal-menu">
          <ModalMenu
            previewPwaContent={previewPwaContent}
            dark={dark}
            appIcon={appIcon}
            setPreviewContent={setPreviewContent}
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;

import { useState, useRef } from "react";
import { PreviewPwaContent, PwaViews } from "./models";
import MainView from "./MainView/MainView";
import AboutView from "./AboutView/AboutView";
import ReviewsView from "./ReviewsView/ReviewsView";
import { Picture } from "@models/pwa";
import { Review } from "@models/review";
import PwaMenu from "./Menu/Menu";

const Preview = ({
  previewPwaContent,
  appIcon,
  screens,
  tags,
  sliders,
  reviews,
  myPWAsPage,
}: {
  previewPwaContent: PreviewPwaContent;
  appIcon: Picture;
  screens: Picture[];
  tags: string[];
  sliders: number[];
  reviews: Review[];
  myPWAsPage?: boolean;
}) => {
  const [view, setView] = useState<PwaViews>(PwaViews.Main);
  const containerRef = useRef<HTMLDivElement | null>(null);

  let currentView;

  switch (view) {
    case PwaViews.Main:
      currentView = (
        <MainView
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
          setView={setView}
          previewPwaContent={previewPwaContent}
          appIcon={appIcon.url}
        />
      );
      break;
    case PwaViews.Reviews:
      currentView = (
        <ReviewsView
          previewPwaContent={previewPwaContent}
          setView={setView}
          appIcon={appIcon.url}
          reviews={reviews}
        />
      );
      break;
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-y-auto">
      <div className="w-full h-full bg-white rounded-3xl">{currentView}</div>
      {previewPwaContent.hasMenu && <PwaMenu />}
    </div>
  );
};

export default Preview;

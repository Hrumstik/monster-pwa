import { Picture } from "@models/pwa";

const ScreensSlider = ({ screens }: { screens: Picture[] }) => {
  return (
    <div className="slider-container mb-6 overflow-x-auto whitespace-nowrap scroll-smooth">
      <div className="flex space-x-4">
        {screens.map((screen, index) => (
          <div
            key={index}
            className="bg-gray-300 rounded-lg flex-shrink-0 w-[94px] h-[167px] snap-start"
          >
            {screen.url && (
              <img
                src={screen.url}
                alt="Screen"
                className="object-fill w-full h-full rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScreensSlider;

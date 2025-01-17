import { useEffect, useState } from "react";
import { PwaContentOptionProps } from "../DesignOption/DesignOption";
import MonsterSwitch from "@shared/elements/Switch/MonsterSwitch";
import ClassicButton from "@shared/elements/ClassicButton/ClassibButton";
import { EditorPWATabs, getTabIcon } from "../EditorPWAHelpers";
import { useGetPwaContentByIdQuery } from "@store/apis/pwaApi";
import { useParams } from "react-router-dom";
import { FacebookEvent, Pixel, PwaEvents } from "@models/pwa";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import SettingsIcon from "@icons/SettingsIcon";
import { DeleteOutlined } from "@ant-design/icons";
import MonsterPopover from "@shared/elements/Popover/MonsterPopover";
import MonsterSelect from "@shared/elements/Select/MonsterSelect";
import { generateLabelForFBEvents } from "./AnalyticOptionHelpers";

const AnalyticOption: React.FC<PwaContentOptionProps> = ({
  setCurrentTab,
  steps,
  setSteps,
  setPwaContent,
  pwaContent,
}) => {
  const [showPixel, setShowPixel] = useState(false);
  const { id } = useParams();
  const { data: fetchedPwaContent } = useGetPwaContentByIdQuery(id!, {
    skip: !id,
  });
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const facebookEvents = Object.values(FacebookEvent).map((event) => {
    return {
      label: generateLabelForFBEvents(event),
      value: event,
    };
  });

  useEffect(() => {
    if (fetchedPwaContent?.pixel) {
      setPixels(fetchedPwaContent.pixel);
      setShowPixel(true);
    }
  }, [fetchedPwaContent]);

  const addPixel = () => {
    setPixels([
      ...pixels,
      {
        token: "",
        pixelId: "",
        events: [
          {
            triggerEvent: PwaEvents.Install,
            sentEvent: FacebookEvent.Lead,
          },
          {
            triggerEvent: PwaEvents.OpenPage,
            sentEvent: FacebookEvent.ViewContent,
          },
          {
            triggerEvent: PwaEvents.Registration,
            sentEvent: FacebookEvent.CompleteRegistration,
          },
          {
            triggerEvent: PwaEvents.Deposit,
            sentEvent: FacebookEvent.Purchase,
          },
        ],
      },
    ]);
  };

  const handleContinue = () => {
    const filteredPixels = pixels.filter(
      (pixel) => pixel.pixelId && pixel.token
    );

    setPwaContent({
      ...pwaContent!,
      pixel: showPixel ? filteredPixels : undefined,
    });

    setSteps(
      steps.map((step) => {
        if (step.id === EditorPWATabs.Analytics) {
          return {
            ...step,
            isPassed: true,
            icon: getTabIcon(EditorPWATabs.Analytics, true, false),
          };
        }
        return step;
      })
    );
    setCurrentTab(EditorPWATabs.Domain);
  };

  const handlePixelIdChange = (index: number, value: string) => {
    const newPixels = [...pixels];
    newPixels[index].pixelId = value;
    setPixels(newPixels);
  };

  const handlePixelTokenChange = (index: number, value: string) => {
    const newPixels = [...pixels];
    newPixels[index].token = value;
    setPixels(newPixels);
  };

  const handleDeletePixel = (index: number) => {
    const newPixels = [...pixels];
    newPixels.splice(index, 1);
    setPixels(newPixels);
  };

  const getEventValue = (
    pixels: Pixel[],
    index: number,
    triggerEvent: PwaEvents
  ): FacebookEvent | undefined => {
    return pixels[index]?.events.find(
      (event) => event.triggerEvent === triggerEvent
    )?.sentEvent;
  };

  const handleEventChange = (
    index: number,
    triggerEvent: PwaEvents,
    sentEvent: FacebookEvent
  ) => {
    const newPixels = [...pixels];
    const eventIndex = newPixels[index].events.findIndex(
      (event) => event.triggerEvent === triggerEvent
    );

    if (eventIndex !== -1) {
      newPixels[index].events[eventIndex].sentEvent = sentEvent;
    } else {
      newPixels[index].events.push({
        triggerEvent,
        sentEvent,
      });
    }

    setPixels(newPixels);
  };

  return (
    <>
      <div className="bg-cardColor rounded-lg px-[50px] py-[50px] flex-1 flex flex-col mb-10">
        <div className="text-[22px] leading-[18px] text-white mb-3 ">
          Facebook
        </div>
        <p className="text-[14px] text-[#8F919D] mb-5">
          Подробнее о настройке интеграции с Facebook можно прочитать{" "}
          <a href="#" className="hover:underline">
            здесь
          </a>
          .
        </p>
        <div className="flex justify-between mb-5">
          <p className="text-sm text-white font-medium">
            {pixels.length > 0
              ? "Использовать ВСЕ пиксели для интеграции с Facebook"
              : "Использовать пиксель для интеграции с Facebook"}
          </p>
          <MonsterSwitch
            value={showPixel}
            onChange={() => setShowPixel(!showPixel)}
          />
        </div>
        {pixels.length > 0 && (
          <div className="flex flex-col gap-[20px] mb-5">
            {pixels.map((pixel, index) => (
              <div key={index} className="h-10 flex gap-5">
                <MonsterInput
                  className="!bg-[#161724] !h-10 w-[250px]"
                  placeholder="Pixel ID"
                  value={pixel.pixelId}
                  onChange={(e) => handlePixelIdChange(index, e.target.value)}
                />
                <MonsterInput
                  className="!bg-[#161724] !h-10 w-[250px]"
                  placeholder="Token"
                  value={pixel.token}
                  onChange={(e) =>
                    handlePixelTokenChange(index, e.target.value)
                  }
                />
                <MonsterPopover
                  placement="top"
                  title={
                    <div className="text-white font-bold text-sm p-[30px]">
                      Настройки событий в Facebook
                    </div>
                  }
                  trigger={["click"]}
                  content={
                    <div className="flex flex-col gap-10 gap-y-5 pb-[30px] px-[30px]">
                      <div className="flex justify-between items-center gap-10">
                        <div className="uppercase text-xs text-white">
                          Инсталл{" "}
                        </div>
                        <MonsterSelect
                          className="h-10 w-[350px]"
                          options={facebookEvents}
                          placeholder="Выберите событие"
                          value={getEventValue(
                            pixels,
                            index,
                            PwaEvents.Install
                          )}
                          onChange={(value) =>
                            handleEventChange(index, PwaEvents.Install, value)
                          }
                        />
                      </div>
                      <div className="flex justify-between items-center gap-10">
                        <div className="uppercase text-xs text-white">
                          Открытие{" "}
                        </div>
                        <MonsterSelect
                          className="h-10 w-[350px]"
                          options={facebookEvents}
                          placeholder="Выберите событие"
                          value={getEventValue(
                            pixels,
                            index,
                            PwaEvents.OpenPage
                          )}
                          onChange={(value) =>
                            handleEventChange(index, PwaEvents.OpenPage, value)
                          }
                        />
                      </div>
                      <div className="flex justify-between items-center gap-10">
                        <div className="uppercase text-xs text-white">
                          Регистрация{" "}
                        </div>
                        <MonsterSelect
                          className="h-10 w-[350px]"
                          options={facebookEvents}
                          placeholder="Выберите событие"
                          value={getEventValue(
                            pixels,
                            index,
                            PwaEvents.Registration
                          )}
                          onChange={(value) =>
                            handleEventChange(
                              index,
                              PwaEvents.Registration,
                              value
                            )
                          }
                        />
                      </div>
                      <div className="flex justify-between items-center gap-10">
                        <div className="uppercase text-xs text-white">
                          Депозит{" "}
                        </div>
                        <MonsterSelect
                          className="h-10 w-[350px]"
                          options={facebookEvents}
                          placeholder="Выберите событие"
                          value={getEventValue(
                            pixels,
                            index,
                            PwaEvents.Deposit
                          )}
                          onChange={(value) =>
                            handleEventChange(index, PwaEvents.Deposit, value)
                          }
                        />
                      </div>
                    </div>
                  }
                >
                  <button className="w-10 h-10 flex items-center justify-center bg-[#161724] rounded-lg hover:bg-[#383B66]">
                    <SettingsIcon />
                  </button>
                </MonsterPopover>
                <button
                  onClick={() => handleDeletePixel(index)}
                  className="w-10 bg-[#F56060] h-10 flex items-center justify-center rounded cursor-pointer hover:opacity-80 hover:shadow-sm"
                >
                  <DeleteOutlined
                    style={{ fontSize: "18px", color: "white" }}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={addPixel}
          className={`w-[250px] h-[43px] font-bold  rounded-lg ${
            pixels.length > 0
              ? "bg-[#383B66] text-white hover:bg-[#515ACA]"
              : "text-black bg-white hover:bg-slate-300"
          }`}
        >
          {pixels.length > 0 ? "+ добавить еще Pixel" : "+ add Pixel"}
        </button>
      </div>
      <div className="pb-[50px]">
        <ClassicButton onClick={handleContinue} text="Продолжить" />
      </div>
    </>
  );
};

export default AnalyticOption;

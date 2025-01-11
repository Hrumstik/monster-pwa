import { useEffect, useState } from "react";
import { PwaContentOptionProps } from "../DesignOption/DesignOption";
import MonsterSwitch from "@shared/elements/Switch/MonsterSwitch";
import { Form } from "antd";
import ClassicButton from "@shared/elements/ClassicButton/ClassibButton";
import MonsterInput from "@shared/elements/MonsterInput/MonsterInput";
import { requiredValidator } from "@shared/form/validators/validators";
import MonsterCheckbox from "@shared/elements/MonsterCheckbox/MonsterCheckbox";
import { EditorPWATabs, getTabIcon } from "../EditorPWAHelpers";
import { useGetPwaContentByIdQuery } from "@store/apis/pwaApi";
import { useParams } from "react-router-dom";
import { Pixel } from "@models/pwa";

const AnalyticOption: React.FC<PwaContentOptionProps> = ({
  setCurrentTab,
  steps,
  setSteps,
  setPwaContent,
  pwaContent,
}) => {
  const [showPixel, setShowPixel] = useState(false);
  const [form] = Form.useForm();
  const [events, setEvents] = useState<string[]>([]);
  const { id } = useParams();
  const { data: fetchedPwaContent } = useGetPwaContentByIdQuery(id!, {
    skip: !id,
  });

  const setValues = (pixelData: Pixel) => {
    setShowPixel(true);
    form.setFieldsValue({
      pixelId: pixelData.pixelId,
      token: pixelData.token,
    });
    setEvents(pixelData.events);
  };

  useEffect(() => {
    if (pwaContent?.pixel) {
      setValues(pwaContent.pixel);
    }
  }, [pwaContent, form]);

  useEffect(() => {
    if (fetchedPwaContent && fetchedPwaContent.pixel) {
      setValues(fetchedPwaContent.pixel);
    }
  }, [fetchedPwaContent]);

  const handleContinue = () => {
    form
      .validateFields()
      .then(() => {
        if (showPixel) {
          const pixel = {
            token: form.getFieldValue("token"),
            pixelId: form.getFieldValue("pixelId"),
            events,
          };

          setPwaContent({
            ...pwaContent!,
            pixel,
          });
        }

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
      })
      .catch(() => {});
  };

  const toggleEvent = (eventType: string) => {
    setEvents((prevEvents) =>
      prevEvents.includes(eventType)
        ? prevEvents.filter((event) => event !== eventType)
        : [...prevEvents, eventType]
    );
  };

  return (
    <>
      <div className="bg-cardColor rounded-lg px-[50px] py-[30px] flex-1 flex flex-col gap-[30px] mb-10">
        <div className="font-bold text-base leading-[18px] text-orangeSubtitle mb-4">
          Интеграция с Facebook
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-white font-medium">
            Использовать пиксель для интеграции с Facebook
          </p>
          <MonsterSwitch
            value={showPixel}
            onChange={() => setShowPixel(!showPixel)}
          />
        </div>
        {showPixel && (
          <>
            <Form form={form} className="w-full flex flex-col gap-[30px]">
              <div className="flex gap-1">
                <Form.Item
                  name="pixelId"
                  className="mb-0 flex-1"
                  rules={[requiredValidator("Пожалуйста, введите пиксель")]}
                >
                  <MonsterInput placeholder="Pixel ID" />
                </Form.Item>
                <Form.Item
                  name="token"
                  className="mb-0 flex-1"
                  rules={[requiredValidator("Пожалуйста, введите токен")]}
                >
                  <MonsterInput placeholder="Pixel Token" />
                </Form.Item>
              </div>
            </Form>
            <p className="text-sm text-white">
              Выберите, какие события должны передаваться в Facebook.
            </p>
            <div className="flex gap-2 items-center">
              <MonsterCheckbox
                checked={events.includes("ViewContent")}
                onChange={() => toggleEvent("ViewContent")}
              >
                {" "}
                <div className="text-white select-none text-sm">Инсталл</div>
              </MonsterCheckbox>
            </div>
            <div className="flex gap-2 items-center">
              <MonsterCheckbox
                checked={events.includes("Lead")}
                onChange={() => toggleEvent("Lead")}
              >
                <div className="select-none text-white text-sm">Открытие</div>
              </MonsterCheckbox>
            </div>
          </>
        )}
      </div>
      <ClassicButton onClick={handleContinue} text="Продолжить" />
    </>
  );
};

export default AnalyticOption;

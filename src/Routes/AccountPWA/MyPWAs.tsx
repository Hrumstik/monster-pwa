import { useEffect, useState } from "react";
import { getTabText, mokePWA_Data, MyPWAsTabs, PWAData } from "./MyPWAsHelpers";
import MonsterInput from "../../shared/elements/MonsterInput/MonsterInput";
import { SettingFilled, MoreOutlined } from "@ant-design/icons";
import moment from "moment";
import { MdOutlineRocketLaunch, MdOutlineEdit, MdDelete } from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import { VscPreview } from "react-icons/vsc";
import { BsGraphUpArrow } from "react-icons/bs";

import { Button } from "antd";
import MonsterDropdown from "../../shared/elements/Dropdown/Dropdown";
import { useNavigate } from "react-router-dom";

const MyPWAs = () => {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(MyPWAsTabs.All);
  const [availablePWAs, setAvailablePWAs] = useState(mokePWA_Data);

  useEffect(() => {
    switch (currentTab) {
      case MyPWAsTabs.All:
        setAvailablePWAs(mokePWA_Data);
        break;
      case MyPWAsTabs.Active:
        setAvailablePWAs(mokePWA_Data.filter((pwa) => pwa.status === "Active"));
        break;
      case MyPWAsTabs.Draft:
        setAvailablePWAs(mokePWA_Data.filter((pwa) => pwa.status === "Draft"));
        break;
      case MyPWAsTabs.Stopped:
        setAvailablePWAs(
          mokePWA_Data.filter((pwa) => pwa.status === "Stopped")
        );
        break;
      case MyPWAsTabs.CreatedAt:
        setAvailablePWAs(
          mokePWA_Data.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          )
        );
        break;
      case MyPWAsTabs.Status:
        setAvailablePWAs(
          mokePWA_Data.sort((a, b) => a.status.localeCompare(b.status))
        );
        break;
      default:
        setAvailablePWAs(mokePWA_Data);
        break;
    }
  }, [currentTab]);

  const generateDropDownItems = (pwa: PWAData) => {
    return [
      {
        label: <span className="text-xs text-white">Запустить</span>,
        key: "start",
        icon: <MdOutlineRocketLaunch style={{ color: "white" }} />,
      },
      {
        label: <span className="text-xs text-white">Редактировать</span>,
        key: "edit",
        icon: <MdOutlineEdit style={{ color: "white" }} />,
      },
      {
        label: <span className="text-xs text-white">Дублировать</span>,
        key: "copy",
        icon: <FiCopy style={{ color: "white" }} />,
        onClick: () => duplicatePWA(pwa),
      },
      {
        label: <span className="text-xs text-white">Предпросмотр</span>,
        key: "preview",
        icon: <VscPreview style={{ color: "white" }} />,
      },
      {
        label: <span className="text-xs text-white">Статистика</span>,
        key: "statistics",
        icon: <BsGraphUpArrow style={{ color: "white" }} />,
      },
      {
        label: <span className="text-xs text-red">Удалить</span>,
        key: "delete",
        icon: <MdDelete />,
        danger: true,
        onClick: () => deletePWA(pwa),
      },
    ];
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") setAvailablePWAs(mokePWA_Data);

    const filteredPWAs = mokePWA_Data.filter((pwa) =>
      pwa.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setAvailablePWAs(filteredPWAs);
  };

  const duplicatePWA = (pwaToDuplicate: PWAData) => {
    const newPWA = {
      ...pwaToDuplicate,
      name: `${pwaToDuplicate.name} (Копия)`,
    };
    setAvailablePWAs([...availablePWAs, newPWA]);
  };

  const deletePWA = (pwaToDelete: PWAData) => {
    const newPWAs = availablePWAs.filter(
      (pwa) => pwa.name !== pwaToDelete.name
    );
    setAvailablePWAs(newPWAs);
  };

  return (
    <div className="px-[50px] pt-[110px]">
      <div className="flex justify-between items-center mb-7">
        <span className="text-xl font-bold leading-8 text-white">Мои PWA</span>
        <span
          onClick={() => navigate("/create-PWA")}
          className="text-[#00FF11] hover:underline text-base font-normal cursor-pointer"
        >
          + Создать PWA
        </span>
      </div>
      <div className="rounded-lg w-full min-h-40 bg-[#20223B]">
        <div className="text-sm font-medium text-center text-white border-b border-[#161724]">
          <ul className="flex flex-wrap -mb-px px-7">
            {Object.values(MyPWAsTabs).map((tab) => (
              <li key={tab} className="me-12">
                <div
                  className={`cursor-pointer inline-block p-4 border-b-2 ${
                    tab === currentTab
                      ? "border-[#00FF11]"
                      : "border-transparent hover:border-[#515ACA]"
                  } rounded-t-lg`}
                  onClick={() => setCurrentTab(tab)}
                >
                  {getTabText(tab)}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3 flex justify-start">
          <MonsterInput
            onChange={(e) => handleSearch(e)}
            className="w-[338px] h-10"
            placeholder="Поиск по названию, id или домену "
          />
        </div>

        <table className="table-fixed bg-transparent border-collapse w-full">
          <thead>
            <tr>
              <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                Название
              </th>
              <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                Домен
              </th>
              <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                ГЕО
              </th>
              <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                Дата создания
              </th>
              <th className="bg-[#515ACA] text-left px-8 py-3 leading-5 text-base font-bold text-white">
                Статус
              </th>
              <th className="bg-[#515ACA] px-8 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {availablePWAs.map((pwa) => (
              <tr
                key={pwa.name}
                className="hover:bg-[#383B66] h-14 focus:bg-gray-300 w-full text-white cursor-pointer"
              >
                <td className="px-8 py-3">{pwa.name}</td>
                <td className="px-8 py-3">{pwa.domain}</td>
                <td className="px-8 py-3">{pwa.geo}</td>
                <td className="px-8 py-3">{moment().format("DD.MM.YYYY")}</td>
                <td className="px-8 py-3">{pwa.status}</td>
                <td className="px-8 py-3 flex gap-[10px]">
                  <Button
                    icon={
                      <SettingFilled
                        style={{ color: "white", fontSize: "15px" }}
                      />
                    }
                    className="bg-transparent border-none hover:!bg-[#5f6280]"
                  />
                  <MonsterDropdown
                    trigger={["click"]}
                    menu={{ items: generateDropDownItems(pwa) }}
                  >
                    <Button
                      icon={
                        <MoreOutlined
                          style={{ color: "white", fontSize: "15px" }}
                        />
                      }
                      className="bg-transparent border-none hover:!bg-[#5f6280]"
                    />
                  </MonsterDropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPWAs;

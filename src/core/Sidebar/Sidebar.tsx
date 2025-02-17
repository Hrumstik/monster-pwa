import { useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import DocumentationIcon from "@icons/Documentation";
import { IoLogoPwa, IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineAnalytics } from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="min-w-[250px] h-full bg-[#121320] pt-[70px] px-5">
      <div className="flex justify-center font-normal font-reemkufi text-[18px] text-[#00FF11] leading-[27px] mb-[107px]">
        Monster PWA
      </div>
      <div className="flex flex-col gap-2.5">
        <MenuItem
          text="Мои PWA"
          onClick={() => navigate("/")}
          path="/"
          defaultTextColor="white"
          icon={
            <IoLogoPwa
              color="white"
              style={{
                fontSize: "26px",
              }}
            />
          }
        />
        <MenuItem
          icon={
            <IoNotificationsSharp color="white" style={{ fontSize: "24px" }} />
          }
          text="Push уведомления"
          defaultTextColor="white"
          path="/push-dashboard"
          onClick={() => navigate("/push-dashboard")}
        />
        <MenuItem
          icon={
            <MdOutlineAnalytics color="white" style={{ fontSize: "28px" }} />
          }
          text="Аналитика"
          defaultTextColor="white"
          path="/analytics"
          onClick={() => navigate("/analytics")}
        />
        <MenuItem
          icon={<DocumentationIcon />}
          text="Документация"
          defaultTextColor="white"
          onClick={() =>
            window.open(
              "https://vibegamesteam.notion.site/PWA-Monster-506fc22fe0ec4b99a2cb47420a17e324",
              "_blank"
            )
          }
        />
      </div>
    </div>
  );
};

export default Sidebar;

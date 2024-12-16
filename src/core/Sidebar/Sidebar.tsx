import { useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import DocumentationIcon from "@icons/Documentation";
import { IoLogoPwa } from "react-icons/io5";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="min-w-[250px] h-full bg-[#121320] pt-[70px] px-5">
      <div className="flex justify-center font-normal font-reemkufi text-[18px] text-[#00FF11] leading-[27px] mb-[95px]">
        Monster PWA
      </div>
      <div className="flex flex-col gap-2.5">
        <MenuItem
          text="Мои PWA"
          onClick={() => navigate("/")}
          path="/"
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

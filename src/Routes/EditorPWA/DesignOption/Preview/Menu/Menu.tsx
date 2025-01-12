import AppsIcon from "@icons/AppsIcon";
import BooksIcon from "@icons/BooksIcon";
import GamesIcon from "@icons/GamesIcon";
import SearchIcon from "@icons/SearchIcon";

const PwaMenu = ({ dark }: { dark: boolean }) => {
  return (
    <div className="h-[70px] z-10 transition-all duration-200 absolute -bottom-3 left-0 w-full">
      <div
        style={dark ? { background: "#1e1f21" } : {}}
        className="h-[58px] bg-[#f0f3f8] px-6 py-1.5 flex gap-5"
      >
        <div className="flex-1 flex flex-col items-center">
          <GamesIcon dark={dark} />
          <div
            style={{ fontWeight: 600, color: dark ? "#DFDFDF" : "#605D64" }}
            className="font-medium text-xs"
          >
            Игры
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <AppsIcon dark={dark} />
          <div
            style={{ fontWeight: 600, color: dark ? "#A8C8FB" : "#056890" }}
            className="font-medium text-xs"
          >
            Приложения
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <SearchIcon dark={dark} />
          <div
            style={{ fontWeight: 600, color: dark ? "#DFDFDF" : "#605D64" }}
            className="font-medium text-xs"
          >
            Поиск
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <BooksIcon dark={dark} />
          <div
            style={{ fontWeight: 600, color: dark ? "#DFDFDF" : "#605D64" }}
            className="font-medium text-xs"
          >
            Книги
          </div>
        </div>
      </div>
    </div>
  );
};

export default PwaMenu;

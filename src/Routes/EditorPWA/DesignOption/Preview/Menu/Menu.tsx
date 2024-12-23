import AppsIcon from "@icons/AppsIcon";
import BooksIcon from "@icons/BooksIcon";
import GamesIcon from "@icons/GamesIcon";
import SearchIcon from "@icons/SearchIcon";

const PwaMenu = () => {
  return (
    <div className="h-[70px] z-10 transition-all duration-200 absolute -bottom-3 left-0 w-full">
      <div className="h-[58px] bg-[#f0f3f8] px-6 py-1.5 flex gap-5">
        <div className="flex-1 flex flex-col items-center">
          <GamesIcon />
          <div className="font-medium text-xs">Игры</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <AppsIcon />
          <div className="font-medium text-xs">Приложения</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <SearchIcon />
          <div className="font-medium text-xs">Поиск</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <BooksIcon />
          <div className="font-medium text-xs">Книги</div>
        </div>
      </div>
    </div>
  );
};

export default PwaMenu;

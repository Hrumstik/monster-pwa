import ArrowLeft from "@icons/ArrowLeft";
import { Dispatch, SetStateAction } from "react";
import { PwaViews } from "../models";

interface Props {
  setView: Dispatch<SetStateAction<PwaViews>>;
  developerName?: string;
  appName?: string;
  appIcon: string | null;
  dark: boolean;
}

const ViewHeader: React.FC<Props> = ({
  setView,
  developerName,
  appIcon,
  appName,
  dark,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setView(PwaViews.Main);
  };
  return (
    <div
      style={
        dark
          ? { background: "rgb(19, 19, 19)", borderBottom: "1px solid #434343" }
          : {}
      }
      className="h-[56px] gap-5 w-full items-center flex top-0 z-10 bg-white px-4 border-0 border-b border-solid border-[#C6C6C6]"
    >
      <button onClick={handleClick} className="flex items-center">
        <ArrowLeft dark={dark} />
      </button>
      {appIcon ? (
        <img
          className="h-[30px] w-[30px] rounded-lg object-cover aspect-square"
          src={appIcon}
          alt="Logo"
        />
      ) : (
        <div className="h-[30px] w-[30px] rounded-lg bg-[#727272]" />
      )}
      <div className="flex flex-col font-medium text-sm">
        <span
          style={dark ? { color: "#DFDFDF" } : {}}
          className="text-[#020202]"
        >
          {appName ?? "Plinko ASMR"}
        </span>
        <span
          style={dark ? { color: "rgb(168, 200, 251)" } : {}}
          className="text-primary"
        >
          {developerName ?? "Supercent, Inc."}
        </span>
      </div>
    </div>
  );
};

export default ViewHeader;

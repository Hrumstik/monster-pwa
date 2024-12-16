import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MenuItem = ({
  text,
  onClick,
  path,
  icon,
  defaultTextColor,
}: {
  text: string;
  onClick: () => void;
  path?: string;
  icon?: React.ReactNode;
  defaultTextColor?: string;
}) => {
  const location = useLocation();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname === path);
  }, [location.pathname, path]);

  return (
    <div
      onClick={onClick}
      className={`${
        isActive ? "bg-[#0d421d]" : ""
      } group hover:bg-[#20223B] h-[42px] rounded  cursor-pointer p-3 flex items-center justify-between`}
    >
      <div className="flex gap-[14px] h-full  items-center justify-between">
        {icon ?? (
          <div className="w-[10px] h-[10px] rounded-full bg-[#00FF11]" />
        )}

        <div
          className="text-base text-[#00FF11] group-hover:text-white leading-5"
          style={{ color: defaultTextColor ?? undefined }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;

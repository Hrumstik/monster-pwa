import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MenuItem = ({
  text,
  onClick,
  path,
  icon,
}: {
  text: string;
  onClick: () => void;
  path?: string;
  icon?: React.ReactNode;
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
      } group hover:bg-[#20223B] h-[42px] rounded flex items-center p-[14px] cursor-pointer gap-[14px]`}
    >
      {icon ?? <div className="w-[10px] h-[10px] rounded-full bg-[#00FF11]" />}
      <span className="text-base text-[#00FF11] group-hover:text-white leading-5">
        {text}
      </span>
    </div>
  );
};

export default MenuItem;

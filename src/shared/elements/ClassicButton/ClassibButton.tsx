import { MouseEventHandler } from "react";

interface ClassicButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  text: string;
  htmlType?: "button" | "submit" | "reset";
}

const ClassicButton: React.FC<ClassicButtonProps> = ({
  onClick,
  text,
  htmlType,
}) => {
  return (
    <button
      type={htmlType}
      onClick={(event) => {
        event.preventDefault();
        if (onClick) onClick(event);
      }}
      className="bg-white hover:bg-slate-300 text-[#121320] rounded-lg text-base py-3 px-[38px]
      transition duration-300 ease-in-out cursor-pointer active:scale-110"
    >
      {text}
    </button>
  );
};

export default ClassicButton;

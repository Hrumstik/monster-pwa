const IconButton = ({
  icon,
  text,
  onclick,
  disabled,
  customClass,
  textCustomClass,
}: {
  icon: React.ReactNode;
  text: string;
  onclick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  customClass?: string;
  textCustomClass?: string;
}) => {
  return (
    <button
      onClick={onclick}
      disabled={disabled}
      className={`flex items-center hover:bg-[#515ACA] bg-[#383B66] h-[42px] rounded-lg  p-[14px] gap-[14px] transition-all ease-in-out active:scale-110 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${customClass}`}
    >
      {icon}
      <span className={`text-base text-white leading-5 ${textCustomClass}`}>
        {text}
      </span>
    </button>
  );
};

export default IconButton;

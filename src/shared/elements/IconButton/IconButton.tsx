const IconButton = ({
  icon,
  text,
  onclick,
}: {
  icon: React.ReactNode;
  text: string;
  onclick: () => void;
}) => {
  return (
    <button
      onClick={onclick}
      className={`flex items-center  hover:bg-[#515ACA] bg-[#383B66] h-[42px] rounded-lg  p-[14px] cursor-pointer gap-[14px]`}
    >
      {icon}
      <span className="text-base text-white leading-5">{text}</span>
    </button>
  );
};

export default IconButton;

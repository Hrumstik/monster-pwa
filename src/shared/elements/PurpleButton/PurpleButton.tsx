import { Button, ButtonProps } from "antd";

const PurpleButton = ({
  text,
  ...rest
}: {
  text: string;
} & ButtonProps) => {
  return (
    <Button
      {...rest}
      className={`bg-[#515ACA] text-white border-none hover:!bg-[#9254de] hover:!text-white ${
        rest.className || ""
      }`}
    >
      {text}
    </Button>
  );
};

export default PurpleButton;

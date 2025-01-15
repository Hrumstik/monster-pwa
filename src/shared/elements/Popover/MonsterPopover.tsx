import React from "react";
import "./MonsterPopover.scss";
import { Popover, PopoverProps } from "antd";

const MonsterPopover: React.FC<PopoverProps> = ({ ...rest }) => {
  return <Popover rootClassName={"monster-popover"} {...rest} />;
};

export default MonsterPopover;

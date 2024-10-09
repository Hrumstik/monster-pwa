import React from "react";
import "./MonsterInput.scss";
import { Input, InputProps } from "antd";

const MonsterInput: React.FC<InputProps> = ({ ...rest }) => {
  return <Input rootClassName={"monster-input"} {...rest} />;
};

export default MonsterInput;

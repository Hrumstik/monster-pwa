import React from "react";
import "./MonsterRadio.scss";
import { Radio, RadioProps } from "antd";

const MonsterRadio: React.FC<RadioProps> = ({ ...rest }) => {
  return <Radio rootClassName={"monster-radio"} {...rest} />;
};

export default MonsterRadio;

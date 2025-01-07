import React from "react";
import "./MonsterCheckbox.scss";
import { Checkbox, CheckboxProps } from "antd";

const MonsterCheckbox: React.FC<CheckboxProps> = ({ ...rest }) => {
  return <Checkbox rootClassName={"monster-checkbox"} {...rest} />;
};

export default MonsterCheckbox;

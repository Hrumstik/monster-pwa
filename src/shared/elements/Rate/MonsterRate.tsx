import React from "react";
import "./MonsterRate.scss";
import { Rate, RateProps } from "antd";

const MonsterRate: React.FC<RateProps> = ({ ...rest }) => {
  return <Rate rootClassName={"monster-rate"} {...rest} />;
};

export default MonsterRate;

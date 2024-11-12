import React from "react";
import { Calendar, theme} from "antd";
import {Button} from "@fluentui/react-components"
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
  console.log(value.format("YYYY-MM-DD"), mode);
};

interface MyCalendarProps extends CalendarProps<Dayjs> {
  noSetDate?: (value: number) => void;
}

export const MyCalendar: React.FC<MyCalendarProps> = (props) => {
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    zIndex: 1000,
    backgroundColor: "rgba(255,255,255,1)"
  };
  const handleButtonClick = () => {
    if (props.noSetDate) {
      props.noSetDate(0);
    }
  };

  return (
    <div style={wrapperStyle}>
      <Button onClick={handleButtonClick}>不添加日期</Button>
      <Calendar {...props} fullscreen={false} onPanelChange={onPanelChange} />
    </div>
  );
};
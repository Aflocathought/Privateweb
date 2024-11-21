import { useEffect, useState } from "react";
import "../App.css";
import { TimeRenderer } from "./TimeRenderer";
import { TimeProps } from "./TimeRenderer";
export const Time = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString().slice(0, 5));
  const [day, setDay] = useState(new Date().toLocaleDateString());
  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const [dayOfWeek, setDayOfWeek] = useState(daysOfWeek[new Date().getDay()]);

  const [exportTime, setExportTime] = useState<TimeProps>({
    time: time,
    day: day,
    dayOfWeek: dayOfWeek,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString().slice(0, 5));
      setDay(now.toLocaleDateString());
      setDayOfWeek(daysOfWeek[now.getDay()]);
      setExportTime({
        time: now.toLocaleTimeString().slice(0, 5),
        day: now.toLocaleDateString(),
        dayOfWeek: daysOfWeek[now.getDay()],
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, [time, day, dayOfWeek]);

  return <TimeRenderer {...exportTime} />;
};

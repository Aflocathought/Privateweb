import { useEffect, useState } from "react";
import "../App.css";
import { TimeRenderer } from "./TimeRenderer";
import { TimeProps } from "./TimeRenderer";
export const Time = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString().slice(0, 5));
  const [day, _] = useState(new Date().toLocaleDateString());
  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const date = new Date();
  const dayOfWeek = daysOfWeek[date.getDay()];
  const [seconds, setSeconds] = useState(new Date().getSeconds());
  const [milliseconds, setMilliseconds] = useState(
    new Date().getMilliseconds()
  );
  const strokeDashoffset =
    ((60 - seconds - milliseconds / 1000) / 60) * 2 * Math.PI * 45;

  const [exportTime, setExportTime] = useState<TimeProps>({
    time: time,
    day: day,
    dayOfWeek: dayOfWeek,
    strokeDashoffset: strokeDashoffset,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString().slice(0, 5));
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(new Date().getSeconds());
      setMilliseconds(new Date().getMilliseconds());
      setExportTime({
        time: time,
        day: day,
        dayOfWeek: dayOfWeek,
        strokeDashoffset: strokeDashoffset,
      });
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [time, day, dayOfWeek, strokeDashoffset]);

  return (
    <>
      <TimeRenderer {...exportTime} />
    </>
  );
};

export default Time;

import { useEffect, useState } from "react";
export interface TimeProps {
  time: string;
  day: string;
  dayOfWeek: string;
}

export const TimeRenderer = (props: TimeProps) => {
  const { time, day, dayOfWeek } = props;
  const [seconds, setSeconds] = useState(new Date().getSeconds());
  const [milliseconds, setMilliseconds] = useState(
    new Date().getMilliseconds()
  );
  const strokeDashoffset =
    (60 - seconds - milliseconds / 1000) * 4.71238898038469;
  /* 因为strokedashoffset更新频繁所以逻辑还是放在这里，避免组件之间的频繁收发 */
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(new Date().getSeconds());
      setMilliseconds(new Date().getMilliseconds());
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [time, day, dayOfWeek, strokeDashoffset]);

  return (
    <>
      {/* 时间 */}
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          fontSize: "220px",
          textShadow: "0 0 10px rgba(0,0,0,0.5)",
          color: "white",
          userSelect: "none",
        }}
      >
        {time}
      </div>
      <div
        style={{
          fontSize: "45px",
          marginTop: "300px",
          textShadow: "0 0 10px rgba(0,0,0,0.5)",
          color: "white",
          userSelect: "none",
        }}
      >
        {day} {dayOfWeek}
      </div>
      <svg
        style={{
          position: "absolute",
          zIndex: 0,
        }}
        width="500"
        height="500"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="10"
          fill="none"
          strokeDasharray={2 * Math.PI * 45}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          // style={{ animation: `${animationName} 1s linear infinite` }}
        />
      </svg>
      {/* 时间 */}
    </>
  );
};

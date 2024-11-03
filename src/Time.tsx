import { useEffect, useState } from "react";
import "./App.css";

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
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const interval2 = setInterval(() => {
  //     let newseconds = new Date().getSeconds();
  //     if (newseconds === 59) {
  //       setAnimationName("hide-head");
  //     } else {
  //       setAnimationName("");
  //     }
  //   }, 100);
  // }, []);

  const strokeDashoffset =
    ((60 - seconds - milliseconds / 1000) / 60) * 2 * Math.PI * 45;

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

export default Time;

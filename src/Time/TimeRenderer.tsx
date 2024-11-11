export interface TimeProps {
  time: string;
  day: string;
  dayOfWeek: string;
  strokeDashoffset: number;
}
export const TimeRenderer = (props: TimeProps) => {
  const { time, day, dayOfWeek, strokeDashoffset } = props;
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

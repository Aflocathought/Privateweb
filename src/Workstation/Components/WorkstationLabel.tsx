interface WorkstationLabelProps {

}

export const WorkstationLabel: React.FC<WorkstationLabelProps> = ({}) => {
  const [hover1, setHover1] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
    <div
      className="fixed w-auto"
      style={{
        height: hover1 ? "100px" : "75px",
        borderRadius: "15px",
        textAlign: "center",
        bottom: -35,
        cursor: "pointer",
        padding: "10px 0",
        backgroundColor: "rgba(255, 255, 255,0.5)",
        opacity: isOpen || !isVisible ? 0 : 1, // 抽屉展开时隐藏
        transition: "opacity 0.3s ease-in-out,height 0.3s ease-in-out", // 平滑过渡效果
        backdropFilter: "blur(2px)",
      }}
      onClick={() => setIsOpen(!isOpen)}
      onMouseEnter={() => {
        setHover1(true);
      }}
      onMouseLeave={() => {
        setHover1(false);
      }}
    >
      <p className="ml-2 mr-2 mt-0.5" style={{ color: "rgba(99,99,99,1)" }}>
        {"点击展开工作区域"}
      </p>
    </div>
  </div>
  );
};

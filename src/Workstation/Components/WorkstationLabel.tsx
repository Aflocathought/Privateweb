import { Mouse } from "../../Mouse/Mouse";
import { useState } from "react";

interface WorkstationLabelProps {
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const WorkstationLabel: React.FC<WorkstationLabelProps> = ({
  isOpen,
  setIsOpen,
  id,
}) => {
  const [hover, setHover] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div id={id} style={{ display: "flex", justifyContent: "center" }}>
      <div
        className={`fixed w-auto  -bottom-[35px] rounded-[15px] text-center`}
        style={{
          height: hover ? "100px" : "75px",
          cursor: "pointer",
          padding: "10px 0",
          backgroundColor: "rgba(255, 255, 255,0.5)",
          opacity: isOpen || !isVisible ? 0 : 1, // 抽屉展开时隐藏
          transition: "opacity 0.3s ease-in-out,height 0.3s ease-in-out", // 平滑过渡效果
          backdropFilter: "blur(2px)",
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        <p className="ml-2 mr-2 mt-0.5 text-[#636363]">点击展开工作区域</p>
      </div>
      <Mouse setIsVisible={setIsVisible} />
    </div>
  );
};

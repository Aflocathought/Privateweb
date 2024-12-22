import { useEffect, useState } from "react";
import "../App.css";
import { Mouse } from "../Mouse/Mouse";
import { WorkstationContainer } from "./WorkstationContainer";

interface properties {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export const Workstation: React.FC<properties> = ({ isOpen, setIsOpen }) => {
  const [_, setProperties] = useState<properties[]>([]); // 保存workstation的状态
  useEffect(() => {
    const storedProperties = localStorage.getItem("properties");
    if (storedProperties) {
      setProperties(JSON.parse(storedProperties));
    }
  }, []);
  const [hover, setHover] = useState(false);

  const [isVisible, setIsVisible] = useState(true);

  return (
    <div
      className="flex flex-col fixed bottom-0 left-0"
      style={{
        marginLeft: "1%",
        width: "98%",
        marginBottom: "-1%",
        borderRadius: "15px",
        zIndex: isOpen ? 10 : 5,
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div
        className=""
        style={{
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255,1)",
          borderTop: "1px solid #ccc",
          transform: isOpen ? "translateY(0%)" : "translateY(100%)", // 初始状态显示为底部的一个条
          transition: "transform 0.3s ease-in-out",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div
          className="absolute left-0 right-0 bottom-2.5"
          style={{
            // 定位到顶部 定位到左侧 右侧设置为0，与左侧配合，实现宽度100%
            height: "50px", // 高度可以根据需要调整
            background:
              "linear-gradient(rgba(255,255,255,0), rgba(150,150,150,0.5))", // 渐变灰色背景
            color: "black", // 文字颜色
            justifyContent: "center", // 水平居中
            alignItems: "center", // 垂直居中
            opacity: hover ? 1 : 0, // 默认完全透明
            display: isOpen ? "flex" : "none", // 当抽屉展开时显示内容
            transition: "opacity 0.5s ease", // 平滑过渡效果
            zIndex: isOpen ? 1145141 : 0, // 置于最上层
          }}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
          onClick={() => setIsOpen(false)}
        >
          点击收起
        </div>
        <div
          style={{
            display: "block",
            height: "100vh", // 占满全屏
            width: "100%",
            maxWidth: "100%",
            overflowY: "auto", // 内容超出时可以滚动
          }}
        >
          <WorkstationContainer />
        </div>
      </div>
      <Mouse setIsVisible={setIsVisible} />
    </div>
  );
};

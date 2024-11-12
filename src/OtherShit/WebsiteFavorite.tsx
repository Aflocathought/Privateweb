import { useState } from "react";
import Mouse from "./Mouse/Mouse";

export const WebsiteFavorite = () => {
  const [hover1, setHover1] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  class Website {
    constructor(public name: string, public url: string) {}
  }

  class Folder {
    constructor(public name: string, public websites: Website[]) {
      this.websites = [];
      this.name = name;
      
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        bottom: 0,
        left: 0,
        marginLeft: "1%",
        width: "98%",
        marginBottom: "-1%",
        borderRadius: "15px",
        position: "fixed",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="fixed"
          style={{
            width: "auto",
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
            zIndex: 114514,
          }}
          onClick={toggleDrawer}
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
      <div
        className=""
        style={{
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255,1)",
          borderTop: "1px solid #ccc",
          transform: isOpen ? "translateY(0%)" : "translateY(100%)", // 初始状态显示为底部的一个条
          transition: "transform 0.3s ease-in-out",
          zIndex: 114516,
        }}
      >
        <div
          className="absolute"
          style={{
            bottom: 10, // 定位到顶部
            left: 0, // 定位到左侧
            right: 0, // 右侧设置为0，与左侧配合，实现宽度100%
            height: "50px", // 高度可以根据需要调整
            background:
              "linear-gradient(rgba(255,255,255,0), rgba(150,150,150,0.5))", // 渐变灰色背景
            color: "black", // 文字颜色
            justifyContent: "center", // 水平居中
            alignItems: "center", // 垂直居中
            opacity: hover1 ? 1 : 0, // 默认完全透明
            display: isOpen ? "flex" : "none", // 当抽屉展开时显示内容
            transition: "opacity 0.5s ease", // 平滑过渡效果
            zIndex: 114515,
          }}
          onMouseEnter={() => {
            setHover1(true);
          }}
          onMouseLeave={() => {
            setHover1(false);
          }}
          onClick={toggleDrawer}
        >
          点击收起
        </div>
        <div
          style={{
            display: isOpen ? "block" : "none", // 当抽屉展开时显示内容
            height: "100vh", // 占满全屏
            overflowY: "auto", // 内容超出时可以滚动
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "98%",
            }}
          >
            <div
              style={{
                borderRadius: "15px",
                width: "70px", // 根据需要调整宽度
                backgroundColor: "#f0f0f0", // 背景颜色，根据需要调整
                padding: "10px", // 内边距，根据需要调整
                boxSizing: "border-box",
              }}
            ></div>
          </div>
        </div>
        <Mouse setIsVisible={setIsVisible} />
      </div>
    </div>
  );
};

export default WebsiteFavorite;

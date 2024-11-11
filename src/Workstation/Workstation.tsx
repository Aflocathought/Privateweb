import { useEffect, useState, useRef } from "react";
import "../App.css";
import { Divider } from "@fluentui/react-components";

import { WeatherChart } from "../Weather/Weather";
import { Classtable } from "../Classtable";
import { Todo } from "../Todo/TodoUpdate copy";
import { Mouse } from "../Mouse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faCloudSunRain,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";

interface properties {
  selectPage: string;
}
export const Workstation = () => {
  const [_, setProperties] = useState<properties[]>([]); // 保存workstation的状态
  useEffect(() => {
    const storedProperties = localStorage.getItem("properties");
    if (storedProperties) {
      setProperties(JSON.parse(storedProperties));
    }
  }, []);
  // 抽屉是否展开的状态
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [hover1, setHover1] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const hasInitialized = useRef(false);
  // 控制抽屉展开或收起的函数
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  const functions = ["Todo", "Classtable", "WeatherChart"];
  const icons = [faList, faTableList, faCloudSunRain];

  const [windowList, setWindowList] = useState<string[]>([]);
  const componentMap: { [key: string]: React.ComponentType } = {
    Classtable: Classtable,
    Todo: Todo,
    WeatherChart: WeatherChart,
    Divider: () => <Divider vertical />,
  };
  function setFuncOpen(func: string) {
    if (windowList.includes(func)) {
      setWindowList(windowList.filter((item) => item !== func));
    } else {
      setWindowList([...windowList, func]);
    }
  }
  function setFuncSolo(func: string) {
    setWindowList([func]);
  }
  useEffect(() => {
    if (!hasInitialized.current) {
      setWindowList([
        "Todo",
      ]);
      hasInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    let parentElement = document.getElementById("container");
    for (let i = 0; i < windowList.length; i++) {
      parentElement?.appendChild(document.createElement(windowList[i]));
      if (i < windowList.length - 1) {
        parentElement?.appendChild(document.createElement("Divider"));
      }
    }
  }, [windowList]);

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
        zIndex: isOpen ? 10 : 5,
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
            opacity: hover ? 1 : 0, // 默认完全透明
            display: isOpen ? "flex" : "none", // 当抽屉展开时显示内容
            transition: "opacity 0.5s ease", // 平滑过渡效果
            zIndex: 15, // 置于最上层
          }}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
          onClick={toggleDrawer}
        >
          点击收起
        </div>
        <div
          style={{
            display: "block", // 当抽屉展开时显示内容
            height: "100vh", // 占满全屏
            overflowY: "auto", // 内容超出时可以滚动
            pointerEvents: isOpen ? "auto" : "none",
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
            >
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "20px",
                  padding: "0",
                  fontWeight: "bold",
                  width: "50px",
                }}
              >
                {functions.map((func, index) => (
                  <div key={index} className="flex items-center -mt-1">
                    <FontAwesomeIcon
                      icon={icons[index]}
                      style={{
                        width: "30px",
                        height: "30px",
                        margin: "10px",
                      }}
                      onClick={() => {
                        setFuncOpen(func);
                      }}
                      onContextMenu={(e) => {
                        // 使用 onContextMenu 处理右键点击事件
                        e.preventDefault(); // 阻止默认的右键菜单
                        setFuncSolo(func);
                      }}
                    />
                  </div>
                ))}
              </ul>
            </div>
            {/* 抽屉内容 */}
            <div id="container" style={{ display: "flex" }}>
              {windowList.map((componentName, index) => {
                const Component = componentMap[componentName];
                return Component ? <Component key={index} /> : null;
              })}
            </div>
            {/* 抽屉内容 */}
          </div>
        </div>
      </div>
      <Mouse setIsVisible={setIsVisible} />
    </div>
  );
};
export default Workstation;

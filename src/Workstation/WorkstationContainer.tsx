import { Divider } from "@fluentui/react-components";
// import { WeatherChart } from "../Weather/Weather";
import { Classtable } from "../Classtable/Classtable";
import { Todo } from "../Todo/TodoUpdate copy";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faCloudSunRain,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";

export const WorkstationContainer: React.FC = () => {
  const hasInitialized = useRef(false);
  const componentMap: { [key: string]: React.ComponentType } = {
    Classtable: Classtable,
    Todo: Todo,
    // WeatherChart: WeatherChart,
    Divider: () => <Divider vertical />,
  };

  const functions = ["Todo", "Classtable", "WeatherChart"];
  const icons = [faList, faTableList, faCloudSunRain];

  const [windowList, setWindowList] = useState<string[]>([]);

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
      setWindowList(["Todo"]);
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
        flexDirection: "row",
        height: "auto",
        minHeight: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          borderRadius: "15px",
          width: "70px", // 根据需要调整宽度
          backgroundColor: "#f0f0f0", // 背景颜色，根据需要调整
          padding: "10px", // 内边距，根据需要调整
          boxSizing: "border-box",
          height: "100vh",
          position: "fixed",
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
            <div key={index} className="flex items-center -mt-1 ">
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
      <div id="ws_container" style={{ display: "flex",marginLeft:"70px" }}>
        {windowList.map((componentName, index) => {
          const Component = componentMap[componentName];
          return Component ? <Component key={index} /> : null;
        })}
      </div>
      {/* 抽屉内容 */}
    </div>
  );
};

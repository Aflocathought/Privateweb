import { Divider } from "@fluentui/react-components";
import { WeatherChart } from "../Weather/Weather";
import { Classtable } from "../Classtable/Classtable";
import { Todo } from "../Todo/TodoUpdate";
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
    WeatherChart: WeatherChart,
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
    <div className="flex flex-row h-[auto] min-h-[100%] max-w-[100%]">
      <div
        className="w-[70px] bg-[#f0f0f0] p-2.5 h-[100vh] fixed z-[114519] rounded-[15px]"
        style={{
          boxSizing: "border-box",
        }}
      >
        <div
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
        </div>
      </div>
      {/* 抽屉内容 */}
      <div id="ws_container" className="flex ml-[70px] max-w-[95%] ">
        {windowList.map((componentName, index) => {
          const Component = componentMap[componentName];
          return Component ? <Component key={index} /> : null;
        })}
      </div>
      {/* 抽屉内容 */}
    </div>
  );
};

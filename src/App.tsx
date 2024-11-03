import { useState } from "react";
import "./App.css";
import { TextareaProps } from "@fluentui/react-components";

import { Time } from "./Time";
import { Workstation } from "./Workstation";
import { EverydayPic } from "./EverydayPic";
import { WebsiteFavorite } from "./WebsiteFavorite";
import { DraggableList } from "./DraggableList";

declare global {
  interface Window {
    shitting: (shit: any) => void;
  }
}
let shitcount = 0;
window.shitting = function (shit: any) {
  if (shit === undefined || shit === null) {
    shitcount += 1;
    if (shitcount > 1000) {
      return `你是不是有啊😡`;
    } else {
      return `拉了${shitcount}坨😊`;
    }
  } else if (typeof shit !== "number") {
    if (shit === "冲马桶") {
      shitcount = 0;
      return "轰隆隆……哗……";
    } else if (shit === "看马桶") {
      return `马桶现在有${shitcount}坨屎😊`;
    }
    return `你不可以拉${shit}这样的屎😡😡`;
  } else if (typeof shit === "number") {
    if (shit < 0) {
      return `你把${shit * -1}坨屎吸回去拉？😡😡`;
    } else if (shit == 0) {
      return "你不拉是吧。😡";
    } else if (!Number.isInteger(shit)) {
      return `${shit}坨屎是多少🤔`;
    }
    shitcount += shit;
    if (shitcount > 1000) {
      return `你是不是有大便超人血统啊😡`;
    } else {
      return `拉了${shitcount}坨😊`;
    }
  }
};

export const Default = (props: Partial<TextareaProps>) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viewPhoto, setViewPhoto] = useState<boolean>(false);

  return (
    <>
      <div id="fullpage">
        {/* 页面一 */}
        <div id="section1" className="section">
          <div
            style={{
              display: "flex",
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              minHeight: "100vh",
              maxHeight: "100vh",
              height: "auto",
              minWidth: "100vw",
              width: "auto",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                opacity: viewPhoto ? 0 : 1,
              }}
            >
              <Workstation />
            </div>
            {/* 时间 */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                opacity: viewPhoto ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <Time />
            </div>
            {/* 时间 */}
            <EverydayPic setUrl={setImageUrl} onlyViewPhoto={setViewPhoto} />
            {/* <div className="flex flex-col justify-center">
              <WebsiteFavorite />
            </div> */}
            <div className="z-10">{/* <DraggableList /> */}</div>
          </div>
        </div>
      </div>
    </>
  );
};
function App() {
  return <Default />;
}

export default App;

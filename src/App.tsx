import "./App.css";
import { AppRenderer } from "./AppRenderer";

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

export const App = () => {
  return <AppRenderer />;
};

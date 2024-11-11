import { useState } from "react";
import "./App.css";


import { Time } from "./Time/Time";
import { Workstation } from "./Workstation/Workstation";
import { EverydayPic } from "./EverydayPic";

interface AppProps {}
export const AppRenderer = (props?: AppProps) => {
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

import { useState } from "react";
import "./App.css";

import { Time } from "./Time/Time";
import { Workstation } from "./Workstation/Workstation";
import { EverydayPic } from "./BackgroundPic/BackgroundPic";
import { Panel } from "./Panel/Panel";
import { Setting } from "./Setting/Setting";
import { WorkstationLabel } from "./Workstation/Components/WorkstationLabel";

interface AppProps {}
export const AppRenderer = (props?: AppProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viewPhoto, setViewPhoto] = useState<boolean>(false);
  const [isOpenWorkstation, setIsOpenWorkstation] = useState<boolean>(false);

  return (
    <>
      <div id="fullpage">
        {/* 页面一 */}
        <div id="section1" className="section">
          <div
            className="flex min-h-[100vh] h-[auto] max-h-[100vh] w-[auto] min-w-[100vw] relative"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
            }}
          >
            <div
              className={`absolute w-[100%] flex justify-center opacity-${
                viewPhoto ? 0 : 100
              }`}
            >
              <Workstation
                isOpen={isOpenWorkstation}
                setIsOpen={setIsOpenWorkstation}
              />
              <WorkstationLabel
                id="workstationLabel"
                isOpen={isOpenWorkstation}
                setIsOpen={setIsOpenWorkstation}
              />
            </div>

            <div
              className={`flex flex-col justify-center items-center w-[100%] opacity-${
                viewPhoto ? 0 : 100
              }`}
              style={{
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <Time />
              <Panel />
            </div>
            <div className="flex fixed m-4 justify-between">
              <EverydayPic setUrl={setImageUrl} onlyViewPhoto={setViewPhoto} />
              {/* <Setting /> */}
            </div>
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

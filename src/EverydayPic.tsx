import { useState, useEffect } from "react";
import {
  faPhotoFilm,
  faRefresh,
  faAsterisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Mouse from "./Mouse";
import "./index.css";

interface EverydayPicProps {
  setUrl: (url: string) => void;
  onlyViewPhoto: (onlyViewPhoto: boolean) => void;
}

interface properties {
  SourceUse: string;
}

interface Source {
  source: string;
  source_title: string;
  refreshable?: boolean;
}

export const EverydayPic: React.FC<EverydayPicProps> = ({
  setUrl,
  onlyViewPhoto,
}) => {
  // #region non-return
  const [_, setProperties] = useState<properties[]>([]);
  const [__, setBgSrc] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [allSources, ___] = useState<Source[]>([
    { source: "bing", source_title: "必应每日图片" },
    {
      source: "animation",
      source_title: "动漫（可能含有NSFW内容）",
      refreshable: true,
    },
    { source: "scenery_yuanfang", source_title: "远方图床", refreshable: true },
  ]);
  const [sourceInfo, setSourceInfo] = useState("");
  const [rotate, setRotate] = useState(true);
  const [viewPhoto, setViewPhoto] = useState(false);

  const [source, setSource] = useState<string>("");
  // 第一个 useEffect：组件挂载时从 localStorage 加载数据
  // 第一个 useEffect：组件挂载时从 localStorage 加载数据
  useEffect(() => {
    const storedProperties = localStorage.getItem("properties");
    if (storedProperties) {
      const parsedProperties = JSON.parse(storedProperties);
      setProperties(parsedProperties);
      setSource(parsedProperties[0]?.SourceUse || "bing");
    } else {
      setSource("bing");
    }
  }, []);

  // 第二个 useEffect：监听 source 变化并更新 localStorage
  useEffect(() => {
    if (source) {
      const newProperties = [{ SourceUse: source }];
      setProperties(newProperties);
      localStorage.setItem("properties", JSON.stringify(newProperties));
    }
  }, [source]);

  // const addSource = (source_: string, source_title_: string) => {
  //   setAllSources((prevSources) => [
  //     ...prevSources,
  //     { source: source_, source_title: source_title_ },
  //   ]);
  // };
  // 随机背景
  useEffect(() => {
    const imageGallery = [
      "56896419_p0.jpg",
      "57833748_p0.jpg",
      "61048675_p0.jpg",
      "61048675_p2.jpg",
      "90194174_p0.jpg",
      "95890188_p0.png",
      "96286231_p0.jpg",
      "93986819_p0.jpg",
      "Fv4_pVkXoAY4nPN.jpg",
      "GHzjuuhaEAA-d8H.jpg",
      "GCua3UGaIAA6FpU.jpg",
      "116444861_p0.png",
      "13461444_p0.png",
    ];
    let randomIndex = Math.floor(Math.random() * imageGallery.length);
    const randomImage = imageGallery[randomIndex];
    setBgSrc(randomImage);
  }, []);

  const refreshSource = (source: string) => {
    setSource("");
    setTimeout(() => setSource(source), 0);
  };

  useEffect(() => {
    if (source === "") {
      setUrl("");
      setSourceInfo("刷新中……");
    } else if (source === "animation") {
      setUrl("https://t.alcy.cc/ycy");
      setSourceInfo("动漫图片");
    } else if (source === "scenery_yuanfang") {
      setUrl("https://tu.ltyuanfang.cn/api/fengjing.php");
      setSourceInfo("远方图床");
    } else {
      fetch(`http://localhost:3000/api/v1/images/${source}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          if (
            data &&
            data.images &&
            data.images.length > 0 &&
            source === "bing"
          ) {
            const url = "https://cn.bing.com" + data.images[0].url;
            setUrl(url); // 设置图片 URL
            setSourceInfo(
              data.images[0].title +
                "\n" +
                data.images[0].copyright.split("(")[0] +
                "\n(" +
                data.images[0].copyright.split("(")[1]
            );
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, [source]);
  // #endregion
  return (
    <div
      className="flex fixed m-4"
      style={{
        opacity: !open && !isVisible ? 0 : 1,
        transition: "opacity 0.3s ease-in-out",
        zIndex: 6,
      }}
    >
      <div
        className="flex fixed rounded-2xl items-center justify-center min-w-14 h-14"
        style={{
          backgroundColor: "rgba(255,255,255,0.3)",
          backdropFilter: "blur(2px)",
        }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <FontAwesomeIcon
          icon={faPhotoFilm}
          style={{
            color: "rgba(255,255,255,0.7)",
            width: "30px",
            height: "30px",
          }}
        />
        <Mouse setIsVisible={setIsVisible} />
      </div>
      <div
        className="flex relative left-0 top-14 rounded-2xl bg-white flex-col w-auto"
        style={{
          backgroundColor: "rgba(255,255,255,0.3)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          backdropFilter: "blur(2px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="flex">
          <div className="ml-4 mt-2 mb-2 mr-4">
            <p>{`当前源：${source}`}</p>
            <p style={{ whiteSpace: "pre-line" }}>{sourceInfo}</p>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onlyViewPhoto(!viewPhoto);
              if (!viewPhoto === true) {
                setOpen(false);
              }
              setViewPhoto(!viewPhoto);
            }}
          >
            <FontAwesomeIcon
              className="flex mt-4 h-6 w-6 mr-4"
              icon={faAsterisk}
              title="只看背景"
            />
          </div>
        </div>
        <p className="ml-4 mt-2">{`选择源：`}</p>
        {allSources.map((source) => (
          <div
            className="flex justify-between min-w-36 w-auto pick ml-2 mr-2 h-8 items-center rounded-2xl "
            onClick={() => {
              setSource(source.source);
            }}
          >
            <p className="flex ml-2">{source.source_title}</p>
            {source.refreshable && (
              <div
                className="z-10"
                onClick={(e) => {
                  e.stopPropagation(); // 防止触发父 div 的 onClick 事件
                  refreshSource(source.source);
                  setRotate(!rotate);
                }}
              >
                <FontAwesomeIcon
                  className="flex h-6 w-6 mr-2"
                  icon={faRefresh}
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    transform: rotate ? "rotate(360deg)" : "rotate(0deg)",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EverydayPic;

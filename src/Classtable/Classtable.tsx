import React, { SetStateAction, useContext, useEffect, useState } from "react";
import "../App.css";
import { Button, Divider } from "@fluentui/react-components";
import { ArrowLeft24Filled, ArrowRight24Filled } from "@fluentui/react-icons";
import * as XLSX from "xlsx";
// @ts-ignore
import converter from "number-to-chinese-words";

const TableDataContext = React.createContext<any[]>([]);

export const Classtable = () => {
  const startDate = new Date("2024-08-25").getTime();
  const [_, setTime] = useState(new Date().toLocaleTimeString().slice(0, 5));

  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const date = new Date();
  const dayOfWeek = daysOfWeek[date.getDay()];

  const [week, setWeek] = useState(1);
  const [curWeek, setCurWeek] = useState(1);
  const [curDay, setCurDay] = useState<any[]>([]);

  const [tableData, setTableData] = useState<any[]>([]);
  const [colordict1, setColordict1] = useState<any>({});

  function calculateDays() {
    const endDate = new Date().getTime();
    const diffTime = Math.abs(endDate - startDate);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  }

  // 应用计算周数
  useEffect(() => {
    setWeek(calculateDays());
    setCurWeek(calculateDays());
  }, []);

  // 课表每周对应日期
  useEffect(() => {
    let newCurDay: SetStateAction<any[]> = [];
    let curDayResult: SetStateAction<any[]> = [];
    for (let i = 0; i < 5; i++) {
      const timestamp =
        startDate +
        (week - 1) * 7 * 24 * 60 * 60 * 1000 +
        i * 24 * 60 * 60 * 1000 +
        86400000;
      const nday = new Date(timestamp).toLocaleDateString().slice(5, 10);
      newCurDay = [...newCurDay, nday];
    }

    for (let item in newCurDay) {
      curDayResult.push(item.split("/"));
    }

    setCurDay(newCurDay);
  }, [week]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString().slice(0, 5));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function prevWeek() {
    setWeek((week) => Math.max(1, week - 1));
  }

  function nextWeek() {
    setWeek((week) => week + 1);
  }

  function turnBackWeek() {
    setWeek(curWeek);
  }

  // 处理课表
  useEffect(() => {
    fetch("/1.xls")
      .then((response) => response.arrayBuffer())
      // 基本处理
      .then((data) => {
        const classinfo: any[] = [];
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        let classdata = workbook.Sheets[workbook.SheetNames[0]];

        for (let key in classdata) {
          if (key[0] === "A" || key[1] === "3") {
            continue;
          }
          let info = classdata[key].v;
          if (info != " " && info != undefined) {
            info = info.split("\n");
            // console.log(info);
            if (info.length > 7) {
              let info1 = info.slice(6);
              info[0] = key.toString();
              info = info.slice(0, 7);
              info1[0] = key.toString();
              classinfo.push(info);
              classinfo.push(info1);
            } else if (info.length > 1) {
              info[0] = key.toString();
              if (info.length == 6) {
                info.splice(2, 0, "");
              }
              classinfo.push(info);
            }
          }
        }
        // console.log(classinfo);
        let colorlist = [
          "#1d4c50",
          "#d4a278",
          "#3f605b",
          "#47a459",
          "#065279",
          "#f47983",
          "#bce672",
          "#ffa631",
          "#1685a9",
          "#a1afc9",
          "#2e4e7e",
          "#d6ecf0",
          "#a3b9c1",
          "#ff4e20",
          "#006187",
          "#00afb9",
          "#eec9a7",
          "#f07167",
          "#db5e51",
          "#1ba784",
          "#9ad7c3",
          "#68a182",
          "#2edfa3",
          "#ffb61e",
          "#f05654",
          "#a4e2c6",
          "#6b6882",
        ];
        // let colorlist1 = [
        //   "#f87171",
        //   "#fb923c",
        //   "#fbbf24",
        //   "#facc15",
        //   "#a3e635",
        //   "#4ade80",
        //   "#34d399",
        //   "#2dd4bf",
        //   "#38bdf8",
        //   "#60a5fa",
        //   "#818cf8",
        //   "#a78bfa",
        //   "#c084fc",
        //   "#e879f9",
        //   "#f472b6",
        //   "#fb7185",
        //   "#4b5563",
        //   "#dc2626",
        //   "#ea580c",
        //   "#65a30d",
        //   "#16a34a",
        //   "#059669",
        //   "#0d9488",
        //   "#0891b2",
        //   "#0284c7",
        //   "#2563eb",
        //   "#4f46e5",
        //   "#7c3aed",
        //   "#9333ea",
        //   "#c026d3",
        //   "#db2777",
        //   "#e11d48",
        // ];
        let colordict = new Array();
        for (let i in classinfo) {
          if (colordict[classinfo[i][1]] == undefined) {
            colordict[classinfo[i][1]] = colorlist[i];
          }
        }
        setColordict1(colordict);
        // console.log(colordict);
        console.log(classinfo);
        for (let i in classinfo) {
          if (classinfo[i][0].substring(0, 1) == "B") {
            classinfo[i][0] = 1;
          } else if (classinfo[i][0].substring(0, 1) == "C") {
            classinfo[i][0] = 2;
          } else if (classinfo[i][0].substring(0, 1) == "D") {
            classinfo[i][0] = 3;
          } else if (classinfo[i][0].substring(0, 1) == "E") {
            classinfo[i][0] = 4;
          } else if (classinfo[i][0].substring(0, 1) == "F") {
            classinfo[i][0] = 5;
          }
          let process = classinfo[i][4].split("(");
          let process1 = classinfo[i][4].split("[");
          process = process[0];
          process1 = process1[2];
          if (process.includes(",")) {
            process = process.split(",");
            let count = 0;
            for (let _ in process) {
              process[count] = Number(process[count]);
              count += 1;
            }
            classinfo[i][4] = process;
            // console.log(process)
          } else if (process.includes("-")) {
            process = process.split("-");
            let processlist = [];

            for (let i = Number(process[0]); i <= Number(process[1]); i++) {
              processlist.push(i);
            }
            classinfo[i][4] = processlist;
          } else {
            classinfo[i][4] = Number(process);
          }

          process1 = process1.split("-");
          for (let i in process1) {
            process1[i] = Number(process1[i].substring(0, 2));
          }
          classinfo[i][6] = process1;
        }

        for (let i = 0; i < classinfo.length; i++) {
          for (let j = i + 1; j < classinfo.length; j++) {
            if (JSON.stringify(classinfo[i]) === JSON.stringify(classinfo[j])) {
              // 删除重复项
              classinfo.splice(j, 1);
              j--; // 调整索引以检查下一个元素
            }
          }
        }
        // console.log(classinfo)
        setTableData(classinfo);
      });
  }, []);

  // 刷新课表
  useEffect(() => {
    // 刷新时卸载之前
    for (let everyclass in tableData) {
      let parentElement = document.getElementById(tableData[everyclass][0]);
      if (parentElement) {
        parentElement.innerHTML = ""; // 清空元素
      }
    }

    // 刷新的方案
    for (let everyclass in tableData) {
      if (
        Array.isArray(tableData[everyclass][4])
          ? tableData[everyclass][4].includes(week)
          : tableData[everyclass][4] == week
      ) {
        let parentElement = document.getElementById(
          String(tableData[everyclass][0])
        );

        // 检查元素是否已经存在
        // @ts-ignore
        if (parentElement) {
          let voffset = 61.5;
          let height = 54;
          let cut = 8;
          let margin = 2.5; // 设置元素之间的间距
          let newDiv = document.createElement("div");
          newDiv.innerText =
            tableData[everyclass][1] +
            "\n" +
            tableData[everyclass][5] +
            "\n" +
            tableData[everyclass][3];
          newDiv.style.fontSize = "11px";
          newDiv.style.color = "white"; // 设置文字颜色为白色
          newDiv.style.textAlign = "center"; // 设置水平对齐方式为居中
          newDiv.style.display = "flex";
          newDiv.style.flexDirection = "column"; // 设置主轴方向为垂直
          newDiv.style.justifyContent = "center"; // 使文本垂直居中
          newDiv.style.backgroundColor = colordict1[tableData[everyclass][1]]; // 设置背景颜色
          newDiv.style.width = "75px"; // 设置宽度
          newDiv.style.position = "fixed"; // 设置绝对定位

          // 计算 top 值，确保元素之间有间距
          let topValue = tableData[everyclass][6][0] * height + voffset;
          if (
            tableData[everyclass][6][0] > 0 &&
            tableData[everyclass][6][0] < 6
          ) {
            topValue += 0;
          } else if (
            tableData[everyclass][6][0] > 5 &&
            tableData[everyclass][6][0] < 11
          ) {
            topValue += cut;
          } else {
            topValue += cut * 2;
          }
          newDiv.style.top = topValue + "px"; // 设置上边距

          newDiv.style.height =
            tableData[everyclass][6].length * height - margin + "px"; // 设置高度
          newDiv.style.borderRadius = "15px"; // 设置圆角

          // @ts-ignore
          parentElement.appendChild(newDiv);
        }
      }
    }
  }, [week, tableData]); // 当 week 变化时，重新运行 useEffect

  useEffect(() => {
    if (dayOfWeek == "周日" || dayOfWeek == "周六") {
      0;
    } else {
      let Element = document.getElementById(dayOfWeek);
      // @ts-ignore
      Element.style.borderRadius = "15px";
      // @ts-ignore
      Element.style.backgroundColor = "rgba(127, 127, 127, 0)";
      if (week == calculateDays()) {
        // @ts-ignore
        Element.style.borderRadius = "15px";
        // @ts-ignore
        Element.style.backgroundColor = "rgba(27, 157, 227, 0.25)";
      }
    }
  }, [week]);

  return (
    <>
      {/* 课表主体 */}
      <div
        className="classlist items-center"
        style={{
          left: "2%",
          right: "2%",
          width: "auto",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255)",
          padding: "15px",
          borderRadius: "15px",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Button onClick={prevWeek} disabled={week === 1}>
            <ArrowLeft24Filled />
          </Button>
          <p style={{ fontSize: "20px", color: "#ccc" }} onClick={turnBackWeek}>
            第 {week} 周
          </p>
          <Button onClick={nextWeek} disabled={week === 20}>
            <ArrowRight24Filled />
          </Button>
        </div>
        <div
          className="flex justify-between flex-row"
          style={{ height: "95%" }}
        >
          <ul className="mr-3">
            <div className="items-center text-center">
              <div className="mt-10" />
              <p>8:30</p>
              <div style={{ height: "92px" }} />
              <p>9:55</p>
              <p>10:15</p>
              <div style={{ height: "75px" }} />
              <p>11:40</p>
              <div style={{ height: "34px" }} />
              <p>12:25</p>
              <p>14:00</p>
              <div style={{ height: "65px" }} />
              <p>15:25</p>
              <p>15:45</p>
              <div style={{ height: "72px" }} />
              <p>17:10</p>
              <div style={{ height: "38px" }} />
              <p>17:55</p>
              <p>19:00</p>
              <div style={{ height: "65px" }} />
              <p>20:20</p>
              <p>20:30</p>
              <div style={{ height: "70px" }} />
              <p>21:50</p>
            </div>
          </ul>
          {Array.from({ length: 5 }, (_, index) => (
            <div className="flex-col mt-2">
              <div
                className="flex-col items-center font-bold flex text-center w-[80px] h-[830px]"
                id={`周${converter.toWords(index + 1)}`}
              >
                周{converter.toWords(index + 1)}
                <br />
                {curDay[index]}
              </div>
              <div
                className="mt-5"
                id={`${index + 1}`}
                style={{ marginLeft: "2.5px" }}
              />
            </div>
          ))}
          <div className="" style={{ position: "fixed", width: "450px" }}>
            <div style={{ height: "335px" }} />
            <Divider className="mt-1 mb-1" style={{ width: "450px" }} />
            <div style={{ height: "270px" }} />
            <Divider className="mt-1 mb-1" style={{ width: "450px" }} />
          </div>
        </div>
      </div>
      {/* 课表主体 */}
    </>
  );
};

export const Subclasstable = () => {
  console.log(TableDataContext);
  const [tableData, _] = useContext(TableDataContext);
  console.log(tableData);
  return (
    <>
      {/* 子课表主体 */}{" "}
      <div
        className="classlist"
        style={{
          left: "2%",
          width: "auto",
          height: "auto",
          backgroundColor: "rgba(255, 255, 255)",
          padding: "15px",
          border: "1px solid black", // 添加边框
          boxShadow: "10px 10px 10px rgba(0,0,0,0.5)", // 添加阴影
          borderRadius: "15px",
          fontFamily: "Arial",
        }}
      ></div>
      {/* 子课表主体 */}
    </>
  );
};

import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Divider } from "@fluentui/react-components";
import ReactECharts from "echarts-for-react";
// @ts-ignore
import converter from "number-to-chinese-words";
import axios from "axios";

export const WeatherChart = () => {
  const [weather,_] = useState("");
  const [weatherTime, setWeatherTime] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any>({});
  const [curWeather, setCurWeather] = useState<any>({}); // 当前天气
  const [dayFeature, setDayFeature] = useState<any>({});
  const [imgSrc, setImgSrc] = useState("");
  const [location, setLocation] = useState("");

  // 图表部分
  const [option, setOption] = useState({
    grid: {
      left: "0%", // 调整左边距
      right: "0%", // 调整右边距
      bottom: "0%", // 调整底边距
      top: "10%", // 调整顶边距
      containLabel: true, // 确保所有的标签都在图表内部
    },
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: [
      {
        type: "value",
        splitLine: {
          show: false, // 隐藏y轴的参考线
        },
      },
      {
        type: "value",
        splitLine: {
          show: false, // 隐藏y轴的参考线
        },
      },
    ],
    series: [
      {
        data: [],
        type: "line",
        itemStyle: {
          opacity: 0, // 设置线条透明度为0，即隐藏线条
        },
      },
      {
        data: [],
        type: "line",
        itemStyle: {
          opacity: 0, // 设置线条透明度为0，即隐藏线条
        },
      },
      {
        data: [],
        type: "line",
      },
    ],
  });
  const [option1, setOption1] = useState({
    grid: {
      left: "0%", // 调整左边距
      right: "0%", // 调整右边距
      bottom: "0%", // 调整底边距
      top: "10%", // 调整顶边距
      containLabel: true, // 确保所有的标签都在图表内部
    },
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false, // 隐藏y轴的参考线
      },
    },
    series: [
      {
        data: [],
        type: "line",
        itemStyle: {
          opacity: 0, // 设置线条透明度为0，即隐藏线条
        },
      },
      {
        data: [],
        type: "line",
      },
      {
        data: [],
        type: "line",
      },
    ],
  });
  const echartsRef = useRef<ReactECharts | null>(null);
  const echartsRef1 = useRef<ReactECharts | null>(null);
  // 图表部分

  // 调用天气api
  useEffect(() => {
    async function main() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setImgSrc(
          `http://www.7timer.info/bin/astro.php?lon=${position.coords.longitude}&lat=${position.coords.latitude}&ac=0&lang=zh-CN&unit=metric&tzshift=0`
        );

        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=temperature_2m,precipitation_probability,relative_humidity_2m,precipitation&forecast_days=5&timezone=auto`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setWeatherTime(data.hourly.time);
            setWeatherData(data.hourly);
          });

        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,weather_code&daily=sunrise,sunset&wind_speed_unit=ms&timezone=auto`
        )
          .then((response) => response.json())
          .then((data) => {
            setCurWeather(data.current);
            console.log(data);
            setDayFeature(data.daily);
            console.log(data.daily);
          });

        const json = await (
          await fetch(
            `api/v1/weather?lon=${position.coords.longitude}&lat=${position.coords.latitude}`
          )
        ).json();
        console.log(json);
      });
    }
    main();
  }, []);

  // 获得定位
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // 获取 IP 地址
        const ipRes = await axios.get("https://api.ipify.org?format=json");
        const ip = ipRes.data.ip;

        // 使用 IP 地址获取地理位置
        const locationRes = await axios.get(`https://ipapi.co/${ip}/json/`);
        const location = locationRes.data;

        // 更新状态
        setLocation(location);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocation();
  }, []);

  // 天气图表
  useEffect(() => {
    let nweathertime = weatherTime.map((item: any) => {
      return item.slice(5, 16);
    }, []);
    // @ts-ignore
    setOption((prevOption) => {
      let minTemperature =
        weatherData && weatherData["temperature_2m"]
          ? Math.min(...weatherData["temperature_2m"]) - 2
          : 0;
      let maxTemperature =
        weatherData && weatherData["temperature_2m"]
          ? Math.max(...weatherData["temperature_2m"])
          : 40;
      const newOption = {
        ...prevOption,

        tooltip: {
          // 添加 tooltip 配置
          trigger: "axis",
          // @ts-ignore
          formatter: function (params) {
            return (
              params[0].name +
              "<br>温度 " +
              params[0].value +
              " °C" +
              "<br>湿度 " +
              params[1].value +
              " %"
            );
          },
        },
        xAxis: {
          type: "category",
          data: nweathertime,
        },
        yAxis: [
          {
            type: "value",
            min: minTemperature, // 设置y轴最小值为数据的最小值
            max: maxTemperature, // 设置y轴最大值为数据的最大值
            position: "left",
          },
          {
            type: "value",
            min: 0,
            max: 100,
            position: "right",
            axisLabel: {
              formatter: "{value} %",
            },
          },
        ],
        series: [
          {
            ...prevOption.series[0],
            yAxisIndex: 0,
            data: weatherData["temperature_2m"],
          },
          {
            ...prevOption.series[1],
            yAxisIndex: 1,
            data: weatherData["relative_humidity_2m"],
          },
        ],
      };
      return newOption;
    });
    // @ts-ignore
    setOption1((prevOption1) => {
      const newOption1 = {
        ...prevOption1,
        tooltip: {
          // 添加 tooltip 配置
          trigger: "axis",
          // @ts-ignore
          formatter: function (params) {
            return (
              params[0].name +
              "<br>" +
              "降雨概率 " +
              params[0].value +
              " %" +
              "<br>" +
              "降雨量 " +
              params[1].value +
              " mm"
            );
          },
        },
        xAxis: {
          type: "category",
          data: nweathertime,
        },
        yAxis: [
          {
            type: "value",
            min: 0, // 设置y轴最小值为数据的最小值
            max: 100, // 设置y轴最大值为数据的最大值
          },
          {
            type: "value",
            min: 0,
            max: "dataMax",
            position: "right",
            axisLabel: {
              formatter: "{value} mm",
            },
          },
        ],
        series: [
          {
            ...prevOption1.series[0],
            yAxisIndex: 0,
            data: weatherData["precipitation_probability"],
          },
          {
            ...prevOption1.series[1],
            yAxisIndex: 1,
            data: weatherData["precipitation"],
          },
        ],
      };
      return newOption1;
    });
  }, [weatherData]);

  return (
    <>
      {/* 天气 */}
      <div>
        <div
          className="blank-div"
          style={{
            width: "auto",
            backgroundColor: "rgba(255, 255, 255)",
            padding: "15px",
            borderRadius: "15px",
            fontFamily: "Arial",
            transformOrigin: "top left",
            marginRight: "-60px",
            transform: "scale(0.9)",
          }}
        >
          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            天气
          </p>
          <p style={{ fontSize: "12px", color: "#ccc" }}>
            {/* @ts-ignore */}
            {location.city} ({location.country}) 当前天气（更新于
            {curWeather.time}）
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p
              style={{
                fontSize: "70px",
                marginTop: "35px",
                marginBottom: "35px",
              }}
            >
              {curWeather.temperature_2m} °C
            </p>
            <p
              style={{
                fontSize: "20px",

                color: "#ccc",
                lineHeight: "28px",
              }}
            >
              体感温度 {curWeather.apparent_temperature} °C <br /> 湿度{" "}
              {curWeather.relative_humidity_2m}% <br /> 降水量{" "}
              {curWeather.precipitation}mm
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "12px", color: "#ccc" }}>
              风速 {curWeather.wind_speed_10m}m/s <br /> 风向{" "}
              {curWeather.wind_direction_10m}° <br />
            </p>
            <p style={{ fontSize: "12px", color: "#ccc" }}>
              能见度 {curWeather.visibility}m <br />
            </p>
            <p style={{ fontSize: "12px", color: "#ccc" }}>
              气压 {curWeather.surface_pressure}hPa <br />
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "12px", color: "#ccc" }}>
              {dayFeature && dayFeature.sunrise && dayFeature.sunrise[0]
                ? `日出 ${dayFeature.sunrise[0]}`
                : ""}
            </p>
            <p style={{ fontSize: "12px", color: "#ccc" }}>
              {dayFeature && dayFeature.sunset && dayFeature.sunset[0]
                ? `日落 ${dayFeature.sunset[0]}`
                : ""}
            </p>
          </div>

          <Divider style={{ marginTop: "5px", marginBottom: "5px" }} />
          <p style={{ fontSize: "12px", color: "#ccc" }}>
            五日
            <span style={{ color: "blue" }}>气温</span>与
            <span style={{ color: "green" }}>湿度</span>
          </p>
          <ReactECharts
            ref={echartsRef}
            option={option}
            style={{ height: "100px", width: "550px" }}
          />
          <Divider style={{ marginTop: "5px", marginBottom: "5px" }} />
          <p style={{ fontSize: "12px", color: "#ccc" }}>
            五日
            <span style={{ color: "blue" }}>降雨概率</span>与
            <span style={{ color: "green" }}>降雨量</span>
          </p>
          <ReactECharts
            ref={echartsRef1}
            option={option1}
            style={{ height: "100px", width: "550px" }}
          />

          <div>{weather}</div>
          <img src={imgSrc} style={{ width: "540px", marginTop: "10px" }} />
        </div>
      </div>
      {/* 天气 */}
    </>
  );
};

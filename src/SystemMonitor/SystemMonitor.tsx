import "./SystemMonitor.css";
import { SystemMonitorRenderer } from "./SystemMonitorRenderer";
import { useState, useEffect } from "react";

export interface dataStructure {
  cpu: number;
  memory: {
    total: number;
    available: number;
    percent: number;
    used: number;
    free: number;
  };
  network: {
    upTotal: number;
    downTotal: number;
    up: number;
    down: number;
  };
  response_time: number;
}

export const SystemMonitor = () => {
  const [data, setData] = useState<dataStructure>();

  async function fetchData() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/sysmonitor/all"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
      console.log("Data fetched:", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    // 每秒刷新一次数据
    const interval = setInterval(fetchData, 1000);

    // 初始加载数据
    fetchData();

    // 清除定时器
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="system-monitor">
      <SystemMonitorRenderer SystemInfo={data!} />
    </div>
  );
};

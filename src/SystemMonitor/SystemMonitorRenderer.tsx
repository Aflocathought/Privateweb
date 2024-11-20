import "./SystemMonitor.css";
import { dataStructure } from "./SystemMonitor";

interface SystemMonitorRendererProps {
  SystemInfo: dataStructure;
}

export const SystemMonitorRenderer: React.FC<SystemMonitorRendererProps> = ({
  SystemInfo,
}) => {
  const normalizeData = (data: dataStructure): dataStructure => {
    try {
      return {
        cpu: data.cpu ?? 0,
        memory: {
          total: data.memory?.total ?? 0,
          available: data.memory?.available ?? 0,
          percent: data.memory?.percent ?? 0,
          used: data.memory?.used ?? 0,
          free: data.memory?.free ?? 0,
        },
        network: {
          up: data.network?.up ?? 0,
          down: data.network?.down ?? 0,
          upTotal: data.network?.upTotal ?? 0,
          downTotal: data.network?.downTotal ?? 0,
        },
        response_time: data.response_time ?? 0,
      };
    } catch (error) {
      return {
        cpu: 0,
        memory: {
          total: 0,
          available: 0,
          percent: 0,
          used: 0,
          free: 0,
        },
        network: {
          up: 0,
          down: 0,
          upTotal: 0,
          downTotal: 0,
        },
        response_time: 0,
      };
    }
  };

  // 标准化 SystemInfo 数据
  const normalizedSystemInfo = normalizeData(SystemInfo);

  return (
    <div>
      <h2>System Monitor</h2>
      <p>CPU Usage: {normalizedSystemInfo.cpu}%</p>
      <p>Memory Usage: {normalizedSystemInfo.memory.percent}%</p>
      <p>Network Sent: {normalizedSystemInfo.network.up}</p>
      <p>Network Received: {normalizedSystemInfo.network.down}</p>
      <p>Response Time: {normalizedSystemInfo.response_time} ms</p>
    </div>
  );
};
